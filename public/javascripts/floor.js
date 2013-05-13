;(function ( $, window, document, undefined ) {

  // Create the defaults once
  var pluginName = "Floor",
    defaults = {
      booths: []
    };

  // The actual plugin constructor
  function Plugin( el, options ) {
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
        width: 100
      },
      {
        x:200,
        y:200,
        height:100,
        width: 100
      },
    ]
  });
})