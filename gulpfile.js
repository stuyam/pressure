// include plug-ins
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var umd        = require('gulp-umd');
var iife       = require('gulp-iife');
var inject     = require('gulp-inject-string')
var rename     = require('gulp-rename');
var uglify     = require('gulp-uglify');
var babel      = require('gulp-babel');

var HEADER_COMMENT = '// Pressure v2.0.1 | Created By Stuart Yamartino | MIT License | 2015 - 2016\n';
var DESTINATION = '.';

// JS concat, strip debugging and minify
gulp.task('pressure', function() {
  gulp.src([
    './src/pressure.js',
    './src/element.js',
    './src/adapters/adapter.js',
    './src/adapters/adapter_force_touch.js',
    './src/adapters/adapter_3d_touch.js',
    './src/config.js',
    './src/helpers.js',
  ])
  .pipe(concat('dist/pressure.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(umd({
    exports: function() {
      return 'Pressure';
    }
  }))
  .pipe(inject.prepend(HEADER_COMMENT))
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
    './src/element.js',
    './src/adapters/adapter.js',
    './src/adapters/adapter_force_touch.js',
    './src/adapters/adapter_3d_touch.js',
    './src/config.js',
    './src/helpers.js',
  ])
  .pipe(concat('dist/jquery.pressure.js'))
  .pipe(babel({
      presets: ['es2015']
  }))
  .pipe(umd({
    dependencies: function() {
      return [
        {
          name: 'jquery',
          amd: 'jquery',
          cjs: 'jquery',
          global: 'jQuery',
          param: '$'
        }
      ]
    },
    namespace: function() {
      // throw away, since jquery_pressure.js mutates $
      // instead of returning something from the factory
      return 'jQuery__pressure';
    }
  }))
  .pipe(inject.prepend(HEADER_COMMENT))
  // This will output the non-minified version
  .pipe(gulp.dest(DESTINATION))

  // This will minify and rename to jquery.pressure.min.js
  .pipe(uglify())
  .pipe(inject.prepend(HEADER_COMMENT))
  .pipe(rename({ extname: '.min.js' }))
  .pipe(gulp.dest(DESTINATION));
});

gulp.task('watch', function() {
  gulp.watch(['src/*', 'src/adapters/*'], ['pressure', 'jquery-pressure']);
});

gulp.task('dist', ['pressure', 'jquery-pressure']);
