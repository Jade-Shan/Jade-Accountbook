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
		self.oriAmt  = oriAmtNum;
		self.amt     = amtNum;

	};

	var proto = accApp.accRecUtil.AccRec.prototype;

	proto.accCodeName = function () { 
		var self = this;
		return self.accCode + " - " + self.accName; 
	};

	proto.originAmount = function () { 
		var self = this;
		return Number(self.oriAmt).format(); 
	};

	proto.debitAmt = function () {
		var self = this;
		if (self.side < 0) { return ""; } else { return Number(self.amt).format(); }
	};

	proto.creditAmt = function () {
		var self = this;
		if (self.side < 0) { return Number(self.amt).format(); } else { return ""; }
	};

	proto.desc = function () {
		var self = this;
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

})(jQuery);



Number.prototype.format = function(formatExp) {
	var num = this.toString().replace(/\$|\,/g, '');
	if(isNaN(num))
		num = "0";
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num * 100 + 0.50000000001);
	cents = num % 100;
	num = Math.floor(num / 100).toString();
	if(cents < 10)
		cents = "0" + cents;
	for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		num = num.substring(0, num.length - (4 * i + 3)) + 
			',' +
			num.substring(num.length - (4 * i + 3));
	return (((sign) ? '' : '-') + num + '.' + cents);
};
