(function ($) {
	accApp.accRecAppend = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.accRecAppend.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);

		this.accTitleUtil = new accApp.accTitleUtil(cfg);
		this.accRecUtil = new accApp.accRecUtil(cfg);
		this.userUtil = new accApp.userUtil(cfg);

		this.cfg = this.super.cfg || {};
		this.ui = this.super.ui || {};
		this.data = this.super.data || {};
		this.initCfg();
		this.initUI();
		this.initData();

		// console.log(i18n.get("test"));
	};

	proto.initCfg = function () {
		var self = this;
		self.initUserCfg();
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
			self.clkCmtAccRecBtn();
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

		this.initAccEntryTable();

		// init option menu
		this.initOptMenu();

		// 模态框与模板
		self.ui.recFrame = $("#rec-frame");
		self.ui.editRecTpl = $.templates("#editRecTpl");
	};

	/*
	 * 会计科目表格
	 */
	proto.initAccEntryTable = function () {
		var self = this;
		this.data.debitCount = 0.00;
		this.data.creditCount = 0.00;
		self.ui.debitCount  = $("#lb-debitCount");
		self.ui.creditCount = $("#lb-creditCount");
		self.ui.accEntryTable = $('#accEntryTable').DataTable({ 
			columns: [{data: "accCodeName"}, {data: "desc"}, {data: "oriCcy"}, {data: "originAmount"}, {data: "debitAmt"}, {data: "creditAmt"}],
			data: [],
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
	 * 更新总计金额
	 */
	proto.reflushAmtCount = function () {
		var self = this;
		var d = 0;
		var c = 0;
		var accEntry = self.ui.accEntryTable.data();
		for (var i = 0; i < accEntry.length; i++) {
			var rec = accEntry[i];
			if (isNaN(rec.side) || isNaN(rec.amt)) {
				//
			} else {
				var side = Number(rec.side);
				var amt  = Number(rec.amt);
				if (side > 0) { d = d + amt; } else { c = c + amt; }
			}
		}
		self.data.debitCount  = d;
		self.data.creditCount = c;
		self.ui.debitCount.html(Number(d).format());
		self.ui.creditCount.html(Number(c).format());
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
				"ccyList": ccyList,
				"vAccCode": self.data.currAccTitleCode,
				"vAccName": self.data.currAccTitleName,
				"vId": "",
				"vOriAmt": "0.00",
				"vAmt": "0.00",
				"vEntryId": "",
				"lbAccTitle":i18n.get("acctype.manage.lbAccTitle"),
				"htInput":i18n.get("acctype.manage.htInput"),
				"title": i18n.get("acctype.manage.editAccTitle"),
				"confirm":i18n.get("comm.opt.confirm"),
				"cancel":i18n.get("comm.opt.cancel")
			}));
			var iptId      = $("#ipt-id");
			var iptAccCode = $("#ipt-accCode");
			var iptAccName = $("#ipt-accName");
			var iptEntryId = $("#ipt-entryId");
			var iptOriCcy  = $("#ipt-oriCcy");
			var iptOriAmt  = $("#ipt-oriAmt");
			var iptAmt     = $("#ipt-amt");
			$("input[name=side][value=" + "1" + "]").attr("checked",true);
			iptOriCcy.val(self.data.user.currency);
			iptOriAmt.unbind("blur").bind("blur", function () {
				var oriAmt = iptOriAmt.val();
				var amt = iptAmt.val();
				if (isNaN(oriAmt)) { iptOriAmt.focus(); alert("原币金额错误！"); } 
				else if (isNaN(amt) || amt < 0.0001) { iptAmt.val(oriAmt);	}
			});
			$("#btn-recConfirm").unbind("click").bind("click", function () {
				var recdata = new accApp.accRecUtil.AccRec(
					iptId.val(), $("input[name='side']:checked").val(),
					iptAccCode.val(), iptAccName.val(), iptEntryId.val(), iptOriCcy.val(),
					iptOriAmt.val(), iptAmt.val());
				self.ui.accEntryTable.rows.add([recdata]).draw();
				self.ui.recFrame.modal('hide');
				self.reflushAmtCount();
			});
			self.ui.recFrame.modal('show');
		}
	};

	/**
	 * 点击编辑会计科目
	 */
	proto.clkEditBtn = function () {
		var self = this;
		var rec = self.ui.accEntryTable.row('.selected');
		if (!self.data.currAccTitleCode && self.data.currAccTitleCode.length < 1) {
			alert("No rec selected...");
		} else if (rec.length == 1) {
			var recdata = rec.data();
			// console.log(recdata);
			// render pop window
			self.ui.recFrame.html(self.ui.editRecTpl.render({
				"ccyList": ccyList,
				"vAccCode": self.data.currAccTitleCode,
				"vAccName": self.data.currAccTitleName,
				"vId"     : recdata.id,
				//"vSide"   : recdata.side,
				//"vOriCcy" : recdata.oriCcy,
				"vOriAmt" : recdata.oriAmt,
				"vAmt"    : recdata.amt,
				"vEntryId": recdata.entryId,
				"lbAccTitle":i18n.get("acctype.manage.lbAccTitle"),
				"htInput":i18n.get("acctype.manage.htInput"),
				"title": i18n.get("acctype.manage.editAccTitle"),
				"confirm":i18n.get("comm.opt.confirm"),
				"cancel":i18n.get("comm.opt.cancel")
			}));
			var iptId      = $("#ipt-id");
			var iptAccCode = $("#ipt-accCode");
			var iptAccName = $("#ipt-accName");
			var iptEntryId = $("#ipt-entryId");
			var iptOriCcy  = $("#ipt-oriCcy");
			var iptOriAmt  = $("#ipt-oriAmt");
			var iptAmt     = $("#ipt-amt");
			$("input[name=side][value=" + recdata.side + "]").attr("checked",true);
			iptOriCcy.val(recdata.oriCcy);
			iptOriAmt.unbind("blur").bind("blur", function () {
				var oriAmt = iptOriAmt.val();
				var amt = iptAmt.val();
				if (isNaN(oriAmt)) { iptOriAmt.focus(); alert("原币金额错误！"); } 
				else if (isNaN(amt)) { iptAmt.val(oriAmt);	}
			});
			$("#btn-recConfirm").unbind("click").bind("click", function () {
				recdata.id      = iptId.val();
				recdata.side    = $("input[name='side']:checked").val();
				recdata.accCode = iptAccCode.val();
				recdata.accName = iptAccName.val();
				recdata.entryId = iptEntryId.val();
				recdata.oriCcy  = iptOriCcy.val();
				recdata.oriAmt  = iptOriAmt.val();
				recdata.amt     = iptAmt.val();
				// console.log(recdata);
				rec.invalidate().draw();
				self.ui.recFrame.modal('hide');
				self.reflushAmtCount();
			});
			self.ui.recFrame.modal('show');
		} else {
			alert("No Record selected...");
		}
	};

	/**
	 * 点击删除会计科目
	 */
	proto.clkRmAccRecBtn = function () {
		var self = this;
		var rec = self.ui.accEntryTable.row('.selected');
		if (rec.length == 1) {
			var recdata = rec.data();
			// console.log(recdata);
			rec.remove().draw(false);
			self.reflushAmtCount();
		} else {
			alert("No Record selected...");
		}
	};

	/**
	 * 提交会计分录
	 */
	proto.clkCmtAccRecBtn = function () {
		var self = this;
		self.reflushAmtCount();
		var d = Number(self.data.debitCount);
		var c = Number(self.data.creditCount);
		if (d > 0 && d == c) {
			var username = self.data.getUsername();
			var password = self.data.getPassword();
			var auth = jadeUtils.web.webAuthBasic(username, password);
			var entryJson = {"recs": []};
			var accEntry = self.ui.accEntryTable.data();
			// create rec
			for (var i = 0; i < accEntry.length; i++) {
				var rec = accEntry[i];
				if (isNaN(rec.side) || isNaN(rec.amt)) {
					//
				} else {
					entryJson.recs.push({ "id": rec.id, "side": rec.side, "accCode": rec.accCode,
						"accName": rec.accName, "entryId": rec.entryId, "oriCcy": rec.oriCcy,
						"oriAmt": rec.oriAmt, "amt": rec.amt});
				}
			}
			self.accRecUtil.createUserAccEntry(auth, username, JSON.stringify(entryJson),
					function(data, status, xhr) {
						if ('success' == data.status) {
							// console.debug(data);
							self.ui.accEntryTable.clear().draw();
						} else {
							console.error("加载测试数据失败");
						}
					}, proto.defaultAjaxErr, proto.defaultAjaxComp);
		} else {
			alert("会计分录不平衡！");
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
			// console.debug(tree);
			self.ui.accTypeTreeObj = $.fn.zTree.init(
				self.ui.accTypeTree, self.cfg.accTypeTreeSetting, tree);
		}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	/**
	 * 初始化用户配置信息
	 */
	proto.initUserCfg = function () {
		var self = this;
		var username = self.data.getUsername();
		var password = self.data.getPassword();
		var auth = jadeUtils.web.webAuthBasic(username, password);
		self.userUtil.getUserCfg(auth, username, function(data, status, xhr) {
			if ('success' == data.status) {
				// console.debug(data);
				self.data.user = data.user;
			} else {
				console.error("加载测试数据失败");
			}
		}, proto.defaultAjaxErr, proto.defaultAjaxComp);
	};

	/**
	 * 点击会计科目分类树上的分类
	 */
	proto.clickAccTitle = function (event, treeId, treeNode) {
		var self = this;
		if ("accTitle" == treeNode.type) {
			// console.log(treeNode.id + ", " + treeNode.code + ", " + treeNode.name);
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
