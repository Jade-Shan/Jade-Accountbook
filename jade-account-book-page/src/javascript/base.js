var appCfg = {
	ajaxTimeout: 8000, i18n: i18nData, 
	webRoot: "http://localhost:8181",
	apiRoot: "http://localhost:8080/accountbook"
};

var accApp = accApp || {};

(function ($) {
	accApp = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.prototype;

	proto.init = function (cfg) {
		this.cfg = cfg || {};
		this.ui = {};
		this.data = {};
		this.initCfg();
		this.initUI();
		this.initData();
	};

	proto.initCfg = function () {
		this.cfg.ajaxTimeout = this.cfg.ajaxTimeout || 5000;
		this.data.i18n = new net.jadedungeon.utils.i18n(this.cfg.i18n || {});
	};


	proto.initUI = function () { };

	proto.initData = function () { };

	proto.render = function () { };

})(jQuery);

