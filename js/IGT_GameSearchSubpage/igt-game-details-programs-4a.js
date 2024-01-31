/// <reference path="libs/jquery-1.10.1.min.js" />
/// <reference path="igt-client.js" />
/// <reference path="igt-game-search-4a.js" />
// Initialize:
// Immediate:
// After load:
$(function () {
    // Globals:
    document.igt.gs.globals.$programsTabGameNameSpans = document.igt.types.Container.ProgramsData.$element.find("span[data-igt-name='GameName']");
    // Event handlers:
    /* Accordians Commented on 07/31/2019*/
    //document.igt.types.Button.ProgramsAccordionTab.$element.on("click", function () { document.igt.types.Button.ProgramsAccordionTab.slideToggle(); return false; });
    //document.igt.types.Button.KitsAccordionTab.$element.on("click", function () { document.igt.types.Button.KitsAccordionTab.slideToggle(); return false; });

    document.igt.types.Container.ProgramsAccordion.$element.css("display", "");
    document.igt.types.Container.KitsAccordion.$element.css("display", "");
});
// Methods:
document.igt.gs.methods.setProgramTabNoResultsHref = function (programsOrKits) {
    ///document.igt.types.Button[programsOrKits + "EmailLinkAnchor"].$element.attr("href", "mailto:DG.StudioPA.Contact@IGT.com ; Brent.Wuest@IGT.com; Richard.Vial@IGT.com?subject=IGT.com - " + programsOrKits + " information needed&amp;body=Please send " + programsOrKits + " for " + document.igt.gs.globals.currentGameItemName);
}
// Run Tab:
document.igt.gs.methods.runProgramsTab = function () {
    // Login:
    ///if (document.igt.gs.globals.isLoggedIn) document.igt.types.Container.ProgramsData.show();
    ///else document.igt.types.Container.ProgramsLogin.show();
    // Call Update Panel (get GTech Par Sheets).
    document.igt.types.Button.Programs.$element.click();
    // Initialize:
    document.igt.types.Container.ProgramsProgressBar.show();
    document.igt.types.Container.ProgramsResults.clear();
    document.igt.types.Container.KitsResults.clear();
    // Three lines below commented 9/14/2023:
    ///document.igt.gs.globals.$programsTabGameNameSpans.html(document.igt.gs.globals.currentGameItemName);
    ///document.igt.gs.methods.setProgramTabNoResultsHref("Programs");
    ///document.igt.gs.methods.setProgramTabNoResultsHref("Kits");
    /* Accordians Commented on 07/31/2019*/
    //document.igt.types.Container.NoProgramsResults.show();
    //document.igt.types.Container.NoKitsResults.show();

    // Call for results:
    $.ajax({
        type: "POST",
        timeout: 1000000,
        url: "/igtsitecore/layouts/webmethods.aspx/getprogramtabdata",
        data: "{GamePageGuid:'" + document.igt.gs.globals.GameLibraryGamePageGuid + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            document.igt.types.Container.RawProgramsData.$element.html(response.d);
            document.igt.types.Container.RawProgramsData.$element.find("table:first").appendTo(document.igt.types.Container.ProgramsResults.$element);
            document.igt.types.Container.RawProgramsData.$element.find("table:last").appendTo(document.igt.types.Container.KitsResults.$element);
            if (document.igt.types.Container.ProgramsResults.$element.find(".footable.table.table > tbody:last > tr").length > 0) {
                document.igt.types.Container.NoProgramsResults.$element.css("display", "none");
            } else {
                document.igt.types.Container.ProgramsResults.$element.css("display", "none");
                document.igt.types.Container.NoProgramsResults.$element.css("display", "");
            }
            if (document.igt.types.Container.KitsResults.$element.find(".footable.table.table > tbody:last > tr").length > 0) {
                document.igt.types.Container.NoKitsResults.$element.css("display", "none");

            } else {
                document.igt.types.Container.NoKitsResults.$element.css("display", "");
            }
            document.igt.types.Container.ProgramsProgressBar.fadeIn();

        },
        failure: function (response) {
            /// document.igt.types.Container.ProgramsProgressBar.$element.fadeOut();
            ///alert(response); Commented 4/20/2018
            // Added 9/14/2023:
            $("#NoKitsResults").css("display", "");
        },
        error: function (jqXHR, textStatus, errorThrown) {
            var errMessage = "An error occured serving your request. Please try again.";
            ///if (jqXHR)
            ///    errMessage = $.parseJSON(jqXHR.responseText).Message;
            ///document.igt.types.Container.ProgramsProgressBar.$element.fadeOut();
            ///alert(errMessage); Commented 4/20/2018
            // Added 9/14/2023:
            $("#NoKitsResults").css("display", "");
        }
    });
}
