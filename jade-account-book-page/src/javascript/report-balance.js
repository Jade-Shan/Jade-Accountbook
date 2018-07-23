(function ($) {
	accApp.report.BalanceSheet = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.report.BalanceSheet.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);

		this.cfg = this.super.cfg || {};
		this.ui = this.super.ui || {};
		this.data = this.super.data || {};
		this.initCfg();
		this.initUI();
		this.initData();

		// console.log(i18n.get("test"));
	};

	proto.initCfg = function () {
		var self = this;
		this.ui.propRptDiv = $("#propRptDiv");
		this.ui.dbtRptDiv  = $("#dbtRptDiv");
		this.ui.onrRptDiv  = $("#onrRptDiv");
	};

	proto.initUI = function () {
		var self = this;
	};

	proto.initData = function () {
		var self = this;
		this.data.getUsername = function () { return self.ui.username.val(); };
		this.data.getPassword = function () { return self.ui.password.val(); };
		this.data.setUsername = function (value) { self.ui.username.val(value); };
		this.data.setPassword = function (value) { self.ui.password.val(value); };
	};

	/**
	 * 当浏览器大小变化时调用的回调函数
	 */
	proto.onResize = function (self) {
		self.super.onResize(self.super);
		var hAll = self.super.calcuBodyHeight();
		var h1 = self.ui.propRptDiv.height();
		var h2 = self.ui.dbtRptDiv.height();
		var h3 = self.ui.onrRptDiv.height();
		if (h1 > (h2 + h3)) {
			if (hAll > h1) {
				h1 = hAll; 
			}
			h3 = h1 - h2 - 20;
		} else {
			if (hAll > (h2 + h3)) {
				h1 = hAll; 
				h3 = hAll - h2 - 20; 
			}
		}
		h1 = 'min-height: ' + h1 + 'px; transition: 1s;';
		h2 = 'min-height: ' + h2 + 'px; transition: 1s;';
		h3 = 'min-height: ' + h3 + 'px; transition: 1s;';
		self.ui.propRptDiv.attr('style', h1);
		self.ui.dbtRptDiv.attr('style', h2);
		self.ui.onrRptDiv.attr('style', h3);
	};

	proto.render = function () {
		var self = this;
		this.super.render();
		self.onResize(self);
		document.body.onresize = function () {
			self.onResize(self);
		};
	};

})(jQuery);
