// include plug-ins
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var iife       = require("gulp-iife");
var inject     = require('gulp-inject-string')
var rename     = require('gulp-rename');
var uglify     = require('gulp-uglify');
var babel      = require('gulp-babel');

var HEADER_COMMENT = '// Pressure v1.0.1 | Created By Stuart Yamartino | MIT License | 2015-Present\n';
var DESTINATION = '.';

// JS concat, strip debugging and minify
gulp.task('pressure', function() {
  gulp.src([
    './src/pressure.js',
    './src/globalize.js',
    './src/element.js',
    './src/adapter.js',
    './src/adapter_3d_touch.js',
    './src/adapter_force_touch.js',
    './src/adapter_polyfill.js',
    './src/config.js',
    './src/support.js',
    './src/helpers.js',
  ])
  .pipe(concat('dist/pressure.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(iife({
    useStrict: false,
    params: ['window', 'document'],
    args: ['typeof window !== "undefined" ? window : false', 'typeof window !== "undefined" ? window.document : false']
  }))
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(inject.replace('//REPLACE-ME-IN-GULP-WITH-RETURN', 'return;'))
  // This will output the non-minified version
  .pipe(gulp.dest(DESTINATION))

  // This will minify and rename to pressure.min.js
  .pipe(uglify())
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION));
});

gulp.task('jquery-pressure', function() {
  gulp.src([
    './src/jquery_pressure.js',
    './src/globalize.js',
    './src/element.js',
    './src/adapter.js',
    './src/adapter_3d_touch.js',
    './src/adapter_force_touch.js',
    './src/adapter_polyfill.js',
    './src/config.js',
    './src/support.js',
    './src/helpers.js',
  ])
  .pipe(concat('dist/jquery.pressure.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(iife({
    useStrict: false,
    params: ['window', 'document', '$'],
    args: ['typeof window !== "undefined" ? window : false', 'typeof window !== "undefined" ? window.document : false', 'typeof jQuery !== "undefined" ? jQuery : false']
  }))
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(inject.replace('//REPLACE-ME-IN-GULP-WITH-RETURN', 'return;'))
  // This will output the non-minified version
  .pipe(gulp.dest(DESTINATION))

  // This will minify and rename to jquery.pressure.min.js
  .pipe(uglify())
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION));
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['pressure', 'jquery-pressure']);
});
