// include plug-ins
var gulp       = require('gulp');
var concat     = require('gulp-concat');
var umd        = require('gulp-umd');
var inject     = require('gulp-inject-string')
var rename     = require('gulp-rename');
var uglify     = require('gulp-uglify');
var babel      = require('gulp-babel');
var HEADER_COMMENT = '// Pressure v2.1.2 | Created By Stuart Yamartino | MIT License | 2015 - 2017\n';
var DESTINATION = '.';

// JS concat, strip debugging and minify
gulp.task('pressure', function() {
  gulp.src([
    './src/pressure.js',
    './src/element.js',
    './src/adapters/adapter.js',
    './src/adapters/adapter_force_touch.js',
    './src/adapters/adapter_3d_touch.js',
    './src/adapters/adapter_pointer.js',
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
    './src/adapters/adapter_pointer.js',
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
    /**
     * The UMD wrapper expects an exports() string for an expression the factory() should return,
     * and a namespace() string for a global value that should be set when no loader is present.
     * However, since jquery_pressure.js mutates $ several times instead of returning a value,
     * it does not need to use these features, so we set them to harmless no-ops.
     */
    namespace: function() {
      // sets `window.jQuery__pressure` to undefined
      return 'jQuery__pressure';
    },
    exports: function() {
      // safely returns undefined from factory
      return 'void 0';
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
