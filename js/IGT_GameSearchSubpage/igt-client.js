/// <reference path="libs/jquery-1.10.1.min.js" />

document.igt = {};
document.igt.types = {
    Group: {},
    Action: {},
    Button: {},
    Element: {},
    Label: {},
    Select: {},
    SelectItemGroup: {},
    SelectItem: {},
    TextBox: {},
    Container: {},
    DisplayList: {},
    DisplayItemGroup: {},
    DisplayItem: {}
};
document.igt.children = {};
document.igt.prm = {
    pageRequestManager: Sys.WebForms.PageRequestManager.getInstance(),
    globals: {},
    util: {},
    methods: {},
    handlers: {}
}
document.igt.facets = {};
document.igt.facetValues = {};
document.igt.facetValuesArray = [];
document.igt.groups = {};
document.igt.handlers = {};
document.igt.globals = {};
document.igt.functions = {};
document.igt.util = {
    hide: function ($items) {
        if ($items == undefined || $items.length == 0) return $items;
        if ($items[0].tagName.toLowerCase() == "option") $items.prop("hidden", "hidden")
        else $items.css("display", "none");
        return $items;
    },
    show: function ($items) {
        if ($items == undefined || $items.length == 0) return $items;
        if ($items[0].tagName.toLowerCase() == "option") $items.removeProp("hidden")
        else $items.css("display", "");
        return $items;
    },
    hidden: function ($items) { return $items.css("visibility", "hidden"); },
    visible: function ($items) { return $items.css("visibility", "visible"); },
    repeat: function (stringToRepeat, timesToRepeat) {
        var results = "";
        for (var i = 0; i < timesToRepeat; i++) results += stringToRepeat;
        return results;
    },
    isHidden: function ($item) { return $item.css("display") == "none"; },
    run: function (functions, param1, param2, param3) {
        if (functions == undefined) return undefined;
        var thisObj = this;
        if ($.isArray(functions)) $.each(functions, function (index, item) { thisObj.run(item); });
        else if ($.isFunction(functions)) return functions(param1, param2, param3);
    },
    runIgtPath: function (igtPathArray, optionalParameter, optionalCallContext) {
        if (optionalCallContext) return (document.igt.util.getValueIGT(igtPathArray)).call(optionalCallContext, optionalParameter);
        else return (document.igt.util.getValueIGT(igtPathArray))(optionalParameter);
    },
    runIfFunction: function (optionalFuntionToRun) { if (optionalFuntionToRun) optionalFuntionToRun(); },
    selectDropdownOption: function (selectTagDomElement, optionIndex) { selectTagDomElement.options[optionIndex].selected = true; },
    getClosestIGTElement: function (currentDomElement, igtType_optional) {
        var $currentDomElement = $(currentDomElement);
        if (igtType_optional != undefined) {
            var $target = $currentDomElement.closest("[data-igt-type='" + igtType_optional + "']");
            if ($target == undefined || $target.length == 0) return undefined;
            else return $target.data("IGTElement");
        }
        else {
            return $currentDomElement.closest("[data-igt-type]").data("IGTElement");
        }
    },
    createFacetOptionText: function (nameValue, resultCount, characterCount) {
        if (nameValue == "All") return nameValue;
        return nameValue + "&nbsp;&nbsp;(<span>" + resultCount + "</span>)";
        //characterCount = (characterCount && characterCount > 0 ? characterCount : 15)
        //return nameValue + document.igt.util.repeat("&nbsp;", characterCount - nameValue.length - String(resultCount).length - 2) + "(" + resultCount + ")";
    },
    toUpperCamelCase: function (name) { return name.substr(0, 1).toUpperCase() + name.substr(1); },
    toLowerCamelCase: function (name) { return name.substr(0, 1).toLowerCase() + name.substr(1); },
    // Function source: http://osvaldas.info/responsive-equal-height-blocks
    setHeights: function ($list, $items) {
        $items.css('height', 'auto');
        var perRow = Math.floor($list.width() / $items.width());
        if (perRow != null && perRow >= 2) {
            for (var i = 0, j = $items.length; i < j; i += perRow) {
                var maxHeight = 0,
                    $row = $items.slice(i, i + perRow);

                $row.each(function () {
                    var itemHeight = parseInt($(this).outerHeight());
                    if (itemHeight > maxHeight) maxHeight = itemHeight;
                });
                $row.css('height', maxHeight);
            }
        }
        return true;
    },
    // Function source: https://stackoverflow.com/questions/544993/official-way-to-ask-jquery-wait-for-all-images-to-load-before-executing-somethin
    waitForImagesToLoad: function ($images, callback) {
            totalImg = $images.length;
        var waitImgLoad = function () {
            totalImg--;
            if (!totalImg) {
                callback();
            }
        };
        $images.each(function () {
            if (this.complete) { 
                waitImgLoad();
            }
        })
        $images.on("load",waitImgLoad).on("error",waitImgLoad);
    },
    getValueIGT: function (igtPathArray) {
        return this.getValueDocument(["igt"].concat(igtPathArray));
    },
    getValueDocument: function (igtPathArray) {
        switch (igtPathArray.length) {
            case 1:
                return document[igtPathArray[0]];
            case 2:
                return document[igtPathArray[0]][igtPathArray[1]];
            case 3:
                return document[igtPathArray[0]][igtPathArray[1]][igtPathArray[2]];
            case 4:
                return document[igtPathArray[0]][igtPathArray[1]][igtPathArray[2]][igtPathArray[3]];
            case 5:
                return document[igtPathArray[0]][igtPathArray[1]][igtPathArray[2]][igtPathArray[3]][igtPathArray[4]];
            case 6:
                return document[igtPathArray[0]][igtPathArray[1]][igtPathArray[2]][igtPathArray[3]][igtPathArray[4]][igtPathArray[5]];
            default:
                return document;
        }
    },
    scrollToTopSlow: function (callbackFunction) { document.igt.util.scrollTo(0,"slow",callbackFunction); },
    scrollToTopFast: function () { document.igt.util.scrollTo(0, "fast"); },
    jumpToTop: function () { $("html, body").scrollTop(0); },
    scrollTo: function (scrollToPosition, speed, callbackFunction) { $("html, body").animate({ scrollTop: scrollToPosition },speed,callbackFunction); },
    matches: function (arrayToCompare1, arrayToCompare2) {
        if (arrayToCompare1.length != arrayToCompare2.length) return false;
        var returnValue = true;
        $.each(arrayToCompare1, function (index,value) { if (arrayToCompare2.indexOf(value) == -1) { returnValue = false; return false; } return true; });
        return returnValue;
    }
};

