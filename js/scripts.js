/**
 * @file
 */

(function ($) {
  $(document).ready(function() {
    // Window details
    var windowHeight = $(window).height(),
        gridTop = windowHeight * .3,
        gridBottom = windowHeight * .7;

    // Get all the placeholder's id's
    // Store all the id's in an array
    var keys = [];
    $(".tell_me_more:not(.class-processed)").each(function(index, value) {
      var id = $(this).attr('id');
      keys.push(id);
      $(this).addClass('class-processed');
    });

    // Get the json (which stores the static messages that editors stored to be displayed on the page)
    var json = $.getJSON({'url': "data/sample_data.json", 'async': false});
    json = JSON.parse(json.responseText);

    // To stop repeated loading
    var processed = [];
    // On scroll, on each scroll
    var iScrollPos = 0;
    $(window).scroll(function() {
      // Allow on down scroll
      var iCurScrollPos = $(this).scrollTop();
      if (iCurScrollPos > iScrollPos) {
        // Take the array that stores the placeholder's id's
        // Note: On each scroll we loop through all the keys/id's
        $.each(keys, function(key, element) {
          // We store the current element in a global array
          // So, on each scroll, we check if the array contains the current key/id
          // If not, then only proceed
          // So, it avoids duplicate rendering
          if (processed.indexOf(element) === -1) {
            processed.push(element);

            // Clean the placeholder container
            $("#" + element).html('');

            var thisTop = $("#" + element).offset().top - $(window).scrollTop();
            // Check if the element is between 30% and 70% of view port
            if (thisTop >= gridTop && (thisTop + $("#" + element).height()) <= gridBottom) {
              $('.tell_me_more_wrapper-' + key).addClass('active');

              // Run through each message from the json which corresponds to the currently visible placeholder
              // Add the profile pic of host
              $("#" + element).before('<div class="author-image"><img src="images/author-thumbnail.png" alt="Mountain View" style="width:60px;height:60px;"></div>');

              // Form the message to be shown for current visible element/key/id
              formAndDisplayTheMessage(json[key], element, key);
            }
            else {
              // If current element is not in range of view port, then make it free again to be used on next scroll.
              var indexOf = processed.indexOf(element);
              if (indexOf > -1) {
                processed.splice(indexOf, 1);
              }
            }
          }
        });
      }
      iScrollPos = iCurScrollPos;
    });
  });

  // Method to: Form and display messages.
  function formAndDisplayTheMessage(key, element, keys) {
    var htmlGet = '';
    if (key.tell_me_more !== undefined) {
      $.each(key.tell_me_more, function(index, val) {
        if (index == 0) {
          $("#" + element).addClass('content-added');
        }
        htmlGet +=  " " + val;
      });
    }

    var htmlGetSomeMoreDeatils = '';
    if (key.some_more_details !== undefined) {
      $.each(key.some_more_details, function(index, val) {
        if (index == 0) {
          $("#" + element).addClass('content-added');
        }
        htmlGetSomeMoreDeatils +=  " " + val;
      });
    }

    if (htmlGet && htmlGetSomeMoreDeatils) {
      $("#" + element).typed({
        strings: [htmlGet, htmlGetSomeMoreDeatils],
        typeSpeed: 30,
        callback: function() {setTimeout(function() {formDecisionButtons(key, keys);}, 1000);},
      });
    }
    else if (htmlGet && !htmlGetSomeMoreDeatils) {
      $("#" + element).typed({
        strings: [htmlGet],
        typeSpeed: 30,
        callback: function() {setTimeout(function() {formDecisionButtons(key, keys);}, 1000);},
      });
    }
    else if (!htmlGet && htmlGetSomeMoreDeatils) {
      $("#" + element).typed({
        strings: [htmlGetSomeMoreDeatils],
        typeSpeed: 30,
        callback: function() {setTimeout(function() {formDecisionButtons(key, keys);}, 1000);},
      });
    }
  }

  // Method to: Form the decison buttons.
  function formDecisionButtons(jsonKey, key) {
    $.each(jsonKey, function(ind, valu) {
      // Buttons: Discontinue, Continue
      if ((ind == 'discontinue') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="discontinue">Discontinue</span><div class="popup__"><div class="pop-uptext" id="my_Popup-' + key + '">Thanks for your time. Happy reading!</div></div>');
      }
      if ((ind == 'continue') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="continue">Continue</span><div class="pop--up"><div class="popup--text" id="my--Popup-' + key + '">Thanks for your interest. Please scroll down for further interactions.</div></div>');
      }

      // Buttons: Who Cares?, Let's Go!
      if ((ind == 'do_not_remind') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="who-cares">Who Cares?</span><div class="popup"><div class="popuptext" id="myPopup">Thanks for your time. Happy reading!</div></div>');
      }
      if ((ind == 'remind_me') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="lets-go">Let\'s Go!</span><div class="pop-up"><div class="popup-text" id="my-Popup">Thanks for your interest. Please scroll down for further interactions.</div></div>');
      }

      // Buttons: Not Interested, Interested
      if ((ind == 'not_interested') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="not-interested">Not Interested</span><div class="pop-up_"><div class="popup-text_" id="my-Popup_">Thanks for your interest. Please scroll down for further interactions.</div></div>');
      }
      if ((ind == 'interested') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="interested">Interested</span><div class="popup_"><div class="popuptext_" id="myPopup_">Thanks for your interest. Happy reading!</div></div>');
      }

      // Buttons: Picture, Video
      if ((ind == 'picture') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="picture">Picture</span>');
      }
      if ((ind == 'video') && (valu == true)) {
        $('#tell_me_more_' + key).append('<span class="video">Video</span>');
      }
    });

    // Handling clicking of decision buttons.
    handlingClickOnDecisionButtons(jsonKey, key);
  }

  // Method to: Handle clicking of decision buttons.
  function handlingClickOnDecisionButtons(jsonKey, key) {
    // Discontinue
    $('#tell_me_more_' + key + ' span.discontinue').click(function() {
      // If want on click toggle
      //var popup = document.getElementById("my_Popup-" + key);
      //popup.classList.toggle("show");
      $('#my_Popup-' + key).addClass('show');
      setTimeout(function() {
        $('#my_Popup-' + key).removeClass('show');
      }, 1500);
      $('#tell_me_more_' + key + ' span.continue').hide();
    });

    // Continue
    $('#tell_me_more_' + key + ' span.continue').click(function() {
      $('#tell_me_more-' + (key + 1)).show();
      $('#tell_me_more-' + (key + 1)).css('display','inline-block');
      // If want on click toggle
      //var popup = document.getElementById("my--Popup-" + key);
      //popup.classList.toggle("show");
      $('#my--Popup-' + key).addClass('show');
      setTimeout(function() {
        $('#my--Popup-' + key).removeClass('show');
      }, 1500);
      $('#tell_me_more_' + key + ' span.discontinue').hide();
    });

    // Who Cares?
    $('#tell_me_more_' + key + ' span.who-cares').click(function() {
      // If want on click toggle
      //var popup = document.getElementById("myPopup");
      //popup.classList.toggle("show");
      $('#myPopup').addClass('show');
      setTimeout(function() {
        $('#myPopup').removeClass('show');
      }, 1500);
      $('#tell_me_more_' + key + ' span.lets-go').hide();
    });

    // Let's Go!
    $('#tell_me_more_' + key + ' span.lets-go').click(function() {
      $('#tell_me_more-' + (key + 1)).show();
      $('#tell_me_more-' + (key + 1)).css('display','inline-block');
      // If want on click toggle
      //var popup = document.getElementById("my-Popup");
      //popup.classList.toggle("show");
      $('#my-Popup').addClass('show');
      setTimeout(function() {
        $('#my-Popup').removeClass('show');
      }, 1500);
      $('#tell_me_more_' + key + ' span.who-cares').hide();
    });

    // Not Interested
    $('#tell_me_more_' + key + ' span.not-interested').click(function() {
      // If want on click toggle
      //var popup = document.getElementById("myPopup_");
      //popup.classList.toggle("show");
      $('#myPopup_').addClass('show');
      setTimeout(function() {
        $('#myPopup_').removeClass('show');
      }, 1500);
      $('#tell_me_more_' + key + ' span.interested').hide();
    });

    // Interested
    $('#tell_me_more_' + key + ' span.interested').click(function() {
      $('#tell_me_more-' + (key + 1)).show();
      $('#tell_me_more-' + (key + 1)).css('display','inline-block');
      // If want on click toggle
      //var popup = document.getElementById("my-Popup_");
      //popup.classList.toggle("show");
      $('#my-Popup_').addClass('show');
      setTimeout(function() {
        $('#my-Popup_').removeClass('show');
      }, 1500);
      $('#tell_me_more_' + key + ' span.not-interested').hide();
    });

    // Picture
    $('#tell_me_more_' + key + ' span.picture').click(function() {
      $('.image-wrapper').show();
      $('.image-wrapper').addClass('image-clicked');
      $('.image-wrapper .image').html('<img src="images/' + jsonKey.picture_url + '" alt="Dog" style="width:290px;height:290px;">');
    });

    // Video
    $('#tell_me_more_' + key + ' span.video').click(function() {
      $('.video-wrapper').show();
      $('.video-wrapper').addClass('video-clicked');
      $('.video-wrapper .video').html('<iframe width="290" height="290" src="' + jsonKey.video_url + '" frameborder="0" allowfullscreen></iframe>');
    });
  }
})(jQuery);
