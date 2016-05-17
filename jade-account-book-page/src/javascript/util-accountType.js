(function ($) {
	accApp.accTypeUtil= function (cfg) { this.init(cfg); return this; };
	var proto = accApp.accTypeUtil.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);
		this.cfg = this.super.cfg || {};
		this.initCfg();
	};

	proto.initCfg = function () {
		var self = this;
		this.cfg.allAccTypeUrl = this.cfg.apiRoot + "/api/accountbook/allAccountType";
	};

	proto.loadAllAccType = function (auth, succCallback, errCallback, compCallback) {
		var self = this;
		$.ajax({ url: encodeURI(self.cfg.allAccTypeUrl), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { }, timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

})(jQuery);



