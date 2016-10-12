import * as merge from 'merge-stream';
import {join} from 'path';

/*
Gulp doesn't follow symlinks and folders, and it crashes with an ambigous error: ""

[The solution](http://stackoverflow.com/questions/28079374/gulp-giving-error-on-symlinks-in-gulp-src) is to
use [vinyl-fs](https://www.npmjs.com/package/vinyl-fs).
 */
var vfs = require('vinyl-fs');

import {APP_SRC, APP_DEST, DEV_DEPENDENCIES} from '../config';

// copies set of asset files (not *.ts and *.scss) from APP_SRC to APP_DEST
//  it will copy js files, css, html files,
//  because in dev they should not be combined into bundles
export = function buildAssetsDev(gulp, plugins) {
  return function() {
    // https://www.npmjs.com/package/merge-stream
    return merge(copyProjectInternalAsets(), copyProjectExternalAsets());

    // copies all external asset dependencies (d.asset === true)
    // to their designated destionations (d.dest)
    function copyProjectExternalAsets() {
      var externalAssetFiles = DEV_DEPENDENCIES.filter(d => d.asset);
      console.log("[copyProjectExternalAsets] externalAssetFiles: ", externalAssetFiles);
      // http://stackoverflow.com/questions/26784094/can-i-use-a-gulp-task-with-multiple-sources-and-multiple-destinations
      var tasks = externalAssetFiles.map(function(element) {
        // https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpsrcglobs-options
        return vfs.src(element.src)
          // https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulpdestpath-options
          .pipe(vfs.dest(element.dest, {overwrite: true, mode: parseInt("0666", 8), dirMode: parseInt("0777", 8)}));
      });

      return merge(...tasks);
    }

    // copies set of asset files (not *.ts and *.scss) from APP_SRC to APP_DEST
    //  it will copy js files, css, html files,
    function copyProjectInternalAsets() {
      var stream = vfs.src([
        join(APP_SRC, '**'),
        '!' + join(APP_SRC, '**', '*.ts'),
        '!' + join(APP_SRC, '**', '*.scss')
    ], { follow: true })
        .pipe(plugins.sniff("internal-assets", {captureFolders: true, captureFilenames: false}))
        .pipe(vfs.dest(APP_DEST, {overwrite: true, mode: parseInt("0666", 8), dirMode: parseInt("0777", 8)}));
        // ;

        stream.on('end', function() {
            // console.log("[build.assets.dev] internal-assets:", plugins.sniff.get("internal-assets"));
        });

      return stream;
    }
  };
};
