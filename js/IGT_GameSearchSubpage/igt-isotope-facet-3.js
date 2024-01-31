/// <reference path="libs/jquery-2.0.2.min.js" />
/// <reference path="isotope.pkgd.js" />


function IgtFacetManager(options) {
    var defaultOptions = {
        isotopeContainerSelector: ".isotope_container",
        facetContainerSelector: ".facet_container",
        facetSelector: ".facet",
        facetPanelSelector: ".facet_panel",
        facetAllSelectCheckboxSelector: ".facet_all_select",
        autocompleteTextBoxSelector: ".autocomplete_textbox",
        searchTextAttricute: "data-search",
        facetNameAttribute: "data-facet",
        isotopeItemValuesAttribute: "data-values",
        isotopeItemSelector: ".element",
        filteringFinishedCallback: null
    }
    options = $.extend(defaultOptions, options);
    var facetMgrInstance = this;
    var facetControls = [];
    $(options.facetContainerSelector).find(options.facetSelector).each(function (index, obj) {
        facetControls[index] = new IgtFacet($(obj));
        return true;
    });
    var $isotopeContainer = $(options.isotopeContainerSelector);
    var $isotopeItems = $isotopeContainer.find(options.isotopeItemSelector);
    $isotopeItems.each(function () {
        var $this = $(this);
        $this.data("values", $.parseJSON($this.attr(options.isotopeItemValuesAttribute)));
        return true;
    });
    function hidePanels() {
        $.each(facetControls, function (index, obj) { obj.hidePanel(); return true; });
    }
    this.clearFilterResetAll = function() {
        $.each(facetControls, function (index, obj) {
            obj.resetToAllSelected();
            return true;
        });
        $isotopeContainer.isotope({ filter: "*" });
    }
    this.filterIsotopeItems = function () {
        for (var i = 0; i < facetControls.length; i++) {
            // Display none if none selected for any facet category.
            if (!facetControls[i].initialFilter()) {
                $isotopeContainer.isotope({ filter: "-none-" });
                $.isFunction(options.filteringFinishedCallback) && options.filteringFinishedCallback();
                return;
            }
        }
        var showAllItems = true;
        for (var i = 0; i < facetControls.length; i++) {
            if (!facetControls[i].allSelected) {
                showAllItems = false;
            }
        }
        // Show all items if all facet categories have all selected.
        if (showAllItems) {
            $isotopeContainer.isotope({ filter: "*" });
            $.isFunction(options.filteringFinishedCallback) && options.filteringFinishedCallback();
            return;
        }
        // Otherwise filter each item individually.
        $isotopeContainer.isotope({
            filter: function () {
                var itemDataValueArray = $(this).data("values");
                for (var i = 0; i < facetControls.length; i++) {
                    if (!facetControls[i].checkFilterItem(itemDataValueArray[i])) {
                        return false;
                    }
                }
                return true;
            }
        });
        $.isFunction(options.filteringFinishedCallback) && options.filteringFinishedCallback();
    }

    // IGT Facet object class constructor.
    function IgtFacet($controlContainer) {
        $controlContainer = $($controlContainer);
        var thisFacet = this;
        var $panel = $controlContainer.find(options.facetPanelSelector);
        var $allSelect = $controlContainer.find(options.facetAllSelectCheckboxSelector);
        var $autocomplete = $controlContainer.find(options.autocompleteTextBoxSelector);
        var isAutocomplete = ($autocomplete.length > 0);
        var $values = $controlContainer.find("input:checkbox:not(.facet_all_select)");
        var $valueContainers = $("");
        this.allSelected = true;
        var noneSelected = false;
        var checkedValues = [];

        // Initialize:
        $values.each(function (index, obj) {
            $valueContainers = $valueContainers.add($(obj).parent())
            return true;
        })

        // Filtering:
        function updateSelected() {
            thisFacet.allSelected = $allSelect.prop("checked");
            checkedValues = [];
            $values.filter(":checked").each(function () { checkedValues.push(new Number($(this).val())) });
            noneSelected = (checkedValues.length === 0 && !thisFacet.allSelected);
        }
        this.initialFilter = function () {
            updateSelected();
            return !noneSelected;
        }
        this.checkFilterItem = function (valueArray) {
            if (thisFacet.allSelected) {
                return true;
            }
            return arraysContain(checkedValues, valueArray);
        }

        // Set selections:
        this.resetToAllSelected = function () {
            $values.prop("checked", false);
            $allSelect.prop("checked", true);
            if (isAutocomplete) {
                $autocomplete.val("");
            }
        }

        // Event handlers:
        function valueClick() {
            if ($(this).prop("checked")) {
                $allSelect.prop("checked", false);
            }
            autocompleteAndFilter();
        }
        function allSelectClick() {
            if ($allSelect.prop("checked")) {
                $values.prop("checked", false);
            }
            autocompleteAndFilter();
        }
        function autocompleteChange() {
            hideValues();
            var autocompleteFilter = "[" + options.searchTextAttricute + "^='" + $autocomplete.val().toLowerCase() + "']";
            $values.filter(":checked, " + autocompleteFilter).parent().css("display", "block");
        }
        function autocompleteAndFilter() {
            if (isAutocomplete) {
                autocompleteChange();
            }
            facetMgrInstance.filterIsotopeItems();
        }

        // Handler wireup:
        $controlContainer.mouseover(function () {
            hidePanels();
            thisFacet.showPanel();
        }).mouseout(function () { thisFacet.hidePanel(); });
        $panel.mouseover(function () { thisFacet.showPanel() }).mouseout(function () { thisFacet.hidePanel(); });
        $values.click(valueClick);
        $allSelect.click(allSelectClick);
        if (isAutocomplete) {
            $autocomplete.keyup(autocompleteChange);
        }

        // Helpers:
        function hideValues() {
            $valueContainers.css("display", "none");
        }
        this.hidePanel = function () { hide($panel); }
        this.showPanel = function () { show($panel); }
    }

    // Helper functions:

    // Doesn't append empty or false or undefined values
    function hide($items) {
        $items.css("display", "none");
    }
    function show($items) {
        $items.css("display", "block");
    }
    function arraysContain(array1, array2) {
        for (var i = 0; i < array1.length; i++) {
            for (var n = 0; n < array2.length; n++) {
                if (array1[i] == array2[n]) {
                    return true;
                }
            }
        }
        return false;
    }
}
