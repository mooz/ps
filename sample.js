$(function () {
    var ps = new Ps(document);
    ps.start();

    ps.addHook("afterTransitPage", function (page) {
        $(document.body).css("background-color", "blue");

        $(page).css("background-color", "red");
    });
});
