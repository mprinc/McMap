import {join} from 'path';
// SystemJS Build Tool
// https://www.npmjs.com/package/systemjs-builder
// Provides a single-file build for SystemJS of mixed-dependency module trees.
import * as Builder from 'systemjs-builder';
import {
  BOOTSTRAP_MODULE,
  JS_PROD_APP_BUNDLE,
  JS_DEST,
  SYSTEM_BUILDER_CONFIG,
  TMP_DIR
} from '../config';

const BUNDLER_OPTIONS = {
  // SFX Format
  // https://github.com/systemjs/builder#sfx-format
  // CommonJS
  // http://requirejs.org/docs/commonjs.html
  format: 'cjs',
  // https://github.com/systemjs/builder#minification-options
  minify: true,
  mangle: false
};

// builds from SYSTEM_BUILDER_CONFIG.paths a SystemJS bundle into JS_DEST/JS_PROD_APP_BUNDLE
export = function bundles(gulp, plugins) {
  return function (done) {
    let builder = new Builder(SYSTEM_BUILDER_CONFIG);
    // makes a (Self-Executing) bundle that is independent of the SystemJS loader entirely
    // This bundle file can then be included with a <script> tag, and no other dependencies would need to be included in the page.
    //
    // https://github.com/systemjs/builder#sfx-format
    // The first module (TMP_DIR/BOOTSTRAP_MODULE) used as input
    // will then have its exports output as the CommonJS exports of the whole SFX bundle itself
    // when run in a CommonJS environment
    // it saves it into JS_DEST/JS_PROD_APP_BUNDLE
    builder
      .buildStatic(join(TMP_DIR, BOOTSTRAP_MODULE),
                   join(JS_DEST, JS_PROD_APP_BUNDLE),
                   BUNDLER_OPTIONS)
      .then(() => done());
  };
};
