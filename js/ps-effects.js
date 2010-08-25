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

    effects.cuteColor = function() {
        var randomColors = function() {
            var get = function() {
                return Math.floor(Math.random() * 2) * 127;
            }
            var r = get();
            var g = get();
            var b = get();
            return ["rgb(" + [r, g, b].join(", ") + ")",
                    "rgb(" + [255-r, 255-g, 255-b].join(", ") + ")"
                   ];
        };

        var pair = randomColors();
        document.body.style.background = pair[0];
        document.body.style.color = pair[1];
    };
})();
