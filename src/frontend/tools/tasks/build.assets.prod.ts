import * as merge from 'merge-stream';
import {join} from 'path';
import {APP_SRC, APP_DEST, ASSETS_SRC, PROD_DEPENDENCIES} from '../config';
var vfs = require('vinyl-fs');

// copies set of asset files (not *.ts, *.js, *.html, *.css) from APP_SRC to APP_DEST
// it excludes empty folders
// copies dependencies assets to their designated destionations (d.dest)
export = function buildAssetsProd(gulp, plugins) {
  return function() {
    // https://www.npmjs.com/package/merge-stream
    return merge(copyProjectInternalAsets(), copyProjectExternalAsets());

    // copies all external asset dependencies (d.asset === true)
    // to their designated destionations (d.dest)
    function copyProjectExternalAsets() {
      var externalAssetFiles = PROD_DEPENDENCIES.filter(d => d.asset);
      // http://stackoverflow.com/questions/26784094/can-i-use-a-gulp-task-with-multiple-sources-and-multiple-destinations
      var tasks = externalAssetFiles.map(function(element){
        // https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options
        return vfs.src(element.src)
            // https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpdestpath-options
            .pipe(vfs.dest(element.dest));
      });

      return merge(...tasks);
    }

    // copies set of asset files (not *.ts, *.js, *.html, *.css) from APP_SRC to APP_DEST
    // it excludes empty folders
    function copyProjectInternalAsets() {
      // TODO There should be more elegant to prevent empty directories from copying
      let es = require('event-stream');
      var onlyDirs = function(es) {
        // https://www.npmjs.com/package/event-stream#map-asyncfunction
        return es.map(function(file, cb) {
          if (file.stat.isFile()) {
            return cb(null, file);
          } else {
            return cb();
          }
        });
      };

      return vfs.src([
        join(APP_SRC, '**'),
        '!' + join(APP_SRC, '**', '*.ts'),
        '!' + join(APP_SRC, '**', '*.css'),
        '!' + join(APP_SRC, '**', '*.html'),
        '!' + join(ASSETS_SRC, '**', '*.js')
      ])
        .pipe(onlyDirs(es))
        .pipe(vfs.dest(APP_DEST));
    }
  };
};
