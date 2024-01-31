///<reference path="libs/jquery-1.10.1.min.js" />
$(function () {
    (function ($) {
        // Globals:
        var slideDownSpeed = 350;
        var slideUpSpeed = 350;
        var topContainerSelector = ".accordion_top";
        var tabToAccordianClass = "tabs_to_accordions";
        var tabsSelector = ".accordion_tabs";
        var secureClass = "secure";
        var $topContainers = $(topContainerSelector);
        var $tabsUls = $(tabsSelector);
        // Initialize accordions.
        $topContainers.find("dd").css("display", "none"); // Hide all dd items.
        // Build tabs HTML (only for top level accordians with CSS class tabs_to_accordions)
        $topContainers.each(function (accordionIndex) {
            var $this = $(this);
            $this.attr("data-accordion-id", accordionIndex);
            if ($this.hasClass(tabToAccordianClass)) {
                var tabUl = $this.prev("ul");
                if (tabUl.length == 0 || !tabUl.hasClass("accordion_tabs")) {
                    $this.before("<ul></ul>");
                    tabUl = $this.prev("ul");
                }
                tabUl.addClass("accordion_tabs tab-nav");
                tabUl.attr("data-accordion-target", accordionIndex);
                $this.children("dt").each(function () {
                    var $thisDt = $(this);
                    var $thisA = $thisDt.find("a");
                    // tabUl.append('<li><a href="#"></a></li>');     
                    tabUl.append('<li><a href="#" onclick=ga("send","event",' + "&quot;"+'Game-Page-' + $(this).find("a").text() + "-Tab&quot;" + ',' + "&quot;" + $(this).find("a").text() + "&quot;" + ')></a></li>');
                   var $newLi =  tabUl.children().last();
                    var $newA = $newLi.find("a");
                    $newA.text($thisA.text());
                    if ($thisA.hasClass(secureClass)) {
                        $newA.addClass(secureClass);
                    }
                });
            }
        });
        // Function that manages selection of tabs / accordion items.
        var selectItem = function (accordionID, itemIndex, animate) {
            var $tabsUl = $tabsUls.filter('[data-accordion-target="' + accordionID + '"]');
            var $accordionDl = $topContainers.filter('[data-accordion-id="' + accordionID + '"]');
            $tabsUl.children(".active").removeClass("active");
            var currentSelectedDt = $accordionDl.children("dt:has(a.active)");
            var currentSelectedIndex =  -1;
            if (currentSelectedDt.length > 0) {
                currentSelectedIndex = currentSelectedDt.prevAll("dt").length;
                currentSelectedDt.find("a.active").removeClass("active");
                if (animate) {
                    currentSelectedDt.next().slideUp(slideUpSpeed);
                }
                else {
                    currentSelectedDt.next().css("display", "none");
                }
            }
            if (itemIndex != currentSelectedIndex) {
                var ddItem = $accordionDl.children("dd").eq(itemIndex);
                if (animate) {
                    ddItem.slideDown(slideDownSpeed);
                }
                else {
                    ddItem.css("display", "");
                }
                $accordionDl.children("dt").eq(itemIndex).find("a").addClass("active");
                $tabsUl.children().eq(itemIndex).addClass("active");
            }
        }
        // Initialize tabs:
        var $tabsUls = $("ul.accordion_tabs");
        if ($tabsUls.length > 0 && $tabsUls.first().css("display") != "none") {
            $tabsUls.each(function () {
                selectItem($(this).attr("data-accordion-target"), 0, false);
            });
        }
        // Event handlers:
        // Accordion click.
        $topContainers.on("click", "dt a", function () {
            var $this = $(this);
            selectItem($this.closest(topContainerSelector).attr("data-accordion-id"), $this.closest("dt").prevAll("dt").length, true);
            return false;
        });
        // Tab click.
        $tabsUls.on("click", "a", function () {
            var $this = $(this);
            if (!$this.closest("li").hasClass("active")) {
                selectItem($this.closest(tabsSelector).attr("data-accordion-target"), $this.closest("li").prevAll().length, false);
                var scrollTopTo = $this.closest("ul").attr("data-tab-scroll");
                if (scrollTopTo) {
                    $("body").animate({ scrollTop: scrollTopTo }, 500);
                }
            }
            return false;
        });
    })(jQuery);
});
