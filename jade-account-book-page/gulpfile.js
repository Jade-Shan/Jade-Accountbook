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
		clean = require('gulp-clean');            //清空文件夹
		
var pathSrcTheme = "./themes/hobbit/less/";
var pathSrcLess = "./src/less/";
var pathSrcScripts = "./src/javascript/";

var pathOutputTheme = "./web-root/themes/hobbit/css/";
var pathOutputCss = "./web-root/styles/";
var pathOutputScripts = "./web-root/scripts/";

// 清空图片、样式、js
gulp.task('clean', function() {
		gulp.src([pathOutputCss, pathOutputTheme, pathOutputScripts], 
			{read: false}).pipe(clean());
});

// less编译为css
gulp.task('build-less-base', function() {
	gulp.src(pathSrcLess + '**/*.less')
		.pipe(less({ compress: true }))
		.on('error', function(e) {console.log(e);} )
		.pipe(gulp.dest(pathOutputCss));
	});
gulp.task('build-less-hobbit', function() {
	gulp.src(pathSrcTheme + '**/*.less')
		.pipe(less({ compress: true }))
		.on('error', function(e) {console.log(e);} )
		.pipe(gulp.dest(pathOutputTheme));
	});

// 合并、压缩、重命名css
gulp.task('min-styles-base', function() {
	gulp.src([pathOutputCss + '**/*.css'])
		.pipe(concat('app.css'))      // 合并文件为all.css
		.pipe(gulp.dest(pathOutputCss))  // 输出all.css文件
		.pipe(rename({suffix: '.min'})) // 重命名all.css为 all.min.css
		.pipe(minifycss())                // 压缩css文件
		.pipe(gulp.dest(pathOutputCss)); // 输出all.min.css
	});
gulp.task('min-styles-hobbit', function() {
	gulp.src([pathOutputTheme + '**/*.css'])
		.pipe(concat('hobbit.css'))      // 合并文件为all.css
		.pipe(gulp.dest(pathOutputTheme))  // 输出all.css文件
		.pipe(rename({suffix: '.min'})) // 重命名all.css为 all.min.css
		.pipe(minifycss())                // 压缩css文件
		.pipe(gulp.dest(pathOutputTheme)); // 输出all.min.css
	});

// 检查javascript
gulp.task('check-js', function() {
	gulp.src(pathSrcScripts + '**/*.js').pipe(jshint()) .pipe(jshint.reporter('default'));
	});

gulp.task('min-scripts', function() {
	gulp.src([pathSrcScripts + 'i18n.js', pathSrcScripts + 'base.js',
		pathSrcScripts + 'test-report.js',
		pathSrcScripts + 'test-account.js'
	])
		.pipe(concat('app.js'))
		.pipe(gulp.dest(pathOutputScripts))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(pathOutputScripts));
	});

// // 默认任务 清空图片、样式、js并重建 运行语句 gulp
// gulp.task('default', ['build-less'], function(){
//     gulp.start('min-styles','min-scripts');
//     gulp.start();
// });
// 监控变化
gulp.task('develop', function() {
	gulp.watch(
		[pathSrcTheme + '**/*.less', pathSrcScripts + '**/*.js'], 
		['clean', 'build-less-base', 'build-less-hobbit', 
			'min-styles-base', 'min-styles-hobbit']);
		});

