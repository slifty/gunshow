;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = "Floor",
    defaults = {
      booths: [],
      sections: []
    };

  // The actual plugin constructor
  function Plugin( el, options ) {
    var self = this
    this.el = el;
    this.$el = $(el);

    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options );

    this._defaults = defaults;
    this._name = pluginName;

    this.init();
  }

  Plugin.prototype = {
    init: function() {
      var self = this
      this.$el
        .addClass("floor");

      // Register booths
      for(var i in this.options.booths) {
        // Convert JSON object to Booth object
        var booth = new Booth(
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
      this.$el.data("booths", this.options.booths);

      // Register sections
      for(var i in this.options.sections) {
        // Convert JSON object to Section object
        var section = new Section(
          this.options.sections[i].x,
          this.options.sections[i].y,
          this.options.sections[i].height,
          this.options.sections[i].width
        );
        section.video_url = this.options.sections[i].video_url;
        this.options.sections[i] = section;
      }
      this.$el.data("sections", this.options.sections);
    },
  };

  // A really lightweight plugin wrapper around the constructor,
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      if (!$.data(this, "plugin_" + pluginName)) {
        $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
      }
    });
  };

  $.fn.getBoothAt = function(x, y) {
    var $this = $(this);
    if(!$this.hasClass("floor"))
      return null;

    var booths = $this.data("booths");
    for(var i in booths) {
      var booth = booths[i];
      if(x >= booth.x && x <= booth.x + booth.width
        && y >= booth.y && y <= booth.y + booth.height)
        return booth;
    }
    return null;
  }

  $.fn.getSectionAt = function(x, y) {
    var $this = $(this);
    if(!$this.hasClass("floor"))
      return null;

    var sections = $this.data("sections");
    // TODO make sure this is a floor object
    for(var i in sections) {
      var section = sections[i];
      if(x >= section.x && x <= section.x + section.width
        && y >= section.y && y <= section.y + section.height)
        return section;
    }
    return null;
  }

})( jQuery, window, document );
