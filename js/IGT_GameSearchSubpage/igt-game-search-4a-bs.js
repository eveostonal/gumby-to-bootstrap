/// <reference path="libs/jquery-1.10.1.min.js" />
/// <reference path="igt-client.js" />

document.igt.gs = {};
document.igt.gs.globals = {};
document.igt.gs.classes = {};
document.igt.gs.enums = {};
document.igt.gs.util = {};
document.igt.gs.methods = {
    setResultHeights: function () {
        var $resultList = $('.games_list_container');
        var $resultItems = $resultList.children();
        document.igt.util.setHeights($resultList, $resultItems);
    },
    isGameSearchMode: function () {
        return !document.igt.types.Container.GameSearch.isHidden();
    },
    closeProcessingSpinner: function (callback) {
        ///document.igt.util.runIfFunction(callback);//temp
        document.igt.types.Container.ProgressPanel.$element.css("display", "none");
        // Clear category selection timeout - if any.
        clearTimeout(document.igt.gs.globals.categoryIndexSelectTimeoutHandle);
        document.igt.util.runIfFunction(callback);
    },
    openProcessingSpinner: function (callback) {
        document.igt.types.Container.ProgressPanel.$element.css("display", "");
        document.igt.util.runIfFunction(callback);//temp
    },
    setIsLoggedIn: function (isLoggedIn) {
        document.igt.gs.globals.isLoggedIn = isLoggedIn;
        if (isLoggedIn) {
            document.igt.gs.globals.$navLoginAnchor.text("Logout").attr("href", "/logout");
            document.igt.gs.globals.$LoginContainers.css("display", "none").next().css("display", "");
            document.igt.types.Container.Tabs.$element.find(".secure").addClass("hide_secure").removeClass("secure");
        }
        else {
            document.igt.gs.globals.$navLoginAnchor.text("Login").attr("href", "#");
            document.igt.gs.globals.$LoginContainers.css("display", "").next().css("display", "none");
            document.igt.types.Container.Tabs.$element.find(".hide_secure").addClass("secure").removeClass("hide_secure");
        }
    },
    getIsLoggedInFromGameSearch: function () {
        return document.igt.types.Container.ResultsUpdatePanel.$element.find("[id$='LoggedInGameSearchHiddenField']").val().toLowerCase() === "true";
    },
    getIsLoggedInFromOverview: function () {
        return document.igt.types.Container.OverviewUpdatePanel.$element.find("[id$='LoggedInOverviewHiddenField']").val().toLowerCase() === "true";
    },
    isInteractiveGame: function () {
        return document.igt.client.util.findUpdatePanel$Element("OverviewUpdatePanel", "IsInteractiveGameHiddenField").attr("value") === "true";
    },
    isInteractiveSearchMode: function () {
        return document.igt.types.Select.LandBasedInteractiveChoice.$control[0].selectedIndex === 1;
    },
    scrollToAddThis: function () {
        $("html, body").scrollTop(490);// "div.subhead_addthis"
        return false;
    },
    scrollToAddThisAndHideProcessingScreen: function () {
        setTimeout(function () { document.igt.gs.methods.scrollToAddThis(); document.igt.gs.methods.closeProcessingSpinner(); }, 200);
    },
    checkForInitialKeyword: function () {
        if (document.igt.gs.globals.initialKeyword) {
            document.igt.types.TextBox.Search.$element.val(document.igt.gs.globals.initialKeyword);
            setTimeout(function () { document.igt.types.Button.Search.$control.prop("disabled",false).click(); }, 500);
            document.igt.gs.globals.initialKeyword = "";
        }
        else document.igt.gs.methods.scrollToAddThisAndHideProcessingScreen();
        return false;
    },
    hideAutocomplete: function () {
        $("#ui-id-1").css("display", "none");
    }
};
document.igt.gs.handlers = {
    eventHandler: function () {
        var thisElement = document.igt.util.getClosestIGTElement(this);
        if (thisElement.isDisabled() || thisElement.noFire) return false;
        thisElement.handleClickOrChangeEvent();
        if (thisElement.value === "NoData") return false;
        var submitElementNameArray = ["Button.Search", "Select.Sort", "Select.LandBasedInteractiveChoice", "Select.Display", "Button.JurAllButton", "Button.JurSaveButton", "Button.JurSelectedButton", "Select.JurSelect"]; //"Button.JurSelectedButton", // "Select.Months", 
        if (thisElement.selectIdName === "Categories" || thisElement.selectIdName === "PrimaryGameSegment" || thisElement.subType === "Facet" || submitElementNameArray.indexOf(thisElement.typeIdName) !== -1) {
            if (thisElement.idName === "Keyword") return false;
            else if (!document.igt.gs.methods.allJursToggleButtonSelected() && document.igt.types.Select.JurSelect.element.selectedIndex === -1) document.igt.types.DisplayItem.NoResultsNoJurisdictionsSelected.show();
            else if (document.igt.types.SelectItem.Keyword.getIsSelected() && document.igt.types.TextBox.Search.$element.val().trim() === "") return false;
            else {
                if (thisElement.noPostback) return false;
                document.igt.handlers.submitForPostBack();
            }
        }
        return false;
    },
    topLoginHandler: function () {
        var $this = $(this);
        if ($this.attr("href") === "#") {
            document.igt.gs.handlers.LoginHandler();
            return false;
        }
        else return true;
    },
    LoginHandler: function () {
        if (!window.location.hash || window.location.hash === "#gs:promo=intro") {
            window.location = "/login";
            return false;
        }
        $("[ID$='LoginHashHiddenField']").attr("value", window.location.hash);
        document.igt.types.Button.SubmitButton.$element.click();
        return false;
    }
};
// Page Request Manager:
document.igt.prm.methods.determinePanelThatWasUpdated = function (args) {
    var panelUpdated = "unknown";
    if (args._panelsUpdated.length === 0) return panelUpdated;
    if (args._panelsUpdated.length !== 1) alert("A JavaScript error has occurred.  Update to 1 update panel was expected but update panel count was: " + args._panelsUpdated.length);
    var panelUpdatedId = args._panelsUpdated[0].id;
    var panelUpdatedIgtId = args._panelsUpdated[0].attributes["data-igt-id"].value;
    if (panelUpdatedId.indexOf("Results") !== -1) panelUpdated = "Game Search Results";
    else if (panelUpdatedIgtId.indexOf("Marketing") !== -1) {
        if (panelUpdatedId.endsWith("UpdatePanel")) panelUpdated = "Marketing Tab";
        else if (panelUpdatedId.endsWith("UpdatePanel2")) panelUpdated = "Marketing Download Button Panel";
        else if (panelUpdatedId.endsWith("ModalWindows")) panelUpdated = "Marketing Modal Windows Panel";
        else alert("A JavaScript error has occurred. An unknown update panel was encountered with the ID: " + panelUpdatedId);
    }
    else if (panelUpdatedId.indexOf("Overview") !== -1) panelUpdated = "Overview Tab";
    else if (panelUpdatedId.indexOf("Specifications") !== -1) panelUpdated = "Specifications Tab";
    else if (panelUpdatedId.indexOf("Programs") !== -1) panelUpdated = "Programs Tab";
    else if (panelUpdatedId.indexOf("Keyword") !== -1) panelUpdated = "Selected Jurisdictions Keyword";
    else alert("A JavaScript error has occurred. An unknown update panel was encountered with the ID: " + panelUpdatedId);
    return panelUpdated;
};
// Run on initial load and every postback:
document.igt.prm.handlers.runEveryPageLoaded = function (sender, args) {
    // window.Gumby.init(); // Bootstrap Comment.
    switch (document.igt.types.Select.View.getSelectedElement().idName) {
        case "ListView":
            document.igt.handlers.showListView();
            break;
        case "ProgramView":
            document.igt.handlers.showProgramView();
            break;
        default:
        case "CatalogView":
            document.igt.handlers.showCatalogView();
            break;
    }
    if (!document.igt.gs.globals.isPostback) {
        // runs on initial load only:
        document.igt.gs.globals.isPostback = true;
        return false;
    }
    // Runs only on Postbacks:
    var panelUpdated = document.igt.prm.methods.determinePanelThatWasUpdated(args);
    switch (panelUpdated) {
        case "Game Search Results":
            // Run only for postback to Game Search Update Panel:
            document.igt.gs.methods.setIsLoggedIn(document.igt.gs.methods.getIsLoggedInFromGameSearch());
            var $isPrimarySearchHiddenField = $("[ID$='IsPrimarySearchHiddenField']");
            var isPrimarySearch = $isPrimarySearchHiddenField.val() === "true";
            var totalCount = $("[ID$='TotalResultCountHiddenField']").val();
            if (isPrimarySearch) document.igt.gs.globals.facetJustSelectedIgtID = ""; // Clear hold facet value for primary search.
            if (totalCount && totalCount > 0) {
                var $images = $('.games_list_container img');
                document.igt.types.Container.ResultsUpdatePanel.$element.css("display", "");
                switch (document.igt.types.Select.View.getSelectedElement().idName) {
                    case "CatalogView":
                        document.igt.util.waitForImagesToLoad($images,
                            function () {
                                document.igt.gs.methods.completeGameSearchResultsPostbackWithResults($isPrimarySearchHiddenField);
                                document.igt.gs.methods.setResultHeights();
                                document.igt.gs.methods.completeGameSearchResultsPostback(isPrimarySearch);
                            });
                        break;
                    case "ListView":
                        document.igt.util.waitForImagesToLoad($images,
                            function () {
                                document.igt.gs.methods.completeGameSearchResultsPostbackWithResults($isPrimarySearchHiddenField);
                                document.igt.gs.methods.completeGameSearchResultsPostback(isPrimarySearch);
                            });
                        break;
                    case "ProgramView":
                        document.igt.gs.methods.completeGameSearchResultsPostbackWithResults($isPrimarySearchHiddenField);
                        document.igt.gs.methods.completeGameSearchResultsPostback(isPrimarySearch);
                        break;
                    default:
                }
            } else {
                if (isPrimarySearch) document.igt.types.Action.PrimarySearchNoResults.handleThisAction("Action.PrimarySearchNoResults");
                else document.igt.types.Action.SecondarySearchNoResults.handleThisAction("Action.SecondarySearchNoResults");
                document.igt.gs.methods.completeGameSearchResultsPostback(isPrimarySearch);
            }
            var postBackInfo = $("[ID$='PostBackInfoHiddenField']").val();
            if (postBackInfo) {
                window.console.info(postBackInfo);
                $("[ID$='PostBackInfoHiddenField']").attr("value", "");
            }
            break;
        case "Overview Tab":
            document.igt.gs.methods.setIsLoggedIn(document.igt.gs.methods.getIsLoggedInFromOverview());
            document.igt.gs.globals.GameLibraryGamePageGuid = document.igt.client.util.findUpdatePanel$Element("OverviewUpdatePanel", "GameLibraryGamePageGuid").attr("value");
            if ($('#provenPerformanceLogo').text().trim().length === 0) {
                $('#primaryGameSegmentLogo').css('float', 'right');
            }
            document.igt.gs.methods.openGameDetails();
            break;
        case "Specifications Tab":
            document.igt.gs.globals.tabLoadedSpecifications = document.igt.gs.globals.currentGamePageName;
            $('div[data-igt-id="SpecificationsUpdatePanel"] tr').each(function () {
                if ($(this).css('visibility') === 'hidden') {
                    $(this).css('display', 'none');
                }
            });
            document.igt.gs.methods.closeProcessingSpinner();
            break;
        case "Programs Tab":
            document.igt.gs.globals.tabLoadedPrograms = document.igt.gs.globals.currentGamePageName;
            $('div[data-igt-id="ProgramsUpdatePanel"] tr').each(function () {
                if ($(this).css('visibility') === 'hidden') {
                    $(this).css('display', 'none');
                }
            });
            document.igt.gs.methods.closeProcessingSpinner();
            break;
        case "Marketing Tab":
            document.igt_gs_marketing_main();///
            document.igt.gs.globals.tabLoadedMarketing = document.igt.gs.globals.currentGamePageName;
            document.igt.gs.methods.closeProcessingSpinner();
            break;
        case "Marketing Download Button Panel":
        case "Marketing Modal Windows Panel":
            break;
        case "Selected Jurisdictions Keyword":
            break;
        default:
            break;
    }
};
document.igt.gs.methods.completeGameSearchResultsPostbackWithResults = function ($isPrimarySearchHiddenField) {
    $isPrimarySearchHiddenField.val("false");
    $(".page_size_text").html($("[ID$='PageSizeTextHiddenField']").val());
    $(".total_filtered_game_count").html($("[ID$='TotalResultCountHiddenField']").val());
    document.igt.types.Action.PostBackWithResults.handleThisAction("Action.PostBackWithResults");
    document.igt.types.Container.ResultsUpdatePanel.$element.css("display", "");
};

