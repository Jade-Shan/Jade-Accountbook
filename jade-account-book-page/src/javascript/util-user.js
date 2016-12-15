(function ($) {
	accApp.userUtil = function (cfg) { this.init(cfg); return this; };
	var proto = accApp.userUtil.prototype;
	proto.super = accApp.prototype;

	proto.init = function (cfg) {
		this.super = new accApp(cfg);
		this.cfg = this.super.cfg || {};
		this.initCfg();
	};

	proto.initCfg = function () {
		var self = this;
		this.cfg.userCfgUrl = this.cfg.apiRoot + "/api/accountbook/user/{0}";
	};

	/**
	 * 新建用户的会计科目
	 */
	proto.getUserCfg = function (auth, username, succCallback, errCallback, compCallback) 
	{
		var self = this;
		$.ajax({
			url: encodeURI(self.cfg.userCfgUrl.format(username)), 
			type: 'POST', dataType: 'json', headers: { Authorization: auth },
			data: {}, timeout: net.jadedungeon.ajaxTimeout,
			success: succCallback, error: errCallback, complete: compCallback
		});
	};


	proto.formatAccRecForShow = function (rec) {
	};
})(jQuery);

function AccRec(idStr, sideNum, accCodeStr, accNameStr, entryIdStr, oriCcyStr, oriAmtNum, amtNum) {
	var self = this;

	self.id      = idStr;
	self.side    = sideNum;
	self.accCode = accCodeStr;
	self.accName = accNameStr;
	self.entryId = entryIdStr;
	self.oriCcy  = oriCcyStr;
	self.oriAmt  = oriAmtNum;
	self.amt     = amtNum;

	self.accCodeName = function () {
		return self.accCode + " - " + self.accName;
	};

	self.originAmount = function () {
			return formatNum(self.oriAmt);
	};

	self.debitAmt = function () {
		if (self.side < 0) {
			return "";
		} else {
			return formatNum(self.amt);
		}
	};

	self.creditAmt = function () {
		if (self.side < 0) {
			return formatNum(self.amt);
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

}

function formatNum(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	cents = num%100;
	num = Math.floor(num/100).toString();
	if(cents<10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
		num = num.substring(0,num.length-(4*i+3))+','+
			num.substring(num.length-(4*i+3));
	return (((sign)?'':'-') + num + '.' + cents);
}
