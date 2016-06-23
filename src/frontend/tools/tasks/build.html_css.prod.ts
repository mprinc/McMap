import * as merge from 'merge-stream';
import {join} from 'path';
import {
  APP_SRC,
  TMP_DIR,
  PROD_DEPENDENCIES,
  CSS_PROD_BUNDLE,
  CSS_DEST
} from '../config';

// minifies project css files and puts into TMP_DIR,
// copies html templates to TMP_DIR, and
// process external css files and stores them into CSS_DEST
export = function buildJSDev(gulp, plugins) {
  return function () {
    let debug = false;

    // https://www.npmjs.com/package/merge-stream
    return merge(minifyComponentCss(), prepareTemplates(), processExternalCss());

    // copies html templates to tmp dir
    function prepareTemplates() {
      return gulp.src(join(APP_SRC, '**', '*.html'))
        .pipe(gulp.dest(TMP_DIR));
    }

    // minify css files from the project
    // TODO: mprinc:
    // - not sure why not minifying assets?
    // - probable because assets are something that we are not working on,
    //  but just providing to the project output
    // still it would make sense to minify them or at least concat them together
    function minifyComponentCss() {
      return gulp.src([
          join(APP_SRC, '**', '*.css'),
          '!' + join(APP_SRC, 'assets', '**', '*.css')
        ])
        // https://www.npmjs.com/package/gulp-cssnano
        .pipe(plugins.cssnano())
        .pipe(gulp.dest(TMP_DIR));
    }

    // gets external css from PROD_DEPENDENCIES (config.ts file)
    // minifies them into CSS_PROD_BUNDLE and stores in CSS_DEST (config.ts file)
    function processExternalCss() {
      var externalCssFiles = getExternalCss().map(r => r.src);
      if(debug) plugins.util.log('[processExternalCss] externalCssFiles: ', externalCssFiles);
      // if(debug) plugins.util.log('[processExternalCss] CSS_PROD_BUNDLE: ', CSS_PROD_BUNDLE);
      // if(debug) plugins.util.log('[processExternalCss] CSS_DEST: ', CSS_DEST);
      let stream = gulp.src(externalCssFiles)
        .pipe(plugins.sniff('processExternalCss', {detailed: true}))
        .pipe(plugins.cssnano())
        .pipe(plugins.concat(CSS_PROD_BUNDLE))
        .pipe(gulp.dest(CSS_DEST));

        stream.on('end', function() {
            if(debug) plugins.util.log(plugins.util.colors.blue("[build.js.prod:processExternalCss]"),
                plugins.sniff.get("processExternalCss"));
        });

    return stream;
    }

    // get css files from external dependencies listed in
    // config.ts file under PROD_DEPENDENCIES
    function getExternalCss() {
        var externalCssFiles = PROD_DEPENDENCIES.filter(d => /\.css$/.test(d.src));
        // if(debug) plugins.util.log('[getExternalCss] externalCssFiles: ', externalCssFiles);
      return externalCssFiles;
    }
  };
};
