(function () {
    var effects = Ps.prototype.effects;

    effects.enlarge = {
        perform: function (elem) {
            // $(elem).css("-webkit-transform", "scale(2.0)");
            $(elem).css("color", "red");
        },
        after: function (elem) {
            $(elem).css("color", "");
            // $(elem).css("-webkit-transform", "");
        }
    };

    effects.show = {
        before: function (elem) {
            $(elem).hide();
        },
        perform: function (elem) {
            $(elem).show();
        }
    };

    effects.blink = {
    };
})();
