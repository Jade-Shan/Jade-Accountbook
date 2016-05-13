(function ($) {
	accApp.testAccount = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.testAccount.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);

		this.cfg = this.super.cfg || {};
		this.ui = this.super.ui || {};
		this.data = this.super.data || {};
		this.initCfg();
		this.initUI();
		this.initData();

		console.log(this.data.i18n.get("test"));
	};

	proto.initCfg = function () {
		var self = this;
		this.cfg.accTypeUrl = this.cfg.apiRoot + "/api/accountbook/allAccountType";
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

		this.ui.username = $("#username");
		this.ui.password = $("#password");
		this.ui.submit = $("#submit");
		// 要套一层函数，不然`this`指向是触发的按钮而不是这个对象
		this.ui.submit.unbind("click").bind("click", 
				function () { self.loadAccTypeTree(); });

		this.ui.accTypeTree = $("#accTypeTree");
		this.ui.accTypeTreeObj = {};

		this.ui.testRecTpl = $.templates("#testRecTpl");
		this.ui.testRec = $("#testRec");

		this.ui.testRec2Tpl = $.templates("#testRec2Tpl");
	};

	proto.initData = function () {
		var self = this;
		this.data.getUsername = function () { return self.ui.username.val(); };
		this.data.getPassword = function () { return self.ui.password.val(); };
		this.data.setUsername = function (value) { self.ui.username.val(value); };
		this.data.setPassword = function (value) { self.ui.password.val(value); };

		this.data.testRec = [{ "name": "Robert", "nickname": "Bob", "showNickname": true },
			{ "name": "Susan", "nickname": "Sue", "showNickname": false }];
		this.data.testRec2 = [{ "name": "Robert", "nickname": "Bob", "showNickname": true },
			{ "name": "Susan", "nickname": "Sue", "showNickname": false }];
	};

	proto.render = function () {
		this.super.render();
		this.renderRec();
	};

	proto.renderRec = function () {
		this.ui.testRec.html(this.ui.testRecTpl.render(this.data.testRec));
		this.ui.testRec2Tpl.link("#testRec2", this.data.testRec2);
	};

	proto.loadAccTypeTree = function () {
		var self = this;
		var auth = jadeUtils.web.webAuthBasic(
				self.data.getUsername(), self.data.getPassword());
		$.ajax({
			url: encodeURI(
						 self.cfg.accTypeUrl
						 ), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { },
			timeout: net.jadedungeon.ajaxTimeout,
			success: function(data, status, xhr) {
				if ('success' == data.status) {
					console.debug(data);
					self.ui.accTypeTreeObj = $.fn.zTree.init(
						self.ui.accTypeTree, self.cfg.accTypeTreeSetting, data.types);
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



