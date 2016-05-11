var i18nData = {
	"test":"i18n信息初始化成功",
	"balanceSheet.table.head.group":"组",
	"balanceSheet.table.head.account":"科目",
	"balanceSheet.table.head.item":"项目"
};

var appCfg = {
	ajaxTimeout: 8000, i18n: i18nData, 
	webRoot: "http://localhost:8181",
	apiRoot: "http://localhost:8080/accountbook"
};

var accApp = accApp || {};

(function ($) {
	accApp = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.prototype;

	proto.init = function (cfg) {
		this.cfg = cfg || {};
		this.ui = {};
		this.data = {};

		this.cfg.ajaxTimeout = cfg.ajaxTimeout || 5000;
		this.data.i18n = new net.jadedungeon.utils.i18n(cfg.i18n || {});
	};

	proto.initUI = function () { };

	proto.initData = function () { };

	proto.render = function () { };

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
		this.initUI(cfg);
		this.initData(cfg);

		console.log(this.data.i18n.get("test"));
	};

	proto.initUI = function (cfg) {
		this.super.initUI();
		this.ui = this.super.ui || {};
		this.ui.username = $("#username");
		this.ui.password = $("#password");
		this.ui.submit = $("#submit");
		this.ui.submit.bind("click", this.testAuth);
	};

	proto.initData = function (cfg) {
		this.super.initData();
		this.data = this.super.data || {};
		this.data.username = $("#username").val();
		this.data.password = $("#password").val();
	};

	proto.render = function (tableId) {
		this.super.render();
		this.loadTestData(function (data) { this.loadBalanceSheet(tableId, data); });
	};

	proto.loadBalanceSheet = function (tableId, reportData) {
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
		$("#" + tableId).html(text);
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
		$.ajax({ 
			url: encodeURI(this.cfg.webRoot+ "/data/test-report.json"), 
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
		var auth = jadeUtils.web.webAuthBasic(this.ui.username.val(), this.ui.password.val());
		$.ajax({
			url: encodeURI(this.cfg.apiRoot + "/api/accountbook/testAuth"), 
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
		this.data.getUsername = function () { 
			console.log(self.ui.username.val());
			return self.ui.username.val(); 
		};
		this.data.getPassword = function () { 
			console.log(self.ui.password.val());
			return self.ui.password.val(); 
		};
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



