import * as merge from 'merge-stream';
import {
    PROD_DEPENDENCIES,
    JS_PROD_SHIMS_BUNDLE,
    JS_DEST
} from '../config';

var vfs = require('vinyl-fs');

// JS: minify all shims/libs/inject==true dependencies into JS_DEST/JS_PROD_SHIMS_BUNDLE
export = function bundles(gulp, plugins) {
    return function() {

        return merge(bundleShims());

        // get sources of *.js dependencies that .inject are either shims or libs or true
        function getShims() {
            let libs = PROD_DEPENDENCIES
                .filter(d => /\.js$/.test(d.src));
            console.log("[build.bundles] libs: ", libs);
            let libsShims = libs.filter(l => l.inject === 'shims')
                .concat(libs.filter(l => l.inject === 'libs'))
                .concat(libs.filter(l => l.inject === true))
                .map(l => l.src);
            console.log("[build.bundles] libsShims: ", libsShims);
            return libsShims;
        }

        function bundleShims() {
          let shims = getShims();
          if (shims.length === 0) {
              return gulp.src([]);
          } else {
            return vfs.src(shims)
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
        }
    };
};
