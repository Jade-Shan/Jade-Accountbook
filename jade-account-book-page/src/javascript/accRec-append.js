(function ($) {
	accApp.accRecAppend = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.accRecAppend.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);

		this.accTitleUtil = new accApp.accTitleUtil(cfg);
		this.accRecUtil = new accApp.accRecUtil(cfg);

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
					self.clickAccTitle(event, treeId, treeNode); 
				}
			},
			data: {
				key: {name: "showName"}
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
			"commit": i18n.get("comm.opt.commit"),
			"create": i18n.get("comm.opt.create"),
			"edit": i18n.get("comm.opt.edit"),
			"delete": i18n.get("comm.opt.delete")}));

		self.ui.btnCreate = $('#btn-create');
		self.ui.btnCreate.unbind("click").bind("click", function () {
			self.clkCreateBtn();
		});
		self.ui.btnEdit = $("#btn-edit");
		self.ui.btnEdit.unbind("click").bind("click", function () {
			self.clkEditBtn();
		});
		self.ui.btnDelete = $("#btn-delete");
		// 要套一层函数，不然`this`指向是触发的按钮而不是这个对象
		self.ui.btnDelete.unbind("click").bind("click", function () {
			self.clkRmAccRecBtn();
		});
		self.ui.btnCommit = $("#btn-commit");
		// 要套一层函数，不然`this`指向是触发的按钮而不是这个对象
		self.ui.btnCommit.unbind("click").bind("click", function () {
			// self.clkCmtAccRecBtn();
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
		self.ui.accEntryTable = $('#accEntryTable').DataTable({ 
			columns: [{data: "accCodeName"}, {data: "desc"}, {data: "oriCcy"}, {data: "originAmount"}, {data: "debitAmt"}, {data: "creditAmt"}],
			data: [
			new AccRec("0001", -1, "6603001", "财务费用：利息支出"    , "itm:6638592;rsp:6638592;", "CNY", 237529.00, 237529.00),
			new AccRec("0002", -1, "2231001", "应付利息：人民币借款利", "itm:6638592;rsp:6638592;", "CNY",   8144.00,   8144.00),
			new AccRec("0003",  1, "2231002", "应付利息：美元借款利息", "itm:6638592;rsp:6638592;", "USD",  35290.00, 229385.00)
			],
			"paging": false, "ordering": false,"searching": false 
		});
		self.ui.accEntryTableBody = $('#accEntryTable tbody');

		// 表格只能选中一行
		self.ui.accEntryTableBody.on('click', 'tr', function () {
			if ($(this).hasClass('selected')) {
				$(this).removeClass('selected');
			} else {
				self.ui.accEntryTable.$('tr.selected').removeClass('selected');
				$(this).addClass('selected');
			}
		});

		// init option menu
		this.initOptMenu();

		// 模态框与模板
		self.ui.recFrame = $("#rec-frame");
		self.ui.editRecTpl = $.templates("#editRecTpl");
	};

	proto.initData = function () {
		var self = this;
		this.data.currAccTitleCode = '';
		this.data.currAccTitleName = '';
		this.data.getUsername = function () { return self.ui.username.val(); };
		this.data.getPassword = function () { return self.ui.password.val(); };
		this.data.setUsername = function (value) { self.ui.username.val(value); };
		this.data.setPassword = function (value) { self.ui.password.val(value); };
	};

	proto.render = function () {
		var self = this;
		this.super.render();
		self.refreshAccTitleTree();
		self.onResize(self);
		document.body.onresize = function () {
			self.onResize(self);
		};
	};

	/**
	 * 更新会计科目表格
	 */
	proto.refreshAccEntryTable = function (accType) {
		var self = this;
		var username = self.data.getUsername();
		var password = self.data.getPassword();
		var auth = jadeUtils.web.webAuthBasic(username, password);
//		self.accTitleUtil.listUserAccTitle(auth, self.data.getUsername(), accType, 
//				function(data, status, xhr) {
//					if ('success' == data.status) {
//						console.debug(data);
//						self.ui.accEntryTable.clear().rows.add(data.recs).draw();
//					} else {
//						console.error("加载测试数据失败");
//					}
//				}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	/**
	 * 点击创建记录
	 */
	proto.clkCreateBtn = function () {
		var self = this;
		if (!self.data.currAccTitleCode && self.data.currAccTitleCode.length < 1) {
			alert("No Type selected...");
		} else {
			self.ui.recFrame.html(self.ui.editRecTpl.render({
				"vAccCode": self.data.currAccTitleCode,
				"vAccName": self.data.currAccTitleName,
				"vId": "00001",
				"vSide": "-1",
				"vOriCcy": "CNY",
				"vOriAmt": "1.00",
				"vAmt": "6.50",
				"vEntryId": "itm:6638592;rsp:6638592;",
				"lbAccTitle":i18n.get("acctype.manage.lbAccTitle"),
				"htInput":i18n.get("acctype.manage.htInput"),
				"title": i18n.get("acctype.manage.editAccTitle"),
				"confirm":i18n.get("comm.opt.confirm"),
				"cancel":i18n.get("comm.opt.cancel")
			}));
			$("#btn-recConfirm").unbind("click").bind("click", function () {
				var type = $("#ipt-typeCode").val();
				var code = $("#ipt-code").val();
				var name = $("#ipt-name").val();
				var desc = $("#ipt-desc").val();
				var assetId = $("#ipt-assetId").val();
				var username = self.data.getUsername();
				var password = self.data.getPassword();
				var auth = jadeUtils.web.webAuthBasic(username, password);
				self.accTitleUtil.createUserAccTitle(auth, username, type, code, 
					name, desc, assetId, function(data, status, xhr) {
						if ('success' == data.status) {
							console.debug(data);
							var recdata = [{"id": data.id, "code": code, "name": name, 
								"desc": desc, "assetId": assetId}];
							self.ui.accEntryTable.rows.add(recdata).draw();
							self.ui.recFrame.modal('hide');
						} else {
							console.error("加载测试数据失败");
						}
					}, proto.defaultAjaxErr, proto.defaultAjaxComp);
			});
			self.ui.recFrame.modal('show');
		}
	};

//	/**
//	 * 点击编辑会计科目
//	 */
//	proto.clkEditBtn = function () {
//		var self = this;
//		var rec = self.ui.accEntryTable.row('.selected');
//		if (!self.data.currAccTitleCode && self.data.currAccTitleCode.length < 1) {
//			alert("No Type selected...");
//		} else if (rec.length == 1) {
//			var recdata = rec.data();
//			console.log(recdata);
//			// render pop window
//			self.ui.recFrame.html(self.ui.editRecTpl.render({
//				"vAccCode": self.data.currAccTitleCode, 
//				"vAccName": self.data.currAccTitleName,
//				"vId": recdata.id, "vCode": recdata.code, "vName": recdata.name,
//				"vAssetId": recdata.assetId, "vDesc": recdata.desc,
//				"lbAccCode":i18n.get("acctype.manage.lbAccCode"),
//				"lbAccName":i18n.get("acctype.manage.lbAccName"),
//				"lbAccAss" :i18n.get("acctype.manage.lbAccAss" ),
//				"lbAccDesc":i18n.get("acctype.manage.lbAccDesc"),
//				"htAccCode":i18n.get("acctype.manage.htAccCode"),
//				"htAccName":i18n.get("acctype.manage.htAccName"),
//				"htAccAss" :i18n.get("acctype.manage.htAccAss" ),
//				"htAccDesc":i18n.get("acctype.manage.htAccDesc"),
//				"title": i18n.get("acctype.manage.editAccTitle"),
//				"confirm":i18n.get("comm.opt.confirm"),
//				"cancel":i18n.get("comm.opt.cancel")
//			}));
//			$("#btn-recConfirm").unbind("click").bind("click", function () {
//				var type = $("#ipt-typeCode").val();
//				var id = $("#ipt-id").val();
//				var code = $("#ipt-code").val();
//				var name = $("#ipt-name").val();
//				var desc = $("#ipt-desc").val();
//				var assetId = $("#ipt-assetId").val();
//				var username = self.data.getUsername();
//				var password = self.data.getPassword();
//				var auth = jadeUtils.web.webAuthBasic(username, password);
//				self.accTitleUtil.updateUserAccTitle(auth, username, type, id, code, 
//					name, desc, assetId, function(data, status, xhr) {
//						if ('success' == data.status) {
//							console.debug(data);
//							recdata.type = type;
//							recdata.id = id;
//							recdata.code = code;
//							recdata.name = name;
//							recdata.desc = desc;
//							recdata.assetId = assetId;
//							rec.invalidate().draw();
//							self.ui.recFrame.modal('hide');
//						} else {
//							console.error("加载测试数据失败");
//						}
//					}, proto.defaultAjaxErr, proto.defaultAjaxComp);
//			});
//			self.ui.recFrame.modal('show');
//		} else {
//			alert("No Record selected...");
//		}
//	};

	/**
	 * 点击删除会计科目
	 */
	proto.clkRmAccRecBtn = function () {
		var self = this;
		var rec = self.ui.accEntryTable.row('.selected');
		if (rec.length == 1) {
			var recdata = rec.data();
			console.log(recdata);
			var username = self.data.getUsername();
			var password = self.data.getPassword();
			var auth = jadeUtils.web.webAuthBasic(username, password);
			// self.accTitleUtil.deleteUserAccTitle(auth, username, 
			// 		self.data.currAccTitleCode, recdata.id, recdata.code,
			// 		function(data, status, xhr) {
			// 			if ('success' == data.status) {
			// 				console.debug(data);
			// 				rec.remove().draw(false);
			// 			} else {
			// 				console.error("加载测试数据失败");
			// 			}
			// 		}, proto.defaultAjaxErr, proto.defaultAjaxComp);
			rec.remove().draw(false);
		} else {
			alert("No Record selected...");
		}
	};

	/**
	 * 刷新页面上的会计科目分类树
	 */
	proto.refreshAccTitleTree = function () {
		var self = this;
		var username = self.data.getUsername();
		var password = self.data.getPassword();
		var auth = jadeUtils.web.webAuthBasic(username, password);
		self.accTitleUtil.genAccTypeTitleTree(auth, username, function(tree) {
			console.debug(tree);
			self.ui.accTypeTreeObj = $.fn.zTree.init(
				self.ui.accTypeTree, self.cfg.accTypeTreeSetting, tree);
		}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	/**
	 * 点击会计科目分类树上的分类
	 */
	proto.clickAccTitle = function (event, treeId, treeNode) {
		var self = this;
		if ("accTitle" == treeNode.type) {
			console.log(treeNode.id + ", " + treeNode.code + ", " + treeNode.name);
			self.data.currAccTitleId = treeNode.id;
			self.data.currAccTitleCode = treeNode.code;
			self.data.currAccTitleName = treeNode.name;
		}
	};

	/**
	 * 调整会计科目分类树的大小与位置
	 */
	proto.resizeAccTypeTree = function () {
		var self = this;
		var top = self.super.calcuBodyHeight();// - self.ui.optMenu.height();
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
