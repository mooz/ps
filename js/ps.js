function Ps(doc, opts) {
    opts = opts || {};

    this.doc = doc;
    this.scrollTime = (typeof opts.scrollTime === "number") ?
        opts.scrollTime : 300;
}

Ps.prototype = {
    effects: {},
    hooks: {
        beforeDisplayPage : [],
        afterTransitPage  : []
    },

    start: function () {
        var self = this;

        $(window).keypress(function (ev) { self.handleKeyPress(ev); });

        this.pages = $(".ps-page");
        this.nthPage(0);
        $.scrollTo(this.pages[0], 0);
    },

    handleKeyPress: function (ev) {
        switch (String.fromCharCode(ev.charCode)) {
        case 'j':
            this.nextPage();
            break;
        case 'k':
            this.previousPage();
            break;
        case 'g':
            this.nthPage(0);
            break;
        case 'G':
            this.nthPage(this.pages.length - 1);
            break;
        }
    },

    // ============================================================ //
    // Transit Pages
    // ============================================================ //

    nextPage: function () {
        if (this.actNumber < this.acts.length) {
            this.doAct(this.acts[this.actNumber++], "perform");
            return;
        }

        if (!this.isValidPageIndex(this.pageNumber + 1))
            return;

        // after を呼ぶ
        this.doActs(this.acts, "after");

        this.nthPage(++this.pageNumber);
    },

    previousPage: function () {
        if (!this.isValidPageIndex(this.pageNumber - 1))
            return;

        // after を呼ぶ
        this.doActs(this.acts, "after");

        this.nthPage(--this.pageNumber);
    },

    nthPage: function (n) {
        var self = this;

        this.pageNumber = n;
        this.actNumber  = 0;

        this.acts = this.getActs(this.pages[n]);
        this.doActs(this.acts, "before");

        var nextPage = this.pages[n];

        self.callHook("beforeDisplayPage", nextPage);

        if (this.beforeAt) {
            var beforePage = this.beforeAt;
            $.scrollTo(nextPage, this.scrollTime, {
                onAfter: function () {
                    if (beforePage !== nextPage)
                        self.callHook("afterTransitPage", beforePage);
                }
            });
        }

        this.beforeAt = nextPage;
    },

    isValidPageIndex: function (i) {
        return (i >= 0 && i < this.pages.length);
    },

    // ============================================================ //
    // Act / Effects
    // ============================================================ //

    getActs: function (page) {
        var acts = [];

        $(page).find("[data-ps-act]").each(function () {
            var target = this;

            $(target).attr("data-ps-act").split(",").forEach(function (effect) {
                acts.push({
                    effect : effect,
                    target : target
                });
            });
        });

        return acts;
    },

    doActs: function (acts, timing) {
        var self = this;
        acts.forEach(function (act) {
            self.doAct(act, timing);
        });
    },

    doAct: function (act, timing) {
        var effect = this.effects[act.effect];

        if (!effect || typeof effect[timing] !== "function")
            return;

        effect[timing](act.target);
    },

    // ============================================================ //
    // Hooks
    // ============================================================ //

    addHook: function (name, func) {
        if (!(this.hooks[name] instanceof Array))
            return;

        this.hooks[name].push(func);
    },

    callHook: function (name, arg) {
        if (!(this.hooks[name] instanceof Array))
            return;

        this.hooks[name].forEach(function (f) {
            if (typeof f === "function")
                f(arg);
        });
    }
};
