(function ($) {
	accApp.userUtil = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.userUtil.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);
		this.cfg = this.super.cfg || {};
		this.initCfg();
	};

	proto.initCfg = function () {
		var self = this;
		this.cfg.userCfgUrl = this.cfg.apiRoot + "/api/accountbook/user/{0}";
	};

	/**
	 * 新建用户的会计科目
	 */
	proto.getUserCfg = function (auth, username, succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({
			url: encodeURI(self.cfg.userCfgUrl.format(username)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: {}, timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

})(jQuery);
