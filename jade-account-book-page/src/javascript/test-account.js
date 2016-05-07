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



