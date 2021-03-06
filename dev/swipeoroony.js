/* exported initSwipe, generateDots */

'use strict';

function initSwipe(object, links, linkClass, doc, transition) {
  object.on('touchstart', function(event) {
    var pointStartX;
    var pointDiffX;
    var pointShift;
    var positionStart;
    var linkActive;
    var index;
    var galleryStatus;
    var animationFrame;
    if (!object.is('.slides-are-fixing')) {
      pointStartX = event.originalEvent.touches[0].pageX;
      pointDiffX = 0;
      pointShift = 1;
      positionStart = object.offset().left;
      linkActive = links.filter('.' + linkClass + '-is-active');
      index = links.index(linkActive);
      galleryStatus = 'middle';
      if (index === 0) {
        galleryStatus = 'start';
      } else if (index === (links.size() - 1)) {
        galleryStatus = 'end';
      }
      doc.on('touchmove', function(event) {
        var pointDiffXMargin;
        pointDiffX = event.originalEvent.touches[0].pageX - pointStartX;
        if (Math.abs(pointDiffX) > 15) {
          event.preventDefault();
          animationFrame = requestAnimationFrame(function() {
            pointDiffXMargin = pointDiffX < 0 ? 15 : -15;
            if (galleryStatus === 'start' && pointDiffX > 0) {
              pointShift = 4;
              pointDiffXMargin = -4;
            } else if (galleryStatus === 'end' && pointDiffX < 0) {
              pointShift = 4;
              pointDiffXMargin = 4;
            }
            object.css(translateGallery(positionStart + pointDiffX / pointShift + pointDiffXMargin + 'px'));
          });
        }
      }).on('touchend', function(event) {
        doc.off('touchmove touchend');
        cancelAnimationFrame(animationFrame);
        requestAnimationFrame(function() {
          if (Math.abs(pointDiffX) > 15) {
            if (pointDiffX > 50 && galleryStatus !== 'start') {
              index -= 1;
            } else if (pointDiffX < -50 && galleryStatus !== 'end') {
              index += 1;
            }
            linkActive.removeClass(linkClass + '-is-active js-dotsPage-is-active');
            links.filter('.' + linkClass + ':eq(' + index + ')').addClass(linkClass + '-is-active js-dotsPage-is-active');
            object.addClass('slides-are-fixing').trigger('swipe');
            object.on(transition, function(event) {
              object.removeClass('slides-are-fixing');
              object.off(transition);
            });
            object.css(translateGallery(-100 * index + '%'));
          }
        });
      });
    }
  });
}

function generateDots(size, listClass, pageClass) {
  var navigation = '<ul class="' + listClass + ' js-dotsNavigation u-listReset">';
  var index;
  for (index = 0; index < size; index++) {
    navigation = index === 0 ? navigation + '<li class="' + pageClass + ' ' + pageClass + '-is-active js-dotsPage-is-active js-dotsPage"></li>' : navigation + '<li class="' + pageClass + ' js-dotsPage"></li>';
  }
  navigation += '</ul>';
  return navigation;
}

function translateGallery(distance, output) {
  var css;
  if (output === 'string') {
    css = '-webkit-transform : translateX(' + distance + ') translateZ(0); -moz-transform : translateX(' + distance + ') translateZ(0); -ms-transform : translateX(' + distance + '); -o-transform : translateX(' + distance + '); transform : translateX(' + distance + ') translateZ(0)';
  } else {
    css = {
      '-webkit-transform': 'translateX(' + distance + ') translateZ(0)',
      '-moz-transform': 'translateX(' + distance + ') translateZ(0)',
      '-ms-transform': 'translateX(' + distance + ')',
      '-o-transform': 'translateX(' + distance + ')',
      'transform': 'translateX(' + distance + ') translateZ(0)'
    };
  }
  return css;
}
