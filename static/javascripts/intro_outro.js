$(document).ready(function() {
  // intro video
  var intro = Popcorn.vimeo('#intro-vid', 'http://player.vimeo.com/video/66376335?autoplay=1');
  intro.autoplay(true);

  intro.cue(.5, function() {
    $("#intro-year").fadeIn(1000);
  });

  intro.cue(3.25, function() {
    $("#intro-year").fadeOut(1000);
  });

  intro.cue(15.5, function() {
    $("#intro-title").fadeIn(1000);
  });

  intro.cue(24, function() {
    $("#intro-title").fadeOut(1000);
  });

  intro.cue(25, function() {
    $("#intro-input").fadeIn(1000);
    $("#intro-input .text").focus();
    var fadedIn = false;
    $("#intro-input .text").keypress(function(e) {
      if(fadedIn == false) {
        $("#intro-input .instruction").fadeIn(500);
        fadedIn = true;
      }

      if(e.which == 13) {
        var label = $("#intro-input .text").val();

        // Delete the video
        $("#intro-vid").remove();

        $("#background-audio")[0].play(); // TODO BADNESS

        // load booth and section data (JSON)
        $(function() {
          $.ajax({
            "method": "GET",
            "url": "data/floor1.json",
            "dataType": "JSON"
          })
          .done(function(data) {
            var $gunshow = $("#gunshow");
            $gunshow.Gunshow(data);

            var $character = $("#character");
            $character.GunshowCharacter({
              type: "user",
              label: label
            });

            // var $roamingCharacter = $("#roaming_character");
            // $roamingCharacter.GunshowCharacter();

            $character.data("GunshowCharacter").enterSpace($gunshow.data("Gunshow"), 600, 800);
            //$roamingCharacter.data("GunshowCharacter").enterSpace($gunshow.data("Gunshow"), 100, 100);

            if ('WebSocket' in window) {
              var remote_chars = {};
              var id;
              conn.onmessage = function(e) {
                var data = JSON.parse(e.data);
                id = data['id'];
                if (!(id in remote_chars)) {
                  remote_chars[id] = $("<div />")
                    .GunshowCharacter({
                      type: 'remote',
                      label: data['label']
                    })
                    .data('GunshowCharacter');
                  remote_chars[id].enterSpace($gunshow.data("Gunshow"), data['left'], data['top']);
                } else if ("closing" in data) {
                  remote_chars[id].leaveSpace($gunshow.data("Gunshow"));
                  delete remote_chars[id];
                } else {
                  remote_chars[id].moveTo(data['left'], data['top']);
                }
              }
            }
          })
        });

        // set timer and callback function
        $(function(){ 
          // initialize to 10 minutes
          ts = (new Date()).getTime() + 10*60*1000;
            
          $('#countdown').countdown({
            timestamp : ts,
            callback  : function(minutes, seconds){
              if (minutes == 5 && seconds == 0) {
                console.log("You have 5 minutes left!");
              }
              if (minutes == 1 && seconds == 0) {
                console.log("One minute left!!");
              }
              if (minutes == 0 && seconds == 0) {
                // kick out of showroom
                console.log("GET OUT");
              }
            }
          }); 
        });
      }
    });
  });

  // outro video
  $(".exit-show").click(function() {
    $("#navigation").fadeOut(1000);
    $("#gunshow").fadeOut(1000, function() {
      $("#gunshow").remove();
    });

    var outro = Popcorn.vimeo('#outro-vid', 'http://player.vimeo.com/66374037?autoplay=1');
    $("#outro-vid").fadeIn(1000);
    outro.autoplay(true);

    outro.cue(1, function() {
      console.log("TEST");
      $("#outro-text-1").show();
    });
    outro.cue(5, function() {
      $("#outro-text-1").hide();
    });
    outro.cue(6, function() {
      $("#outro-text-2").show();
    });
    outro.cue(10, function() {
      $("#outro-text-2").hide();
    });
    outro.cue(11, function() {
      $("#outro-text-3").show();
    });
    outro.cue(19, function() {
      $("#outro-text-3").hide();
    });
  });
});
