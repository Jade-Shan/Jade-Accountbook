(function ($) {
	accApp.accTitleUtil= function (cfg) { this.init(cfg); return this; };
	var proto = accApp.accTitleUtil.prototype;
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
		this.cfg.createUserAccTitleUrl = this.cfg.apiRoot + "/api/accountbook/accTitle/create/{0}/{1}/{2}";
		this.cfg.updateUserAccTitleUrl = this.cfg.apiRoot + "/api/accountbook/accTitle/update/{0}/{1}/{2}";
		this.cfg.deleteUserAccTitleUrl = this.cfg.apiRoot + "/api/accountbook/accTitle/delete/{0}/{1}/{2}";
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
	 * 新建用户的会计科目
	 */
	proto.createUserAccTitle = function (auth, username, type, code, name, desc,
			assetId, succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({
			url: encodeURI(self.cfg.createUserAccTitleUrl.format(username, type, code)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: {type: type, code: code, name: name, desc: desc, assetId: assetId}, 
			timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

	/**
	 * 编辑用户的会计科目
	 */
	proto.updateUserAccTitle = function (auth, username, type, id, code, name, desc,
			assetId, succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({
			url: encodeURI(self.cfg.updateUserAccTitleUrl.format(username, type, code)), 
			type: 'POST', dataType: 'json', headers: {Authorization: auth},
			data: {type: type, id: id, code: code, name: name, desc: desc, assetId: assetId}, 
			timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

	/**
	 * 删除用户的会计科目
	 */
	proto.deleteUserAccTitle = function (auth, username, type, id, code,
			succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({
			url: encodeURI(self.cfg.deleteUserAccTitleUrl.format(username, type, code)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth }, data: {id: id}, 
			timeout: net.jadedungeon.ajaxTimeout,
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

