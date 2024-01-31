
$(function () {
    // Globals:
    var $subNavContainer = $("div.sub_nav_container");
    var $subNavUl = $("div.sub_nav > ul");
    var minBarHeight = 35; //65 Changed 4/17/15
    var barSlideDownDuration = 250;//250;
    var barSlideUpDuration = 250;//250;
    var barSlideDownEasing = "swing";
    var barDataKey = "callingBarNumber";
    var $bars = $subNavUl.children("[data-bar]");
    var $barsNot0 = $bars.filter("[data-bar!=0]");
    var $barsOptional = $barsNot0.not(".static_bar");
    var $staticBars = $bars.filter("[data-bar=0], .static_bar");
    var $mouseoverElements = $subNavUl.find("[data-child]");
    var mouseoverItemSelectedCssClass = "active_dropdown";
    var barHideTimeouts = [0, 0, 0, 0, 0];
    var barHideTimeoutDuration = 200;//150;
    var $window = $(window);

    // Initial settings:
    $barsOptional.css("display", "none");
    $subNavUl.find("[data-sub-bar]").css("display", "none");
    setStaticBarHeights();
    $bars.filter("[data-bar=2]").css({ "position": "relative", "z-index": 500 });
    $bars.filter("[data-bar=1]").css({ "position": "relative", "z-index": 500 });

    // Event handlers:
    $window.on("resize", setStaticBarHeights);
    $subNavUl.on("mouseenter", "[data-child]", function () {
        $this = $(this);
        var newSelectedBarNumber = getChildBarNumber($this);
        clearTimeout(barHideTimeouts[newSelectedBarNumber]);
        var thisBarNumber = getThisBarNumber($this)
        var subBarNumber = $this.attr("data-sub-child");
        deselectAll(thisBarNumber);
        select($this);
        if (thisBarNumber == 0) {
            $barsNot0.each(function (index, obj) {
                var barNumber = getBarNumber($(this));
                if (newSelectedBarNumber == barNumber) {
                    showBar(barNumber, thisBarNumber, subBarNumber);
                }
                else {
                    hideBar(barNumber);
                }
                return true;
            });
        }
        else {
            showBar(newSelectedBarNumber, thisBarNumber, subBarNumber);
        }
    }).on("mouseleave", "[data-child]", function () {
        var $this = $(this);
        var newSelectedBarNumber = getChildBarNumber($this);
        clearTimeout(barHideTimeouts[newSelectedBarNumber]);
        var callback = function () {
            deselect($this);
            hideBar(newSelectedBarNumber);
        }
        barHideTimeouts[newSelectedBarNumber] = setTimeout(callback, barHideTimeoutDuration);
    });
    $barsNot0.on("mouseenter", function () {
        var $this = $(this);
        var barNumber = getBarNumber($this);
        var callingBarNumber = getCallingBarNumber($this);
        clearTimeout(barHideTimeouts[callingBarNumber]);
        clearTimeout(barHideTimeouts[barNumber]);
    }).on("mouseleave", function () {
        var $this = $(this);
        var barNumber = getBarNumber($this);
        var callingBarNumber = getCallingBarNumber($this);
        clearTimeout(barHideTimeouts[barNumber]);
        clearTimeout(barHideTimeouts[callingBarNumber]);
        var callback = function () {
            hideBarAndDeselectAll(barNumber);
        }
        barHideTimeouts[barNumber] = setTimeout(callback, barHideTimeoutDuration);
        var callback2 = function () {
            hideBarAndDeselectAll(callingBarNumber);
        }
        barHideTimeouts[callingBarNumber] = setTimeout(callback2, barHideTimeoutDuration);
    });

    // Helpers:
    function select($mouseoverItem) {
        if (!$mouseoverItem.hasClass(mouseoverItemSelectedCssClass)) {
            $mouseoverItem.addClass(mouseoverItemSelectedCssClass).not(":has(i)").append(" <i class='fa fa-sort-desc'></i>");
        }
    }
    function deselect($mouseoverItem) {
        $mouseoverItem.removeClass(mouseoverItemSelectedCssClass).find("i").not(".static_i").remove();
        $mouseoverItem.html($mouseoverItem.html().trim());
    }
    function deselectAll(barNumber) {
        getBar(barNumber).find("." + mouseoverItemSelectedCssClass).each(function (index, obj) { deselect($(obj)); return true; });
    }
    function showBar(barNumber, callingBarNumber, subBarNumber) {
        if (barNumber > 0) {
            var $bar = getBar(barNumber);
            $bar.data(barDataKey, callingBarNumber);
            if ($bar.css("display") == "none") {
                $bar.slideDown(barSlideDownDuration, barSlideDownEasing);
            }
            if (subBarNumber != undefined) {
                var $subBar = $bar.children().css("display", "none").filter("[data-sub-bar='" + subBarNumber + "']");
                if ($subBar.length == 0) {
                    $subBar = $bar.children().not("[data-sub-bar]");
                }
                $subBar.css("display", "block");
            }
        }
    }
    function hideBar(barNumber) {
        if (barNumber > 0) {
            var $bar = getBar(barNumber);
            if ($bar.hasClass("static_bar")) {
                $bar.children().css("display", "none").not("[data-sub-bar]").css("display", "block");
            }
            else {
                getBar(barNumber).not(".static_bar").slideUp(barSlideUpDuration, barSlideDownEasing);
            }
        }
    }
    function hideBarAndDeselectAll(barNumber) {
        var callingBarNumber = getBar(barNumber).data(barDataKey);
        deselectAll(callingBarNumber);
        hideBar(barNumber);
    }
    function getThisBarNumber($mouseoverItem) {
        return $mouseoverItem.closest("li[data-bar]").attr("data-bar");
    }
    function getBarNumber($bar) {
        return $bar.attr("data-bar");
    }
    function getBar(barNumber) {
        return $bars.eq(barNumber);
    }
    function getCallingBarNumber($bar) {
        var callingBarNumber = $bar.data(barDataKey);
        if (!$.isNumeric(callingBarNumber)) {
            callingBarNumber = 0;
        }
        return callingBarNumber;
    }
    function getChildBarNumber($mouseoverItem) {
        return $mouseoverItem.attr("data-child");
    }
    function setStaticBarHeights() {
        var totalHeight = 0;
        $staticBars.each(function () {
            totalHeight += $(this).outerHeight();
            return true;
        });
        $subNavContainer.css("height", totalHeight);
    }
});
