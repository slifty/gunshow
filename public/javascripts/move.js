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
    $(booth.$el[0]).html("<span id='on'>BOOTH</span>");
  } else {
    $('#on').remove();
  }
  if (section) {
    // TODO: should load video instead
    if ($('#live-view-content').length == 0) {
      var img = $('<img id="live-view-content">');
      img.attr('src', '../images/images-4.jpeg');
      img.attr('width', '150');
      img.attr('height', '150');
      img.appendTo('#live-view');
    }
  } else {
    $("#live-view-content").remove();
  }
}

// Process Character Walk Function
function processWalk(dir) {
  // move the char
  // 1 unit of movement = 15px 
  switch(dir) {
    case'down':
      give_pos($('#character').animate({top: '+=15'}, $charSpeed));
      break;
    case'up':
      // really glitchy bug here with going over the border. wtf??
      // handle top border
      if ($('#character').position().top > 7) {
        give_pos($('#character').animate({top: '-=15'}, $charSpeed));
      } break;
    case'left':
      // handle left border
      if ($('#character').position().left > 7) {
        give_pos($('#character').animate({left: '-=15'}, $charSpeed));
      } break;
    case'right':
      give_pos($('#character').animate({left: '+=15'}, $charSpeed));
      break;
    }
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

