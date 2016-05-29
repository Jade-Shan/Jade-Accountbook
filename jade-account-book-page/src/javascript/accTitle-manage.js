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

	/*
	 * 创建操作会计科目的按钮组
	 */
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
		// 要套一层函数，不然`this`指向是触发的按钮而不是这个对象
		self.ui.btnDelete.unbind("click").bind("click", function () {
			self.clickRmAccTitleBtn();
		});

	};

	proto.initUI = function () {
		var self = this;

		/*
		 * 创建会计科目分类树
		 */
		self.ui.accTypeTree = $("#accTypeTree");
		self.ui.accTypeTreeLeft = $("#accTypeTreeLeft");
		self.ui.accTypeTreeObj = {};

		/*
		 * 会计科目表格
		 */
		self.ui.accTitleTable = $('#accTitleTable').DataTable({ 
			columns: [{data: "code"},{data: "name"},{data: "desc"},{data: "assetId"}],
			data: []
		});
		self.ui.accTitleTableBody = $('#accTitleTable tbody');

		// 表格只能选中一行
		self.ui.accTitleTableBody.on('click', 'tr', function () {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				self.ui.accTitleTable.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
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
		self.refreshAccTypeTree();
		self.onResize(self);
		document.body.onresize = function () {
			self.onResize(self);
		};
	};

	/**
	 * 更新会计科目表格
	 */
	proto.refreshAccTitleTable = function (accType) {
		var self = this;
		var auth = jadeUtils.web.webAuthBasic(
				self.data.getUsername(), self.data.getPassword());
		self.accTypeUtil.listUserAccTitle(auth, self.data.getUsername(), accType, 
				function(data, status, xhr) {
					if ('success' == data.status) {
						console.debug(data);
						self.ui.accTitleTable.clear().rows.add(data.recs).draw();
					} else {
						console.error("加载测试数据失败");
					}
				}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	/**
	 * 点击删除会计科目
	 */
	proto.clickRmAccTitleBtn = function () {
		var self = this;
		var rec = self.ui.accTitleTable.row('.selected');
		if (rec.length == 1) {
			console.log(rec.data().id);
			var auth = jadeUtils.web.webAuthBasic(
					self.data.getUsername(), self.data.getPassword());
			self.accTypeUtil.deleteUserAccTitle(
					auth, self.data.getUsername(), rec.data().code,
					function(data, status, xhr) {
						if ('success' == data.status) {
							console.debug(data);
							rec.remove().draw(false);
						} else {
							console.error("加载测试数据失败");
						}
					}, proto.defaultAjaxErr, proto.defaultAjaxComp);
		} else {
			alert("No Record selected...");
		}
	};

	/**
	 * 刷新页面上的会计科目分类树
	 */
	proto.refreshAccTypeTree = function () {
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

	/**
	 * 点击会计科目分类树上的分类
	 */
	proto.clickAccType = function (event, treeId, treeNode) {
		var self = this;
		if ("accType" == treeNode.type) {
			console.log(treeNode.code + ", " + treeNode.name);
			self.refreshAccTitleTable(treeNode.code);
		}
	};

	/**
	 * 调整会计科目分类树的大小与位置
	 */
	proto.resizeAccTypeTree = function () {
		var self = this;
		var top = self.super.calcuBodyHeight() - self.ui.optMenu.height();
		var height = top - 20;
		var left = self.super.calcuBodyLeft();
		var style = 'height: ' + height + 'px; transition: 1s;';
		self.ui.accTypeTree.attr('style', style);
		style = 'left: ' + left + 'px; top: ' + top + 'px; transition: 1s;';
		self.ui.accTypeTreeLeft.attr('style', style);
	};

	/**
	 * 当浏览器大小变化时调用的回调函数
	 */
	proto.onResize = function (self) {
		self.super.onResize(self.super);
		self.resizeAccTypeTree();
	};

})(jQuery);
