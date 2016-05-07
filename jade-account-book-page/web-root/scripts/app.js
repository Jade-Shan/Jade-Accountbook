var i18nData = {
	"test":"i18n信息初始化成功",
	"balanceSheet.table.head.group":"组",
	"balanceSheet.table.head.account":"科目",
	"balanceSheet.table.head.item":"项目"
};

var appCfg = {
	ajaxTimeout: 8000, i18n: i18nData, 
//	appRoot: "http://localhost:8181/webapp"
	webRoot: "http://localhost:8181",
	apiRoot: "http://localhost:8080/accountbook"
};

var accApp = accApp || {};

(function ($) {
	accApp = function (cfg) { init(cfg); return this; };
	var self = accApp.prototype;

	var init = function (cfg) {
		self.cfg = cfg || {};
		self.cfg.ajaxTimeout = cfg.ajaxTimeout || 5000;
		self.cfg.i18n = cfg.i18n || {};

		self.ui = {};
		self.data = {};
		self.data.i18n = new net.jadedungeon.utils.i18n(self.cfg.i18n);
	};

	self.render = function () {
	};

})(jQuery);


(function ($) {
	accApp.reportTest = function (cfg) { init(cfg); return this; };
	var self = accApp.reportTest.prototype;

	var init = function (cfg) {
		self.super = new accApp(cfg);
		self.cfg = self.super.cfg || {};
		initUI(cfg);
		initData(cfg);

		console.log(self.data.i18n.get("test"));
	};

	var initUI = function (cfg) {
		self.ui = self.super.ui || {};
		self.ui.username = $("#username");
		self.ui.password = $("#password");
		self.ui.submit = $("#submit");
		self.ui.submit.bind("click", self.testAuth);
	};

	var initData = function (cfg) {
		self.data = self.super.data || {};
		self.data.username = $("#username").val();
		self.data.password = $("#password").val();
	};

	self.render = function (tableId) {
		self.super.render();
		self.loadTestData(function (data) { self.loadBalanceSheet(tableId, data); });
	};

	self.loadBalanceSheet = function (tableId, reportData) {
		var text = '\n<tr><th colspan="2">' + 
			self.data.i18n.get("balanceSheet.table.head.group") + '</th><th colspan="2">' + 
			self.data.i18n.get("balanceSheet.table.head.account") + '</th><th colspan="2">' + 
			self.data.i18n.get("balanceSheet.table.head.item") + '</th></tr>\n';

		if (reportData.length > 0) {
			text = text + '<tr>';
			for (var i = 0; i < reportData.length; i++) {
				text = text + self.showRec(reportData[i], "subs");
			}
		}
		$("#" + tableId).html(text);
	};


	self.countLeafNode = function (node, subsName, count) {
		if (node && node[subsName] && 0 < node[subsName].length) {
			for (var i=0; i < node[subsName].length; i++) {
				count = self.countLeafNode(node[subsName][i], subsName, count);
			}
			return count;
		} else {
			return count + 1;
		}
	};

	self.showRec = function (node, subsName) {
		var size = self.countLeafNode(node, "subs", 0);
		var amount = parseFloat(node.amount);
		var text = '<td rowspan="' + size + '">' + node.code + ' - ' + node.name +
			'</td><td rowspan="' + size + '">￥ ' + 
			jadeUtils.string.formatNumber(amount, 2) + '</td>';
		if (node && node[subsName] && 0 < node[subsName].length) {
			for (var i = 0; i < node[subsName].length; i++) {
				text = text + self.showRec(node[subsName][i], subsName);
			}
		} else {
			text = text + "</tr>\n";
		}
		// console.debug(text);
		return text;
	};

	self.loadTestData = function (callback) {
		$.ajax({ 
			url: encodeURI(self.cfg.webRoot+ "/data/test-report.json"), 
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

	self.testAuth = function () {
		var auth = jadeUtils.web.webAuthBasic(self.ui.username.val(), self.ui.password.val());
		$.ajax({
			url: encodeURI(self.cfg.apiRoot + "/api/accountbook/testAuth"), 
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
	accApp.testAccount = function (cfg) { init(cfg); return this; };
	var self = accApp.testAccount.prototype;

	var init = function (cfg) {
		self.super = new accApp(cfg);
		self.cfg = self.super.cfg || {};
		initUI(cfg);
		initData(cfg);

		console.log(self.data.i18n.get("test"));
	};

	var initUI = function (cfg) {
		self.ui = self.super.ui || {};
		self.ui.username = $("#username");
		self.ui.password = $("#password");
		self.ui.submit = $("#submit");
		self.ui.submit.bind("click", self.testType);
	};

	var initData = function (cfg) {
		self.data = self.super.data || {};
		self.data.username = $("#username").val();
		self.data.password = $("#password").val();
	};

	self.render = function (tableId) {
		self.super.render();
	};


	self.testType = function () {
		var auth = jadeUtils.web.webAuthBasic(self.ui.username.val(), self.ui.password.val());
		$.ajax({
			url: encodeURI(self.cfg.apiRoot + "/api/accountbook/allAccountType"), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: { },
			timeout: net.jadedungeon.ajaxTimeout,
			success: function(data, status, xhr) {
				if ('success' == data.status) {
					console.debug(data);
					var zTreeObj;
					var setting = { callback: { onClick: self.clickAccType }	};
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

	self.clickAccType = function (event, treeId, treeNode) {
		if ("accType" == treeNode.type) {
			console.log(treeNode.code + ", " + treeNode.name);
		}
	};

})(jQuery);



