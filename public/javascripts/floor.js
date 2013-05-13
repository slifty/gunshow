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
        .css("position", "absolute");
      for(var x in this.options.booths) {
        var booth = this.options.booths[x];
        var $booth = $("<div />")
          .addClass("booth")
          .data("booth", booth)
          .css("position", "absolute")
          .css("left", booth.x)
          .css("top", booth.y)
          .height(booth.height)
          .width(booth.width)
          .appendTo(this.$el);

        booth.$el = $booth;
      }

      this.$el.data("booths", this.options.booths);
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
    var booths = $this.data("booths");
    // TODO make sure this is a floor object
    for(var i in booths) {
      var booth = booths[i];
      if(x >= booth.x && x <= booth.x + booth.width
        && y >= booth.y && y <= booth.y + booth.height)
        return booth;
    }
    return null;
  }

})( jQuery, window, document );


// Run the map (TODO, REMOVE ME)
$(function(){
  var $map = $("#floor");
  $map.Floor({
    booths: [
      {
        x:10,
        y:10,
        height:100,
        width: 100,
        background_url: "",
        booth_url: ""
      },
      {
        x:200,
        y:200,
        height:100,
        width: 100,
        background_url: "",
        booth_url: ""
      },
    ]
  });
})