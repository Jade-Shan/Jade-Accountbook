(function ($) {
	accApp.accRecUtil= function (cfg) { this.init(cfg); return this; };
	var proto = accApp.accRecUtil.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);
		this.cfg = this.super.cfg || {};
		this.initCfg();
	};

	proto.initCfg = function () {
		var self = this;
		this.cfg.createUserAccEntryUrl = this.cfg.apiRoot + "/api/accountbook/accEntry/create/{0}";
	};

	/**
	 * 新建用户的会计科目
	 */
	proto.createUserAccEntry = function (auth, username, entryJson, succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({
			url: encodeURI(self.cfg.createUserAccEntryUrl.format(username)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: entryJson, 
			timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};

//	/**
//	 * 读取指定用户在指定分类的下会计科目
//	 */
//	proto.listUserAccTitle = function (auth, username, accType, 
//		succCallback, errCallback, compCallback) 
//	{
//		var self = this;
//		$.ajax({ url: encodeURI(self.cfg.listUserAccTitleUrl.format(username, accType)), 
//			type: 'POST', dataType: 'json', headers: { Authorization: auth },
//			data: { }, timeout: net.jadedungeon.ajaxTimeout,
//			success: succCallback, error: errCallback, complete: compCallback
//		});
//	};
//
//	/**
//	 * 编辑用户的会计科目
//	 */
//	proto.updateUserAccTitle = function (auth, username, type, id, code, name, desc,
//			assetId, succCallback, errCallback, compCallback) 
//	{
//		var self = this;
//		$.ajax({
//			url: encodeURI(self.cfg.updateUserAccTitleUrl.format(username, type, code)), 
//			type: 'POST', dataType: 'json', headers: {Authorization: auth},
//			data: {type: type, id: id, code: code, name: name, desc: desc, assetId: assetId}, 
//			timeout: net.jadedungeon.ajaxTimeout,
//			success: succCallback, error: errCallback, complete: compCallback
//		});
//	};
//
//	/**
//	 * 删除用户的会计科目
//	 */
//	proto.deleteUserAccTitle = function (auth, username, type, id, code,
//			succCallback, errCallback, compCallback) 
//	{
//		var self = this;
//		$.ajax({
//			url: encodeURI(self.cfg.deleteUserAccTitleUrl.format(username, type, code)), 
//			type: 'POST', dataType: 'json', headers: { Authorization: auth }, data: {id: id}, 
//			timeout: net.jadedungeon.ajaxTimeout,
//			success: succCallback, error: errCallback, complete: compCallback
//		});
//	};
//
//	/**
//	 * 读取所有的会计科目分类
//	 *
//	 */
//	proto.loadAllAccType = function (auth, succCallback, errCallback, compCallback) {
//		var self = this;
//		$.ajax({ url: encodeURI(self.cfg.allAccTypeUrl), 
//			type: 'POST', dataType: 'json', headers: { Authorization: auth },
//			data: { }, timeout: net.jadedungeon.ajaxTimeout,
//			success: succCallback, error: errCallback, complete: compCallback
//		});
//	};
//
//	/**
//	 * 生成指定用户的会计科目树
//	 *
//	 */
//	proto.genAccTypeTitleTree = function (auth, username, succCallback, errCallback, compCallback) {
//		var self = this;
//		/* load acc title */
//		self.listUserAccTitle(auth, username, "all", function(data, status, xhr) {
//			if ('success' == data.status) {
//				var typeMap = new net.jadedungeon.dataStructure.Map();
//				for (var i = 0; i < data.recs.length; i++) {
//					var title = data.recs[i];
//					title.showName = title.code + "-" + title.name;
//					if (typeMap.containsKey(title.type)) {
//						typeMap.get(title.type).push(title);
//					} else {
//						typeMap.put(title.type, [title]);
//					}
//				}
//				/* load acc title type */
//				self.loadAllAccType(auth, function (data, status, xhr) {
//					if ('success' == data.status) {
//						var tree = [];
//						for (var i = 0; i < data.recs.length; i++) {
//							var grp = data.recs[i];
//							grp.showName = grp.name;
//							var types = grp.children;
//							grp.children = [];
//							tree.push(grp);
//							for (var j = 0; j < types.length; j++) {
//								var type = types[j];
//								if (typeMap.containsKey(type.code)) {
//									type.showName = type.code + "-" + type.name;
//									type.children = typeMap.get(type.code);
//									grp.children.push(type);
//								}
//							}
//						}
//						succCallback(tree);
//					} else { console.error("加载测试数据失败"); }
//				}, errCallback, compCallback);
//			} else {
//				console.error("加载测试数据失败");
//			}
//		}, proto.defaultAjaxErr, proto.defaultAjaxComp);
//	};

	proto.formatAccRecForShow = function (rec) {
	};
})(jQuery);

(function ($) {
	accApp.accRecUtil.AccRec = function (idStr, sideNum, accCodeStr, accNameStr, 
		entryIdStr, oriCcyStr, oriAmtNum, amtNum) 
	{
		var self = this;

		self.id      = idStr;
		self.side    = sideNum;
		self.accCode = accCodeStr;
		self.accName = accNameStr;
		self.entryId = entryIdStr;
		self.oriCcy  = oriCcyStr;
		self.oriAmt  = oriAmtNum - 0;
		self.amt     = amtNum - 0;

		self.accCodeName = function () { return self.accCode + " - " + self.accName; };

		self.originAmount = function () { return jadeUtils.string.formatNumber(self.oriAmt); };

		self.debitAmt = function () {
			if (self.side < 0) {
				return "";
			} else {
				return jadeUtils.string.formatNumber(self.amt);
			}
		};

		self.creditAmt = function () {
			if (self.side < 0) {
				return jadeUtils.string.formatNumber(self.amt);
			} else {
				return "";
			}
		};

		self.desc = function () {
			var desc = '';
			var recs = self.entryId.split(";");
			if (recs.length) {
				for (var i = 0; i < recs.length; i++) {
					var rec = recs[i];
					if (rec.indexOf(":") > -1) {
						var cols = rec.split(":");
						if (cols.length && cols.length > 1) {
							var type = cols[0];
							var value = cols[1];
							desc = desc + '<a href="#">' + type + ':' + value + '</a>&nbsp;';
						}
					}
				}
			}
			return desc;
		};
	};

	var proto = accApp.accRecUtil.AccRec.prototype;

})(jQuery);