document.igt.gs.methods.completeGameSearchResultsPostback = function (isPrimarySearch) {
    $("div.subhead_addthis")[0].scrollIntoView();// ul[ID$='ResultsTopUnorderedlistdatapager']
    var firstHideFacetValues = isPrimarySearch;
    var facetResultsJSON = $("[ID$='SearchResultsFacetsJsonHiddenField']").val();
    if (facetResultsJSON) document.igt.functions.updateFacetsFromResults(facetResultsJSON, firstHideFacetValues);
    $("[data-igt-id='JurSelect']").trigger('chosen:updated');
    if (isPrimarySearch) document.igt.types.Action.PostBack.handleThisAction("Action.PrimaryPostBack");
    else document.igt.types.Action.PostBack.handleThisAction("Action.SecondaryPostBack");
    document.igt.gs.methods.updateContextMessages();
    document.igt.gs.methods.setViewMessaging();
    document.igt.gs.methods.closeProcessingSpinner();
};
document.igt.functions.submitRequest = function () {
    var selectedCategoryElement = document.igt.types.Select.Categories.getSelectedElement();
    var categoryValue = (selectedCategoryElement ? selectedCategoryElement.value : null);
    var $resultsPanel = $("[data-igt-id='ResultsUpdatePanel']");
    var keywordTextBoxValue = (document.igt.gs.globals.initialKeyword || document.igt.types.TextBox.Search.$control.val().trim());
    if (keywordTextBoxValue.indexOf(" ^ ") !== -1) keywordTextBoxValue = keywordTextBoxValue.substring(0, keywordTextBoxValue.indexOf(" ^ ")); // Remove additional keywords before submit.
    var $primaryGameSegmentSelectedItem = document.igt.types.Select.PrimaryGameSegment.getSelectedElement();
    //var primaryGameSegmentValue = .value;// "3EC592F53C83463499C98A21C2C8A421";// getSelectedValue();
    var $filterJson = $resultsPanel.find("[ID$='FilterJsonHiddenField']");
    var $keywordHolder = $resultsPanel.find("[ID$='KeywordSearchHiddenField']");
    var $displayCount = $resultsPanel.find("[ID$='NewDisplayCountHiddenField']");
    var displayCount = document.igt.types.Select.Display.getSelectedValue();
    var $months = $resultsPanel.find("[ID$='MonthsHiddenField']");
    var months = document.igt.types.Select.Months.getSelectedValue();
    var $segment = $resultsPanel.find("[ID$='SegmentHiddenField']");
    var segmentValue = document.igt.types.Select.LandBasedInteractiveChoice.getSelectedValue();
    var $sortBy = $resultsPanel.find("[ID$='SortByHiddenField']");
    var sortBy = document.igt.types.Select.Sort.getSelectedValue();
    var $selectedJurs = $resultsPanel.find("[ID$='SelectedJurisdictionsHiddenField']");
    var selectedJursString = (document.igt.handlers.getCurrentSelectedJursString());
    var $selectedJursSitecoreIDs = $resultsPanel.find("[ID$='SelectedJurisdictionsSitecoreIDsHiddenField']");
    var selectedJursSitecoreIDsString = (document.igt.gs.methods.allJursToggleButtonSelected() ? "" : document.igt.handlers.getCurrentSelectedJursSitecoreIDsString());
    var showAllJurs = (document.igt.gs.methods.allJursToggleButtonSelected() ? "true" : "false");
    var $showAllJurs = $resultsPanel.find("[ID$='ShowAllJursHiddenField']");
    var landBasedFacetArray = [["Select", "Platform", "themeplatformnew"], ["Select", "NumberOfReels", "reel_configruation"], ["SelectItemGroup", "LinesGroup", "payline_configuration"], ["SelectItemGroup", "WaysGroup", "way_configuration"], ["Select", "Credits", "maximum_bet"], ["Select", "Cabinet", "hardwareconfiguration"], ["Select", "Brands", "brands"], ["Select", "ProductLine", "game_type"], ["Select", "PrimaryGameSegment", "primary_game_segment"]];//
    var interactiveFacetArray = [["Select", "InteractiveRegion", "interactive_games_region"], ["Select", "InteractiveGameType", "interactive_game_type"], ["Select", "InteractiveGameCategory", "interactive_game_categories"], ["Select", "InteractiveDevice", "interactive_devices"]];
    var facetArray = (segmentValue === "Interactive" ? interactiveFacetArray : landBasedFacetArray);
    var obj = {};
    if (categoryValue && categoryValue.indexOf("|") !== -1) { // If Select value is pipe delimited:
        var categoryValueArray = categoryValue.split("|");
        if (categoryValueArray[0].toLowerCase() === "jurisdiction") { // Specifc jurisdiction for category.
            selectedJursString = categoryValueArray[1];
            showAllJurs = "false";
        } else obj[categoryValue.split("|")[0]] = [categoryValue.split("|")[1]]; // Specific facet value for category.
    }
    if ($primaryGameSegmentSelectedItem && $primaryGameSegmentSelectedItem.value !== "All") obj.primary_game_segment = [$primaryGameSegmentSelectedItem.value.toLowerCase()];
    for (var facetArrayItemIndex in facetArray) {
        var facetItemDataArray = facetArray[facetArrayItemIndex];
        var facetValue = document.igt.types[facetItemDataArray[0]][facetItemDataArray[1]].getSelectedValue();
        if (facetValue && facetValue !== "All") obj[facetItemDataArray[2]] = [facetValue];
    }
    var value = JSON.stringify(obj);
    // Set hidden fields:
    $filterJson.val(value);
    $keywordHolder.val(keywordTextBoxValue);
    $displayCount.val(displayCount);
    $months.val(months);
    $segment.val(segmentValue);
    $sortBy.val(sortBy);
    $showAllJurs.val(showAllJurs);
    $selectedJurs.val(selectedJursString);
    $selectedJursSitecoreIDs.val(selectedJursSitecoreIDsString);
    return true;
};
// Faceting:
document.igt.functions.updateFacetsFromResults = function (facetResultsJsonString, firstHideAllFacetValues) {
    var facets = JSON.parse(facetResultsJsonString);
    for (var i = 0; i < facets.length; i++) {
        var facetName = facets[i].Name;
        var facetObj = document.igt.facets[facetName];
        if (facetObj === undefined) continue;
        if (facetObj.idName === document.igt.gs.globals.facetJustSelectedIgtID) continue; // Skip facet that was just selected.
        if (facetObj.facetType === "guid") { // GUID based facets:
            var facetDisplaySelect = document.igt.types.Select[facetName + "_display"];
            var $facetDisplaySelect = (facetDisplaySelect ? facetDisplaySelect.$selectTag : undefined);
            if (firstHideAllFacetValues && $facetDisplaySelect) {
                $facetDisplaySelect.children().remove();
                $facetDisplaySelect.append('<option value="All" selected="selected">All</option>');
            }
            else if ($facetDisplaySelect) {
                $facetDisplaySelect.children("[value!='All']").prop("disabled", true).find("span").text(0);
            }
            for (var n = 0; n < facets[i].Values.length; n++) {
                var count = facets[i].Values[n].AggregateCount;
                if (count === 0 && firstHideAllFacetValues) continue;
                var facetID = facets[i].Values[n].Name.toLowerCase();
                var listItemObj = document.igt.facetValues["id_" + facetID];
                if (listItemObj === undefined) continue;
                if (firstHideAllFacetValues && $facetDisplaySelect) {
                    var $optionClone = listItemObj.$element.clone();
                    $optionClone.find("span").text(count);
                    $facetDisplaySelect.append($optionClone);
                }
                else if ($facetDisplaySelect) {
                    var $facetDisplayItem = $facetDisplaySelect.children("[value='" + facetID + "']");
                    if ($facetDisplayItem) {
                        $facetDisplayItem.find("span").text(count);
                        if (count === 0) $facetDisplayItem.prop("disabled", true);
                        else $facetDisplayItem.prop("disabled", false);
                    }
                }
            }
            //facetObj.updateSelectDisplay();
            if (firstHideAllFacetValues) document.igt.util.sortOptions($facetDisplaySelect, document.igt.util.sortByInnerHTML);
        }
        else { // Value (integer) based facets:
            var $tag = $(facetObj.type === "Select" ? facetObj.$selectTag : facetObj.$element);
            if ($tag.find("option").length === 0) {
                if (facetObj.type !== "SelectItemGroup") $tag.html('<option value="All">All</option>');
                for (var num = 0; num < facets[i].Values.length; num++) {
                    var c = facets[i].Values[num].AggregateCount;
                    if (c === 0 && firstHideAllFacetValues) continue;
                    var value = facets[i].Values[num].Name;
                    var text = document.igt.util.createFacetOptionText(value, c, facetObj.characterCount);
                    var $newOption = $tag.append('<option value="' + value + '">' + text + '</option>');
                    if (c === 0) $newOption.prop("disabled", true);
                }
            } else {
                var resultValues = {};
                for (var x = 0; x < facets[i].Values.length; x++) { resultValues["name_" + facets[i].Values[x].Name] = facets[i].Values[x].AggregateCount; };
                var $options = $tag.find("option");
                for (var z = 0; z < $options.length; z++) {
                    var $option = $options.eq(z);
                    if ($option.val() === "All") {
                        continue;
                    }
                    var v = $option.val();
                    var key = "name_" + v;
                    var cnt = (resultValues[key] ? resultValues[key] : 0);
                    $option.html(document.igt.util.createFacetOptionText(v, cnt, facetObj.characterCount));
                    if (cnt === 0) $option.prop("disabled", true);
                    else $option.prop("disabled",false);
                }
            }
            if (firstHideAllFacetValues) document.igt.util.sortOptions($tag, document.igt.util.sortByNumberValue);
        }
    }
};
document.igt.util.sortByInnerHTML = function (a, b) {
    return ((a.innerHTML.toLowerCase() > b.innerHTML.toLowerCase()) ? 1 : -1);
};
document.igt.util.sortByNumberValue = function (a, b) {
    return ((new Number(a.value) > new Number(b.value)) ? 1 : -1);
};
document.igt.util.sortOptions = function ($select, sortFunction) {
    $select.children("[value!='All']").sort(sortFunction).appendTo($select);
};
document.igt.handlers.OpenFaceting = function () {
    var allFacetsContainer = document.igt.types.Container.AllFacets;
    var landBasedContainer = document.igt.types.Container.LandBasedFacets;
    var interactiveContainer = document.igt.types.Container.InteractiveFacets;
    var isLandBased = (document.igt.types.Select.LandBasedInteractiveChoice.$selectTag[0].selectedIndex === 0);
    var openCurrentFacets = function () {
        interactiveContainer.$element.add(landBasedContainer.$element).css("display", "none");
        if (isLandBased) landBasedContainer.$element.css("display", "");
        else interactiveContainer.$element.css("display", "");
        allFacetsContainer.$element.slideDown();
    }
    if (allFacetsContainer.$element.css("display") === "none") openCurrentFacets();
    else {
        if ((isLandBased && landBasedContainer.$element.css("display") === "none") || (!isLandBased && interactiveContainer.$element.css("display") === "none"))
            allFacetsContainer.$element.slideUp(openCurrentFacets);
    }
};
document.igt.gs.handlers.displayFacetRelay = function () {
    var $select = $(this);
    var $facetSelect = document.igt.types.Select[$select.attr("data-igt-facet")].$selectTag;
    var $facetValueSelectItem = $facetSelect.children("[value='" + $select[0].options[$select[0].selectedIndex].value + "']");
    $facetValueSelectItem[0].selected = true;
    $facetValueSelectItem.change();
};
// Segmentation Facets:
document.igt.gs.methods.showSegmentBanner = function () {
    var segmentValue = document.igt.types.Select.primary_game_segment_display.$selectTag.val();
    if (segmentValue === "All") document.igt.gs.methods.hideSegmentBanner();
    else document.igt.types.DisplayItem[segmentValue].show();
};
document.igt.gs.methods.hideSegmentBanner = function () {
    document.igt.types.DisplayList.ResultsBannerList.hide();
};
// Months:
document.igt.gs.globals.supressMonthsDefaultFlag = false;
document.igt.gs.globals.temporaryMonthsDefault = false;
document.igt.gs.globals.standardMonthsDefault = "Months36";
document.igt.gs.methods.setMonths = function () {
    var selectObj = document.igt.types.Select.Months.$selectTag[0];
    if (document.igt.gs.globals.supressMonthsDefaultFlag) document.igt.gs.globals.supressMonthsDefaultFlag = false;
    else if (document.igt.gs.globals.temporaryMonthsDefault) selectObj.selectedIndex = document.igt.types.SelectItem[document.igt.gs.globals.temporaryMonthsDefault].element.index;
    else selectObj.selectedIndex = document.igt.types.SelectItem[document.igt.gs.globals.standardMonthsDefault].element.index;
    document.igt.gs.globals.temporaryMonthsDefault = false;
    return true;
};
document.igt.gs.handlers.monthsSelectionCheck = function () {
    var hide = document.igt.types.SelectItem.MonthsArchive.getIsSelected();
    document.igt.gs.globals.$showOnlyIfNotArchiveMessages.css("display", hide ? "none" : "");
    document.igt.gs.methods.setMonths.call(this);
    return true;
};
document.igt.gs.methods.setDefaultMonths = function (argDefaultMonths) {
    var selectItemMonths = undefined;
    if (this.type === "Select") {
        var selected = this.getSelectedElement();
        if (selected && selected.params && selected.params.Months) selectItemMonths = selected.params.Months;
    }
    if (argDefaultMonths) document.igt.gs.globals.temporaryMonthsDefault = argDefaultMonths;
    else if (this.params && this.params.Months) document.igt.gs.globals.temporaryMonthsDefault = this.params.Months;
    else if (selectItemMonths) document.igt.gs.globals.temporaryMonthsDefault = selectItemMonths;
    else document.igt.gs.globals.temporaryMonthsDefault = document.igt.gs.globals.standardMonthsDefault;
    return true;
};
document.igt.gs.methods.supressMonthsDefault = function () {
    document.igt.gs.globals.supressMonthsDefaultFlag = true;
    return true;
};
// Results:
document.igt.handlers.showMessagePrimaryNoResults = function () {
    var keywordObj = document.igt.types.SelectItem.Keyword;
    if (keywordObj.$element.attr("data-igt-selected") === "true") keywordObj.handleThisAction("Open:DisplayItem.NoResultsKeywordPrimary");
    else keywordObj.handleThisAction("Open:DisplayItem.NoResultsPrimary")
};
document.igt.prm.handlers.runAfterLoadComplete = function () {
    if (!document.igt.prm.pageRequestManager.get_isInAsyncPostBack()) document.igt.handlers.onHashChange();
};

