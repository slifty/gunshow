;(function ( $, window, document, undefined ) {
  var ID_COUNTER = 0;

  // Create the defaults once
  var pluginName = "GunshowFloor",
    defaults = {
      booths: [],
      sections: []
    };

  // The actual plugin constructor
  function Plugin( el, options ) {
    var self = this
    self.el = el;
    self.$el = $(el);

    self.options = $.extend( {}, defaults, options );

    self._defaults = defaults;
    self._name = pluginName;
    self.id = ID_COUNTER++;

    self.characters = [];

    self.init();
  }

  Plugin.prototype = {
    init: function() {
      var self = this
      this.$el
        .addClass("floor");

      // Register booths
      for(var i in this.options.booths) {
        // Convert JSON object to Booth object
        var booth = new GunshowBooth(
          this.options.booths[i].x,
          this.options.booths[i].y,
          this.options.booths[i].height,
          this.options.booths[i].width);
        booth.background_url = this.options.booths[i].background_url;
        booth.booth_url = this.options.booths[i].booth_url;

        // Create the visual object
        var $booth = $("<div />")
          .addClass("booth")
          .css("left", booth.x)
          .css("top", booth.y)
          .height(booth.height)
          .width(booth.width)
          .appendTo(this.$el);

        booth.$el = $booth;
        this.options.booths[i] = booth;
      }

      // Register sections
      for(var i in this.options.sections) {
        // Convert JSON object to Section object
        var section = new GunshowSection(
          this.options.sections[i].x,
          this.options.sections[i].y,
          this.options.sections[i].height,
          this.options.sections[i].width
        );
        section.video_url = this.options.sections[i].video_url;
        this.options.sections[i] = section;
      }
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
        .appendTo(self.$el);

      console.log(character.$el);
    },
    removeCharacter: function(character) {
      delete self.characters[character.id];
    },
    registerLocation: function(x,y) {
      
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
