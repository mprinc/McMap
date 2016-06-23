import * as merge from 'merge-stream';
import {
  PROD_DEPENDENCIES,
  JS_PROD_SHIMS_BUNDLE,
  JS_DEST
} from '../config';

// JS: minify all shims/libs/inject==true dependencies into JS_DEST/JS_PROD_SHIMS_BUNDLE
export = function bundles(gulp, plugins) {
  return function () {

    return merge(bundleShims());

    // get sources of *.js dependencies that .inject are either shims or libs or true
    function getShims() {
      let libs = PROD_DEPENDENCIES
        .filter(d => /\.js$/.test(d.src));
      return libs.filter(l => l.inject === 'shims')
        .concat(libs.filter(l => l.inject === 'libs'))
        .concat(libs.filter(l => l.inject === true))
        .map(l => l.src);
    }

    function bundleShims() {
      return gulp.src(getShims())
      // Minify files with UglifyJS
      // https://www.npmjs.com/package/gulp-uglify
      // Strip comments and sourcemaps
      .pipe(plugins.uglify({
        mangle: false
      }))
      .pipe(plugins.concat(JS_PROD_SHIMS_BUNDLE))
      .pipe(gulp.dest(JS_DEST));
    }
  };
};
