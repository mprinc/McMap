import {join} from 'path';
import * as merge from 'merge-stream';
import {APP_SRC, TMP_DIR, TMP_DIR_BASE, SUB_PROJECT, DEV_PUZZLES_SRC, DEV_PUZZLES_DEST} from '../config';
import {templateLocals, tsProjectFn} from '../utils';
// import * as runSequence from 'run-sequence';

var vfs = require('vinyl-fs');

// resolves external ng2 templates into inline, compiles typescript,
// and parses output with Lo-Dash/Underscore template renders/precompiles
// and outputs everything to dest
// in that way we can use all exported values from the config.ts
// and achieve something like (see the example in src/buttons/main.ts):
//    if ('<%= ENV %>' === 'prod') { enableProdMode(); }
export = function buildJSProd(gulp, plugins) {
    let debug = true;
    return function() {
      function inlineNg1Templates(src, dest) {
          if(debug) plugins.util.log("[build.js.prod] inlineNg1Templates starts");
          // https://www.npmjs.com/package/gulp-angular-templatecache
          const INLINE_OPTIONS = {
              // module: 'ng1Templates',
              // standalone: true
          };

          if(debug) plugins.util.log("[inlineNg1Templates] src: ", src);

          let stream = vfs.src(src, {followSymlinks: true});
          if(SUB_PROJECT.SYM_LINKS_EXISTS){
              stream = stream
              .pipe(plugins.filter(['app/components/**/*.*']));
          }

          stream = stream
              .pipe(plugins.plumber())
              .pipe(plugins.sniff('inlineNg1Templates'))
              // https://www.npmjs.com/package/gulp-angular-templatecache
              .pipe(plugins.angularTemplatecache('js/ng1Templates.js', INLINE_OPTIONS));

          stream.on('end', function() {
              if(debug) plugins.util.log("[build.js.prod] inlineNg1Templates:", plugins.sniff.get("inlineNg1Templates"));
          });

          stream = stream
          // renders/precompiles Lo-Dash/Underscore templates
          // https://www.npmjs.com/package/gulp-template

          // templateLocals(): returns all exported values from the config.ts and
          // provides them to be used as data for rendering
          // in that way we can use (in src/buttons/main.ts) something like:
          //    if ('<%= ENV %>' === 'prod') { enableProdMode(); }
              .pipe(plugins.template(templateLocals()));

          if(SUB_PROJECT.SYM_LINKS_EXISTS){
              stream = stream
                  .pipe(plugins.replace(/put\(\"app\/components/g, 'put\(\"components'));
          }

          stream = stream
              .pipe(vfs.dest(dest));

          return stream;
      }

      function inlineNg2TemplatesAndCompileTs(src, dest) {
          if(debug) plugins.util.log("[build.js.prod] inlineNg2TemplatesAndCompileTs starts");
          // https://www.npmjs.com/package/gulp-inline-ng2-template#configuration
          const INLINE_OPTIONS = {
              base: dest,
              indent: 4,
              useRelativePaths: SUB_PROJECT.COMPILATION.INLINE.USE_RELATIVE_PATHS,
              removeLineBreaks: true
          };

          // creates a TypeScript project from the 'tsconfig.json' file
          let tsProject = tsProjectFn(plugins);

          if(debug) plugins.util.log("[inlineNg2TemplatesAndCompileTs] src: ", src);

          let result = vfs.src(src)
              .pipe(plugins.sniff("inlineNg2TemplatesAndCompileTs", { captureFolders: true, captureFilenames: true }))
              .pipe(plugins.plumber())
          // https://www.npmjs.com/package/gulp-inline-ng2-template#configuration
              .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
              .pipe(plugins.typescript(tsProject))
              .pipe(plugins.template(templateLocals()))
              .pipe(vfs.dest(dest));

          result.on('end', function() {
              // if(debug) plugins.util.log("[build.js.prod] (name:%s): ", "inlineNg2TemplatesAndCompileTs",
              //  plugins.sniff.get("inlineNg2TemplatesAndCompileTs"));
          });

          return result;

          /*            return result.js
                      // renders/precompiles Lo-Dash/Underscore templates
                      // https://www.npmjs.com/package/gulp-template

                      // templateLocals(): returns all exported values from the config.ts and
                      // provides them to be used as data for rendering
                      // in that way we can use (in src/buttons/main.ts) something like:
                      //    if ('<%= ENV %>' === 'prod') { enableProdMode(); }
                          .pipe(plugins.template(templateLocals()))
                          .pipe(vfs.dest(dest));
          */
      }

      // https://www.npmjs.com/package/merge-stream
      return merge(buildProject(), buildDevPuzzles());

      function buildDevPuzzles() {
        // https://www.npmjs.com/package/merge-stream
        // return merge(inlineNg1Templates(), inlineNg2TemplatesAndCompileTs());
        // return function() {
        //     if(debug) plugins.util.log("[build.js.prod]");
        //     runSequence(inlineNg1Templates, inlineNg2TemplatesAndCompileTs);
        // };
        if(debug) plugins.util.log("[build.js.prod]");

        // src files are all ts files (except tests/template ones) and type definitions

        let srcNg1 = SUB_PROJECT.SYM_LINKS_EXISTS ?
            // this does work for symbolic links
            ['**/*.tpl.html'] :
            // this doesn't work for symbolic links
            [
                join(DEV_PUZZLES_SRC, '**/*.tpl.html')
            ];

        // src files are all ts files (except tests/template ones) and type definitions
        let srcNg2 = [
            'typings/index.d.ts',
            'tools/manual_typings/**/*.d.ts',
            join(DEV_PUZZLES_SRC, '**/*.ts'),
            '!' + join(DEV_PUZZLES_SRC, '**/*.spec.ts'),
            '!' + join(DEV_PUZZLES_SRC, '**/*.e2e.ts')
        ];

        return merge(inlineNg1Templates(srcNg1, join(TMP_DIR_BASE, DEV_PUZZLES_SRC)),
          inlineNg2TemplatesAndCompileTs(srcNg2, join(TMP_DIR_BASE, DEV_PUZZLES_SRC)));
        // runSequence(inlineNg1Templates, inlineNg2TemplatesAndCompileTs);
      }

      function buildProject() {
        // https://www.npmjs.com/package/merge-stream
        // return merge(inlineNg1Templates(), inlineNg2TemplatesAndCompileTs());
        // return function() {
        //     if(debug) plugins.util.log("[build.js.prod]");
        //     runSequence(inlineNg1Templates, inlineNg2TemplatesAndCompileTs);
        // };
        if(debug) plugins.util.log("[build.js.prod]");

        // src files are all ts files (except tests/template ones) and type definitions
        let srcNg1 = SUB_PROJECT.COMPILATION.INLINE_NG1.SRC || [
            join(APP_SRC, '**/*.html'),
            '!' + join(APP_SRC, '**/index.html')
        ];

        // src files are all ts files (except tests/template ones) and type definitions
        let srcNg2 = [
            'typings/index.d.ts',
            'tools/manual_typings/**/*.d.ts',
            join(APP_SRC, '**/*.ts'),
            '!' + join(APP_SRC, '**/*.spec.ts'),
            '!' + join(APP_SRC, '**/*.e2e.ts')
        ];

        return merge(inlineNg1Templates(srcNg1, TMP_DIR),
          inlineNg2TemplatesAndCompileTs(srcNg2, TMP_DIR));
        // runSequence(inlineNg1Templates, inlineNg2TemplatesAndCompileTs);

      }
    };
};
