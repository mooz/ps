function Ps(doc) {
    this.doc = doc;
}

Ps.prototype = {
    effects: {},
    hooks: {
        beforeTransitPage : [],
        afterTransitPage  : []
    },

    start: function () {
        var self = this;

        $(window).keypress(function (ev) { self.handleKeyPress(ev); });

        this.pages = $(".ps-page");
        this.nthPage(0);
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
        var self = this;
        $(this.acts).each(function () {
            self.doAct(this, "after");
        });

        this.nthPage(++this.pageNumber);
    },

    previousPage: function () {
        if (!this.isValidPageIndex(this.pageNumber - 1))
            return;

        // after を呼ぶ
        var self = this;
        $(this.acts).each(function () {
            self.doAct(this, "after");
        });

        this.nthPage(--this.pageNumber);
    },

    nthPage: function (n) {
        var self = this;

        this.pageNumber = n;
        this.actNumber  = 0;

        this.acts = $(this.pages[n]).find("[data-ps-act]");
        this.arrangeActs();

        var page = this.pages[n];

        self.callHook("beforeTransitPage", page);

        $.scrollTo(this.pages[n], 300, {
            onAfter: function () {
                self.callHook("afterTransitPage", page);
            }
        });
    },

    hidePages: function () {
        this.pages.each(function (e) { $(this).hide(); });
    },

    isValidPageIndex: function (i) {
        return (i >= 0 && i < this.pages.length);
    },

    // ============================================================ //
    // Act / Effects
    // ============================================================ //

    getEffect: function (act) {
        var effect = this.effects[$(act).attr("data-ps-act")];
        return effect;
    },

    doAct: function (act, name) {
        var effect = this.getEffect(act);

        if (!effect || typeof effect[name] !== "function")
            return;

        effect[name](act);
    },

    arrangeActs: function () {
        var self = this;

        $(this.acts).each(function () {
            self.doAct(this, "before");
        });
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
