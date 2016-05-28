(function ($) {
	accApp.accTitleManage = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.accTitleManage.prototype;
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

	proto.initOptMenu = function () {
		var self = this;
		self.ui.optMenuTpl = $.templates('#optMenuTpl');
		self.ui.optMenu = $('#opt-menu');
		self.ui.optMenu.html(self.ui.optMenuTpl.render({
			"create": i18n.get("comm.opt.create"),
			"edit": i18n.get("comm.opt.edit"),
			"delete": i18n.get("comm.opt.delete")}));
		self.ui.btnCreate = $('#btn-create');
		self.ui.btnEdit = $("#btn-edit");
		self.ui.btnDelete = $("#btn-delete");
	};

	proto.initUI = function () {
		var self = this;

		this.ui.username = $("#username");
		this.ui.password = $("#password");
		this.ui.submit = $("#submit");
		// 要套一层函数，不然`this`指向是触发的按钮而不是这个对象
		this.ui.submit.unbind("click").bind("click", function () {
			//		self.updateAccTypeTree(); 
		});

		this.ui.accTypeTree = $("#accTypeTree");
		this.ui.accTypeTreeObj = {};

		this.ui.accTitleList = $('#accTitleList').DataTable({ 
			data: [],
			columns: [{data: "code"},{data: "name"},{data: "desc"},{data: "assetId"}]
		});

		// init option menu
		this.initOptMenu();
	};

	proto.initData = function () {
		var self = this;
		this.data.getUsername = function () { return self.ui.username.val(); };
		this.data.getPassword = function () { return self.ui.password.val(); };
		this.data.setUsername = function (value) { self.ui.username.val(value); };
		this.data.setPassword = function (value) { self.ui.password.val(value); };
	};

	proto.render = function () {
		var self = this;
		this.super.render();
		self.updateAccTypeTree();
	};

	proto.updateUserAccTitle = function (accType) {
		var self = this;
		var auth = jadeUtils.web.webAuthBasic(
				self.data.getUsername(), self.data.getPassword());
		self.accTypeUtil.loadUserAccTitle(self.data.getUsername(), accType, auth, 
				function(data, status, xhr) {
					if ('success' == data.status) {
						console.debug(data);
						self.ui.accTitleList.clear().rows.add(data.recs).draw();
					} else {
						console.error("加载测试数据失败");
					}
				}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	proto.updateAccTypeTree = function () {
		var self = this;
		var auth = jadeUtils.web.webAuthBasic(
				self.data.getUsername(), self.data.getPassword());
		self.accTypeUtil.loadAllAccType(auth, function(data, status, xhr) {
			if ('success' == data.status) {
				console.debug(data);
				self.ui.accTypeTreeObj = $.fn.zTree.init(
					self.ui.accTypeTree, self.cfg.accTypeTreeSetting, data.types);
			} else { console.error("加载测试数据失败"); }
		}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	proto.clickAccType = function (event, treeId, treeNode) {
		var self = this;
		if ("accType" == treeNode.type) {
			console.log(treeNode.code + ", " + treeNode.name);
			self.updateUserAccTitle(treeNode.code);
		}
	};

	proto.resizeAccTypeTree = function () {
		var self = this;
		var height = document.documentElement.clientHeight;
		var style = 'height: ' + height + 'px; transition: 1s;';
		self.ui.accTypeTree.attr('style', style);
	};

	proto.windowSizeChange = function () {
		var self = this;
		self.resizeAccTypeTree();
	};

})(jQuery);




