构建说明
===============

环境配置
---------------

不同的环境的配置由在`gulpfile.js`中的变量`env`来控制：

* `env.prd`：生产环境，CDN指向CDN服务器，API指向生产环境中的`jade-account-book-api`程序。
* `env.fat`：开发环境，CDN指向CDN服务器，API指向本地运行的`jade-account-book-api`程序。
* `env.dev`：开发环境，CDN指向CDN服务器，API指向当前目录下的`web-root/test/`里的静态文件。
* `env.dev_be`：开发环境，在没有网络的情况下，CDN指向本机启动的http服务（`Jade-Misc/jade-cdn`），API指向当前目录下的`web-root/test/`里的静态文件。

例如：

	var env = {
		prd : { /* .. */ },
		fat : { /* .. */ },
		dev_be : { /* .. */ },
		dev_fe : { /* .. */ }
	};

当前阶段如果要在不同的配置环境中切换的方式比较简陋。需要人工修改`gulpfile.js`文件。
把变量`cfg`定义中的`env`成员，指向之前的变量`env`中的成员。例如：

	var cfg = {
		/* ..... */
		env : env.dev_fe            // use config env.dev_fe
	};


项目依赖
---------------

### 第三方前端库

* 在有网络的情况下（dev, fat, prd），指向`//cdn.bootcss.com`
* 没有网络时，用`Jade-Misc/jade-cdn`凑数，[项目链接](https://github.com/Jade-Shan/Jade-Misc/tree/master/jade-cdn)。

### 本人的前端库

* 在有网络的情况下（dev, fat, prd），指向七牛提供的CDN平台：`//7xldv2.com1.z0.glb.clouddn.com/jadeutils.v2`
* 没有网络时，用`Jade-Misc/jade-cdn`凑数，[项目链接](https://github.com/Jade-Shan/Jade-Misc/tree/master/jade-cdn)。

### 本程序后台API

后台程序为[jade-account-book-api](jade-account-book-api)。

开发过程中，`src/mock-backend/api/accountbook/`下的静态文件可以用来模拟API
调用的响应。必须用用户名`jade`登录，密码任意。


构建项目
---------------

前端页面全部是静态的内容，使用glup构建。执行多个任务时是并行执行的，
经常会有前一个任务还没有执行完，后一个任务已经启动的情况。
当前先用bash脚本插入暂停的方式解决。

### 构建整个项目

	bash ./build -a

构建完成后，整个项目的内容都在`web-root`目录下。

### 发布项目

`web-root`是整个项目的根目录，直接在`web-root`目录下启动HTTP服务。


本地开发测试
---------------

本地开发测试过程中，并不把`web-root`作为HTTP服务的根目录，而是采用上一级目录
作为HTTP服务的根目录。

原因是在开发过程中，HTML文件直接引用源代码目录下没有合并和压缩的HTML文件
更加便于调试和排错。启动HTTP服务的脚本为：

	python localtest.py

脚本默认占用`8181`端口，如需要更换其他端口请修改`localtest.py`源代码。

### 只生成css

如果在开发过程中只修改了LESS脚本，那么使用这个命令重新生成CSS。

	bash ./build -s

### 只生成HTML

如果在开发过程中只修改了HTML模板，那么用这个命令重新生成HTML页面。

	bash ./build -p

该命令生成的HTML页面全部引用`src/javascript`下没有合并压缩过的JS，
方便在开发过程中用来排错。

*注意：* 如果之前从来没有生成过CSS，要先用`bash ./build -s`把LESS编译为CSS。


TODO List
===============

* 资产负债表的样式需要从HTML文件中取到CSS文件中。