document.igt.handlers.submitForPostBack = function () {
    document.igt.handlers.beforeSubmit();
    document.igt.types.Select.JurSelect.handleThisAction("Action.CloseResults;Action.SubmitForm");
    document.igt.types.Button.SubmitButton.$control.click();
};
document.igt.handlers.ResetPrimarySearch = function () {
    $("[ID$='IsPrimarySearchHiddenField']").val("true");
};
// Pager:
document.igt.handlers.closePager = function () {
    $(".short-pagi").css("display", "");
};
document.igt.handlers.openPager = function () {
    $(".short-pagi").css("display", "");
};
document.igt.functions.PagerClick = function () {
    document.igt.types.Container.ResultsUpdatePanel.$element.css("display", "");//.css("visibility", "hidden");
    document.igt.handlers.closePager();
    return true;
};
// VIEWS:
document.igt.handlers.showCatalogView = function () {
    document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="Program"]').css("display", "none");
    document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="CatalogAndList"]').css("display", "").removeClass("list_view").addClass("catalog_view");
    document.igt.gs.methods.setResultHeights();
    document.igt.gs.methods.setViewMessaging();
    return false;
};
document.igt.handlers.showListView = function () {
    document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="Program"]').css("display", "none");
    document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="CatalogAndList"]').css("display", "").addClass("list_view").removeClass("catalog_view");
    document.igt.gs.methods.setViewMessaging();
    return false;
};
document.igt.handlers.showProgramView = function () {
    document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="Program"]').css("display", "");
    document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="CatalogAndList"]').css("display", "none");
    document.igt.gs.methods.setViewMessaging();
    return false;
};
document.igt.handlers.blurProgramView = function () {
    if (document.igt.types.SelectItem.ProgramView.$element.attr("data-igt-selected") === "true") document.igt.types.SelectItem.CatalogView.$element.click();
};
document.igt.gs.methods.setViewMessaging = function () {
    var programViewSelectedAndIsEmpty = (document.igt.types.SelectItem.ProgramView.getIsSelected() && document.igt.types.Container.ResultsUpdatePanel.$element.find('[data-igt-temp-id="Program"] table').length === 0);
    document.igt.gs.methods.showHideMessageSpecific(programViewSelectedAndIsEmpty, document.igt.types.DisplayItem.NoResultsProgramView);
};
// Jurisdictions:
document.igt.handlers.selectedJursChanged = function myfunction() {
    $("[ID$='UpdateSelectedJursHiddenField']").val("1");
    document.igt.handlers.jurShowSelected();
    return false;
};
document.igt.handlers.jurShowAll = function () {
    document.igt.types.Button.JurAllButton.$element.addClass("secondary").removeClass("primary");
    document.igt.types.Button.JurSelectedButton.$element.removeClass("secondary").addClass("primary");
    document.igt.types.Container.AllJursMessage.$element.css("display", "block");
    document.igt.types.Container.JurPicker.$element.removeClass("ttip_gms");
    $("div.chosen-container").css("display", "none");
    document.igt.types.Container.CurrentJurs.$element.text(document.igt.types.Container.TotalJurs.$element.text());
    document.igt.gs.globals.$showOnlyIfSelectedJurisdictionsMessages.css("display", "none");
    if (document.igt.types.SelectItem.Keyword.getIsSelected()) document.igt.gs.methods.autocompleteSwitchToLandBased();
};
document.igt.handlers.jurShowSelected = function () {
    var jurSelect = document.igt.types.Select.JurSelect;
    if (jurSelect.element.selectedIndex === -1) { ; }
    else if (!document.igt.types.SelectItem.Keyword.getIsSelected() || document.igt.types.TextBox.Search.$control.val() !== "")
        document.igt.handlers.submitForPostBack();
    else
        document.igt.types.Select.JurSelect.handleThisAction("Action.CloseResults");
    document.igt.types.Button.JurAllButton.$element.removeClass("secondary").addClass("primary");
    document.igt.types.Button.JurSelectedButton.$element.removeClass("primary").addClass("secondary");
    document.igt.types.Container.AllJursMessage.$element.css("display", "none");
    $("div.chosen-container").css("display", "");
    document.igt.types.Container.JurPicker.$element.addClass("ttip_gms");
    var selectedJursCount = document.igt.types.Select.JurSelect.$items.filter(":selected").length;
    document.igt.types.Container.CurrentJurs.$element.text(selectedJursCount);
    //document.igt.types.Container.SelectedJurs.$element.text(selectedJursCount);
    if (document.igt.types.SelectItem.Keyword.getIsSelected()) document.igt.gs.methods.autocompleteSwitchToLandBased();
    if (document.igt.types.Select.JurSelect.element.selectedIndex === -1) document.igt.gs.methods.showMessageNoJurisdictions();
    else document.igt.gs.methods.hideMessageNoJurisdictions();
    document.igt.gs.globals.$showOnlyIfSelectedJurisdictionsMessages.css("display", "");
};
document.igt.handlers.getCurrentSelectedJursString = function () {
    var selectedJursArray = [];
    document.igt.types.Select.JurSelect.$items.filter(":selected").each(function () { selectedJursArray.push($(this).attr("value")); });
    return selectedJursArray.join(",");
};
document.igt.handlers.getCurrentSelectedJursSitecoreIDsString = function () {
    var selectedJursArray = [];
    document.igt.types.Select.JurSelect.$items.filter(":selected").each(function () { selectedJursArray.push($(this).attr("data-igt-value")); });
    return selectedJursArray.join("|");
};
document.igt.gs.methods.allJursToggleButtonSelected = function () {
    return document.igt.types.Button.JurAllButton.$element.hasClass("secondary");
};
document.igt.gs.methods.showMessageNoJurisdictions = function () {
    document.igt.types.Select.JurSelect.handleThisAction("Action.CloseResults;Open:DisplayItem.NoResultsNoJurisdictionsSelected");
};
document.igt.gs.methods.hideMessageNoJurisdictions = function () {
    document.igt.types.Select.JurSelect.handleThisAction("Close:DisplayItem.NoResultsNoJurisdictionsSelected");
};
// Autocomplete / Predictive Search:
document.igt.gs.methods.initializeAutocomplete = function () {
    document.igt.types.TextBox.Search.$control.autocomplete({
        source: document.igt.gs.globals.autocompleteInitialSource,
        minLength: document.igt.gs.globals.autocompleteMinLength,
        select: document.igt.gs.methods.autocompleteAutoSubmit,
        response: document.igt.gs.methods.autocompleteCheckForNoResults
    });
    document.igt.types.TextBox.Search.$control.keypress(document.igt.gs.methods.autocompleteEnterSubmit);
    document.igt.types.TextBox.Search.$control.keyup(document.igt.gs.methods.autocompletecheckKeyupToHideNoResults);
};
document.igt.gs.methods.autocompleteAutoSubmit = function (event, ui) {
    if (ui.item.value) {
        document.igt.types.TextBox.Search.$control.val(ui.item.value);
        document.igt.types.Button.Search.$control.click();
        document.igt.types.Button.Search.handleButtonClick();
        return true;
    } else return false;
};
document.igt.gs.methods.autocompleteCheckForNoResults = function (event, ui) {
    document.igt.types.Container.AutocompleteNoResults.$element.css("display", ui.content.length === 0 ? "" : "none");
    return true;
};
document.igt.gs.methods.autocompleteEnterSubmit = function (e) {
    //if (document.igt.gs.acManager.$textBox.val().length < 3) document.igt.gs.acManager.$noResultsElement.fadeOut();
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        document.igt.types.Button.Search.$control.click();
        return false;
    }
    else return true;
};
document.igt.gs.methods.autocompletecheckKeyupToHideNoResults = function () {
    if (document.igt.types.TextBox.Search.$control.val().length < 3) document.igt.types.Container.AutocompleteNoResults.$element.css("display", "none");
};
document.igt.gs.methods.autocompleteSwitchToLandBased = function () {
    document.igt.types.TextBox.Search.$control.autocomplete("option", "source", document.igt.gs.globals.autocompleteLandBasedSource);
};
document.igt.gs.methods.autocompleteSwitchToInteractive = function () {
    document.igt.types.TextBox.Search.$control.autocomplete("option", "source", document.igt.gs.globals.autocompleteInteractiveSource);
};
document.igt.gs.methods.autocompleteUpdateCurrentDatasource = function () {
    if (document.igt.gs.methods.isInteractiveSearchMode()) document.igt.gs.methods.autocompleteSwitchToInteractive();
    else document.igt.gs.methods.autocompleteSwitchToLandBased();
};
// MESSAGING:
document.igt.gs.methods.updateContextMessages = function () {
    document.igt.gs.globals.$showOnlyIfSelectedJurisdictionsMessages.css("display", document.igt.types.Button.JurAllButton.$element.hasClass("secondary") ? "none" : "");
    var archiveValue = document.igt.types.SelectItem.MonthsArchive.value;
    var currentValue = document.igt.types.Select.Months.$control.val();
    document.igt.gs.globals.$showOnlyIfNotArchiveMessages.css("display", currentValue === archiveValue ? "none" : "");
};
document.igt.gs.methods.clearMessageSpecific = function (messageDisplayItem) {
    if (messageDisplayItem.getIsDisplayed()) messageDisplayItem.hide();
};
document.igt.gs.methods.clearMessageAny = function () {
    document.igt.types.DisplayList.MessageList.hide();
};
document.igt.gs.methods.showMessage = function (messageDisplayItem) {
    messageDisplayItem.show();
};
document.igt.gs.methods.showHideMessageSpecific = function (show, messageDisplayItem) {
    if (show) document.igt.gs.methods.showMessage(messageDisplayItem);
    else document.igt.gs.methods.clearMessageSpecific(messageDisplayItem);
};
// Reels, Lines/Ways, and Credits:
document.igt.handlers.secondaryPostBack = function () {
};
document.igt.handlers.beforeSubmit = function () {
};
// Chosen:
document.igt.handlers.updateChosen = function () {
    $("[data-igt-id='JurSelect']").trigger('chosen:updated');
};
// Land Based / Interactive
document.igt.gs.handlers.LandBasedInteractiveDropdownChange = function () {
    if (document.igt.gs.globals.interactiveOnly || document.igt.types.Select.LandBasedInteractiveChoice.$control[0].selectedIndex === 1) document.igt.gs.methods.selectInteractive();
    else document.igt.gs.methods.selectLandBased();
    return true;
};
document.igt.gs.handlers.facetSelect = function () {
    var $this = $(this);
    var $select = ($this.is("option") ? $this.parent() : $this);
    document.igt.gs.globals.facetJustSelectedIgtID = ($select.val() === "All" ? "" : $select.closest("[data-igt-id]").attr("data-igt-id"));
    return document.igt.gs.handlers.eventHandler.call(this);
};
document.igt.gs.methods.selectInteractive = function () {
    document.igt.gs.methods.autocompleteSwitchToInteractive();
    document.igt.handlers.blurProgramView();
    document.igt.types.Container.LandBasedFacets.$element.css("display", "none");
    document.igt.types.Container.InteractiveFacets.$element.css("display", "");
    document.igt.types.Container.JurSubControlPanel.$element.css("display", "none");
    document.igt.types.Select.LandBasedInteractiveChoice.$control[0].selectedIndex = 1;
    document.igt.types.Container.ProgramView.$element.css("display", "none");
};
document.igt.gs.methods.selectLandBased = function () {
    if (document.igt.gs.globals.interactiveOnly) return;
    document.igt.gs.methods.autocompleteSwitchToLandBased();
    document.igt.types.Container.LandBasedFacets.$element.css("display", "");
    document.igt.types.Container.InteractiveFacets.$element.css("display", "none");
    document.igt.types.Container.JurSubControlPanel.$element.css("display", "");
    document.igt.types.Select.LandBasedInteractiveChoice.$control[0].selectedIndex === 0;
    document.igt.types.Container.ProgramView.$element.css("display", "");
};
document.igt.gs.methods.showLandBasedInteractiveDropdown = function () {
    if (document.igt.gs.globals.interactiveOnly) document.igt.gs.methods.hideLandBasedInteractiveDropdown();
    else document.igt.types.Select.LandBasedInteractiveChoice.$element.css("display", "");
};
document.igt.gs.methods.hideLandBasedInteractiveDropdown = function () {
    document.igt.types.Select.LandBasedInteractiveChoice.$element.css("display", "none");
};
document.igt.gs.methods.checkAndSetForInteractiveOnly = function () {
    document.igt.gs.globals.interactiveOnly = false;
    if (window.location.href.toLowerCase().indexOf("/interactive/") !== -1) {
        document.igt.gs.globals.interactiveOnly = true;
        $("option[data-igt-id='Interactive']").attr("data-igt-default", "true");
        $("option[data-igt-id='LandBased']").removeAttr("data-igt-default");
        $("li[data-igt-id='SearchWithin']").nextAll().css("display", "none");
    }
};
// CATEGORY:
document.igt.gs.methods.getSelectedCategoryIndex = function () {
    for (var i = 0; i < document.igt.types.Select.Categories.$items.length; i++) {
        if (document.igt.types.Select.Categories.$items.eq(i).attr("data-igt-selected") === "true") return i;
    }
    return -1;
};
document.igt.gs.methods.resetCurrentCategoryButSkipMonths = function () {
    var initialSearchKeywordText = document.igt.types.TextBox.Search.$control.val();
    document.igt.gs.methods.supressMonthsDefault();
    document.igt.gs.methods.resetCurrentCategory();
    if (initialSearchKeywordText && document.igt.types.SelectItem.Keyword.getIsSelected()) {
        document.igt.types.TextBox.Search.$control.val(initialSearchKeywordText);
        document.igt.types.Button.Search.$control.click();
    }
};
document.igt.gs.methods.resetCurrentCategory = function () {
    document.igt.types.Select.Categories.getSelectedElement().$element.find("a").click();
};
document.igt.gs.methods.selectCategoryByIndex = function (newIndex) {
    // Clear previous category selection timeout (if any).
    clearTimeout(document.igt.gs.globals.categoryIndexSelectTimeoutHandle);
    if (newIndex === -1) document.igt.gs.methods.openGameSearchLanding();
    else if (newIndex !== document.igt.gs.methods.getSelectedCategoryIndex()) {
        document.igt.gs.globals.categoryIndexSelectTimeoutHandle = setTimeout(function () {
            document.igt.types.Select.Categories.$items.eq(newIndex).find("a").trigger("click");
        }, 6000);
    }
    else document.igt.handlers.backToGameSearch();
};
document.igt.gs.methods.runCategoryGroup = function () {
    return false;
};
document.igt.gs.methods.setHashForSelectedCategory = function (optionalTreatAsNonPageEvent) {
    var index = document.igt.gs.methods.getSelectedCategoryIndex();
    if (index === -1) document.igt.handlers.setHashToGameSearchLanding(); //document.igt.gs.methods.openGameSearchLanding();
    else {
        var newHash = "gs:category=" + index;
        document.igt.gs.methods.setHash(newHash, optionalTreatAsNonPageEvent);
    }
    return false;
};
// Mobile Categories:
document.igt.handlers.categories_MobileChange = function () {
    var navID = document.igt.types.Select.Categories_Mobile.getSelectedElement().idName.split("_")[0];
    document.igt.types.SelectItem[navID].$control.click();
};
document.igt.handlers.categoriesChangeForMobile = function () {
    var mobileID = document.igt.types.Select.Categories.getSelectedElement().idName + "_Mobile";
    document.igt.types.SelectItem[mobileID].element.selected = true;
};

