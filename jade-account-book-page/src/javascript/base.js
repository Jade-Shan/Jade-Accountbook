var appCfg = {
	ajaxTimeout: 8000, i18n: i18nData, 
//	appRoot: "http://localhost:8181/webapp"
	webRoot: "http://localhost:8181",
	apiRoot: "http://localhost:8080/accountbook"
};

var accApp = accApp || {};

(function ($) {
	accApp = function (cfg) { init(cfg); return this; };
	var self = accApp.prototype;

	var init = function (cfg) {
		self.cfg = cfg || {};
		self.cfg.ajaxTimeout = cfg.ajaxTimeout || 5000;
		self.cfg.i18n = cfg.i18n || {};

		self.ui = {};
		self.data = {};
		self.data.i18n = new net.jadedungeon.utils.i18n(self.cfg.i18n);
	};

	self.render = function () {
	};

})(jQuery);

