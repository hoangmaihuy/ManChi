var gulp = require('gulp'),
  browserSync = require('browser-sync'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish');

gulp.task('jshint', function() {
  return gulp.src('scripts/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('scripts/**/*.js', ['jshint']);
});

gulp.task('browser-sync', ['default'], function() {
  var files = [
    'stylesheets/**/*.css',
    'index.html',
    'scripts/**/*.js'
  ];
  browserSync.init(files, {
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
  gulp.watch(files).on('change', browserSync.reload);
});

gulp.task('default', function() {
  gulp.start('jshint', 'browser-sync');
});
