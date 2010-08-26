$(function () {
    var ps = new Ps(document);
    ps.start();

    ps.addHook("beforeDisplayPage", function (page) {
        $(page).css("opacity", 1.0);
    });

    ps.addHook("afterTransitPage", function (page) {
        $(page).css("opacity", 0.3);
    });

    window.ps = ps;
});
