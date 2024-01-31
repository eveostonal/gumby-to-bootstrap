    function BindControlEvents() {
        var magicZoom = "/igtsitecore/js/extensions/magictools/magiczoomplus.js";
        var magicScroll = "/IGTSitecore/js/extensions/magictools/magicscroll.js";
        var magic360 = "/IGTSitecore/js/extensions/magictools/magic360.js";
        var bootstrap = "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js";
        $.getScript(magicZoom);
        $.getScript(magicScroll);
        $.getScript(magic360);
        $.getScript(bootstrap);
    }
   
    var prm = Sys.WebForms.PageRequestManager.getInstance();

    prm.add_endRequest(function () {
        BindControlEvents();
    });
