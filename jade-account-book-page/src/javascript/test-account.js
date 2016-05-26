(function ($) {
	accApp.testAccount = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.testAccount.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);

		this.accTypeUtil = new accApp.accTypeUtil(cfg);

		this.cfg = this.super.cfg || {};
		this.ui = this.super.ui || {};
		this.data = this.super.data || {};
		this.initCfg();
		this.initUI();
		this.initData();

		console.log(i18n.get("test"));
	};

	proto.initCfg = function () {
		var self = this;
		this.cfg.accTypeTreeSetting = {
			callback: {
				onClick: function (event, treeId, treeNode) { 
					self.clickAccType(event, treeId, treeNode); 
				}
			}
		};
	};

	proto.initUI = function () {
		var self = this;

		$("title").html(i18n.get("acctype.manage.title"));

		this.ui.username = $("#username");
		this.ui.password = $("#password");

		this.ui.accTypeTree = $("#accTypeTree");
		this.ui.accTypeTreeObj = {};

	};

	proto.initData = function () {
		var self = this;
		this.data.getUsername = function () { return self.ui.username.val(); };
		this.data.getPassword = function () { return self.ui.password.val(); };
		this.data.setUsername = function (value) { self.ui.username.val(value); };
		this.data.setPassword = function (value) { self.ui.password.val(value); };
	};

	proto.render = function () {
		this.super.render();

		this.loadAccTypeTree();
	};


	proto.loadAccTypeTree = function () {
		var self = this;
		var auth = jadeUtils.web.webAuthBasic(
				self.data.getUsername(), self.data.getPassword());
		self.accTypeUtil.loadAllAccType(auth, function(data, status, xhr) {
			if ('success' == data.status) {
				console.debug(data);
				self.ui.accTypeTreeObj = $.fn.zTree.init(
					self.ui.accTypeTree, self.cfg.accTypeTreeSetting, data.types);
			} else {
				console.error("加载测试数据失败");
			}
		},
		function(xhr, errorType, error) {
			console.error("加载测试数据失败");
			console.debug(xhr);
			console.debug(errorType);
			console.debug(error);
		},
		function(xhr, status) { });
	};

	proto.clickAccType = function (event, treeId, treeNode) {
		if ("accType" == treeNode.type) {
			console.log(treeNode.code + ", " + treeNode.name);
		}
	};

})(jQuery);



