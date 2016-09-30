var gulp = require('gulp'),
  minifycss = require('gulp-minify-css'),
  jshint = require('gulp-jshint'),
  stylish = require('jshint-stylish'),
  uglify = require('gulp-uglify'),
  usemin = require('gulp-usemin'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  changed = require('gulp-changed'),
  rev = require('gulp-rev'),
  browserSync = require('browser-sync'),
  del = require('del'),
  ngannotate = require('gulp-ng-annotate');

var files = [
  'app/styles/**/*.css',
  'app/scripts/**/*.js',
  'app/**/*.html'
];

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('default', ['clean'], function() {
  gulp.start('usemin', 'copyviews', 'copyfonts', 'copydata');
});

gulp.task('jshint', function() {
  return gulp.src('scripts/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('usemin', ['jshint'], function() {
  return gulp.src('./app/**/*.html')
    .pipe(usemin({
      css: [minifycss(), rev()],
      js: [ngannotate(), uglify(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task('copyviews', function() {
  gulp.src('./app/views/**/*.html')
    .pipe(gulp.dest('./dist/views'));
});

gulp.task('copyfonts', function() {
  gulp.src('./bower_components/bootstrap/dist/fonts/**/*.{ttf,woff,eof,svg}*')
    .pipe(gulp.dest('./dist/fonts'));
});

gulp.task('copydata', function() {
  gulp.src('app/data/**/*.json').pipe(gulp.dest('./dist/data'));
})

 gulp.task('watch', ['browser-sync'], function() {
  gulp.watch('{app/scripts/**/*.js,app/styles/**/*.css,app/**/*.html}', ['usemin']);
});

gulp.task('browser-sync', ['default'], function() {
  browserSync.init(files, {
    server: {
      baseDir: "dist",
      index: "index.html"
    }
  });
  gulp.watch("dist/**/*").on('change', browserSync.reload);
});

gulp.task('usemin', ['jshint'], function() {
  return gulp.src('./app/index.html')
    .pipe(usemin({
      css: [minifycss(), rev()],
      js: [ngannotate(), uglify(), rev()]
    }))
    .pipe(gulp.dest('dist/'));
});
