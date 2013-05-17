import os
import uuid

import tornado.web
from tornado.ioloop import IOLoop
from tornado.websocket import WebSocketHandler

# process-global set of per-document connected clients
doc_clients = {}

class InteractionHandler(WebSocketHandler):
  """
  Handles all websocket connections and messages
  NOTE:: self is the client connection
  """

  def open(self, doc):
    print 'Connection opened!'
    if self not in doc_clients:
      doc_clients[self] = str(uuid.uuid1())
    self.write_message({'id':doc_clients[self]})
    print 'Connections: %s' % doc_clients

  def on_message(self, msg):
    # unicode -> dict
    msg = eval(msg)
    msg['id'] = doc_clients[self]
    for c in doc_clients.keys():
      if c is not self:
        c.write_message(msg)

  def on_close(self):
    print 'Connection closed!'
    msg = {}
    msg['id'] = doc_clients[self]
    msg['closing'] = True
    for c in doc_clients.keys():
      if c is not self:
        c.write_message(msg)
    doc_clients.pop(self, 0)


application = tornado.web.Application([
  (r"/socks(.*)", InteractionHandler),
  (r"/()", tornado.web.StaticFileHandler, {'path': "static/index.html"} ),
  (r"/(.+)", tornado.web.StaticFileHandler, {'path': "static"} )
])


if __name__ == "__main__":
  application.listen(80, address="0.0.0.0")
  IOLoop.instance().start()