// GAME SEARCH APPLICATION:
document.igt.gs.methods.initializeGameSearchPage = function () {
    document.igt.types.Container.GameDetails.$element.css("display", "none");
    document.igt.types.Container.GameSearch.$element.css("display", "");
    document.igt.gs.methods.replaceHeaderAndSubcopy(document.igt.gs.globals.gameSearchH1Html, document.igt.gs.globals.gameSearchSubcopy, "Show Introduction", "pointer", document.igt.handlers.setHashToGameSearchLanding);
    document.igt.gs.globals.$bannerWrapper.css("display", "");
    document.igt.gs.globals.$bannerImageHtml.find("#bannerImageUrl").parent().css("display", "none");
};
// Handles back to search button.
document.igt.handlers.backToGameSearch = function (event) {
    document.igt.gs.methods.initializeGameSearchPageForSearch();
    document.igt.gs.methods.setResultHeights();
    $("html, body").scrollTop(document.igt.gs.globals.gameSearchLastScrollPosition);
    return false;
};
document.igt.gs.methods.initializeGameSearchPageForSearch = function () {
    document.igt.gs.methods.initializeGameSearchPage();
    document.igt.types.DisplayList.PromoList.$element.css("display", "none");
    document.igt.types.Container.Search.$element.css("display", "");
};

