$(document).ready(function() {
  // intro video
  var intro = Popcorn.vimeo('#intro-vid', 'http://player.vimeo.com/video/66183736?autoplay=1');
  intro.autoplay(true);
  intro.cue(1, function() {
    // backwards counting
    var duration = intro.duration();
    //intro.cue(duration - 45, function() {
    //  $("#intro-input").show();
    //});
    intro.cue(duration, function() {
      $('#intro-vid').hide();
    });
  });

  intro.cue(40, function() {
    $("#intro-input").show();
  });

  // outro video
  //var outro = Popcorn.vimeo('#outro-vid', '');
  // once timer is up
  // outro.play()
});
