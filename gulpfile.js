// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var iife = require("gulp-iife");
var insert = require('gulp-insert');
var rename = require('gulp-rename');
var stripDebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');

var HEADER_COMMENT = '// Pressure v0.0.1 alpha | Created By Stuart Yamartino | MIT License | 2015 \n';
var DESTINATION = '.';

// JS concat, strip debugging and minify
gulp.task('scripts', function() {
  gulp.src([
      './src/pressure.js',
      './src/router.js',
      './src/event.js',
      './src/element.js',
      './src/adapters/touch_3d.js',
      './src/adapters/touch_force.js',
      './src/support.js',
      './src/manager.js',
      './src/helpers.js',
      './src/global.js'
    ])
    .pipe(concat('pressure.js'))
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(iife({
      useStrict: false,
      params: ['window', 'document'],
      args: ['window', 'document']
    }))
    .pipe(insert.prepend(HEADER_COMMENT))
    // .pipe(stripDebug())
    // This will output the non-minified version
    .pipe(gulp.dest(DESTINATION))

    // This will minify and rename to foo.min.js
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(insert.prepend(HEADER_COMMENT))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DESTINATION));;
});

gulp.task('watch', function() {
  gulp.watch('src/*', ['scripts']);
  gulp.watch('src/adapters/*', ['scripts']);

});
