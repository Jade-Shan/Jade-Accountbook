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


