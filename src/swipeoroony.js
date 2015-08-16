/* exported initSwipe, generateDots */
function initSwipe(object, parent, links, linkClass, document, window, body, transition) {
  object.on('touchstart', function (event) {
    if (!object.is('.galleryImageView-is-fixing')) {
      var objectWidth = parent.width();
      var objectPadding = parent.css('padding-left').replace('px', '') - 0;
      var pointStartX = event.originalEvent.touches[0].pageX;
      var pointStartY = event.originalEvent.touches[0].pageY;
      var pointDiffX = 0;
      var pointDiffY = 0;
      var pointShift = 1;
      var positionStart = object.offset().left;
      var linkActive = links.find('.' + linkClass + '-is-active');
      var index = links.find('.' + linkClass).index(linkActive);
      var galleryStatus = 'middle';
      if (linkActive.is(links.find('.' + linkClass + ':first'))) {
        galleryStatus = 'start';
      } else if (linkActive.is(links.find('.' + linkClass + ':last'))) {
        galleryStatus = 'end';
      }
      document.on('touchmove', function (event) {
        pointDiffX = event.originalEvent.touches[0].pageX - pointStartX;
        pointDiffY = event.originalEvent.touches[0].pageY - pointStartY;
        if (Math.abs(pointDiffX) > 15) {
          pointDiffY = 0;
          var pointDiffXMargin = pointDiffX < 0 ? 15 - objectPadding : -15 - objectPadding;
          if (galleryStatus === 'start' && pointDiffX > 0) {
            pointShift = 4;
            pointDiffXMargin = -4 - objectPadding;
          } else if (galleryStatus === 'end' && pointDiffX < 0) {
            pointShift = 4;
            pointDiffXMargin = 4 - objectPadding;
          }
          object.css(translateGallery(positionStart + pointDiffX / pointShift + pointDiffXMargin + 'px'));
        }
      }).on('touchend', function (event) {
        document.off('touchmove touchend');
        if (Math.abs(pointDiffX) > 15) {
          if (pointDiffX > 50 && galleryStatus !== 'start') {
            index -= 1;
          } else if (pointDiffX < -50 && galleryStatus !== 'end') {
            index += 1;
          }
          linkActive.removeClass(linkClass + '-is-active js-dotsPage-is-active');
          links.find('.' + linkClass + ':eq(' + index + ')').addClass(linkClass + '-is-active js-dotsPage-is-active');
          object.addClass('slides-are-fixing');
          object.data('activeBlock', index);
          object.trigger('gallerySwipe');
          object.on(transition, function (event) {
            object.removeClass('slides-are-fixing');
            object.off(transition);
          });
          setTimeout(function () {
            object.css(translateGallery(objectWidth * -index + 'px'));
          }, 15);
        }
      });
    }
  });
}
function generateDots(size, listClass, pageClass) {
  var navigation = '<ul class="' + listClass + ' js-dotsNavigation u-listReset">';
  for (var index = 0; index < size; index++) {
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