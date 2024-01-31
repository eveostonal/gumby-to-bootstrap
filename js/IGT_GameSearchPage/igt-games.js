$(function() {
	//On width change, update the height of the M4 sticky header parent content container
	$('.gumby_fixed').closest('.content').resize(function() {
		adjustHeight();
	});
	
	adjustHeight();
});

function adjustHeight() {
	//Get the parent content element
	var $parentContent = $('.gumby_fixed').closest('.content');
	var parentHeight = $parentContent.height();
	
	//If the user scrolls to 215, set the height of the parent content container
	//if ($(window).scrollTop() > 215)
	$parentContent.css({'min-height' : parentHeight});
	//else
	//	$parentContent.css({});
}