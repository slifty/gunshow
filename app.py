import os
import uuid

import tornado.web
from tornado.ioloop import IOLoop
from tornado.websocket import WebSocketHandler

# process-global set of per-document connected clients
doc_clients = {}

class MainHandler(tornado.web.RequestHandler):
  def get(self):
    self.write("Hello World")

class InteractionHandler(WebSocketHandler):
  """
  Handles all websocket connections and messages
  NOTE:: self is the client connection
  """

  def open(self, doc):
    print 'Connection opened!'
    if self not in doc_clients:
      doc_clients[self] = str(uuid.uuid1())
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
    doc_clients.pop(self, 0)
    print 'Connections: %s' % doc_clients


application = tornado.web.Application([
  (r"/(.+)", InteractionHandler),
  (r"/", MainHandler),
])


if __name__ == "__main__":
  application.listen(8888)
  IOLoop.instance().start()

