// #!/bin/bash
// # lessc -x style.less > style.css
// # lessc style.less > style.css

function sleep(t) { for(var start = Date.now(); Date.now() - start <= t; ) {} }


var gulp = require('gulp'),
		less = require('gulp-less'),                //less编译
		minifycss = require('gulp-minify-css'),     //css压缩
		jshint = require('gulp-jshint'),            //js检查
		uglify  = require('gulp-uglify'),           //js压缩
		rename = require('gulp-rename'),            //重命名
		concat  = require('gulp-concat'),           //合并文件
		fileinclude = require('gulp-file-include'), //html模板
		processhtml = require('gulp-processhtml'),  // html引用替换
		clean = require('gulp-clean');              //清空文件夹

var env = {
	prd : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181",
		apiRoot: "http://localhost:8080/accountbook",
		cdn01: "//cdn.bootcss.com",
		cdn02: "//7xldv2.com1.z0.glb.clouddn.com" },
	fat : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181/",
		apiRoot: "http://localhost:8080/accountbook",
		cdn01: "//cdn.bootcss.com",
		cdn02: "//7xldv2.com1.z0.glb.clouddn.com" },
	dev_be : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181/web-root",
		apiRoot: "http://localhost:8080/accountbook",
		cdn01: "//cdn.bootcss.com",
		cdn02: "//7xldv2.com1.z0.glb.clouddn.com" },
	dev_fe : {
		buildversion: "0.0.1",
		webRoot: "http://localhost:8181/web-root",
		apiRoot: "http://localhost:8181/web-root/test",
		cdn01: "//cdn.bootcss.com",
		cdn02: "//7xldv2.com1.z0.glb.clouddn.com" }
};

var cfg = {
	path: {
		src: {
			less : "./src/less/",
			scripts : "./src/javascript/",
			tpls: "./src/tpls/",
			html : "./src/pages/"},
		dst: {
			css : "./web-root/styles/",
			scripts : "./web-root/scripts/",
			html : "./web-root/pages/"}
	},
	env : env.dev_fe            // use dev config
};

/* =====================================================
 *
 * build css
 *
 * ===================================================== */

// clean output css
gulp.task('clean-css', function() {
	return gulp.src([cfg.path.dst.css], {read: false}).pipe(clean());
});

// compile javascript to css
gulp.task('build-less-base', ['clean-css'], function() {
	return gulp.src(cfg.path.src.less + '**/*.less')
		.pipe(less({ compress: true }))
		.on('error', function(e) {console.log(e);} )
		.pipe(gulp.dest(cfg.path.dst.css));
});

// 合并、压缩、重命名css
gulp.task('min-styles-base', ['build-less-base'], function() {
	return gulp.src([cfg.path.dst.css + '**/*.css'])
		.pipe(concat('app.css'))      // 合并文件为all.css
		.pipe(gulp.dest(cfg.path.dst.css))  // 输出all.css文件
		.pipe(rename({suffix: '.min'})) // 重命名all.css为 all.min.css
		.pipe(minifycss())                // 压缩css文件
		.pipe(gulp.dest(cfg.path.dst.css)); // 输出all.min.css
	});


/* =====================================================
 *
 * build Java script
 *
 * ===================================================== */

gulp.task('clean-scripts', function() {
	return gulp.src([cfg.path.dst.scripts], {read: false}).pipe(clean());
});

// 检查javascript
gulp.task('check-scripts', function() {
	return gulp.src(cfg.path.src.scripts + '**/*.js').pipe(jshint())
		.pipe(jshint.reporter('default'));
});

gulp.task('min-scripts', function() {
	return gulp.src([cfg.path.src.scripts + 'i18n.js', 
			cfg.path.src.scripts + 'cfg.js',
			cfg.path.src.scripts + 'base.js',
			cfg.path.src.scripts + 'test-report.js',
			cfg.path.src.scripts + 'test-account.js'])
		.pipe(concat('app.js'))
		.pipe(gulp.dest(cfg.path.dst.scripts))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest(cfg.path.dst.scripts));
});

/* =====================================================
 *
 * build html
 *
 * ===================================================== */

gulp.task('clean-html', function() {
	return gulp.src([cfg.path.dst.html], {read: false}).pipe(clean());
});

gulp.task('include-html', function() {
	return gulp.src([cfg.path.src.html + "**/*.html"])
		.pipe(fileinclude({prefix: '@@', basepath: '@root', context: cfg.env}))
		.pipe(gulp.dest(cfg.path.dst.html));
});

gulp.task('process-html', function() {
	return gulp.src([cfg.path.src.html + "**/*.html", cfg.path.src.tpls + "**/*.html"])
		.pipe(fileinclude({prefix: '@@', basepath: '@root', context: cfg.env}))
    .pipe(processhtml()).pipe(gulp.dest(cfg.path.dst.html));
});

// 监控变化
gulp.task('watch-html', function() {
	gulp.watch(
		[cfg.path.src.html + '**/*.html', cfg.path.src.tpls + '**/*.html'], 
		['include-html']); 
});

