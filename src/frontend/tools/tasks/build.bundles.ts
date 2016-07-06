import * as merge from 'merge-stream';
import {
  PROD_DEPENDENCIES,
  JS_PROD_SHIMS_BUNDLE,
  JS_DEST
} from '../config';

var vfs = require('vinyl-fs');

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
      return vfs.src(getShims())
      // Minify files with UglifyJS
      // https://www.npmjs.com/package/gulp-uglify
      // Strip comments and sourcemaps
      // TODO: fix problem with uglify, DISABLED at the moment
    //   .pipe(plugins.uglify({
    //     mangle: false
    //   }))
      .pipe(plugins.concat(JS_PROD_SHIMS_BUNDLE))
      .pipe(vfs.dest(JS_DEST));
    }
  };
};
