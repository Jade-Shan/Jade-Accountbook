accountBook.report.balanceSheet = {};
accountBook.report.balanceSheet.loadBalanceSheet = function (tableId, reportData) {
	var text = '\n<tr><th colspan="2">' + 
		jadeUtils.i18n.load("balanceSheet.table.head.group") +
		'</th><th colspan="2">' + 
		jadeUtils.i18n.load("balanceSheet.table.head.account") +
		'</th><th colspan="2">' + 
		jadeUtils.i18n.load("balanceSheet.table.head.item") + '</th></tr>\n';

	if (reportData.length > 0) {
		text = text + '<tr>';
		for (var i = 0; i < reportData.length; i++) {
			text = text + accountBook.report.balanceSheet.showRec(reportData[i], "subs");
		}
	}
	$("#" + tableId).html(text);
};


accountBook.report.balanceSheet.countLeafNode = function (node, subsName, count) {
	if (node && node[subsName] && 0 < node[subsName].length) {
		for (var i=0; i < node[subsName].length; i++) {
			count = accountBook.report.balanceSheet.countLeafNode(node[subsName][i], subsName, count);
		}
		return count;
	} else {
		return count + 1;
	}
};
accountBook.report.balanceSheet.showRec = function (node, subsName) {
	var size = accountBook.report.balanceSheet.countLeafNode(node, "subs", 0);
	var amount = parseFloat(node.amount);
	var text = '<td rowspan="' + size + '">' + node.code + ' - ' + node.name +
		'</td><td rowspan="' + size + '">￥ ' + 
		jadeUtils.formatter.formatNumber(amount, 2) + '</td>';
	if (node && node[subsName] && 0 < node[subsName].length) {
		for (var i = 0; i < node[subsName].length; i++) {
			text = text + accountBook.report.balanceSheet.showRec(node[subsName][i], subsName);
		}
	} else {
		text = text + "</tr>\n";
	}
	console.debug(text);
	return text;
};
