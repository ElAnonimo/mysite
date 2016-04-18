// Gulp.js configuration

// include Gulp and plugins
var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var sass = require('gulp-sass');
var size = require('gulp-size');
var newer = require('gulp-newer');
var preprocess = require('gulp-preprocess');
var htmlclean = require('gulp-htmlclean');
var del = require('del');
var pkg = require('./package.json');

// file locations
var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');

var source = 'source/';
var dest = 'build/';

var html = {
	in: source + '*.html',
	watch: [source + '*.html', source + 'template/**/*'],
	out: dest,
	context: {
		devBuild: devBuild,
		author: pkg.author,
		version: pkg.version
	}
};

var images = {
	in: source + 'images/*.*',
	out: dest + 'images/'
};

var css = {
	in: source + 'scss/main.scss',
	watch: [source + 'scss/**/*'],
	out: dest + 'css/',
	sassOpts: {
		outputStyle: 'nested',
		imagePath: '../images',
		precision: 3,
		errLogToConsole: true
	}
};

var fonts = {
	in: source + 'fonts/*.*',
	out: css.out + 'fonts/'
};

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

// clean build folder
gulp.task('clean', function() {
	del([
		dest + '*'
	])
});

// build HTML files
gulp.task('html', function() {
	var page = gulp.src(html.in).pipe(preprocess({ context: html.context }));
	if (!devBuild) {
		page = page
			.pipe(size({ title: 'HTML in' }))
			.pipe(htmlclean())
			.pipe(size({ title: 'HTML out' }));
	}
	return page.pipe(gulp.dest(html.out));
});

// manage images
gulp.task('images', function() {
	return gulp.src(images.in)
		.pipe(newer(images.out))
		.pipe(imagemin())
		.pipe(gulp.dest(images.out))
});

// copy fonts
gulp.task('fonts', function() {
	return gulp.src(fonts.in)
		.pipe(newer(fonts.out))
		.pipe(gulp.dest(fonts.out))
});

// compile Sass
gulp.task('sass', function() {
	return gulp.src(css.in)
		.pipe(sass(css.sassOpts))
		.pipe(gulp.dest(css.out))
});

// default task
gulp.task('default', ['html', 'images', 'fonts', 'sass'], function() {
	// html changes
	gulp.watch(html.watch, ['html']);
	
	// image changes
	gulp.watch(images.in, ['images']);
	
	// fonts changes
	gulp.watch(fonts.in, ['fonts']);
	
	// sass changes
	gulp.watch(css.watch, ['sass']);
});