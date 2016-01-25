// include plug-ins
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var iife       = require("gulp-iife");
var insert     = require('gulp-insert');
var rename     = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var uglify     = require('gulp-uglify');
var babel      = require('gulp-babel');

var HEADER_COMMENT = '// Pressure v0.0.4 | Created By Stuart Yamartino | MIT License | 2016 \n';
var DESTINATION = '.';

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src([
    './src/setup.js',
    './src/pressure.js',
    './src/element.js',
    './src/adapter.js',
    './src/adapter_touch_3d.js',
    './src/adapter_touch_force.js',
    './src/support.js',
    './src/helpers.js',
  ])
  .pipe(concat('pressure.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(iife({
    useStrict: false,
    params: ['window'],
    args: ['typeof window !== "undefined" ? window : false']
  }))
  .pipe(insert.prepend(HEADER_COMMENT))
  // .pipe(stripDebug())
  // This will output the non-minified version
  .pipe(gulp.dest(DESTINATION))

  // This will minify and rename to pressure.min.js
  .pipe(stripDebug())
  .pipe(uglify())
  .pipe(insert.prepend(HEADER_COMMENT))
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION));
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['scripts']);
  gulp.watch('src/adapters/*', ['scripts']);
});
