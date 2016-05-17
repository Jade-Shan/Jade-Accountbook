/* config the nav-bar */
var topnavCfg = {
	"usernameprefix": i18n.get("navbar.usernameprefix"),
	"login": i18n.get("navbar.login"),
	"menu": [
		{title: "账户概览", link: "#"},
		{title: "账目管理", subs: [
			{title: "会计科目管理", link: appCfg.webRoot + "/pages/accTitle-manage.html"},
			{title: "", link: ""},
			{title: "录入分录", link: "#"}]},
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


