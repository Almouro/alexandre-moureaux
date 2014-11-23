var gulp = require('gulp');
var server = require('gulp-nodemon');
var open = require('open');
var sass = require('gulp-sass');
var jade = require('gulp-jade');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

var paths = {
  server: {
    index: './app.js',
  },
  client: {
  	sass: ['./client/styles/**/*.scss'],
  	jade: ['./client/templates/**/*.jade'],
  	scripts: ['./client/scripts/**/*.js']
  },
  public: {
  	dir: './public',
  	css: './public/css',
  	scripts: './public/js'
  }
};

var browser = "firefox";
var url = "http://localhost:5000";

gulp.task('sass', function(done) {
  gulp.src(paths.client.sass)
    .pipe(sass())
    //.pipe(gulp.dest(paths.public.css))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
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

gulp.task('javascript', function (done) {
	//TO DO
    gulp.src(paths.client.scripts)
      .pipe(gulp.dest(paths.public.scripts))
      .on('end', done);
});

gulp.task('templates', ['sass', 'jade', 'javascript']);

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

gulp.task('serve', ['server', 'templates', 'open', 'watch']);