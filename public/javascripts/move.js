// Global Variables
var $currentKey = false;
var $TimerWalk;
var $charSpeed = 120;

// Print Character Position Function
function give_pos(character) {
  var pos = character.position();
  var booth = $("#floor").getBoothAt(pos.left, pos.top);
  var section = $("#floor").getSectionAt(pos.left, pos.top);
  if (booth) {
    $(booth.$el[0])
      .find("img")
      .css("opacity", "0.4");
  } else {
    $(".booth-img")
      .css("opacity", "1");
  }
  if (section) {
    //var video = $("#live-view").find("iframe").attr("src");
    //console.log(video);
    //if (video) {
    //  if (video.split("?")[0] != section.video_url.split("?")[0]) {
        var live_video = Popcorn.vimeo(
          '#live-view',
          section.video_url);
        live_video.autoplay = true;
        live_video.loop = true;
        live_video.play();
    //  }
    //}
  }
}

// Process Character Walk Function
function processWalk(dir) {
  // move the char
  // 1 unit of movement = 15px 
  var $character = $('#character');
  var top = $character.position().top;
  var left = $character.position().left;

  // Calcualte new position
  switch(dir) {
    case'down':
      top += 15;
      break;
    case'up':
      top -= 15;
      break;
    case'left':
      left -= 15;
      break;
    case'right':
      left += 15;
      break;
  }

  // Make sure we aren't out of bounds
  left = Math.max(left, 0);
  top = Math.max(top, 0);

  // Move to new position
  $character.css("left", left);
  $character.css("top", top);
  give_pos($character);
}

// Character Walk Function
function charWalk(dir) {
  // move the character
  processWalk(dir);
  // set the interval timer to continually move the character
  $TimerWalk = setInterval(function() { processWalk(dir); }, $charSpeed);
}

// KeyDown Function
// don't handle two keys at the same time
$(document).keydown(function(e) {
  if (!$currentKey) {
    // set the $currentKey to the key that is down
    $currentKey = e.keyCode;

    // execute character movement function charWalk('direction')
    switch(e.keyCode) {
      case 38: charWalk('up');    break;
      case 39: charWalk('right'); break;
      case 40: charWalk('down');  break;
      case 37: charWalk('left');  break;
    }
  }
});

// KeyUp Function
$(document).keyup(function(e) {
  // only stop the walk if the key that started the walk is released
  if (e.keyCode == $currentKey) {
    // null the current key
    $currentKey = false;
    // clear the walk timer
    clearInterval($TimerWalk);
    // finish the character's movement
    $('#character').stop(true, true);
  }
});