document.igt.client = {
    classes: {
        Element: function (element) {
            this.util = document.igt.util;
            this.types = document.igt.types;
            this.element = element;
            this.tagName = element.tagName.toLowerCase();
            this.$element = $(element);
            this.idName = this.$element.data("igt-id");
            this.index = this.$element.data("igt-index");
            var typeArray = this.$element.data("igt-type").split(".");
            this.type = typeArray[0];
            this.subType = typeArray[1];
            this.variant = this.$element.data("igt-variant");
            this.typeIdName = this.type + "." + this.idName;
            this.escapedTypeIdName = this.type + "_" + this.idName;
            this.name = this.$element.data("igt-name");
            this.openClose = this.$element.data("igt-open-close");
            this.actions = this.$element.data("igt-actions");
            this.canHaveSelectedItem = false;
            this.hasClickOrChangeEvent = false;
            if (this.$element.attr("data-igt-params")) {
                var pairs = this.$element.attr("data-igt-params").split("|");
                this.params = {};
                for (var i = 0; i < pairs.length; i++) {
                    var pair = pairs[i].split("=");
                    this.params[pair[0]] = pair[1];
                }
            }
            this.groups = this.$element.data("igt-groups");
            this.parent = this.$element.attr("data-igt-parent");
            if (this.parent) {
                this.parent = this.parent.replace(/[\.\-]/g, "_");
                if (!document.igt.children[this.parent]) document.igt.children[this.parent] = [];
                document.igt.children[this.parent].push(this);
            }
            this.displayMode = this.$element.attr("data-igt-display-mode");
            this.noPostback = false;
            this.noFire = false;
            if (this.groups && this.groups != undefined && this.groups != "") {
                var groupsArray = this.groups.split(",");
                for (var i = 0; i < groupsArray.length; i++) {
                    if (this.types.Group[groupsArray[i]] == undefined)
                        this.types.Group[groupsArray[i]] = new document.igt.client.classes.Group(this);
                    else this.types.Group[groupsArray[i]].addIGTElement(this);
                }
            }
            switch (this.type) {
                case "Element":
                    break;
                case "Label":
                    break;
                case "Select":
                    this.canHaveSelectedItem = true;
                    this.hasClickOrChangeEvent = true
                    this.characterCount = this.$element.data("igt-character-count");
                    this.selectedClass = (this.$element.data("igt-selected-class") || "selected");
                    this.classTargetSelector = this.$element.data("igt-class-target-selector");
                    this.$groups = this.$element.find("[data-igt-type^='SelectItemGroup.']");
                    this.$items = this.$element.find("[data-igt-type^='SelectItem.']");
                    this.$selectTag = (this.element.tagName.toLowerCase() == "select" ? this.$element : this.$element.find("select"));
                    if (this.$items.length == 0 && this.$selectTag.length > 0) this.$items = this.$selectTag.find("option");
                    this.itemCount = this.$items.length;
                    this.$defaultItem = this.$items.filter("[data-igt-default='true']");
                    this.multiSelect = (this.$element.data("igt-multi-select") == "true");
                    if (this.$defaultItem.length == 0) this.$defaultItem = this.$items.first();
                    if (this.$element[0].tagName.toLowerCase() == "select") this.$select = this.$element;
                    else if (this.$element.find("select").length > 0) this.$select = this.$element.find("select");
                    this.$control = this.$select;
                    switch (this.subType) {
                        case "SelectList":
                            this.$items = this.$items.filter("[data-igt-type$='SelectListItem']");
                            this.$itemsATags = this.$items.find("a");
                            this.$itemsITags = this.$items.find("i");
                            //this.$selectItemAnchors.on("click", function () { thisElement.SelectList_change(this); });
                            break;

                        case "Facet":
                            var facetInfo = this.$element.data("igt-facet");
                            if (facetInfo) {
                                facetInfo = facetInfo.split("|");
                                this.facetName = facetInfo[0];
                                this.facetType = facetInfo[1].trim().toLowerCase();
                                if (this.facetName) document.igt.facets[this.facetName] = this;
                            }
                        case "Option":
                        default:
                            break;
                    }
                    break;
                case "SelectItemGroup":
                    this.canHaveSelectedItem = true;
                    this.$items = this.$element.find("[data-igt-type^='SelectItem.']");
                    if (this.$items.length == 0 && this.tagName == "optgroup") this.$items = this.$element.find("option");
                    switch (this.subType) {
                        case "Facet":
                            var facetInfo = this.$element.data("igt-facet");
                            if (facetInfo) {
                                facetInfo = facetInfo.split("|");
                                this.facetName = facetInfo[0];
                                this.facetType = facetInfo[1].trim().toLowerCase();
                                if (this.facetName) document.igt.facets[this.facetName] = this;
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "SelectItem":
                    this.index = this.$element.data("igt-index");
                    if (this.index == undefined || this.index == "") this.index = this.$element.prevAll().length;
                    this.$select = this.$element.closest("[data-igt-type^='Select.']");
                    this.selectSubType = this.$select.data("igt-type").split(".")[1];
                    this.selectIdName = this.$select.data("igt-id");
                    this.$element.data("igt-select", this.selectIdName);
                    if (this.idName == undefined || this.idName == "") this.idName = this.selectIdName + "_" + this.index;
                    this.$group = this.$element.closest("[data-igt-type^='SelectItemGroup.']");
                    this.value = (this.$element.data("igt-value") ? this.$element.data("igt-value") : (this.$element.val() ? this.$element.val() : undefined));
                    switch (this.selectSubType) {
                        case "SelectList":
                            this.hasClickOrChangeEvent = true;
                            this.$control = this.$element.find("a,input,button");
                            if (this.$control.length == 0) this.$control = this.$element;
                            break;
                        case "Facet":
                            // this.count = 0;//this.$element.data("igt-count");
                            if (this.$select.data("igt-facet") && this.$select.data("igt-facet").indexOf("|guid") != -1 && this.name != "All") {
                                document.igt.facetValues["id_" + this.value.toLowerCase()] = this;
                                document.igt.facetValuesArray.push(this);
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "Container":
                    switch (this.subType) {
                        case "SelectContainer":
                            this.$Selects = this.$element.find("[data-igt-type^='Select.']");
                            break;
                        default:
                            break;
                    }
                    break;
                case "DisplayList":
                    this.canHaveSelectedItem = true;
                    this.$items = this.$element.find("[data-igt-type^='DisplayItem.']");
                    this.$groups = this.$element.find("[data-igt-type^='DisplayItemGroup.']");
                    break;
                case "DisplayItemGroup":
                    this.$list = this.$element.closest("[data-igt-type^='DisplayList.']");
                    this.$items = this.$element.find("[data-igt-type^='DisplayItem.']");
                    break;
                case "DisplayItem":
                    this.$list = this.$element.closest("[data-igt-type^='DisplayList.']");
                    this.$group = this.$element.closest("[data-igt-type^='DisplayItemGroup.']")
                    break;
                case "Button":
                    this.hasClickOrChangeEvent = true;
                    var tag = this.element.tagName.toLowerCase();
                    if (tag == "a" || tag == "input") this.$control = this.$element;
                    else {
                        this.$control = this.$element.find("a");
                        if (this.$control.length == 0) this.$control = this.$element.find("input");
                    }
                    break;
                case "TextBox":
                    this.$control = (this.element.tagName.toLowerCase() == "input" ? this.$element : this.$element.find("input"));
                    this.defaultValue = (this.$element.data("igt-default-value") || "");
                    switch (this.subType) {
                        case "SearchTextBox":
                            if (this.$element.data("igt-submit-control") != undefined) {
                                var submitID = this.$element.data("igt-submit-control").split(".");
                                this.$submitElement = $("[data-igt-id='" + submitID[1] + "'][data-igt-type^='" + submitID[0] + ".']");
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                case "Action":
                    this.executionSequence = this.$element.data("igt-exec-seq");
                    break;
                default:
                    alert(this.type + " | ");
                    break;
            }
            document.igt.types[this.type][this.idName] = this;
            this.$element.data("IGTElement", this);
        },
        Group: function (initialGroupIGTElement) {
            this.igtElements = [initialGroupIGTElement];
            this.$elements = initialGroupIGTElement.$element;
            this.subtype = (initialGroupIGTElement.type == "Action" ? "Action" : "Element");
            if (this.subtype == "Action") this.actions = [];
            this.addAction(initialGroupIGTElement);
            this.type = "Group";
        },
        //Action: function (actionString) {
        //    this.colons = undefined;
        //    this.function = undefined;
        //    this.targets = [];
        //    this.parameter = undefined;
        //    this.colonStrings = actionString.split(":");
        //    this.command = this.colonStrings[0];
        //    switch (this.command) {
        //        case "Run":
        //            this.populatePartObjects();

        //            break;
        //        case "Action":
        //            this.populatePartStrings();
        //            for (var i = 0; i < length; i++) {

        //            }
        //            break;
        //        default:

        //    }

        //    this.indexLevelOfColonObjects = document.igt.client.util.getActionInfoColonLevelIndex(this.primaryCommand);
        //    if (this.indexLevelOfColonObjects > -1) {
        //        this.secondaryColonStrings = this.colonStrings.slice(1, this.colonStrings.length - 1);
        //        if (this.indexLevelOfColonObjects > 0) {
        //            for (var i = 0; i < secondaryColonStrings.length; i++) {
        //                colons.push(new this.Colon(secondaryColonStrings[i], indexLevelOfColonObjects));
        //            }
        //        }
        //    };
        //},
        //Colon: function (colonString, indexLevelOfColonObjects) {
        //    this.colonString = colonString;
        //    this.partStrings = colonString.split(",");
        //    this.parts = undefined;
        //    this.elements = null;
        //    this.functions = null;
        //    this.values = null;

        //    if(indexLevelOfColonObjects > 1){
        //        this.colonElements = [];
        //        for (var i = 0; i < this.colonElementStrings.length; i++) {
        //            this.colonElements.push(new this.ColonElement(this.colonElementStrings[i],indexLevelOfColonObjects));
        //        }
        //    }
        //},
        //Part: function (actionElementString, indexLevelOfColonObjects) {
        //    this.colonPartString = actionElementString;
        //    this.colonSubpartStrings = this.colonPartString.split(".");
        //},
        Processor: function (commandString, optionalStaticTargetElements, optionalStaticParameterObject) {
            this.commandString = commandString;
            this.commandArray = undefined
            this.primaryCommand = undefined;
            this.targetElements = optionalStaticTargetElements; // Array.
            this.parameter = optionalStaticParameterObject;
            this.commandFunction = undefined;
        },
    },
    util: {
        initializeAllElements: function () {
            $("[data-igt-type]").each(function () {
                new document.igt.client.classes.Element(this);
            });
        },
        runActionsString: function (actionsString) {
            var actionStrings = actionsString.split(";");
            for (var i = 0; i < actionStrings.length; i++) {
                var actionInfoObj = new document.igt.client.classes.ActionInfo(actionStrings[i]);

            }
        },
        run: function (igtFunctionPathArray, optionalParameter) {
            return document.igt.util.getValueIGT(igtFunctionPathArray)(optionalParameter);
        },
        findUpdatePanel$Element: function (updatePanelIgtId, tagID) {
            return document.igt.types.Container[updatePanelIgtId].$element.find("[id$='" + tagID + "']");
        },
        getElements: function (elementsString) {

        },
        get$elementsFromElements: function (elementArray) {
            var $result = $();
            for (var i = 0; i < elementArray.length; i++) $result = $result.add(elementArray[i].$element);
            return $result;
        },
        runForAll: function (elementArray, methodName, optionalParameter) {
            for (var i = 0; i < elementArray.length; i++) elementArray[i][methodName](optionalParameter);
        },
        filterShown: function (elementArray) { return elementArray.filter(function (element) { return !element.isHidden(); }); },
        filterHidden: function (elementArray) { return elementArray.filter(function (element) { return element.isHidden(); }); },
        //getActionInfoColonLevelIndex: function (primaryCommand) {
        //    switch (primaryCommand) {
        //        case "Run":
        //             return 2;
        //        case "Action":
        //            return 1;
        //        default:
        //            return 0;
        //    }
        //},
        //getActionProcessor: function (actionInfo) {
        //    switch (actionInfo.primaryCommand) {
        //        case "Action":
        //            return function () {
        //                for (var i = 0; i < actionInfo.colons[1].colonElementStrings.length; i++) {
        //                    document.igt.client.methods.runActionsStrings(document.igt.types.Action[actionInfo.colons[1].colonElementStrings[i]].actions);
        //                }
        //            };
        //        case "Run":
        //            return function () {
        //                var parameter = (actionInfo.colons.length < 3 ? undefined : document.igt.util.getValueIGT(actionInfo.colons[2].colonElements[0].colonElementPartStrings));
        //                for (var i = 0; i < actionInfo.colons[1].colonElements.length; i++) {
        //                    var element = actionInfo.colons[1].colonElements[i];
        //                    var functionObject = document.igt.util.getValueIGT(element.colonElementPartStrings);
        //                    return functionObject(parameter);
        //                }
        //            };
        //        case "Set":
        //            return function () {

        //            };
        //        default: // Commands: Reset, 
        //            return function () {
        //                var elements = document.igt.client.util.getAsElements(actionInfo.colons[1].colonElements);
        //                for (var i = 0; i < elements.length; i++) {
        //                    if (elements[i].type == "Group") elements[i].runMethod(actionInfo.primaryCommand);
        //                    else elements[i][document.igt.util.toLowerCamelCase(actionInfo.primaryCommand)]();
        //                }
        //            };
        //    }
        //},
        getValueClient: function (igtPathArray) {
            return document.igt.util.getValueIGT(["client"].concat(igtPathArray));
        },
        //getAsElements: function (colonElements) {
        //    var elements = [];
        //    for (var i = 0; i < colonElements.length; i++) {
        //        elements.push(document.igt.types[colonElements[i].colonElementPartStrings[0]][colonElements[i].colonElementPartStrings[1]]);
        //    };
        //    return elements;
        //}
    }
};
//document.igt.client.classes.Action.prototype = {
//    //populatePartStrings: function () {

//    //},
//    //populatePartObjects: function () {

//    //},
//    //populateTargetsFromPartStringArray: function (type, partStringArray) {

//    //},
//    run: function () {
//        for (var i = 0; i < this.targets.length; i++) {
//            this.function.call(this.targets[i], this.parameter);
//        }
//    },

//};
document.igt.client.classes.Processor.prototype = {
    run: function () {
        if (!this.isInitialized()) this.initialize();
        switch (this.primaryCommand) {
            default:

        }
    },
    initialize: function () {
        this.commandArray = commandString.split(".");
        this.primaryCommand = this.commandArray[0];
        switch (this.primaryCommand) {
            case "Run":
                //this.commandFunction = 
                break;
            default:

        }

    },
    isInitialized: function () {
        return (this.commandArray != undefined);
    }
}
//document.igt.client.classes.Colon.prototype = {
//    populatePartObjects: function () {

//    },
//    populateElements: function (optionalType) {

//    },
//    populateFunctions: function () {

//    },
//    populateValues: function () {

//    }
//}
//document.igt.client.classes.Part.prototype = {

//}
document.igt.client.classes.Element.prototype = {
    find$ElementByAspID: function (aspID) { return this.$element.find("[id$='" + aspID + "']"); },
    zoomIn: function () {
        switch (this.type) {
            case "SelectItem":
                this.getSelectElement().$items.not(this.$element).slideUp();
                this.$element.slideDown();
                break;
            default:
        }
    },
    zoomOut: function () {
        switch (this.type) {
            case "SelectItem":
                this.getSelectElement().$items.slideDown();
                break;
            default:
        }
    },
    showHide: function (show) { if (show) this.show(); else this.hide(); },
    addClass: function (newClass) {
        this.$element.addClass(newClass);
    },
    setHTML: function (newHTML) {
        this.$element.html(newHTML);
    },
    getParent: function () {
        return (this.parent ? document.igt.types.Container[this.parent.split('_')[1]] : undefined);
    },
    getAncestors: function () {
        var result = [];
        var parent = this.getParent();
        while (parent) {
            result.push(parent);
            parent = parent.getParent();
        }
        return result;
    },
    getChildren: function () {
        return document.igt.children[this.escapedTypeIdName].slice(0);
    },
    getSiblingsAndSelf: function () {
        return (this.parent && this.getParent().getChildren());
    },
    getSiblings: function () {
        var siblingsAndSelf = this.getSiblingsAndSelf();
        if (!siblingsAndSelf) return undefined;
        var index = siblingsAndSelf.indexOf(this);
        if (index > -1) siblingsAndSelf.splice(index, 1);
        return siblingsAndSelf;
    },
    getIGTDataFromItem: function ($item) {
        return $item.data("IGTElement");
    },
    getIGTDataFromItems: function ($items) {
        if ($items.length > 0) {
            var result = [];
            $items.each(function () {
                result.push($(this).data("IGTElement"));
            });
            return result;
        }
    },
    getIGTData: function (igtType, igtIdName) {
        return this.types[igtType][igtIdName];
    },
    getSelectedElement: function () {
        if (!this.canHaveSelectedItem) return undefined;
        switch (this.type) {
            case "Select":
                switch (this.subType) {
                    case "SelectList":
                        return this.$items.filter("[data-igt-selected='true']").data("IGTElement");
                    case "Facet":
                    default:
                        return this.$items.eq(this.$select[0].selectedIndex).data("IGTElement");
                }
            case "Message":
                break;
            default:
                break;
        }
    },
    getSelectedValue: function () {
        if (!this.canHaveSelectedItem) return undefined;
        switch (this.type) {
            case "Select":
                return this.$selectTag.val();
                // Need to implement for non-select tag selects.
            case "SelectItemGroup":
                if (this.tagName == "optgroup") {
                    var $currentItems = (this.$items.length == 0 ? this.$element.find("option") : this.$items);
                    for (var i = 0; i < $currentItems.length; i++) {
                        if ($currentItems[i].selected) return $currentItems.eq(i).val();
                    }
                    return undefined;
                }
                // Need to implement for non-optgroup groups.
            case "Message":
                break;
            default:
                break;
        }
    },
    getSelectedIGTValues: function () {
        if (!this.canHaveSelectedItem) return undefined;
        switch (this.type) {
            case "Select":
                switch (this.subType) {
                    case "Option":
                        var values = [];
                        this.$items.each(function () { if (this.selected) values.push($(this).data("igt-value")); });
                        return values;
                        break;
                    default:
                }
                break;
            default:
        }
    },
    getIsSelected: function () {
        if (this.tagName == "option") return this.element.selected;
        else return (this.$element.attr("data-igt-selected") == "true");
    },
    getIsDisplayed: function () {
        return (this.$element.css("display") != "none");
    },
    getSelectedCount: function () {
        if (!this.canHaveSelectedItem) return undefined;
        return this.$items.filter(":selected").length;
    },
    getSelectElement: function () {
        return (this.type == "Select" ? this : (this.type == "SelectItem" ? this.$select.data("IGTElement") : undefined));
    },
    getManager: function () {
        return this.$manager.data("IGTElement");
    },
    getSelectItemElements: function () {
        var selectElement = this.getSelectElement();
        if (selectElement == undefined) return undefined;
        return this.getIGTDataFromItems(selectElement.$items);
    },
    selectThis: function () {
        switch (this.type) {
            case "SelectItem":
                switch (this.selectSubType) {
                    case "SelectList":
                        this.getSelectElement().$items.attr("data-igt-selected", "false");
                        this.$element.attr("data-igt-selected", "true");
                        break;
                    case "Facet":
                    default:
                        this.element.selected = true;
                        //document.igt.util.selectDropdownOption(this.getSelectElement().$selectTag[0], this.$element.prevAll().length);
                        break;
                }
                this.getSelectElement().updateSelectDisplay();
                break;
            case "MessageItem":
                this.util.hide(this.getManager().$ManagedItems);
                this.util.show(this.$element);
                break;
            default:
                break;
        }
    },
    updateSelectDisplay: function () {
        if (this.type != "Select") return;
        var thisObj = this;
        var selectedItemElement = this.getSelectedElement();
        switch (this.subType) {
            case "Facet":
                if (this.facetType != "guid") return;
                var characterCount = (this.characterCount == undefined ? 15 : this.characterCount);
                $.each(this.getSelectItemElements(), function (index, item) {
                    var count = item.$element.attr("data-igt-count");
                    item.$element.html(document.igt.util.createFacetOptionText(item.name, count, characterCount));
                });
                selectedItemElement.$element.html(selectedItemElement.name);
                break;
            case "SelectList":
                if (this.classTargetSelector) {
                    this.$items.find(this.classTargetSelector).removeClass(this.selectedClass);
                    if (selectedItemElement) selectedItemElement.$element.find(this.classTargetSelector).addClass(this.selectedClass);
                }
                else {
                    this.$items.removeClass(this.selectedClass);
                    if (selectedItemElement) selectedItemElement.$element.addClass(this.selectedClass);
                }
                if (this.variant == "Nav") {
                    this.$itemsATags.removeClass("selected_blk");
                    if (selectedItemElement) selectedItemElement.$element.find("a").addClass("selected_blk");
                    document.igt.util.hidden(this.$itemsITags);
                    if (selectedItemElement) document.igt.util.visible(selectedItemElement.$element.find("i"));
                }
                break;
            default:
                break;
        }
    },
    deselect: function myfunction() {
        switch (this.type) {
            case "Select":
                if (this.subType == "SelectList") {
                    this.$items.attr("data-igt-selected", "false");
                    this.updateSelectDisplay();
                }
                break;
            default:
                break;
        }
    },
    handleClickOrChangeEvent: function () {
        switch (this.type) {
            case "Select":
            case "SelectItem":
                this.handleSelectEvent();
                break;
            case "Button":
                this.handleButtonClick();
                break;
            case "TextBox":
                this.handleTextBoxKeyUp();
                break;
            default:
                this.handleElementClick();
                break;
        }
    },
    handleSelectEvent: function () {
        var selectedItem;
        var select;
        if (this.type == "SelectItem") {
            selectedItem = this;
            select = this.getSelectElement();
        } else {
            select = this;
            selectedItem = this.getSelectedElement();
        }
        if (selectedItem) {
            selectedItem.selectThis();
            select.handleThisAction();
            var selectedItemGroup = this.getIGTDataFromItem(selectedItem.$group);
            if (selectedItemGroup) selectedItemGroup.handleThisAction();
            selectedItem.handleThisAction();
        }
        else {
            select.handleThisAction();
        }
    },
    handleButtonClick: function () {
        this.handleThisAction();
    },
    handleElementClick: function () {
        this.handleThisAction();
    },
    handleTextBoxKeyUp: function () {
        switch (this.subType) {
            case "SearchTextBox":
                if (this.$control.val() == "") this.handleThisAction("Disable:" + this.getIGTDataFromItem(this.$submitElement).typeIdName);
                else this.handleThisAction("Enable:" + this.getIGTDataFromItem(this.$submitElement).typeIdName);
                this.handleThisAction();
                break;
            default:
                break;
        }
    },
    isDisabled: function () {
        if (this.$element.hasClass("disabled")) return true;
        switch (this.type) {
            case "SelectItemGroup":
            case "SelectItem":
            case "Select":
                if (this.$select && this.$select.length > 0 && this.$select.hasClass("disabled")) return true;
                if (this.$selectTag && this.$selectTag.length > 0 && this.$selectTag.hasClass("disabled")) return true;
                break;
            case "Button":
                if (this.$control && this.$control.length > 0 && this.$control.hasClass("disabled")) return true;
                break;
            default:
        }
        return false;
    },
    // Actions:
    action: function () {
        document.igt.client.methods.action(this.actions);
    },
    // - - No Parameters:
    isHidden: function () {
        return this.$element.css("display") == "none";
    },
    hide: function () {
        switch (this.subType) {
            case "Option":
                this.$element.prop("hidden", "hidden");
                break;
            case "DisplayList":
                this.initialize();
                break;
            case "DisplayItem":
                this.getIGTDataFromItem(this.$list).initialize();
                break;
            default:
                this.$element.css("display", "none");
                break;
        }
    },
    show: function (optionalForceNoAnimation) {
        if (this.parent) {
            var siblings = this.getSiblings();
            var siblingDisplay = (this.displayMode == "All" ? "" : "none")
            for (var i = 0; i < siblings.length; i++) siblings[i].$element.css("display", siblingDisplay);
            this.$element.css("display", "");
        }
        else {

            switch (this.type) {
                case "DisplayItem":
                    var listElement = this.getIGTDataFromItem(this.$list);
                    document.igt.util.hide(listElement.$groups);
                    document.igt.util.hide(listElement.$items);
                    document.igt.util.show(this.$group);
                    if (listElement.openClose == "Fade" && !optionalForceNoAnimation) this.$element.fadeIn();
                    else if (listElement.openClose == "Slide" && !optionalForceNoAnimation) this.$element.slideDown();
                    else document.igt.util.show(this.$element);
                    break;
                case "SelectItem":
                    if (this.subType == "Option") this.$element.removeProp("hidden");
                    else this.$element.css("display", "");
                    break;
                default:
                    this.$element.css("display", "");
            }
        }
    },
    fadeIn: function (callback) {
        if (this.parent) {
            var ancestors = this.getAncestors();
            var levelCount = ancestors.length + 1;
            if (levelCount == 3) { // Display mode Single is assumed for third level:
                if (ancestors[0].isHidden()) {
                    var activeParentSibling = document.igt.client.util.filterShown(ancestors[0].getSiblings());
                    var thisObj = this;
                    activeParentSibling[0].fadeOut(function () { thisObj.fadeIn2Level(callback); });
                } else this.fadeIn2Level(callback);
            }
            else if (levelCount == 2) {
                this.fadeIn2Level(callback);
            } else this.$element.fadeIn(callback);
        } else this.$element.fadeIn(callback);
    },
    fadeIn2Level: function (callback) {
        var siblingsAndSelf = this.getSiblingsAndSelf();
        var siblings = this.getSiblings();
        var $siblings = document.igt.client.util.get$elementsFromElements(siblings);
        var parent = this.getParent();
        var displayMode = (parent.displayMode || "Single");
        if (parent.isHidden()) { // Parent Hidden:
            if (displayMode == "Single") {
                this.show();
                $siblings.hide();
            } else {
                siblingsAndSelf.show();
            }
            parent.fadeIn(callback);
        } else { // Parent Showing:
            if (displayMode == "Single") {
                if (!this.isHidden()) {
                    document.igt.util.runIfFunction(callback);
                } else {
                    this.$element.fadeIn(callback);
                    $siblings.fadeOut();
                }
            } else {
                if (!this.isHidden()) {
                    document.igt.util.runIfFunction(callback);
                } else {
                    this.$element.fadeIn(callback);
                    $siblings.fadeIn();
                }
            }
        }
    },
    fadeOut: function (callback) {
        this.$element.fadeOut(callback);
    },
    slideDown: function () {
        if (this.type == "DisplayItem") {
            var listElement = this.getIGTDataFromItem(this.$list);
            var itemElement = this;
            var openDisplayItem = function () {
                itemElement.show(true);
                listElement.$element.slideDown();
            }
            if (listElement.$element.css("display") == "none") openDisplayItem();
            else listElement.slideUp(openDisplayItem);
        }
        else this.$element.slideDown();
    },
    slideUp: function () {
        this.$element.slideUp();
    },
    slideToggle: function () {
        switch (this.type) {
            case "Button":
                if (this.subType == "Accordion") {
                    var contentContainerElement = this.getChildren()[0];
                    var willOpen = contentContainerElement.isHidden();
                    var $i = this.$element.find("i");
                    var $classTarget;
                    var classListObject;
                    if ($i.length > 0) {
                        $classTarget = $i;
                        if ($i.hasClass("fa-angle-up") || $i.hasClass("fa-angle-down")) classListObject = { open: { add: "fa-angle-up", remove: "fa-angle-down" }, close: { add: "fa-angle-down", remove: "fa-angle-up" } };
                    }
                    contentContainerElement.$element["slide" + (willOpen ? "Down" : "Up")]("slow");
                    $classTarget.addClass(classListObject[willOpen ? "open" : "close"].add).removeClass(classListObject[willOpen ? "open" : "close"].remove);
                }
                break;
            default:
                this.$element.slideToggle();
        }
    },
    reset: function () {
        switch (this.type) {
            case "Select":
                var element = this.getIGTDataFromItem(this.$defaultItem);
                if (element) element.selectThis();
                else {
                    var firstElement = this.getIGTDataFromItem(this.$items.first());
                    if (firstElement == undefined) this.$selectTag[0].selectedIndex = 0;
                    else firstElement.selectThis();
                }
                break;
            case "Message":

                break;
            case "Label":

                break;
            case "TextBox":
                this.$control.val(this.defaultValue);
                break;
            default:
                break;
        }
    },
    primaryCSS: function () {

    },
    secondaryCSS: function () {

    },
    defaultCSS: function () {

    },
    clear: function () {
        this.$element.html("");
    },
    enable: function () {

    },
    disable: function () {

    },
    open: function () {

    },
    close: function () {

    },
    select: function () {

    },
    click: function () {

    },
    noFire: function () {

    },
    noPostback: function () {

    },
    initialize: function () {
        switch (this.type) {
            case "DisplayList":
                this.$items.css("display", "none");
                if (this.$groups) this.$groups.css("display", "none");
                break;
            case "TextBox":
                this.$control.val(this.defaultValue);
                break;
            default:
                break;
        }
    },
    // - - ActionInfo object parameter:
    set: function () {

    },
    //
    handleThisAction: function (actionsString) {
        if (this.noFire) return;
        if (!actionsString || actionsString == "") actionsString = this.actions;
        if (!actionsString || actionsString == "") return;
        var actions = actionsString.split(";");
        var thisObj = this;
        for (var i = 0; i < actions.length; i++) {
            if (actions[i].startsWith("#")) continue;
            var actionSegments = actions[i].split(":");
            var commandSegments = actionSegments[0].trim().split(".");
            var targets = (actionSegments.length > 1 ? actionSegments[1].split(",") : undefined);
            var parameters = (actionSegments.length > 2 ? actionSegments[2].split(",") : undefined);
            switch (commandSegments[0].trim()) {
                case "Action":
                    this.handleThisAction(this.types.Action[commandSegments[1].trim()].actions);
                    break;
                case "Run":
                    var optionalParam = undefined;
                    if (commandSegments[commandSegments.length - 1].indexOf("#") != -1) {
                        optionalParam = commandSegments[commandSegments.length - 1].split("#")[1];
                        commandSegments[commandSegments.length - 1] = commandSegments[commandSegments.length - 1].split("#")[0];
                    }
                    document.igt.util.runIgtPath(commandSegments.slice(1), optionalParam, this);
                    break;
                case "Group":
                    this.handleThisAction(this.types.Group[this.types.Action[commandSegments[1].trim()].getActionsCombined()]);
                    break;
                case "Reset":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                $.each(this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements, function (index, igtElement) {

                                    switch (igtElement.type) {
                                        case "Select":
                                            var element = this.getIGTDataFromItem(igtElement.$defaultItem);
                                            if (element) element.selectThis();
                                            else {
                                                var firstElement = this.getIGTDataFromItem(igtElement.$items.first());
                                                if (firstElement == undefined) igtElement.$element[0].selectedIndex = 0;
                                                else firstElement.selectThis();
                                            }
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                switch (igtElement.type) {
                                    case "Select":
                                        var element = this.getIGTDataFromItem(igtElement.$defaultItem);
                                        if (element) element.selectThis();
                                        else {
                                            var firstElement = this.getIGTDataFromItem(igtElement.$items.first());
                                            if (firstElement == undefined) igtElement.$selectTag[0].selectedIndex = 0;
                                            else firstElement.selectThis();
                                        }
                                        break;
                                    case "Message":

                                        break;
                                    case "Label":

                                        break;
                                    case "TextBox":
                                        igtElement.$control.val(igtElement.defaultValue);
                                        break;
                                    default:
                                        break;
                                }
                        }
                    }
                    break;
                case "Primary":
                    $.each(this.buildIGTElementList(targets), function (index, element) { element.$element.removeClass("secondary default").addClass("primary") });
                    break;
                case "Secondary":
                    $.each(this.buildIGTElementList(targets), function (index, element) { element.$element.removeClass("primary default").addClass("secondary") });
                    break;
                case "Default":
                    $.each(this.buildIGTElementList(targets), function (index, element) { element.$element.removeClass("secondary primary").addClass("default") });
                    break;
                case "Clear":
                    var targetIGTElements = this.buildIGTElementList(targets);
                    for (var i = 0; i < targetIGTElements.length; i++) {
                        switch (targetIGTElements[i].type) {
                            case "Select":
                                if (targetIGTElements[i].$groups.length > 0) {
                                    for (var n = 0; n < targetIGTElements[i].$groups.length; n++) targetIGTElements[i].$groups.eq(n).html("");
                                } else targetIGTElements[i].$select.html("");
                                break;
                            case "SelectItemGroup":
                                targetIGTElements[i].$element.html("");
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case "Disable":
                case "Enable":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                $.each(this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements, function (index, igtElement) {

                                    switch (igtElement.type) {
                                        case "Select":
                                            var $tags = igtElement.$element.add(igtElement.$selectTag);
                                            switch (commandSegments[0].trim()) {
                                                case "Disable":
                                                    $tags.prop("disabled", true).addClass("disabled");
                                                    break;
                                                default:
                                                    $tags.prop("disabled",false).removeClass("disabled");
                                                    break;
                                            }
                                            break;
                                        case "Button":
                                            var $controls = igtElement.$element.add(igtElement.$control);
                                            if (commandSegments[0].trim() == "Disable") $controls.addClass("disabled").prop("disabled", true);
                                            else $controls.removeClass("disabled").prop("disabled",false);
                                            break;
                                        default:
                                            break;
                                    }
                                });
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                switch (igtElement.type) {
                                    case "Select":
                                        var $tags = igtElement.$element.add(igtElement.$selectTag);
                                        switch (commandSegments[0].trim()) {
                                            case "Disable":
                                                $tags.prop("disabled", true).addClass("disabled");
                                                break;
                                            default:
                                                $tags.prop("disabled",false).removeClass("disabled");
                                                break;
                                        }
                                        break;
                                    case "Button":
                                        var $controls = igtElement.$element.add(igtElement.$control);
                                        if (commandSegments[0].trim() == "Disable") $controls.addClass("disabled").prop("disabled", true);
                                        else $controls.removeClass("disabled").prop("disabled",false);
                                        break;
                                    default:
                                        break;
                                }

                        }
                    }
                    break;
                case "Set":
                    var value = this.getValue(parameters[0]);
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {

                            default:
                                if (this.types[targetPrimaryIdentifier]) this.types[targetPrimaryIdentifier][targetSequence[1].trim()].$element.html(value);
                                break;
                        }
                    }
                    break;
                case "Select":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "SelectItem":
                                if (this.types[targetPrimaryIdentifier]) this.types[targetPrimaryIdentifier][targetSequence[1].trim()].selectThis();
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case "Deselect":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Select":
                                var igtElement = document.igt.types.Select[targetSequence[1].trim()];
                                if (igtElement.subType == "SelectList") {
                                    igtElement.$items.attr("data-igt-selected", "false");
                                    igtElement.updateSelectDisplay();
                                }
                                break;
                            default:
                                break;
                        }
                    }
                    break;
                case "Open":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                $.each(this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements, function (index, igtElement) {
                                    switch (igtElement.openClose) {
                                        case "Slide":
                                            igtElement.slideDown();
                                            break;
                                        case "Fade":
                                            igtElement.fadeIn();
                                            break;
                                        default:
                                            igtElement.show();
                                            break;
                                    }
                                });
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                switch (igtElement.openClose) {
                                    case "Slide":
                                        igtElement.slideDown();
                                        break;
                                    case "Fade":
                                        igtElement.fadeIn();
                                        break;
                                    default:
                                        igtElement.show();
                                        break;
                                }
                                break;
                        }
                    }
                    break;
                case "Close":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                $.each(this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements, function (index, igtElement) {
                                    switch (igtElement.openClose) {
                                        case "Slide":
                                            igtElement.slideUp();
                                            break;
                                        case "Fade":
                                            igtElement.fadeOut();
                                            break;
                                        default:
                                            thisObj.util.hide(igtElement.$element);
                                            break;
                                    }
                                });
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                switch (igtElement.openClose) {
                                    case "Slide":
                                        igtElement.slideUp();
                                        break;
                                    case "Fade":
                                        igtElement.fadeOut();
                                        break;
                                    default:
                                        thisObj.util.hide(igtElement.$element);
                                        break;
                                }
                                break;
                        }
                    }
                    break;
                case "Hide":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                $.each(this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements, function (index, igtElement) {
                                    igtElement.hide();
                                });
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                igtElement.hide();
                                break;
                        }
                    }
                    break;
                case "Show":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                $.each(this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements, function (index, igtElement) {
                                    igtElement.show();
                                });
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                igtElement.show();
                                break;
                        }
                    }
                    break;
                case "NoPostback":
                case "NoFire":
                    for (var n = 0; n < targets.length; n++) {
                        var targetSequence = targets[n].split(".");
                        var targetPrimaryIdentifier = targetSequence[0].trim();
                        var propertyName = document.igt.util.toLowerCamelCase(commandSegments[0]);
                        switch (targetPrimaryIdentifier) {
                            case "Group":
                                var elementObjects = this.types[targetPrimaryIdentifier][targetSequence[1].trim()].igtElements;
                                for (var n in elementObjects) elementObjects[n][propertyName] = (parameters[0] == "true");
                                break;
                            default:
                                var igtElement = this.types[targetPrimaryIdentifier][targetSequence[1].trim()];
                                igtElement[propertyName] = (parameters[0] == "true");
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    },
    buildIGTElementList: function (elementIdNames) {
        elementIdArray = ($.isArray(elementIdNames) ? elementIdNames : elementIdNames.split(","));
        var resultArray = [];
        for (var i = 0; i < elementIdArray.length; i++) {
            var elementSequence = elementIdArray[i].split(".");
            switch (elementSequence[0]) {
                case "Group":
                    $.merge(resultArray, this.types.Group[elementSequence[1].trim()].igtElements);
                    break;
                default:
                    resultArray.push(this.types[elementSequence[0].trim()][elementSequence[1].trim()])
                    break;
            }
        }
        return resultArray;
    },
    getValue: function (valueString) {
        var value = "";
        var valueSequence = valueString.split(".");
        switch (valueSequence[0].trim()) {
            case "Self":
                if (valueSequence.length < 2)
                    value = this.name;
                break;
            case "SelectedItem":
                if (valueSequence.length < 2)
                    value = this.getSelectedElement().name;
                break;
            case "SelectedItemGroup":
                if (valueSequence.length < 2)
                    value = this.getIGTDataFromItem(this.getSelectedElement().$group).name;
                break;


            default:
                break;
        };
        return value;
    }
};
document.igt.client.classes.Group.prototype = {
    addIGTElement: function (igtElement) {
        this.igtElements.push(igtElement);
        this.$elements.add(igtElement.$element);
        this.addAction(igtElement);
    },
    addAction: function (igtElement) {
        if (this.subtype == "Action") this.actions.push("#" + ($.isNumeric(igtElement.executionSequence) ? "000000".substr(0, 6 - igtElement.executionSequence.trim().length) : "000000") + ";" + igtElement.actions);
    },
    getActionsCombined: function () {
        this.igtElements
        if (this.subtype == "Action") return this.actions.sort().join(";");
    },
    // Actions:
    runMethod: function (methodName) {
        for (var i = 0; i < this.igtElements.length; i++) {
            this.igtElements[i][methodName]();
        }
    },
    reset: function () {
        for (var i = 0; i < this.igtElements.length; i++) {
            this.igtElements[i].reset();
        }
    }
};
