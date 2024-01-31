(function(){
// Function defined under handlers.
var buttonsOnUpdatePanelsHandlers;

//===========================================================================================================
// Modal script from user control:
$(function () {
    SetupModals();
});

function SetupModals() {
    var dlg = $('#divEULAModal').dialog({
        modal: true,
        draggable: false,
        autoOpen: false,
        resizable: false,
        width: 640,
        height: 400
    });
    dlg.parent().appendTo($("form:first"));

    var dlg2 = $('#divProcessing').dialog({
        modal: true,
        draggable: false,
        autoOpen: false,
        resizable: false,
        width: 350,
        height: 300
    });

    var dlg3 = $('#divProcessed').dialog({
        modal: true,
        draggable: false,
        autoOpen: false,
        resizable: false,
        width: 350
    });

    var dlg4 = $('#divImageZoomModal').dialog({
        modal: true,
        dialogClass: "interactive_modal",
        draggable: false,
        autoOpen: false,
        resizable: false
    });
};

window.setCartAssetDownloadData = function() {
    $("input.cart_asset_download_data").val(window.getCartAssetDownloadData());  // From igt-interactive-media-downloads.js
}

//Modal functionality to open and close. Server side code may also close modal using functions
window.LoadModal = function(modalName) {
    $('#' + modalName).dialog('open');
}

 window.AcceptedEULA = function() {
    CloseModal('divEULAModal');
    LoadModal('divProcessing');
}

window.CloseModal = function(modalName) {
    $('#' + modalName).dialog('close');
}

//Show the processed links for downloading
window.ShowProcessedLinksModal = function () {
    CloseModal("divProcessing");
    LoadModal('divProcessed');
}

window.CloseAllModals = function() {
    CloseModal('divProcessing');
    CloseModal('divProcessed');
    CloseModal('divEULAModal');
}

//Re-bind for callbacks
var prm = Sys.WebForms.PageRequestManager.getInstance();

prm.add_endRequest(function () {
    SetupModals();
    if (buttonsOnUpdatePanelsHandlers) {
        buttonsOnUpdatePanelsHandlers();
    }
});
// End script from user control (modal functionality)
//===========================================================================================================

/// <reference path="igt-isotope-facet-3.js" />
/// <reference path="isotope.pkgd.js" />

$(function () {
    var facetMgr = new IgtFacetManager({ filteringFinishedCallback: onFilterCompleteWithPause });

    // Variables.
    var $isotopeContainer = $('.isotope_container');
    var $cartHeaderPanel = $(".cart_header_panel");
    var $selectHeaderPanel = $(".media_header_panel");
    var $elements = $isotopeContainer.find(".element");
    var $itemsAsGridButton = $(".items_as_grid_button");
    var $itemsAsListButton = $(".items_as_list_button");
    var $addToCartButtons = $isotopeContainer.find("div.element a.btn");
    var $removeFromCartButtons = $isotopeContainer.find("div.element a.remove");
    var $cartPageButton = $(".cart_page_button");
    var $mediaSelectionPageButton = $(".media_selection_page_button");
    var $cartCount = $(".mda_cart_count");
    var $cartPageButton = $(".mda_cart_button");
    var $filteredCount = $(".mda_filtered_count");
    var $totalCount = $(".mda_total_count");
    var $images = $isotopeContainer.find("div.element_image img");
    var $imageAnchors = $isotopeContainer.find("div.element_image a");
    var $window = $(window);
    var MEDIA_DOWNLOAD_COOKIE_KEY = "Scene7HandlesCart";
    var $downloadAnchorWrapperWrapper = $("div.download_processed_wrapper_wrapper");
    var $imageZoomModal = $("#divImageZoomModal");
    var $imageZoomModalImage = $imageZoomModal.find("img.image_zoom_modal_image");
    var MAX_ZOOM_IMAGE_WIDTH = 800;
    var MAX_ZOOM_IMAGE_HEIGHT = 800;
    var ZOOM_IMAGE_WIDTH_ADJUSTMENT = 0; // 0;
    var ZOOM_IMAGE_HEIGHT_ADJUSTMENT = 30; // 0;
    var MAX_FILTER_ASSETS_TO_ADD_TO_CART = 40;

    // Global Functions:
    window.getCartAssetDownloadData = function () {
        var $itemsInCart = getItemsInCart();
        var cartAssetDataItems = [];
        for (var i = 0; i < $itemsInCart.length; i++) {
            cartAssetDataItems[i] = {
                AssetHandle: $itemsInCart.eq(i).attr("data-handle"),
                AssetSize: new Number($itemsInCart.eq(i).find("span.asset_size").text()),
                AssetName: $itemsInCart.eq(i).find("div.description_file_name").text().trim()
            }
        }
        return JSON.stringify(cartAssetDataItems);
    }

    // Initialize Isotope plugin.
    $isotopeContainer.isotope({
        itemSelector: '.element',
        layoutMode: 'masonry',
        masonry: {
            // columnWidth: 1 //235
        }
    });

    //Initialize page:
    $elements.css("display", "block");
    $totalCount.text($elements.length);
    onFilterComplete();
    refreshCartAndElements();

    //Event handlers:
    $isotopeContainer.isotope("on", "layoutComplete", onFilterComplete);
    $isotopeContainer.isotope("on", "removeComplete", onFilterComplete);
    $imageAnchors.click(function (e) {
        e.stopPropagation();
        zoomImageInModal($(this));
        return false;
    });
    $elements.click(function () {
        toggleElementExpandContract($(this));
    });
    $mediaSelectionPageButton.click(function () {
        showMediaSelectionPage();
        return false;
    });
    $cartPageButton.click(function () {
        showCartPage();
        return false;
    });
    $totalCount.click(function () {
        facetMgr.clearFilterResetAll();
        return false;
    });
    $filteredCount.click(function () {
        if (!$(this).hasClass("disabled") && $(this).text() <= MAX_FILTER_ASSETS_TO_ADD_TO_CART) {
            addFilteredItemsToCart();
        }
        return false;
    })
    $itemsAsGridButton.click(function () {
        $itemsAsGridButton.addClass("active");
        $itemsAsListButton.removeClass("active");
        showItemsAsGrid(true);
        return false;
    });
    $itemsAsListButton.click(function () {
        $itemsAsGridButton.removeClass("active");
        $itemsAsListButton.addClass("active");
        showItemsAsList(true);
        return false;
    });
    $addToCartButtons.click(function () {
        var $this = $(this);
        if ($this.hasClass("in_cart")) {
            showCartPage();
        }
        else {
            setupItemInCart(getContainingElement(this));
            updateCart();
        }
        return false;
    });
    $removeFromCartButtons.click(function () {
        setupItemNotInCart(getContainingElement(this));
        updateCart();
        if ($cartHeaderPanel.css("display") != "none") {
            $isotopeContainer.isotope({ filter: ".in_cart" });
        }
        return false;
    });
    $downloadAnchorWrapperWrapper.on("click", "div.download_complete_link a", function () {
        clearCart();
        showMediaSelectionPage();
        return true;
    });
    // Function for attaching handlers for buttons on update panels.
    buttonsOnUpdatePanelsHandlers = function () {
        // Clear cart button.
        var $clearCartButton = $(".mda_clear_cart");
        $clearCartButton.off("click").on("click", function () {
            clearCart();
            showMediaSelectionPage();
            return false;
        });
    }
    // Initialize.
    buttonsOnUpdatePanelsHandlers();
    // Helpers:
    function onFilterComplete() {
        // Update filter item count
        var filteredCounter = 0;
        $elements.each(function () { $(this).css("display") == "none" || filteredCounter++; return true; })
        $filteredCount.text(filteredCounter);
        // Enable / Disable select all filtered button
        if (filteredCounter <= MAX_FILTER_ASSETS_TO_ADD_TO_CART) {
            $filteredCount.removeClass("disabled");
        }
        else {
            $filteredCount.addClass("disabled")
        }
        $filteredCount.attr("title", filteredCounter <= 40 ? "Amount Viewing\nClick to add all filtered assets to the cart\n(total of " + filteredCounter + " items)" : "Amount Viewing");
    }
    function onFilterCompleteWithPause() {
        setTimeout(onFilterComplete, 2000);
    }
    function addFilteredItemsToCart() {
        $elements.each(function () {
            var $thisElement = $(this);
            if ($thisElement.css("display") != "none" && !$thisElement.hasClass("in_cart")) {
                setupItemInCart($thisElement);
            }
            return true;
        });
        updateCart();
    }
    function getItemsInCart() { return $elements.filter(".in_cart"); }
    function getContainingElement(itemInElement) { return $(itemInElement).closest(".element"); }
    function toggleElementExpandContract($element) {
        if ($cartHeaderPanel.css("display") == "none" && !$itemsAsListButton.hasClass("active")) {
            var isLarge = $element.hasClass("large");
            $elements.filter(".large").removeClass("large");
            if (!isLarge) {
                $element.addClass("large");
            }
            $isotopeContainer.isotope("layout");
        }
    }
    function showCartPage() {
        $cartHeaderPanel.css("display", "block");
        $selectHeaderPanel.css("display", "none");
        showItemsAsList(false);
        $addToCartButtons.css("display", "none");
        $isotopeContainer.isotope({ filter: ".in_cart" });
        $isotopeContainer.addClass("cart");
    }
    function showMediaSelectionPage() {
        $cartHeaderPanel.css("display", "none");
        $selectHeaderPanel.css("display", "block");
        showItemsAsCurrentGridListSelection(false);
        facetMgr.filterIsotopeItems();
        $addToCartButtons.css("display", "inline-block");
        $isotopeContainer.removeClass("cart");
    }
    function refreshCartCookie() {
        var cookieValue = readCookie(MEDIA_DOWNLOAD_COOKIE_KEY);
        if (cookieValue !== null) {
            createCookie(MEDIA_DOWNLOAD_COOKIE_KEY, cookieValue, 1);
        }
    }
    function clearCart() {
        getItemsInCart().each(function (item, obj) {
            setupItemNotInCart($(obj));
            return true;
        });
        clearCartCookie();
        updateCartItemCount();
    }
    function setupItemInCart($element) {
        var $addButton = $element.find(".btn");
        var $removeButton = $element.find(".remove");
        $element.addClass("in_cart");
        $addButton.addClass("in_cart"); //.find("span").text("Go to Cart");
        $addButton.attr("title", "Item is in cart\nClick to go to cart");
        $removeButton.addClass("in_cart");
    }
    function setupItemNotInCart($element) {
        var $addButton = $element.find(".btn");
        var $removeButton = $element.find(".remove");
        $element.removeClass("in_cart").find(".in_cart");
        $addButton.removeClass("in_cart"); //.find("span").text("Add to Cart");
        $addButton.attr("title", "Add to cart");
        $removeButton.removeClass("in_cart");
    }
    function updateCart() {
        var $itemsInCart = getItemsInCart();
        updateCartItemCount($itemsInCart);
        updateCartCookie($itemsInCart);
    }
    function refreshCartAndElements() {
        var $itemsInCart = getItemsInCart();
        $itemsInCart.each(function (index, obj) {
            setupItemInCart($(obj));
            return true;
        });
        refreshCartCookie();
        updateCartItemCount($itemsInCart);
    }
    function updateCartItemCount($itemsInCart) {
        var currentCount = ($itemsInCart ? $itemsInCart.length : getItemsInCart().length);
        $cartCount.text(currentCount);
        $cartPageButton.attr("title", "Click to go to cart\n(currently " + currentCount + " items in the cart)");
    }
    function zoomImageInModal($imgAnchor) {
        var imageWidth = new Number($imgAnchor.attr("data-width"));
        var imageHeight = new Number($imgAnchor.attr("data-height"));
        var skipShowImage = false;
        $imageZoomModalImage.attr("src", $imgAnchor.attr("data-src"));
        if (imageWidth == 0 || imageHeight == 0) {
            var imageThumbnailUrl = $imgAnchor.find("img").attr("src");
            var imageDiscription = getContainingElement($imgAnchor).find("div.description_file_name").text().trim();
            // SWF file special case.
            if (imageDiscription.substr(imageDiscription.length - 4).toLowerCase() == ".swf") {
                $imageZoomModalImage.attr("src", imageThumbnailUrl);
                openZoomModal(200, 200);
            }
            else {
                $imageZoomModal.dialog({ width: 400, height: 400 });
                $imageZoomModalImage.css({ width: "auto", height: "auto" });
                var callbackNumber = 0;
                // Recursive function.
                var callback = function () {
                    callbackNumber++
                    imageWidth = $imageZoomModalImage.innerWidth();
                    imageHeight = $imageZoomModalImage.innerHeight();

                    if (callbackNumber < 100 && (imageWidth == 0 || imageHeight == 0)) {
                        setTimeout(callback, 100);
                    }
                    else {
                        if (imageWidth == 0 || imageHeight == 0) {
                            // If no image then show thumbnail:
                            $imageZoomModalImage.attr("src", imageThumbnailUrl);
                            imageWidth = $imageZoomModalImage.innerWidth();
                            imageHeight = $imageZoomModalImage.innerHeight();
                        }
                        $imageZoomModal.dialog("close");
                        $imageZoomModal.css("visibility", "visible");
                        openZoomModal(imageWidth, imageHeight);
                    }
                }
                $imageZoomModal.css("visibility", "hidden");
                $imageZoomModal.dialog("open");
                setTimeout(callback, 300);
            }
        }
        else {
            openZoomModal(imageWidth, imageHeight);
        }
    }
    function openZoomModal(imageWidth, imageHeight) {
        var dialogWidth;
        var dialogHeight;
        var resultWidth;
        var resultHeight;
        if (imageWidth > MAX_ZOOM_IMAGE_WIDTH && imageHeight > MAX_ZOOM_IMAGE_HEIGHT) {
            if ((imageWidth - MAX_ZOOM_IMAGE_WIDTH) > (imageHeight - MAX_ZOOM_IMAGE_HEIGHT)) {
                resultWidth = MAX_ZOOM_IMAGE_WIDTH;
                resultHeight = imageHeight * (resultWidth / imageWidth);
            }
            else {
                resultHeight = MAX_ZOOM_IMAGE_HEIGHT;
                resultWidth = imageWidth * (resultHeight / imageHeight);
            }
        }
        else if (imageWidth > MAX_ZOOM_IMAGE_WIDTH) {
            resultWidth = MAX_ZOOM_IMAGE_WIDTH;
            resultHeight = imageHeight * (resultWidth / imageWidth);
        }
        else if (imageHeight > MAX_ZOOM_IMAGE_HEIGHT) {
            resultHeight = MAX_ZOOM_IMAGE_HEIGHT;
            resultWidth = imageWidth * (resultHeight / imageHeight);
        }
        else {
            resultWidth = imageWidth;
            resultHeight = imageHeight;
        }
        $imageZoomModalImage.css({ width: resultWidth, height: resultHeight });
        dialogWidth = resultWidth + ZOOM_IMAGE_WIDTH_ADJUSTMENT;
        dialogHeight = resultHeight + ZOOM_IMAGE_HEIGHT_ADJUSTMENT;
        $imageZoomModal.dialog({ width: dialogWidth, height: dialogHeight, modal: true, dialogClass: "interactive_modal" });
        $imageZoomModal.dialog("open");
    }
    // Utilities:
    function updateCartCookie($cartItems) {
        var cartScene7Handles = [];
        $cartItems.each(function (index, obj) {
            cartScene7Handles.push($(obj).attr("data-handle"));
            return true;
        });
        var cookieValue = cartScene7Handles.join(",");
        createCookie(MEDIA_DOWNLOAD_COOKIE_KEY, cookieValue, 1);
    }
    function clearCartCookie() {
        eraseCookie(MEDIA_DOWNLOAD_COOKIE_KEY);
    }
    function showItemsAsCurrentGridListSelection(layout) {
        if ($itemsAsGridButton.hasClass("active")) {
            showItemsAsGrid(layout);
        }
        else {
            showItemsAsList(layout);
        }
    }
    function showItemsAsGrid(layout) {
        $elements.removeClass("large");
        if (layout) {
            $isotopeContainer.isotope("layout");
        }
        $elements.css("cursor", "pointer");
    }
    function showItemsAsList(layout) {
        $elements.addClass("large");
        if (layout) {
            $isotopeContainer.isotope("layout");
        }
        $elements.css("cursor", "default");
    }
    function createCookie(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toGMTString();
        }
        else var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }
    function readCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    function eraseCookie(name) {
        createCookie(name, "", -1);
    }
});

})()
