function initSwipe(OBJECT, PARENT, LINKS, LINK_CLASS, DOCUMENT, WINDOW, BODY, TRANSITION) {
	OBJECT.on("touchstart", function(event) {
		if (!OBJECT.is(".galleryImageView-is-fixing")) {
			var OBJECT_WIDTH = PARENT.width(),
					OBJECT_PADDING = PARENT.css("padding-left").replace("px", "") - 0,
					POINT_START_X = event.originalEvent.touches[0].pageX,
					POINT_START_Y = event.originalEvent.touches[0].pageY,
					POINT_DIFF_X = 0,
					POINT_DIFF_Y = 0,
					POINT_SHIFT = 1,
					POSITION_START = OBJECT.offset().left,
					LINK_ACTIVE = LINKS.find("." + LINK_CLASS + "-is-active"),
					INDEX = LINKS.find("." + LINK_CLASS).index(LINK_ACTIVE),
					GALLERY_STATUS = "middle";
			if (LINK_ACTIVE.is(LINKS.find("." + LINK_CLASS + ":first"))) {
				GALLERY_STATUS = "start";
			} else if (LINK_ACTIVE.is(LINKS.find("." + LINK_CLASS + ":last"))) {
				GALLERY_STATUS = "end";
			}
			DOCUMENT.on("touchmove", function(event) {
					POINT_DIFF_X = event.originalEvent.touches[0].pageX - POINT_START_X;
					POINT_DIFF_Y = event.originalEvent.touches[0].pageY - POINT_START_Y;
					if (Math.abs(POINT_DIFF_X) > 15) {
						POINT_DIFF_Y = 0;
						var POINT_DIFF_X_MARGIN = POINT_DIFF_X < 0 ? (15 - OBJECT_PADDING) : (-15 - OBJECT_PADDING);
						if ((GALLERY_STATUS === "start" && POINT_DIFF_X > 0)) {
							POINT_SHIFT = 4;
							POINT_DIFF_X_MARGIN = -4 - OBJECT_PADDING;
						} else if ((GALLERY_STATUS === "end" && POINT_DIFF_X < 0)) {
							POINT_SHIFT = 4;
							POINT_DIFF_X_MARGIN = 4 - OBJECT_PADDING;
						}
						OBJECT.css(translateGallery((POSITION_START + POINT_DIFF_X / POINT_SHIFT + POINT_DIFF_X_MARGIN) + "px"));
					}
			}).on("touchend", function(event) {
				DOCUMENT.off("touchmove touchend");
				if (Math.abs(POINT_DIFF_X) > 15) {
					if (POINT_DIFF_X > 50 && GALLERY_STATUS !== "start") {
						INDEX -= 1;
					} else if (POINT_DIFF_X < -50 && GALLERY_STATUS !== "end") {
						INDEX += 1;
					}
					LINK_ACTIVE.removeClass(LINK_CLASS + "-is-active js-dotsPage-is-active");
					LINKS.find("." + LINK_CLASS + ":eq(" + INDEX + ")").addClass(LINK_CLASS + "-is-active js-dotsPage-is-active");
					OBJECT.addClass("slides-are-fixing");
					OBJECT.data("activeBlock", INDEX);
					OBJECT.trigger("gallerySwipe");
					OBJECT.on(TRANSITION, function(event) {
						OBJECT.removeClass("slides-are-fixing");
						OBJECT.off(TRANSITION);
					});
					setTimeout(function() {
						OBJECT.css(translateGallery(OBJECT_WIDTH * -INDEX + "px"));
					}, 15);
				}
			});
		}
	});
}

function generateDots(SIZE, LIST_CLASS, PAGE_CLASS) {
	var NAVIGATION = "<ul class=\"" + LIST_CLASS + " js-dotsNavigation u-listReset\">";
	for (var INDEX = 0; INDEX < SIZE; INDEX++) {
		NAVIGATION = INDEX === 0 ? NAVIGATION + "<li class=\"" + PAGE_CLASS + " " + PAGE_CLASS + "-is-active js-dotsPage-is-active js-dotsPage\"></li>" : NAVIGATION + "<li class=\"" + PAGE_CLASS + " js-dotsPage\"></li>";
	}
	NAVIGATION += "</ul>";
	return NAVIGATION;
}

function translateGallery(DISTANCE) {
	var CSS = {
		"-webkit-transform": "translateX(" + DISTANCE + ") translateZ(0)",
		"-moz-transform": "translateX(" + DISTANCE + ") translateZ(0)",
		"-ms-transform": "translateX(" + DISTANCE + ")",
		"-o-transform": "translateX(" + DISTANCE + ")",
		"transform": "translateX(" + DISTANCE + ") translateZ(0)"
	};
	return CSS;
}
