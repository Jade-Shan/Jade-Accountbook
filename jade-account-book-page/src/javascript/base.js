
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
	};

	proto.initUI = function () {
		this.ui.topNav = $("nav#topnav");
		this.ui.footer = $("div#footer");
		this.ui.ctxBodyLeft = $("div#ctx-body-left");
		this.ui.ctxBodyRight = $("div#ctx-body-right");
	};

	proto.initData = function () {
		var self = this;
	};

	proto.calcuBodyLeft = function () {
		var self = this;
		return self.ui.ctxBodyLeft.position().left;
	};

	proto.calcuBodyHeight = function () {
		var self = this;
		var width = document.documentElement.clientWidth;
		var height = document.documentElement.clientHeight;
		// console.debug("window size change {0} * {1}".format(width, height));

		return height - self.ui.topNav.height() - self.ui.footer.height() - 15;
	};

	proto.onResize = function (self) {
		var style = 'min-height: ' + self.calcuBodyHeight() + 'px; transition: 1s;';
		self.ui.ctxBodyLeft.attr('style', style);
		self.ui.ctxBodyRight.attr('style', style);
	};

	proto.render = function () { };

	/* Ajax响应成功时的默认方法 */
	proto.defaultAjaxSucc = function(data, status, xhr) {
		if ('success' == data.status) {
			// console.debug(data);
		} else {
			console.error("加载测试数据失败");
		}
	};

	/* Ajax响应出错时的默认方法 */
	proto.defaultAjaxErr = function(xhr, errorType, error) {
		console.error("加载测试数据失败");
		// console.debug(xhr);
		// console.debug(errorType);
		console.debug(error);
	};

	/* Ajax响应完成时的默认方法 */
	proto.defaultAjaxComp = function(xhr, status) { };

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
					// console.debug(status);
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
			// console.debug("no username or password");
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
					// console.debug(data.reason);
					self.ui.divUserLogin.addClass("has-error");
				}, function (data) { /* 网络错误时的操作 */
					alert("Ajax Error");
				});
	};

	proto.barinit = function () {
		var self = this;

		self.ui.topnav = $("#topnav");
		self.ui.topnavTpl = $.templates("#topnavTpl");
		self.ui.topnav.html(self.ui.topnavTpl.render(self.cfg.topnavCfg));

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
		self.ui.btnLogout = $('#btn-logout');
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
	accApp.report = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.report.prototype;

	proto.init = function (cfg) {
		this.cfg = cfg || {};
	};
})(jQuery);
