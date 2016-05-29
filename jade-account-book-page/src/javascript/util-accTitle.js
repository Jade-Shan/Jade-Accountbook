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
		this.cfg.allAccTypeUrl = this.cfg.apiRoot + "/api/accountbook/accType/all";
		this.cfg.listUserAccTitleUrl = this.cfg.apiRoot + "/api/accountbook/accTitle/list/{0}/{1}";
		this.cfg.updateUserAccTitleUrl = this.cfg.apiRoot + "/api/accountbook/accTitle/update/{0}/{1}";
		this.cfg.deleteUserAccTitleUrl = this.cfg.apiRoot + "/api/accountbook/accTitle/delete/{0}/{1}";
	};

	/**
	 * 读取指定用户在指定分类的下会计科目
	 */
	proto.listUserAccTitle = function (auth, username, accType, 
		succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({ url: encodeURI(self.cfg.listUserAccTitleUrl.format(username, accType)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { }, timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

	/**
	 * 删除用户的会计科目
	 */
	proto.deleteUserAccTitle = function (auth, username, accTitle, 
		succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({ url: encodeURI(self.cfg.deleteUserAccTitleUrl.format(username, accTitle)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { }, timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

	/**
	 * 读取所有的会计科目分类
	 *
	 */
	proto.loadAllAccType = function (auth, succCallback, errCallback, compCallback) {
		var self = this;
		$.ajax({ url: encodeURI(self.cfg.allAccTypeUrl), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { }, timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

})(jQuery);

