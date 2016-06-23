import {join, sep, normalize} from 'path';
import {templateLocals} from '../utils';
import {
  APP_SRC,
  APP_DEST,
  CSS_DEST,
  JS_DEST,
  CSS_PROD_BUNDLE,
  JS_PROD_APP_BUNDLE,
  JS_PROD_SHIMS_BUNDLE
} from '../config';

// injects css and js shims and bundles into APP_SRC/'index.html'
export = function buildIndexProd(gulp, plugins) {
  return function () {
    return gulp.src(join(APP_SRC, 'index.html'))
      .pipe(injectJs())
      .pipe(injectCss())
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST));
  };

  function inject(...files) {
    return plugins.inject(
      // https://www.npmjs.com/package/gulp-inject
      gulp.src(files, {
        read: false
      }), {
        // https://www.npmjs.com/package/gulp-inject#injecting-into-a-json-file
        // adds date (to create unique version of the filename in order to avoid caching issues)
        transform: function (filepath) {
          let path = normalize(filepath).split(sep);
          // adds dates sufix
          arguments[0] = path.slice(3, path.length).join(sep) + `?${Date.now()}`;
          return plugins.inject.transform.apply(plugins.inject.transform, arguments);
        }
      });
  }

  function injectJs() {
    return inject(join(JS_DEST, JS_PROD_SHIMS_BUNDLE),
      join(JS_DEST, JS_PROD_APP_BUNDLE));
  }

  // css from assets are not injected, because they are directly copied to the project output
  // TODO: still it would make sense to minify them or at least concat them together
  function injectCss() {
    return inject(join(CSS_DEST, CSS_PROD_BUNDLE));
  }
};