// Promo Sections:
document.igt.gs.methods.openGameSearchLanding = function () {
    return document.igt.gs.methods.showPromotion("intro");
};
document.igt.handlers.showThisPromotion = function (e) {
    var $this = $(this);
    var thisIndex = $this.parent().prevAll().length;
    return document.igt.gs.methods.showPromotion(thisIndex);
};
document.igt.gs.methods.showPromotion = function (promotionIdentifier) {
    document.igt.gs.methods.initializeGameSearchPageForPromo();
    document.igt.types.DisplayItem["Promo_" + new String(promotionIdentifier).toLowerCase()].$element.css("display", "");
    //document.igt.gs.methods.setHash("gs:promo=" + new String(promotionIdentifier).toLowerCase(), true);
    document.igt.types.Select.Categories.deselect();
    document.igt.util.jumpToTop();
    document.igt.gs.methods.closeProcessingSpinner();
    return false;
};
document.igt.gs.methods.initializeGameSearchPageForPromo = function () {
    document.igt.gs.methods.initializeGameSearchPage();
    document.igt.types.DisplayList.PromoList.$element.css("display", "");
    document.igt.types.Container.Search.$element.css("display", "none");
};
// GAME PAGE APPLICATION (Game Details):
// Return to previous Game Page without postback.
document.igt.handlers.backToGamePage = function () {
    document.igt.gs.methods.replaceHeaderAndSubcopy($("#DetailsH1").html(), $("#DetailsSubcopy").html());
    var bannerHtmlBuild = document.igt.client.util.findUpdatePanel$Element("OverviewUpdatePanel", "media_Image_Url").val();
    if (bannerHtmlBuild) {
        document.igt.gs.globals.$bannerImageHtml.find("#bannerImageUrl").parent().css("display", "");
        document.igt.gs.globals.$bannerImageHtml.find("#bannerImageUrl").attr("src", bannerHtmlBuild);
    }
    document.igt.gs.methods.closeProcessingSpinner();
    return false;
};
// Event handler when user clicks game.
document.igt.handlers.handleResultClickSubmitGameDetails = function (event) {
    $this = $(this);
    var $container;
    if ($this.is("a[data-igt-game-id]")) $container = $this;
    else $container = $this.closest("li");
    document.igt.gs.globals.currentGameItemName = $container.attr("data-igt-game-item-name");
    document.igt.gs.globals.currentGamePageName = $container.attr("data-igt-game-page-name");
    document.igt.gs.globals.currentGamePageID = $container.attr("data-igt-game-id");
    document.igt.gs.methods.setHash(document.igt.gs.globals.currentGamePageName);
    return false;
};
document.igt.gs.methods.initializeGamePage = function () {
    document.igt.gs.globals.gameSearchLastScrollPosition = $("html, body").scrollTop();
    document.igt.types.Container.GameSearch.$element.css("display", "none");
    document.igt.types.Container.GameDetails.$element.css("display", "");
    document.igt.gs.globals.$bannerWrapper.css("display", "none");
    document.igt.gs.globals.$bannerImageHtml.find("#bannerImageUrl").parent().css("display", "none");
    $("html, body").scrollTop(0);
};
// Used by both game click event and hash navigation before postback.
document.igt.gs.methods.submitGameDetails = function () {
    // Hide Screen.
    // Set hidden field values for each update panel:
    var panels = (document.igt.gs.globals.isLoggedIn ? ["Overview", "Specifications", "Programs", "MarketingMain"] : ["Overview"]);
    for (var i = 0; i < panels.length; i++) {
        var panel = document.igt.types.Container[panels[i] + "UpdatePanel"];
        if (panel) {
            panel.$element.find("[id$='GameItemNameHiddenField']").val(document.igt.gs.globals.currentGameItemName);
            panel.$element.find("[id$='GamePageNameHiddenField']").val(document.igt.gs.globals.currentGamePageName);
            panel.$element.find("[id$='GamePageIdHiddenField']").val(document.igt.gs.globals.currentGamePageID);
        }
    }
    // Submit Overview panel.
    setTimeout(function () { document.igt.types.Button.Overview.$element.click(); }, 2500);// Changed 500 to 2500 on 7/21/22 by Greg C. to fix bug preventing loading game.
    // Open tab accordian.
    document.igt.types.Container.Tabs.$element.find("a:eq(0)").click();
};
// Runs after update panel postback.
document.igt.gs.methods.openGameDetails = function () {
    document.igt.gs.globals.lastGamePageLoadedGamePageName = document.igt.gs.globals.currentGamePageName;
    document.igt.gs.methods.replaceHeaderAndSubcopy($("#DetailsH1").html(), $("#DetailsSubcopy").html());
    if (document.igt.gs.methods.isInteractiveGame()) document.igt.util.hide(document.igt.gs.globals.$tabsHiddenForInteractive);
    else document.igt.util.show(document.igt.gs.globals.$tabsHiddenForInteractive);
    document.igt.gs.methods.showGameDetails()///
};
document.igt.gs.methods.showGameDetails = function () {
    document.igt.util.waitForImagesToLoad(document.igt.types.Container.OverviewUpdatePanel.$element.find("img"), document.igt.gs.methods.closeProcessingSpinner);
    document.igt.types.Container.GameSearch.$element.css('display', "none");
    document.igt.gs.globals.$bannerWrapper.css("display", "none");
    document.igt.types.Container.GameDetails.$element.css("display", "");
    $("html, body").scrollTop(0);
    var bannerHtmlBuild = document.igt.client.util.findUpdatePanel$Element("OverviewUpdatePanel", "media_Image_Url").val();
    if (bannerHtmlBuild) {
        document.igt.gs.globals.$bannerImageHtml.find("#bannerImageUrl").parent().css("display", "");
        document.igt.gs.globals.$bannerImageHtml.find("#bannerImageUrl").css('background-image', 'url(' + bannerHtmlBuild + ')');
    }
};
document.igt.gs.methods.replaceHeaderAndSubcopy = function (h1HTML, subcopyHTML, toolTip, cursor, handler) {
    if (document.igt.gs.globals.$h1.html() === h1HTML) return;
    document.igt.gs.globals.$h1.html(h1HTML).css("cursor", cursor ? cursor : "").attr("title", toolTip ? toolTip : "");
    if (handler) document.igt.gs.globals.$h1.on("click", handler);
    else document.igt.gs.globals.$h1.off("click");
    document.igt.gs.globals.$subcopy.html(subcopyHTML);
};
// Game Page Tabs:
document.igt.handlers.loadSpecificationsTab = function () {
    if (!document.igt.gs.globals.isLoggedIn || document.igt.gs.globals.tabLoadedSpecifications === document.igt.gs.globals.currentGamePageName) return false;
    document.igt.gs.methods.openProcessingSpinner();
    document.igt.types.Button.Specifications.$element.click();
};
document.igt.handlers.loadProgramsTab = function () {
    if (!document.igt.gs.globals.isLoggedIn || document.igt.gs.globals.tabLoadedPrograms === document.igt.gs.globals.currentGamePageName) return false;
    document.igt.gs.methods.openProcessingSpinner();
    document.igt.gs.methods.runProgramsTab();
};
document.igt.handlers.loadMarketingTab = function () {
    if (!document.igt.gs.globals.isLoggedIn || document.igt.gs.globals.tabLoadedMarketing === document.igt.gs.globals.currentGamePageName) return false;
    document.igt.gs.methods.openProcessingSpinner();
    ///document.igt.types.Container.MarketingMainUpdatePanel.$element.css("display", "none");
    document.igt.types.Button.Marketing.$element.click();
};
// HASH:
document.igt.gs.methods.setHash = function (newHash, optionalTreatAsNonPageEvent) {
    var newHashFinal = newHash.trim(":").toLowerCase();
    var currentHash = window.location.hash.substring(1).toLowerCase();
    var newHashIsGameSearch = document.igt.gs.methods.isGameSearchHash(newHashFinal);
    var currentHashIsGameSearch = document.igt.gs.methods.isGameSearchHash(currentHash);
    var newCategoryIndex = document.igt.gs.methods.getCategoryIndexFromHashString(newHashFinal).toString();
    var currentCategoryIndex = document.igt.gs.methods.getCategoryIndexFromHashString(currentHash).toString();
    if (newHashFinal === currentHash || (newHashIsGameSearch && currentHashIsGameSearch && newCategoryIndex === currentCategoryIndex)) return false;
    //if (optionalTreatAsNonPageEvent) $(window).off("hashchange");
    window.location.hash = newHashFinal;
    //if (optionalTreatAsNonPageEvent) $(window).on("hashchange", document.igt.handlers.onHashChange);
    return false;
};
document.igt.handlers.onHashChange = function (eventObject, runHashWithoutEvent, optionalHashWithoutEvent) {
    var newHash = (runHashWithoutEvent ? (optionalHashWithoutEvent ? optionalHashWithoutEvent : "") : window.location.hash);
    if (!runHashWithoutEvent) document.igt.gs.globals.hashIsUnchangedFromInitialLoad = false;
    newHash = newHash.toLowerCase();
    //var latestLoggedHash = document.igt.gs.methods.getLatestLoggedHash();
    if (!newHash) return document.igt.gs.methods.routeEmptyHash();
    if (newHash.startsWith("#")) newHash = newHash.substring(1);
    //if (newHash === latestLoggedHash) return false;
    //document.igt.gs.globals.hashStack.push(newHash);
    document.igt.gs.methods.routeHash(newHash);
    return false;
};
// Hash Routing:
document.igt.gs.methods.routeEmptyHash = function () {
    if (document.igt.gs.globals.interactiveOnly) document.igt.handlers.setHashToInteractiveCustomPageLanding();
    else document.igt.handlers.setHashToGameSearchLanding();
    return false;
};
document.igt.gs.methods.routeHash = function (hash) {
    if (!hash) return document.igt.handlers.setHashToGameSearchLanding();
    if (window.location.hash.indexOf("gs:") !== -1) document.igt.gs.methods.routeToGameSearchByHash(hash);
    else document.igt.gs.methods.routeToGamePage(hash);
    return false;
};

