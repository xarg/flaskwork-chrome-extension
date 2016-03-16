var gulp = require('gulp')
  , uglify = require('gulp-uglify')
  , browserify = require('browserify')
  , babelify = require('babelify')
  , source = require('vinyl-source-stream')
  , buffer = require('vinyl-buffer')
  , notify = require('gulp-notify')
  , plumber = require('gulp-plumber')
  , less = require('gulp-less')
  , rename = require('gulp-rename')
  , LessPluginAutoPrefix = require('less-plugin-autoprefix');;


function errorHandler(err) {
  console.log(err);
}


var notifyHandler = notify.onError({
  title: "Flaskwork Extension Error",
  message: "<%= error.message %>"
});


function build() {
  return browserify({
    entries: ['src/app.js'],
    debug: true
  })
  .on('error', errorHandler)
  .on('error', notifyHandler)
  .transform(babelify.configure({
    presets: ['es2015', 'react'],
    plugins: ['transform-class-properties']
  }))
  .on('error', errorHandler)
  .on('error', notifyHandler)
  .bundle()
  .on('error', errorHandler)
  .on('error', notifyHandler);
}


gulp.task('build:js', ['set-development-env'], function() {
  return build()
    .pipe(source('flaskwork.js'))
    .pipe(gulp.dest('extension'))
    .pipe(notify({
      title: "Flaskwork Extension",
      message: "Build completed successfully."
    }));
});


gulp.task('build:less', function() {
  return gulp.src('./src/app.less')
    .pipe(less({
      compress: true,
      ieCompat: false,
      paths: ['assets', 'src'],
      plugins: [
        new LessPluginAutoPrefix({
          cascade: false,
          browsers: ['last 2 versions']
        })
      ]
    }))
    .on('error', notifyHandler)
    .pipe(rename('flaskwork.css'))
    .pipe(gulp.dest('extension'))
    .pipe(notify({
      title: "Flaskwork Extension",
      message: "LESS compilation completed successfully."
    }));
});


gulp.task('watch', function() {
  gulp.watch(['src/**/*.js'], ['build:js']);
  gulp.watch(['src/**/*.less'], ['build:less']);
});


gulp.task('set-production-env', function() {
  process.env.NODE_ENV = 'production';
});


gulp.task('set-development-env', function() {
  process.env.NODE_ENV = 'development';
});


gulp.task('build:production', ['set-production-env'], function() {
  return build()
    .pipe(source('flaskwork.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest('extension'))
    .pipe(notify({
      title: "Flaskwork Extension",
      message: "Build completed successfully."
    }));
});


gulp.task('default', ['build:js']);
