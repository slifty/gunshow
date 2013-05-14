;(function ( $, window, document, undefined ) {
  var ID_COUNTER = 0;
  
  // Create the defaults once
  var pluginName = "GunshowCharacter",
    defaults = {
      walkSpeed: 100
    };

  // The actual plugin constructor
  function Plugin( el, options ) {
    var self = this;
    self.el = el;
    self.$el = $(el);
    self.$el.addClass("character")

    self.options = $.extend( {}, defaults, options );

    self.moving = false;
    self.keys = {};
    self.leftDest = 0;
    self.topDest = 0;
    self.currentSpace = null;
    self.spaces = [];

    self._defaults = defaults;
    self._name = pluginName;
    self.id = ID_COUNTER++;

    self.init();

    // Enable animation
    self.enableAnimation();

    // Set up the walking control functionality
    $(document).keydown(function(e) {
      self.keys[e.which] = true;

      var moveKey = false;
      switch(e.which) {
        case 37:
        case 38:
        case 39:
        case 40:
          moveKey = true;
      }

      // Delete movement if another key is pressed
      if(!moveKey) self.stopWalking();
      if(!self.moving) self.startWalking();
    });

    $(document).focus(function(e) {
      console.log("BLUR");
    });

    // KeyUp Function
    $(document).keyup(function(e) {
      delete self.keys[e.which];
    });

    // KeyUp Function

  }

  Plugin.prototype = {
    init: function() {
      var self = this
      this.$el
        .addClass("character");
    },
    refresh: function() {
      var self = this;

      if(self.space != null) {
        var nearbyObjects = self.space.getNearbyObjects(self.leftDest, self.topDest);
        for(var i in nearbyObjects) {
          var nearbyObject = nearbyObjects[i];
          if(nearbyObject instanceof GunshowBooth) {
            // Enter the booth

            nearbyObject.$el.html("<span id='on'>BOOTH</span>");
          }

          if(nearbyObject instanceof GunshowSection) {
            var img = $('<img id="live-view-content">');
            img.attr('src', '../images/images-4.jpeg');
            img.attr('width', '150');
            img.attr('height', '150');
            img.appendTo('#live-view');
          }
        }
      }
    },

    stopWalking: function() {
      var self = this;
      delete self.keys[37];
      delete self.keys[38];
      delete self.keys[39];
      delete self.keys[40];
    },

    startWalking: function(direction) {
      var self = this;
      var $character = $('#character');
      var moved = false;
      var newLeft = self.leftDest;
      var newTop = self.topDest;

      self.moving = true;

      // Calcualte new position
      if(self.keys[40]) {
        // Down
        newTop += 10;
        moved = true;
      }
      if(self.keys[38]) {
        // Up
        newTop -= 10;
        moved = true;
      }
      if(self.keys[37]) {
        // left
        newLeft -= 10;
        moved = true;
      }
      if(self.keys[39]) {
        // right
        newLeft += 10;
        moved = true;
      }

      // Make sure we aren't out of bounds
      newLeft = Math.max(newLeft, 0);
      newTop = Math.max(newTop, 0);

      // Move
      self.moveTo(newLeft, newTop, true);

      // Keep on walking if we just moved
      if(moved) setTimeout(function() { if(self.moving) self.startWalking(); }, self.options.walkSpeed)
      else self.moving = false;
    },

    enableAnimation: function() {
      var self = this;
      self.$el.css("transition", "left .3s, top .3s");
    },

    disableAnimation: function() {
      var self = this;
      self.$el.css("transition", "");
    },

    moveTo: function(x, y, animate) {
      var self = this;
      self.leftDest = x;
      self.topDest = y;

      if(!animate) self.disableAnimation();
      self.$el.css("left", x);
      self.$el.css("top", y);
      if(!animate) self.enableAnimation();
      self.refresh();
    },

    enterSpace: function(space) {
      var self = this;

      // Leave the current space
      if(self.space != null) self.leaveSpace(self.space);

      // Make sure this space is registered
      if(!(space.id in self.spaces)) self.registerSpace(space);

      // Switch to the new space
      self.spaces[space.id].space.addCharacter(self);
      self.space = self.spaces[space.id].space;
      self.moveTo(
        self.spaces[space.id].x,
        self.spaces[space.id].y,
        false);
    },

    leaveSpace: function(space) {
      if(self.space != null) {
        self.spaces[space.id].x = self.leftDest;
        self.spaces[space.id].y = self.topDest;
        self.spaces[space.id].space.removeCharacter(self);
      }
    },

    registerSpace: function(space) {
      var self = this;
      self.spaces[space.id] = {
        space: space,
        x: 0,
        y: 0
      }
    },
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, pluginName)) {
        $.data(this, pluginName, new Plugin( this, options ));
      }
    });
  };

})( jQuery, window, document );