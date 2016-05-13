var i18nData = {
	"test":"i18n信息初始化成功",
	"balanceSheet.table.head.group":"组",
	"balanceSheet.table.head.account":"科目",
	"balanceSheet.table.head.item":"项目"
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

		this.barinit();
	};

	proto.initCfg = function () {
		this.cfg.ajaxTimeout = this.cfg.ajaxTimeout || 5000;
		this.cfg.testAuthUrl = this.cfg.apiRoot + "/api/accountbook/testAuth";
		this.data.i18n = new net.jadedungeon.utils.i18n(this.cfg.i18n || {});
	};


	proto.initUI = function () {
	};

	proto.initData = function () {
		var self = this;
	};

	proto.render = function () { };

	proto.checkLogin = function (username, password, successCallback, 
			failCallback, errorCallback) 
	{
		var self = this;
		if ('' !== username && '' !== password) {
			var auth = jadeUtils.web.webAuthBasic(username, password);
			$.ajax({ type: 'POST', dataType: 'json', timeout: self.cfg.ajaxTimeout,
				url: encodeURI(self.cfg.testAuthUrl), headers: {Authorization: auth},
				data: { },
				success: function(data, status, xhr) {
					console.debug(status);
					if ('success' == data.status && 'success' == data.auth) {
						successCallback(data);
					} else {
						failCallback(data);
					}
				},
				error: function(xhr, errorType, error) { errorCallback(error); },
				complete: function(xhr, status) {}
			});
		} else {
			console.debug("no username or password");
		}
	};

	proto.login = function (username, password) {
		var self = this;
		self.checkLogin(username, password, 
				function(data) { /* 登录成功的操作 */
					jadeUtils.web.cookieOperator('username', username);
					jadeUtils.web.cookieOperator('password', password);
					self.ui.divUserLogin.removeClass("has-error");
					self.ui.divUserLogin.hide();
					self.ui.lbUsername.html(username);
					self.ui.userinfo.show();
					self.ui.accOverview.show();
				}, function (data) { /* 登录失败时的操作 */
					console.debug(data.reason);
					self.ui.divUserLogin.addClass("has-error");
				}, function (data) { /* 网络错误时的操作 */
					alert("Ajax Error");
				});
	};

	proto.barinit = function () {
		var self = this;

		self.ui.username = $("#username");
		self.ui.password = $("#password");
		self.ui.userinfo = $('#div-userinfo');
		self.ui.lbUsername = $('#lb-username');
		self.ui.accOverview = $('#mu-accOverview');
		self.ui.divUserLogin = $('#div-userlogin');

		self.ui.btnLogin = $('#btn-login');
		self.ui.btnLogin.unbind("click").bind("click", function(event) {
			self.login(self.data.getUsername(), self.data.getPassword());
		});
		self.ui.btnLogout = $('#btn-logout')
		self.ui.btnLogout.unbind("click").bind("click", function(event) {
			self.ui.accOverview.hide();
			self.ui.userinfo.hide();
			self.ui.divUserLogin.show();
		});

		self.data.getUsername = function () { return self.ui.username.val(); };
		self.data.getPassword = function () { return self.ui.password.val(); };
		self.data.setUsername = function (value) { self.ui.username.val(value); };
		self.data.setPassword = function (value) { self.ui.password.val(value); };

		self.ui.userinfo.hide();
		self.ui.accOverview.hide();

		self.data.setUsername(jadeUtils.web.cookieOperator('username'));
		self.data.setPassword(jadeUtils.web.cookieOperator('password'));
		self.login(self.data.getUsername(), self.data.getPassword());
	};

})(jQuery);


(function ($) {
	accApp.reportTest = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.reportTest.prototype;
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
		this.cfg.testReporthUrl = this.cfg.webRoot + "/data/test-report.json";
	};

	proto.initUI = function (cfg) {
		var self = this;

		this.ui.username = $("#username");
		this.ui.password = $("#password");

		this.ui.mainReport= $("#mainReport");

		this.ui.submit = $("#submit");
		this.ui.submit.unbind("clikd").bind("click", 
				function () { self.testAuth(); });

	};

	proto.initData = function (cfg) {
		var self = this;
	};

	proto.render = function () {
		var self = this;
		this.super.render();
		this.loadTestData(function (data) { 
			self.loadBalanceSheet(self.ui.mainReport, data); 
		});
	};

	proto.loadBalanceSheet = function (report, reportData) {
		var text = '\n<tr><th colspan="2">' + 
			this.data.i18n.get("balanceSheet.table.head.group") + '</th><th colspan="2">' + 
			this.data.i18n.get("balanceSheet.table.head.account") + '</th><th colspan="2">' + 
			this.data.i18n.get("balanceSheet.table.head.item") + '</th></tr>\n';

		if (reportData.length > 0) {
			text = text + '<tr>';
			for (var i = 0; i < reportData.length; i++) {
				text = text + this.showRec(reportData[i], "subs");
			}
		}
		report.html(text);
	};


	proto.countLeafNode = function (node, subsName, count) {
		if (node && node[subsName] && 0 < node[subsName].length) {
			for (var i=0; i < node[subsName].length; i++) {
				count = this.countLeafNode(node[subsName][i], subsName, count);
			}
			return count;
		} else {
			return count + 1;
		}
	};

	proto.showRec = function (node, subsName) {
		var size = this.countLeafNode(node, "subs", 0);
		var amount = parseFloat(node.amount);
		var text = '<td rowspan="' + size + '">' + node.code + ' - ' + node.name +
			'</td><td rowspan="' + size + '">￥ ' + 
			jadeUtils.string.formatNumber(amount, 2) + '</td>';
		if (node && node[subsName] && 0 < node[subsName].length) {
			for (var i = 0; i < node[subsName].length; i++) {
				text = text + this.showRec(node[subsName][i], subsName);
			}
		} else {
			text = text + "</tr>\n";
		}
		// console.debug(text);
		return text;
	};

	proto.loadTestData = function (callback) {
		var self = this;
		$.ajax({ 
			url: encodeURI(self.cfg.testReporthUrl), 
			type: 'GET', dataType: 'json', data: { },
			timeout: net.jadedungeon.ajaxTimeout,
			success: function(data, status, xhr) {
				if ('success' == data.status) {
					callback(data.recs);
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

	proto.testAuth = function () {
		var self = this;
		var auth = jadeUtils.web.webAuthBasic(
				self.data.getUsername(), self.data.getPassword());
		$.ajax({
			url: encodeURI(self.cfg.testAuthUrl), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { },
			timeout: net.jadedungeon.ajaxTimeout,
			success: function(data, status, xhr) {
				if ('success' == data.status) {
					console.debug(data.auth);
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

})(jQuery);



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



