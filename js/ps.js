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

        this.pages         = $(".ps-page");
        this.youtubeVideos = $("[data-ps-video-youtube]");

        if (this.youtubeVideos) {
            this.setupYoutubeVideos(this.youtubeVideos);
        }

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
        case 'u':
            if (this.pageToUndo)
                this.nthPage(this.getPageNumber(this.pageToUndo));
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

        this.nthPage(++this.pageNumber);
    },

    previousPage: function () {
        if (!this.isValidPageIndex(this.pageNumber - 1))
            return;

        this.nthPage(--this.pageNumber);
    },

    nthPage: function (n) {
        var self = this;

        this.pageNumber = n;
        this.actNumber  = 0;

        var oldActs = this.acts;

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

                    if (oldActs)
                        self.doActs(oldActs, "after");
                }
            });
        }

        this.pageToUndo = this.beforeAt;
        this.beforeAt   = nextPage;
    },

    getPageNumber: function (page) {
        for (var i = 0; i < this.pages.length; ++i) {
            if (page === this.pages[i])
                return i;
        }

        return -1;
    },

    gotoPageByName: function (name) {
        for (var i = 0; i < this.pages.length; ++i) {
            var page = this.pages[i];

            if ($(page).attr("data-ps-page-name") === name) {
                this.nthPage(i);
                return false;
            }
        }
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
    },

    // ============================================================ //
    // Videos
    // ============================================================ //

    setupYoutubeVideos: function (videos) {
        var infos = [];

        $(videos).each(function () {
            var info = {};

            $(this).attr("data-ps-video-youtube").split(",").forEach(function (param) {
                param = param.split("=");
                info[param[0]] = param[1];
            });

            infos.push(info);

            var container   = document.createElement("div");
            var containerID = "ps-embed-youtube-video-" + new Date();
            container.setAttribute("id", containerID);
            this.appendChild(container);

            var params = { allowScriptAccess: "always" };

            swfobject.embedSWF("http://www.youtube.com/v/" + info.id + "?enablejsapi=1&playerapiid=ytplayer",
                               containerID,
                               info.width || "480", info.height || "360",
                               "8", null, null, params);
        });
    }
};
