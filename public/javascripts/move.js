// Global Variables
var currentKey = false;
var TimerWalk;
var charSpeed = 400;

// Process Character Walk Function
function processWalk(dir) {
  // move the char
  // 1 unit of movement = 32px
  switch(dir) {
    case'down':
      $('#character').animate({top: '+=32'}, charSpeed);
      break;
    case'up':
      // don't let the character move any further up if they are already at the top of the screen
      if ($('#character').position().top > 0) {
        $('#character').animate({top: '-=32'}, charSpeed);
      } break;
    case'left':
    // don't let the character move any further left if they are already at the left side of the screen  
      if ($('#character').position().left > 0) {
        $('#character').animate({left: '-=32'}, charSpeed);
      } break;
    case'right':
      $('#character').animate({left: '+=15'}, charSpeed);
      break;
    }
}

// Character Walk Function
function charWalk(dir) {
  // move the character
  processWalk(dir);
  // set the interval timer to continually move the character
  TimerWalk = setInterval(function() { processWalk(dir); }, charSpeed);
}

// KeyDown Function
// don't handle two keys at the same time
$(document).keydown(function(e) {
  if (!currentKey) {
    // set the currentKey to the key that is down
    currentKey = e.keyCode;

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
  if (e.keyCode == currentKey) {
    // null the current key
    currentKey = false;
    // clear the walk timer
    clearInterval(TimerWalk);
    // finish the character's movement
    $('#character').stop(true, true);
  }
});

