$(function () {
    var ps = new Ps(document);
    ps.start();
    ps.addHook("beforeTransitPage", ps.effects.cuteColor);
});
