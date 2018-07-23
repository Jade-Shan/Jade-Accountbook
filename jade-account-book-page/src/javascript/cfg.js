/* config the nav-bar */
var topnavCfg = {
	"usernameprefix": i18n.get("navbar.usernameprefix"),
	"login": i18n.get("navbar.login"),
	"menu": [
	{title: "账户概览", link: "#"},
	{title: "账目管理", subs: [
		{title: "会计科目管理", link: appCfg.webRoot + "/pages/accTitle-manage.html"},
		{title: "", link: ""},
		{title: "录入分录", link: appCfg.webRoot + "/pages/accRec-append.html"},
		{title: "", link: ""},
		{title: "资产负债表", link: appCfg.webRoot + "/pages/balance-sheet.html"}
		]},
	{title: "固定资产管理", subs: [
		{title: "添加固定资产", link: "#"}]},
	{title: "票据管理", subs: [
		{title: "添加票据", link: "#"}]}],
	"userMenu": [
	{title: "testing", link: "#"},
	{title: "testing", link: "#"},
	{title: "testing", link: "#"},
	{title: "", link: ""},
	{title: "testing", link: "#"},
	{title: "testing", link: "#"}],
	"appname": i18n.get("navbar.appname")
};

var ccyList = [{"code": "ATS", "name": "奥地利先令"},
{"code": "AUD", "name": "澳大利亚元"},
{"code": "BEF", "name": "比利时法郎"},
{"code": "CAD", "name": "加拿大元"},
{"code": "CHF", "name": "瑞士法郎"},
{"code": "CNY", "name": "人民币元"},
{"code": "DEM", "name": "西德马克"},
{"code": "DKK", "name": "丹麦克郎"},
{"code": "DZD", "name": "阿尔及利亚第纳尔"},
{"code": "EUR", "name": "欧元"},
{"code": "FIM", "name": "芬兰马克"},
{"code": "FRF", "name": "法国法郎"},
{"code": "GBP", "name": "英镑"},
{"code": "GHC", "name": "加纳塞地"},
{"code": "GNS", "name": "几内亚西里"},
{"code": "HKD", "name": "港币"},
{"code": "IQD", "name": "伊拉克第纳尔"},
{"code": "IRR", "name": "伊朗里亚尔"},
{"code": "ITL", "name": "意大利里拉"},
{"code": "JOD", "name": "约旦第纳尔"},
{"code": "JPY", "name": "日元"},
{"code": "KWD", "name": "科威特第纳尔"},
{"code": "MOP", "name": "澳门元"},
{"code": "MYR", "name": "马来西亚元"},
{"code": "NLG", "name": "荷兰盾"},
{"code": "NOK", "name": "挪威克郎"},
{"code": "NPR", "name": "尼泊尔卢比"},
{"code": "NZD", "name": "新西兰元"},
{"code": "PHP", "name": "菲律宾比索"},
{"code": "PKR", "name": "巴基斯坦卢比"},
{"code": "RMB", "name": "人民币元"},
{"code": "SEK", "name": "瑞典克郎"},
{"code": "SGD", "name": "新加坡元"},
{"code": "SLL", "name": "塞拉利昂利昂"},
{"code": "SUR", "name": "卢布(RBS)"},
{"code": "THB", "name": "泰国株"},
{"code": "TZS", "name": "坦桑尼亚先令"},
{"code": "USD", "name": "美元"},
{"code": "ZMY", "name": "折美元"}];

