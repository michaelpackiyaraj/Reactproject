"use strict";

var gulp = require('gulp');
var order = require('gulp-order');//gulp concat order
var browserify = require('browserify');// Bundles Js
var source = require('vinyl-source-stream'); //Use conventional text streams with gulp
var concat = require('gulp-concat');//Concatenates multiple files
var uglify = require('gulp-uglify');//Concatenates multiple files
var minifyCss = require('gulp-minify-css');//minifies css files
var nodemon = require('gulp-nodemon');//To start and auto reload node server
var mocha = require('gulp-mocha');
var util = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var babelify = require("babelify");

var config = {
	port: 3000,
	devBaseUrl: 'http://localhost',
	paths: {
		html: './src/main/*.html',
		js: './src/main/assets/js',
		indexJs: './src/main/components/index.js',
		components: './src/main/components/**/*.js',
		css:'./src/main/assets/css',
		images: './src/main/assets/images/**/*',
		transcripts: './src/main/assets/transcripts/*',
		videos: './src/main/assets/videos/*',
		fonts: './src/main/assets/fonts/**/*',
		dest: './public',
		test: './test/client/'
	}
}

//starts a local node server
gulp.task('server', function (cb){
	var started = false;
	return nodemon({
		script: 'web.js',
		env: { 'NODE_ENV': 'development' },
		watch: [
    			'server/*'
  				],
  		ext: 'js'
	}).on('start', function () {
		// to avoid nodemon being started multiple times
		if (!started) {
			cb();
			started = true;
		}
	});
});

gulp.task('html',function(){
	gulp.src(config.paths.html)
		.pipe(gulp.dest(config.paths.dest));
});


gulp.task('indexJs',function(){
	browserify(config.paths.indexJs)
		.transform(babelify)
		.bundle()
		.on('error',console.error.bind(console))
		.pipe(source('partnerSummit-app.js'))
		.pipe(gulp.dest(config.paths.dest+'/scripts'));
});

gulp.task('js',function() {
  	gulp.src([config.paths.js+'/vendor/plugins_header.js', config.paths.js+'/vendor/**/*.js', config.paths.js+'/*.js'])
  		.pipe(uglify())
	    .pipe(concat('partnerSummit.min.js'))
	    .pipe(gulp.dest(config.paths.dest+'/scripts'));
});

gulp.task('css',function(){
	gulp.src([config.paths.css+'/bootstrap.css', config.paths.css+'/bootstrap-responsive.css', config.paths.css+'/theme.css', config.paths.css+'/theme-responsive.css', config.paths.css+'/*.css'])
		.pipe(minifyCss())
		.pipe(concat('partnerSummit.css'))
		.pipe(gulp.dest(config.paths.dest+'/css'));
});

gulp.task('images',function(){
	gulp.src(config.paths.images)
		.pipe(gulp.dest(config.paths.dest + '/images'));

	//publish favicon
	 gulp.src('./src/favicon.ico')
	 	.pipe(gulp.dest(config.paths.dest));
});

gulp.task('fonts',function(){
	gulp.src(config.paths.fonts)
		.pipe(gulp.dest(config.paths.dest+'/fonts'));
});
gulp.task('transcripts',function(){
	gulp.src(config.paths.transcripts)
		.pipe(gulp.dest(config.paths.dest+'/transcripts'));
});
gulp.task('videos',function(){
	gulp.src(config.paths.videos)
		.pipe(gulp.dest(config.paths.dest+'/videos'));
});

gulp.task('minifyTestJs',function() {
  	gulp.src([config.paths.test+'**/*.js', '!'+config.paths.test+'build/*.min.js'])
			.pipe(sourcemaps.init())
			.pipe(concat('test-build.min.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(config.paths.test+'build'));
});

gulp.task('test',['minifyTestJs'],function () {
    return gulp.src([config.paths.test+'build/test-build.min.js'])
        // gulp-mocha needs filepaths so you can't have any plugins before it
         .pipe(mocha({ reporter: 'spec' }))
				 .on('error', util.log);
});

gulp.task('watch', function(){
	gulp.watch(config.paths.html,['html']);
	gulp.watch(config.paths.components,['indexJs']);
	gulp.watch(config.paths.js+'/**/*.js',['js']);
	gulp.watch(config.paths.css+'/**/*.css',['css']);
});

if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
  gulp.task('default',['html','js', 'indexJs', 'css','images', 'fonts', 'transcripts','server','test', 'watch']);
} else {
  gulp.task('default', ['html','js', 'indexJs', 'css','images', 'fonts', 'transcripts']);
}
