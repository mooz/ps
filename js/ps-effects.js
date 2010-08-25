(function () {
    var effects = Ps.prototype.effects;

    effects.enlarge = {
        before: function (elem) {
            $(elem).css("-webkit-transform-origin", "0 50%");
        },
        perform: function (elem) {
            $(elem).css("-webkit-transform", "scale(1.2)");
        },
        after: function (elem) {
            $(elem).css("-webkit-transform-origin", "");
            $(elem).css("-webkit-transform", "");
        }
    };

    effects.show = {
        before: function (elem) {
            $(elem).hide();
        },
        perform: function (elem) {
            $(elem).show();
        },
        after: function (elem) {
            $(elem).hide();
        }
    };

    effects.textDelete = {
        perform: function (elem) {
            $(elem).css("text-decoration", "line-through");
        },
        after: function (elem) {
            $(elem).css("text-decoration", "");
        }
    };

    effects.textBlink = {
        perform: function (elem) {
            $(elem).css("text-decoration", "blink");
        },
        after: function (elem) {
            $(elem).css("text-decoration", "");
        }
    };

    effects.cuteColor = function() {
        var randomColors = function() {
            var get = function() {
                return Math.floor(Math.random() * 2) * 255;
            };
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

    effects.monotone = (function() {
        var count = 0;

        var colorFor = function(i) {
            var f0 = i % 2 ? '0' : 'f';
            return '#'+ f0 + f0 + f0;
        };

        return function() {
            document.body.style.background = colorFor(count);
            document.body.style.color = colorFor(count+1);
            count++;
        };
    })();
})();
