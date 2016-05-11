(function ($) {
	accApp.testAccount = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.testAccount.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);
		this.cfg = this.super.cfg || {};
		this.ui = this.super.ui || {};
		this.data = this.super.data || {};
		this.initUI(cfg);
		this.initData(cfg);

		console.log(this.data.i18n.get("test"));
	};

	proto.initUI = function () {
		var self = this;
		this.super.initUI();
		this.ui = this.super.ui || {};
		this.ui.username = $("#username");
		this.ui.password = $("#password");

		this.ui.submit = $("#submit");
		this.ui.submit.unbind("clikd").bind("click", function () {
			self.testType();
		});
	};

	proto.initData = function () {
		var self = this;
		this.super.initData();
		this.data = this.super.data || {};
		this.data.getUsername = function () { return self.ui.username.val(); };
		this.data.getPassword = function () { return self.ui.password.val(); };
		this.data.setUsername = function (value) { this.ui.username.val(value); };
		this.data.setPassword = function (value) { this.ui.password.val(value); };
	};

	proto.render = function () {
		this.super.render();
	};


	proto.testType = function () {
		var self = this;
		console.log(self.data.getUsername());
		console.log(self.data.getPassword());
		var auth = jadeUtils.web.webAuthBasic(self.data.getUsername(), self.data.getPassword());
		$.ajax({
			url: encodeURI(this.cfg.apiRoot + "/api/accountbook/allAccountType"), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { },
			timeout: net.jadedungeon.ajaxTimeout,
			success: function(data, status, xhr) {
				if ('success' == data.status) {
					console.debug(data);
					var zTreeObj;
					var setting = { callback: { onClick: this.clickAccType }	};
					zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, data.types);
				} else {
					console.error("加载测试数据失败");
				}
			},
			error: function(xhr, errorType, error) {
				console.error("加载测试数据失败");
				console.debug(xhr);
				console.debug(errorType);
				console.debug(error);
			},
			complete: function(xhr, status) { }
		});
	};

	proto.clickAccType = function (event, treeId, treeNode) {
		if ("accType" == treeNode.type) {
			console.log(treeNode.code + ", " + treeNode.name);
		}
	};

})(jQuery);



