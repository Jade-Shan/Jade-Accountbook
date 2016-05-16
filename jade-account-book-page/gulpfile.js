// #!/bin/bash
// # lessc -x style.less > style.css
// # lessc style.less > style.css

// gulp build-less：你会在目录下发现less目录下的less文件被编译成对应的css文件。
// gulp min-styles：会在css目录下输出all.css和all.min.css文件。
// gulp develop：会监听所有less文件，当有less文件改变时，会执行build-less和min-styles
var gulp = require('gulp'),
		less = require('gulp-less'),              //less编译
		minifycss = require('gulp-minify-css'),   //css压缩
		jshint = require('gulp-jshint'),          //js检查
		uglify  = require('gulp-uglify'),         //js压缩
		rename = require('gulp-rename'),          //重命名
		concat  = require('gulp-concat'),         //合并文件
		fileinclude = require('gulp-file-include'),   //html模板
		clean = require('gulp-clean');            //清空文件夹

var env = {
	prd : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181",
		apiRoot: "http://localhost:8080/accountbook",
		cdn01: "//cdn.bootcss.com",
		cdn02: "//7xldv2.com1.z0.glb.clouddn.com"
	},
	devCdn : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181",
		apiRoot: "http://localhost:8080/accountbook",
		cdn01: "http://localhost:8000/3rd.v2",
		cdn02: "http://localhost:8000/3rd.v2"
	},
	dev : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181",
		apiRoot: "http://localhost:8181/test",
		cdn01: "//cdn.bootcss.com",
		cdn02: "//7xldv2.com1.z0.glb.clouddn.com"
	}
};

var cfg = {
	path: {
		src: {
			theme : "./themes/hobbit/less/",
			less : "./src/less/",
			scripts : "./src/javascript/",
			html : "./src/pages/"},
		dst: {
			theme : "./web-root/themes/hobbit/css/",
			css : "./web-root/styles/",
			scripts : "./web-root/scripts/",
			html : "./web-root/pages/"}},
	env : env.dev
};

// 清空图片、样式、js
gulp.task('clean', function() {
		gulp.src([cfg.path.dst.css, cfg.path.dst.theme, cfg.path.dst.scripts, cfg.path.dst.html], 
			{read: false}).pipe(clean());
});

// less编译为css
gulp.task('build-less-base', function() {
	gulp.src(cfg.path.src.less + '**/*.less')
		.pipe(less({ compress: true }))
		.on('error', function(e) {console.log(e);} )
		.pipe(gulp.dest(cfg.path.dst.css));
	});
gulp.task('build-less-hobbit', function() {
	gulp.src(cfg.path.src.theme + '**/*.less')
		.pipe(less({ compress: true }))
		.on('error', function(e) {console.log(e);} )
		.pipe(gulp.dest(cfg.path.dst.theme));
	});

// 合并、压缩、重命名css
gulp.task('min-styles-base', function() {
	gulp.src([cfg.path.dst.css + '**/*.css'])
		.pipe(concat('app.css'))      // 合并文件为all.css
		.pipe(gulp.dest(cfg.path.dst.css))  // 输出all.css文件
		.pipe(rename({suffix: '.min'})) // 重命名all.css为 all.min.css
		.pipe(minifycss())                // 压缩css文件
		.pipe(gulp.dest(cfg.path.dst.css)); // 输出all.min.css
	});
gulp.task('min-styles-hobbit', function() {
	gulp.src([cfg.path.dst.theme + '**/*.css'])
		.pipe(concat('hobbit.css'))      // 合并文件为all.css
		.pipe(gulp.dest(cfg.path.dst.theme))  // 输出all.css文件
		.pipe(rename({suffix: '.min'})) // 重命名all.css为 all.min.css
		.pipe(minifycss())                // 压缩css文件
		.pipe(gulp.dest(cfg.path.dst.theme)); // 输出all.min.css
	});

// 检查javascript
gulp.task('check-js', function() {
	gulp.src(cfg.path.src.scripts + '**/*.js').pipe(jshint()) .pipe(jshint.reporter('default'));
	});

gulp.task('min-scripts', function() {
	gulp.src([cfg.path.src.scripts + 'i18n.js', cfg.path.src.scripts + 'base.js',
			cfg.path.src.scripts + 'test-report.js',
			cfg.path.src.scripts + 'test-account.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest(cfg.path.dst.scripts))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(cfg.path.dst.scripts));
	});

	gulp.task('fileinclude', function() {
		gulp.src([cfg.path.src.html + "*.html"])
			.pipe(fileinclude({prefix: '@@', basepath: '@root', context: cfg.env}))
			.pipe(gulp.dest(cfg.path.dst.html));
	});

// // 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default', ['build-less'], function(){
//     gulp.start('min-styles','min-scripts');
//     gulp.start();
// });
// 监控变化
gulp.task('develop', function() {
	gulp.watch(
		[cfg.path.src.theme + '**/*.less', cfg.path.src.scripts + '**/*.js'], 
		['clean', 'build-less-base', 'build-less-hobbit', 
			'min-styles-base', 'min-styles-hobbit']);
		});

