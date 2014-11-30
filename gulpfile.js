'use strict';

var gulp = require('gulp');
var server = require('gulp-nodemon');
var open = require('open');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var mainBowerFiles = require('main-bower-files');
var uglify = require('gulp-uglify');
var del = require('del');

var BROWSER = "firefox";
var URL = "http://localhost:5000";

var PUBLIC_DIR = './public';
var CLIENT_DIR = './client';

var paths = {
  server: {
    index: './server/app.js',
  },
  client: {
    watch:{
      sass: [CLIENT_DIR + '/styles/**/*.scss'],
      jade: [CLIENT_DIR + '/templates/**/*.jade']
    },
  	sass: [CLIENT_DIR + '/styles/index.scss'],
  	jade: [CLIENT_DIR + '/templates/*.jade', CLIENT_DIR + '/templates/directives/*.jade'],
  	scripts: [CLIENT_DIR + '/scripts/**/*.js'],
    bower: CLIENT_DIR + '/scripts/libs/'
  },
  public: {
  	dir: PUBLIC_DIR,
  	css: PUBLIC_DIR + '/css',
  	scripts: PUBLIC_DIR + '/js',
    libs: PUBLIC_DIR + '/libs'
  }
};

gulp.task('clean', function(){
  del([paths.public.dir + '/**/*', '!'+ paths.public.dir +'/{assets,assets/**}'], function (err) {
    if(err) console.log(err);
  });
});

gulp.task('browser-sync', function() {
    browserSync({
      files: paths.public.dir + "/**/*",
      proxy: URL
    });
});

gulp.task('sass', function(done) {
  gulp.src(paths.client.sass)
    .pipe(sass())
    /*.pipe(minifyCss({
      keepSpecialComments: 0
    }))*/
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.public.css))
    .on('end', done);
});

gulp.task('jade', function (done) {
    gulp.src(paths.client.jade)
      .pipe(jade({pretty: true}))
      .pipe(gulp.dest(paths.public.dir))
      .on('end', done);
});

gulp.task('bower', function() {
    return gulp.src(mainBowerFiles({
      overrides: {
        "angular-ui-router":{
          dependencies: null
        },
        "angular":{
          ignore: true
        }
      }
    }))
      .pipe(gulp.dest(paths.public.libs));
});

gulp.task('javascript', function (done) {
    gulp.src(paths.client.scripts)
      //.pipe(uglify())
      .pipe(rename({ extname: '.min.js' }))
      .pipe(gulp.dest(paths.public.scripts))
      .on('end', done);
});

gulp.task('templates', ['sass', 'jade', 'bower', 'javascript']);

gulp.task('watch', function() {
  gulp.watch(paths.client.watch.sass, ['sass']);
  gulp.watch(paths.client.watch.jade, ['jade']);
  gulp.watch(paths.client.scripts, ['javascript']);
});

gulp.task('open', function(){
  open(URL, BROWSER);
});

gulp.task('server', function(){
  server({script: paths.server.index});
});

gulp.task('serve', ['server', 'templates', 'watch', 'browser-sync']);
gulp.task('serve-no-sync', ['server', 'templates', 'watch', 'open']);