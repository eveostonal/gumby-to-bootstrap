function scrollEv(leftArrow, rightArrow, carousel) {
  if (carousel.scrollLeft <= 0) {
    leftArrow.classList.add("arrow-inactive");
  } else {
    leftArrow.classList.remove("arrow-inactive");
  }
  if (carousel.scrollLeft >= carousel.scrollWidth - carousel.offsetWidth - 1) {
    rightArrow.classList.add("arrow-inactive");
  } else {
    rightArrow.classList.remove("arrow-inactive");
  }
}

function clicleftArrow(carousel, rectList) {
  let shiftScroll;
  for (let i = 0; i < rectList.length; i++) {
    if (carousel.scrollLeft > rectList[rectList.length - 1]) {
      shiftScroll = rectList[rectList.length - 1];
    } else if (
      carousel.scrollLeft > rectList[i] &&
      carousel.scrollLeft <= rectList[i + 1]
    ) {
      shiftScroll = rectList[i];
    }
  }
  carousel.scrollTo({
    left: shiftScroll,
    behavior: "smooth"
  });
}

function clickRight(carousel, rectList) {
  let shiftScroll;
  for (let i = 0; i < rectList.length; i++) {
    if (
      carousel.scrollLeft >= rectList[i] - 1 &&
      carousel.scrollLeft < rectList[i + 1]
    ) {
      shiftScroll = rectList[i + 1];
    }
  }
  carousel.scrollTo({
    left: shiftScroll,
    behavior: "smooth"
  });
}

function listRectCarousel(carouselNumber, carousels) {
  let divs = carousels[carouselNumber].getElementsByClassName("story-carousel-item");
  let rectList = [];
  let rectGauche = carousels[carouselNumber].getBoundingClientRect().left;

  for (let i = 0; i < divs.length; i++) {
    let rect = divs[i].getBoundingClientRect();
    rectList.push(rect.left - rectGauche);
  }

  for (let i = rectList.length - 1; i >= 0; i--) {
    rectList[i] = rectList[i] - rectList[0];
  }
  return rectList;
}

function autoSlidePosLeft(carouselNumber, carousels, leftArrows) {
  let rectList = listRectCarousel(carouselNumber, carousels);
  leftArrows[carouselNumber].addEventListener("click", () => {
    clicleftArrow(carousels[carouselNumber], rectList);
  });
}

function autoSlidePosRight(carouselNumber, carousels, rightArrows) {
  let rectList = listRectCarousel(carouselNumber, carousels);
  rightArrows[carouselNumber].addEventListener("click", () => {
    clickRight(carousels[carouselNumber], rectList);
  });
}

window.onload = () => {
  let leftArrows = document.getElementsByClassName("left-arrow");
  let rightArrows = document.getElementsByClassName("right-arrow");
  let carousels = document.getElementsByClassName("story-carousel");

  for (let i = 0; i < leftArrows.length; i++) {
    autoSlidePosLeft(i, carousels, leftArrows);
    window.onresize = () => {
      autoSlidePosLeft(i, carousels, leftArrows);
    };
  }

  for (let i = 0; i < rightArrows.length; i++) {
    autoSlidePosRight(i, carousels, rightArrows);
    window.onresize = () => {
      autoSlidePosRight(i, carousels, rightArrows);
    };
  }

  for (let i = 0; i < carousels.length; i++) {
    carousels[i].addEventListener("scroll", () => {
      scrollEv(leftArrows[i], rightArrows[i], carousels[i]);
    });
  }

  for (let i = 0; i < carousels.length; i++) {
    scrollEv(leftArrows[i], rightArrows[i], carousels[i]);
    window.onresize = () => {
      scrollEv(leftArrows[i], rightArrows[i], carousels[i]);
    };
  }

  /* TOGGLE OVERFLOW */

	/*
  let toggleOverflow = document.getElementById("toggle");
  toggleOverflow.addEventListener("click", () => {
    for (let i = 0; i < carousels.length; i++) {
      carousels[i].classList.toggle("overflow");
      carousels[i].parentNode.classList.toggle("scrollbar-overflow");
    }
  });
	*/
};

$(function () {

  var igtBrowserWidth = parseFloat( $(document).width() );
  var storyCardWidth = parseFloat ( $("div.container:first-of-type").width() );
  var storyCardMargin = (igtBrowserWidth - storyCardWidth)/2;
  // alert(igtBrowserWidth);
  // alert(storyCardWidth);
  // alert(storyCardMargin);
  $("#storycards .story-carousel-item:first-of-type").css("margin-left", storyCardMargin);
  // $("#storycards").css("margin-left", storyCardMargin).css("max-width", "100%").css("padding-left", 0).css("padding-right", 0);

  // Add scroll delay
  $("#storycards .story-carousel-item > a.card").each(function(){
    $(this).hover(
      function(){
        // $(this).find(".story-copy-wrapper").css("overflow", "auto");
      }, 3000);
  });

});