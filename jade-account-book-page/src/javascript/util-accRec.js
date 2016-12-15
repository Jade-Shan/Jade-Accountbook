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

