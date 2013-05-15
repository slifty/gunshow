;(function ( $, window, document, undefined ) {
  var ID_COUNTER = 0;

  // Create the defaults once
  var pluginName = "Gunshow",
    defaults = {
      booths: [],
      sections: [],
      floorHeight: 100,
      floorWidth: 100
    };

  // The actual plugin constructor
  function Plugin( el, options ) {
    var self = this;
    self.el = el;
    self.$el = $(el);

    self.options = $.extend( {}, defaults, options );

    self._defaults = defaults;
    self._name = pluginName;
    self.id = ID_COUNTER++;

    self.characters = [];
    self.currentBooth = null;

    self.init();
  }

  Plugin.prototype = {
    init: function() {
      var self = this
      self.$el
        .addClass("show");

      self.$viewport = $("<div />")
        .addClass("viewport")
        .appendTo(self.$el);

      self.$floor = $("<div />")
        .addClass("floor")
        .width(self.options.floorWidth)
        .height(self.options.floorHeight)
        .appendTo(self.$viewport);

      self.$presentation = $("<div />")
        .addClass("presentation")
        .hide()
        .appendTo(self.$el);
      

      // Register booths
      var floorHeight = 0;
      var floorWidth = 0;
      for(var i in self.options.booths) {
        // Convert JSON object to Booth object
        var booth = new GunshowBooth(
          self.options.booths[i].x,
          self.options.booths[i].y,
          self.options.booths[i].height,
          self.options.booths[i].width);
        booth.background_url = self.options.booths[i].background_url;
        booth.booth_url = self.options.booths[i].booth_url;

        // Create the visual object
        var $booth = $("<div />")
          .addClass("booth")
          .css("left", booth.x)
          .css("top", booth.y)
          .height(booth.height)
          .width(booth.width)
          .appendTo(this.$floor);

        // Background image for the booth
        var $booth_img = $('<img />') 
          .addClass("booth-img")
          .attr("src", booth.background_url)
          .css("max-width", "100%")
          .css("max-height", "100%")
          .appendTo($booth);

        booth.$el = $booth;
        self.options.booths[i] = booth;
      }

      // Register sections
      for(var i in self.options.sections) {
        // Convert JSON object to Section object
        var section = new GunshowSection(
          self.options.sections[i].x,
          self.options.sections[i].y,
          self.options.sections[i].height,
          self.options.sections[i].width
        );
        section.video_url = self.options.sections[i].video_url;
        self.options.sections[i] = section;

      }

      // Create live view
      self.liveView = $("<div />")
        .addClass("live-view")
        .appendTo(self.$el);
    },
    getBoothAt: function(x, y) {
      var self = this;
      var booths = self.options.booths;
      var overlaps = [];
      for(var i in booths) {
        var booth = booths[i];
        if(x >= booth.x && x <= booth.x + booth.width
          && y >= booth.y && y <= booth.y + booth.height)
          overlaps.push(booth);
      }
      return overlaps;
    },
    getSectionAt: function(x, y) {
      var self = this;
      var sections = self.options.sections;
      var overlaps = [];
      for(var i in sections) {
        var section = sections[i];
        if(x >= section.x && x <= section.x + section.width
          && y >= section.y && y <= section.y + section.height)
          overlaps.push(section);
      }
      return overlaps;
    },
    getObjectsAt: function(x,y) {
      var self = this;
      return self.getSectionAt(x,y).concat(self.getBoothAt(x,y));
    },
    addCharacter: function(character) {
      var self = this;
      self.characters[character.id] = character;
      character.$el.remove()
        .appendTo(self.$floor);
    },
    removeCharacter: function(character) {
      delete self.characters[character.id];
    },
    setFocus: function(x,y) {
      var self = this;
      var sections = self.getSectionAt(x,y);
      if(sections.length > 0) {
        var section = sections[0];
        if(self.liveView.data("videoURL") != section.video_url) {
          self.liveView.data("videoURL", section.video_url)
          self.liveView.empty();
          if(section.video_url != "") {
            //var video = Popcorn.vimeo('.live-view', section.video_url + "?loop=1");
            //video.play();
          }
        }
      } else {
        self.liveView.empty();
        self.liveView.data("videoURL", "")
      }
    },

    enterBooth: function(booth) {
      var self = this;
      if(self.currentBooth != booth) {
        self.currentBooth = booth;
        self.setViewport(
          booth.x,
          booth.y,
          booth.height,
          booth.width
        );
        self.$presentation
          .fadeIn(1000, 
            function() { $(this).html("<iframe src='" + booth.booth_url + "' frameBorder='0'></iframe>") });
      }
    },

    exitBooth: function() {
      var self = this;
      if(self.currentBooth != null) {
        self.currentBooth = null;
        self.setViewport(
          0,
          0,
          "100%",
          "100%"
        );
        self.$presentation.empty()
          .fadeOut(1000);
      }
    },

    setViewport: function(x, y, height, width) {
      var self = this;
      self.$viewport.css("transition", "margin-left 1s, height 1s, width 1s, bottom 1s, left 1s");
      self.$floor.css("transition", "top 1s, left 1s");
      self.$viewport.css("height", height);
      self.$viewport.css("width", width);
      self.$viewport.css("bottom", height=="100%"?0:10);
      self.$viewport.css("left", width == "100%"?0:($(document).width() - width) / 2);
      self.$floor.css("top", -y);
      self.$floor.css("left", -x);
    }
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
