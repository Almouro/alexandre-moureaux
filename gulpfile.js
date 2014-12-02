'use strict';

var gulp = require('gulp');
var server = require('gulp-nodemon');
var open = require('open');
var sass = require('gulp-ruby-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
//var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var del = require('del');
var gulpif = require('gulp-if');
var beautify = require('gulp-beautify');
var concat = require('gulp-concat');
var run = require('run-sequence');

var BROWSER = "firefox";
var URL = "http://localhost:5000";

var IS_PROD = false;

var PUBLIC_DIR = './public';
var CLIENT_DIR = './client';
var TMP = './_tmp';

var paths = {
  server: {
    index: './server/app.js',
  },
  client: {
    watch:{
      sass: [CLIENT_DIR + '/styles/**/*.scss'],
      jade: [CLIENT_DIR + '/templates/**/*.jade'],
      scripts: [CLIENT_DIR + '/scripts/**/*.js']
    },
  	sass: [CLIENT_DIR + '/styles/index.scss'],
  	jade: [CLIENT_DIR + '/templates/*.jade', CLIENT_DIR + '/templates/directives/*.jade']
  },
  public: {
  	dir: PUBLIC_DIR,
  	css: PUBLIC_DIR + '/css',
  	scripts: PUBLIC_DIR + '/js',
    libs: PUBLIC_DIR + '/libs'
  },
  tmp: {
    dir: TMP,
    scripts: [TMP + '/snap.js',TMP + '/angular-snap.js', TMP + '/angular-ui-router.js', CLIENT_DIR + '/scripts/app.js'],
    css: [TMP + '/angular-snap.css', TMP + '/index.css']
  }
};

gulp.task('clean', function(){
  del([paths.public.dir + '/**/*', '!'+ paths.public.dir +'/{assets,assets/**}', paths.tmp.dir + '/**/*', paths.tmp.dir], function (err) {
    if(err) console.log(err);
  });
});

gulp.task('browser-sync', function() {
    browserSync({
      files: paths.public.dir + "/**/*",
      proxy: URL
    });
});

gulp.task('css', ['sass'], function(){
  gulp.src(paths.tmp.css)
    .pipe(concat('index.min.css'))
    .pipe(gulpif(IS_PROD,minifyCss({
      keepSpecialComments: 0
    })))
    .pipe(gulp.dest(paths.public.css))
});

gulp.task('sass', function() {
  gulp.src(paths.client.sass)
    .pipe(sass({'sourcemap=none': true}))
    .pipe(gulp.dest(paths.tmp.dir));
});

gulp.task('jade', function () {
    gulp.src(paths.client.jade)
      .pipe(jade({pretty: !IS_PROD}))
      .pipe(gulp.dest(paths.public.dir));
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles())
      .pipe(gulp.dest(paths.tmp.dir));
});

gulp.task('javascript', function () {
    gulp.src(paths.tmp.scripts)
      .pipe(concat('app.min.js'))
      .pipe(gulpif(IS_PROD, uglify(), beautify()))
      .pipe(gulp.dest(paths.public.scripts));
});

gulp.task('templates', function(){
  run('bower', ['css', 'jade', 'javascript']);
});

gulp.task('watch', function() {
  gulp.watch(paths.client.watch.sass, ['css']);
  gulp.watch(paths.client.watch.jade, ['jade']);
  gulp.watch(paths.client.watch.scripts, ['javascript']);
});

gulp.task('open', function(){
  open(URL, BROWSER);
});

gulp.task('server', function(){
  server({script: paths.server.index});
});

gulp.task('serve', ['server', 'templates', 'watch', 'browser-sync']);
gulp.task('serve-no-sync', ['server', 'templates', 'watch', 'open']);
gulp.task('prod', function(){
  IS_PROD = true;
  run('templates');
});