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

var paths = {
  server: {
    index: './app.js',
  },
  client: {
  	sass: ['./client/styles/**/*.scss'],
  	jade: ['./client/templates/**/*.jade'],
  	scripts: ['./client/scripts/**/*.js'],
    bower: './client/scripts/libs/'
  },
  public: {
  	dir: './public',
  	css: './public/css',
  	scripts: './public/js'
  }
};

var browser = "firefox";
var url = "http://localhost:5000";

gulp.task('browser-sync', function() {
    browserSync({
      files: "public/**/*",
      proxy: "localhost:5000"
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
      .pipe(gulp.dest(paths.client.bower));
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
  gulp.watch(paths.client.sass, ['sass']);
  gulp.watch(paths.client.jade, ['jade']);
  gulp.watch(paths.client.scripts, ['javascript']);
});

gulp.task('open', function(){
  open(url, browser);
});

gulp.task('server', function(){
  server({script: paths.server.index});
});

gulp.task('serve', ['server', 'templates', 'watch', 'browser-sync']);
gulp.task('serve-no-sync', ['server', 'templates', 'watch', 'open']);