// Opens Game Search based on hash.
document.igt.gs.methods.routeToGameSearchByHash = function (hash) {
    var categoryIndex = document.igt.gs.methods.getCategoryIndexFromHashString(hash);
    if (categoryIndex !== -1 && hash.startsWith("gs:category=")) {
        var previousCategoryIndex = document.igt.gs.globals.latestCategoryIndex;
        document.igt.gs.globals.latestCategoryIndex = categoryIndex;
        if (categoryIndex.toString() === previousCategoryIndex.toString()) { document.igt.handlers.backToGameSearch(); }
        else { document.igt.gs.methods.selectCategoryByIndex(categoryIndex); }
    }
    else if (hash === "gs:promo=intro") document.igt.gs.methods.openGameSearchLanding();
    else document.igt.handlers.setHashToGameSearchLanding();
    return false;
};
// Opens Game Page based on hash.
document.igt.gs.methods.routeToGamePage = function (gamePageName) {
    var newGamePageName = gamePageName.toLowerCase();
    if (document.igt.gs.methods.isGameSearchHash(newGamePageName)) return document.igt.handlers.setHashToGameSearchLanding();
    document.igt.gs.methods.initializeGamePage();
    if (document.igt.gs.globals.currentGamePageName.toLowerCase() === newGamePageName && document.igt.gs.globals.lastGamePageLoadedGamePageName.toLowerCase() === newGamePageName) document.igt.handlers.backToGamePage();
    else {
        document.igt.gs.methods.openProcessingSpinner();
        if (document.igt.gs.globals.currentGamePageName.toLowerCase() !== newGamePageName) {
            document.igt.gs.globals.currentGamePageName = newGamePageName;
            document.igt.gs.globals.currentGameItemName = newGamePageName.replace(/_/g, " ");
            document.igt.gs.globals.currentGamePageID = "";
        }
        document.igt.gs.methods.submitGameDetails();
    }
    return false;
};
document.igt.gs.methods.goToPreviousGameSearch = function () {
    if (document.igt.gs.globals.hashIsUnchangedFromInitialLoad || (document.igt.gs.globals.initialHashHiddenFieldValue && document.igt.gs.methods.minimizeHash(window.location.hash) === document.igt.gs.methods.minimizeHash(document.igt.gs.globals.initialHashHiddenFieldValue))) document.igt.handlers.setHashToGameSearchLanding();
    else window.history.back();
    document.igt.gs.globals.initialHashHiddenFieldValue = undefined;
    return false;
};
// Hash Elements:
document.igt.gs.methods.getCategoryIndexFromHashString = function (hashString) {
    var valueArray = hashString.split("|")[0].split("=");
    if (hashString.indexOf("gs:") === -1 || valueArray.length < 2 || !$.isNumeric(valueArray[1])) return -1;
    else return new Number(valueArray[1]);
};
document.igt.gs.methods.getKeywordFromHash = function (hashString) {
    var pipes = hashString.split("|");
    return (pipes.length < 3 ? "" : unescape(pipes[2]).replace(/\+/g, " ").trim());
};
document.igt.gs.methods.isGameSearchHash = function (hashString) {
    return !(document.igt.gs.methods.getCategoryIndexFromHashString(hashString) === -1 && hashString.toLowerCase().indexOf("gs:") === -1);
};
document.igt.handlers.setHashToGameSearchLanding = function () {
    document.igt.gs.methods.setHash("gs:promo=intro");
    return false;
};
document.igt.handlers.setHashToInteractiveCustomPageLanding = function () {
    document.igt.gs.methods.setHash("gs:category=1");
    return false;
};
document.igt.gs.methods.minimizeHash = function (hash) {
    if (hash.startsWith("#")) hash = hash.substr(1);
    return hash.toLowerCase();
};
// INITIALIZATION:
// Immediate:
document.igt.gs.globals.isPostback = false;
document.igt.gs.globals.isLoggedIn = false;
document.igt.gs.globals.$h1 = $("h1").eq(1);
document.igt.gs.globals.$subcopy = $("div.subpage_subhead p");
document.igt.gs.globals.gameSearchH1Html = document.igt.gs.globals.$h1.html();
document.igt.gs.globals.gameSearchSubcopy = document.igt.gs.globals.$subcopy.html();
document.igt.gs.globals.$bannerWrapper = $("div[data-target='static-header'],div[data-target='slideshow-header']").parent();
document.igt.gs.globals.$h1.add(document.igt.gs.globals.$subcopy).html("&nbsp;&nbsp;");
document.igt.gs.globals.$bannerWrapper.css("display", "none");
document.igt.prm.pageRequestManager.add_pageLoaded(document.igt.prm.handlers.runEveryPageLoaded);
// After page load:
$(function () {
    // Pre-initialization:
    $("[data-igt-id='GameDetails']").parent().attr({
        "data-igt-id": "Application", "data-igt-type": "Container"
    });
    // Prep if Interactive-Only page:
    document.igt.gs.methods.checkAndSetForInteractiveOnly();
    // Initialize elements:
    document.igt.client.util.initializeAllElements();
    // GLOBALS:    
    //GameDetails Banner intialization
    document.igt.gs.globals.$bannerImageHtml = $("<div id='HeaderCarousel1_pnlStatic' style='display:'><div class='row_full' data-target='static-header'><div class='non_mobile_img' id='bannerImageUrl'/></div></div>").insertAfter('.sub_nav_container.clearfix');
    document.igt.gs.globals.currentGameItemName = "";
    document.igt.gs.globals.currentGamePageName = "";
    document.igt.gs.globals.currentGamePageID = "";
    document.igt.gs.globals.lastGamePageLoadedGamePageName = "";
    document.igt.gs.globals.$contentContainer = $("div.main_wrapper");
    document.igt.gs.globals.$marketingTab = $('[data-igt-temp-id="Marketing"]');
    document.igt.gs.globals.$resultsUpdatePanel = $("[id$='ResultsUpdatePanel']");
    document.igt.gs.globals.$tabs = document.igt.types.Container.Tabs.$element.find("li");
    document.igt.gs.globals.$tabsHiddenForInteractive = document.igt.gs.globals.$tabs.eq(1).add(document.igt.gs.globals.$tabs.eq(2));
    document.igt.gs.globals.gameSearchRightContainerAlternatives = [document.igt.types.Container.Promo, document.igt.types.Container.Search];
    document.igt.gs.globals.facetJustSelectedIgtID = "";
    document.igt.gs.globals.$navLoginAnchor = $("ul.main_navigation_items a:contains('Log')");
    document.igt.gs.globals.$LoginContainers = $("[data-igt-category='LoginContainer']");
    document.igt.gs.globals.$LoginAnchors = $("[data-igt-category='Login']");
    document.igt.gs.globals.$showOnlyIfNotArchiveMessages = $(".show_only_if_not_archive");
    document.igt.gs.globals.$showOnlyIfSelectedJurisdictionsMessages = $(".show_only_if_selected_jurisdictions");
    document.igt.gs.globals.autocompleteMinLength = 3;
    document.igt.gs.globals.autocompleteInitialSource = [];
    document.igt.gs.globals.autocompleteLandBasedSource = [];
    document.igt.gs.globals.autocompleteInteractiveSource = [];
    document.igt.gs.globals.gameSearchLastScrollPosition = 0;
    document.igt.gs.globals.tabLoadedSpecifications = "";
    document.igt.gs.globals.tabLoadedPrograms = "";
    document.igt.gs.globals.tabLoadedMarketing = "";
    //document.igt.gs.globals.hashStack = [];
    document.igt.gs.globals.addThisPosition = $("div.subhead_addthis").scrollTop();
    document.igt.gs.globals.initialKeyword = "";
    document.igt.gs.globals.hashIsUnchangedFromInitialLoad = true;
    //document.igt.gs.globals.initialHistoryLength = window.history.length;
    document.igt.gs.globals.initialHash = window.location.hash;
    document.igt.gs.globals.initialHashHiddenFieldValue = $("[ID$='InitialHashHiddenField']").val();
    document.igt.gs.globals.latestCategoryIndex = -1;// initial default value only, will be set as page loads.
    document.igt.gs.globals.categoryIndexSelectTimeoutHandle = 0;// For clearing the previous select timeout.
    // Initialize Login
    document.igt.gs.methods.setIsLoggedIn(document.igt.gs.methods.getIsLoggedInFromGameSearch());
    // jurisdictions setup:
    var jursSelect = document.igt.types.Select.JurSelect;
    var totalJurs = jursSelect.itemCount;
    document.igt.types.Container.TotalJurs.$element.text(totalJurs);
    $(".chosen-select").chosen({
        width: "178px", max_selected_options: 10
    });
    $(".chosen-select").on("chosen:maxselected", function () {
        alert("The maximum number of 10 selected jurisdictions has been reached.\n\nConsider clicking the 'All' button to show games for all jurisdictions.");
    });
    $(".chosen-choices").css({
        "font-size": "7pt", "height": "55px", overflowY: "scroll"
    });
    // Jurisdictions: Select all default for anonomous or selected for logged in:
    if (document.igt.gs.globals.isLoggedIn && document.igt.types.Select.JurSelect.element.selectedIndex !== -1) document.igt.handlers.jurShowSelected();
    else document.igt.handlers.jurShowAll();
    // autocomplete setup;
    document.igt.gs.methods.initializeAutocomplete();
    // messaging:
    document.igt.types.DisplayList.MessageList.initialize();
    // Header display:
    $("div.smiley_survey").css("display", "");
    // HANDLERS:
    document.igt.gs.globals.$navLoginAnchor.on("click", document.igt.gs.handlers.topLoginHandler);
    document.igt.gs.globals.$LoginAnchors.on("click", document.igt.gs.handlers.LoginHandler);
    $("[data-igt-type$='.SelectList']").on("click", "[data-igt-type^='SelectItem.'] a, a[data-igt-type^='SelectItem.']", document.igt.gs.handlers.eventHandler);
    $("select[data-igt-category='DisplayFacet']").on("change", document.igt.gs.handlers.displayFacetRelay);
    $("[data-igt-type='Select.Facet'] select, select[data-igt-type='Select.Facet']").on("change", document.igt.gs.handlers.facetSelect);
    $("[data-igt-type='Select.Dropdown'] select, select[data-igt-type='Select.Dropdown']").on("change", document.igt.gs.handlers.eventHandler);
    $("[data-igt-id='JurSelect']").on("change", function (e) { document.igt.handlers.selectedJursChanged(e); document.igt.gs.handlers.eventHandler.call(this, e); return true; });
    $("[data-igt-type^='Button.']").on("click", "input,a", document.igt.gs.handlers.eventHandler);
    $("input[data-igt-type^='TextBox.']").on("keyup", document.igt.gs.handlers.eventHandler);//.on("keyup", document.igt.handlers.autocompleteKeyup);
    $("[data-igt-id='ResultsUpdatePanel']").on("click", "ul.item a", document.igt.functions.PagerClick);
    $("[data-igt-id='SubmitButton']").on("click", document.igt.functions.submitRequest);
    document.igt.types.Select.LandBasedInteractiveChoice.$selectTag.on("change", document.igt.gs.handlers.LandBasedInteractiveDropdownChange);//ac*
    //document.igt.types.Select.Categories.$groups.each(function () { $(this).children("div").css("cursor", "pointer").on("click", document.igt.handlers.showThisPromotion); return true; });
    document.igt.types.Container.CategoriesHeader.$element.add(document.igt.gs.globals.$h1).on("click", document.igt.handlers.setHashToGameSearchLanding).css("cursor", "pointer").attr("title", "Show Introduction");
    document.igt.types.Container.ResultsUpdatePanel.$element.on("click", "ul[data-igt-temp-id='GamesContainer'] div.link_2 a", document.igt.handlers.handleResultClickSubmitGameDetails);
    document.igt.types.Container.ResultsUpdatePanel.$element.on("click", "ul[data-igt-temp-id='GamesContainer'] a[data-igt-active='true']", document.igt.handlers.handleResultClickSubmitGameDetails);
    document.igt.types.Container.ResultsUpdatePanel.$element.on("click", "div[data-igt-temp-id='Program'] a[data-igt-game-id]", document.igt.handlers.handleResultClickSubmitGameDetails);
    document.igt.types.Container.ResultsUpdatePanel.$element.on("click", "ul[data-igt-temp-id='TopResultsPager'] a", function () {
        document.igt.gs.methods.openProcessingSpinner();
    });
    document.igt.types.Container.ResultsUpdatePanel.$element.on("click", "ul[data-igt-temp-id='BottomResultsPager'] a", function () {
        document.igt.gs.methods.openProcessingSpinner(); document.igt.gs.methods.scrollToAddThis();
    });
    document.igt.types.Button.BackToGameSearch.$control.on("click", document.igt.gs.methods.goToPreviousGameSearch);// document.igt.handlers.backToGameSearch //document.igt.gs.methods.popHash
    document.igt.types.Container.AllJursMessage.$element.on("click", function () {
        document.igt.types.Button.JurSelectedButton.$control.click(); return false;
    });
    $(".game_categories .gm_cat a").on("click", function () {
        $("#CategoryFeatureList").children().css("display", "none").filter("[data-igt-category='"+$(this).text().trim()+"']").css("display","");
    });
    // Game Page Tabs:
    document.igt.types.Container.Tabs.$element.on("click", "a:eq(1)", document.igt.handlers.loadSpecificationsTab);
    document.igt.types.Container.Tabs.$element.on("click", "a:eq(2)", document.igt.handlers.loadProgramsTab);
    document.igt.types.Container.Tabs.$element.on("click", "a:eq(3)", document.igt.handlers.loadMarketingTab);
    if (document.igt.gs.globals.isLoggedIn) $(".secure").addClass("hide_secure").removeClass("secure");
    // Autocomplete Land Based All - Asynchronous
    $.get("/GS_Predictive.txt", function (data) {
        //data = data.replace(/\-/g, "").replace(/ {2,6}/g, " ");
        document.igt.gs.globals.autocompleteLandBasedSource = data.split("|");
        document.igt.gs.methods.autocompleteUpdateCurrentDatasource();
        //document.igt.gs.globals.allLandBasedKeywordsArePreLoadingFlag = false;
    });
    // Autocomplete Interactive All - Asynchronous
    $.get("/GS_Predictive_Interactive.txt", function (data) {
        //data = data.replace(/\-/g, "").replace(/ {2,6}/g, " ");
        document.igt.gs.globals.autocompleteInteractiveSource = data.split("|");
        document.igt.gs.methods.autocompleteUpdateCurrentDatasource();
    });
    // Initialize hash and load page:
    $(window).on("hashchange", document.igt.handlers.onHashChange);
    var originalHash = window.location.hash.toLowerCase();
    if (originalHash.startsWith("#")) originalHash = originalHash.substring(1);
    var newHash = originalHash;
    if (document.igt.gs.globals.initialHashHiddenFieldValue) {
        newHash = document.igt.gs.globals.initialHashHiddenFieldValue;

    }
    document.igt.gs.globals.initialKeyword = document.igt.gs.methods.getKeywordFromHash(newHash);
    if (originalHash === newHash) document.igt.handlers.onHashChange(null, true, newHash);
    else document.igt.gs.methods.setHash(newHash);
});

