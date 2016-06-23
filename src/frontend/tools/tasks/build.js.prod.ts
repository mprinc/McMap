import {join} from 'path';
import * as merge from 'merge-stream';
import {APP_SRC, TMP_DIR, SUB_PROJECT} from '../config';
import {templateLocals, tsProjectFn} from '../utils';
// import * as runSequence from 'run-sequence';

// resolves external ng2 templates into inline, compiles typescript,
// and parses output with Lo-Dash/Underscore template renders/precompiles
// and outputs everything to TMP_DIR
// in that way we can use all exported values from the config.ts
// and achieve something like (see the example in src/buttons/main.ts):
//    if ('<%= ENV %>' === 'prod') { enableProdMode(); }
export = function buildJSProd(gulp, plugins) {
    let debug = false;
    return function() {
        // https://www.npmjs.com/package/merge-stream
        // return merge(inlineNg1Templates(), inlineNg2TemplatesAndCompileTs());
        // return function() {
        //     if(debug) plugins.util.log("[build.js.prod]");
        //     runSequence(inlineNg1Templates, inlineNg2TemplatesAndCompileTs);
        // };
        if(debug) plugins.util.log("[build.js.prod]");
        return merge(inlineNg1Templates(), inlineNg2TemplatesAndCompileTs());
        // runSequence(inlineNg1Templates, inlineNg2TemplatesAndCompileTs);

        function inlineNg1Templates() {
            if(debug) plugins.util.log("[build.js.prod] inlineNg1Templates starts");
            // https://www.npmjs.com/package/gulp-angular-templatecache
            const INLINE_OPTIONS = {
                // module: 'ng1Templates',
                // standalone: true
            };

            // src files are all ts files (except tests/template ones) and type definitions
            let src = SUB_PROJECT.COMPILATION.INLINE_NG1.SRC || [
                join(APP_SRC, '**/*.html'),
                '!' + join(APP_SRC, '**/index.html')
            ];
            if(debug) plugins.util.log("[inlineNg1Templates] src: ", src);
            let stream = gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(plugins.sniff('inlineNg1Templates'))
            // https://www.npmjs.com/package/gulp-angular-templatecache
                .pipe(plugins.angularTemplatecache('js/ng1Templates.js', INLINE_OPTIONS));

            stream.on('end', function() {
                if(debug) plugins.util.log("[build.js.prod] inlineNg1Templates:", plugins.sniff.get("inlineNg1Templates"));
            });

            return stream
            // renders/precompiles Lo-Dash/Underscore templates
            // https://www.npmjs.com/package/gulp-template

            // templateLocals(): returns all exported values from the config.ts and
            // provides them to be used as data for rendering
            // in that way we can use (in src/buttons/main.ts) something like:
            //    if ('<%= ENV %>' === 'prod') { enableProdMode(); }
                .pipe(plugins.template(templateLocals()))
                .pipe(gulp.dest(TMP_DIR));
        }

        function inlineNg2TemplatesAndCompileTs() {
            if(debug) plugins.util.log("[build.js.prod] inlineNg2TemplatesAndCompileTs starts");
            // https://www.npmjs.com/package/gulp-inline-ng2-template#configuration
            const INLINE_OPTIONS = {
                base: TMP_DIR,
                indent: 4,
                useRelativePaths: SUB_PROJECT.COMPILATION.INLINE.USE_RELATIVE_PATHS,
                removeLineBreaks: true
            };

            // creates a TypeScript project from the 'tsconfig.json' file
            let tsProject = tsProjectFn(plugins);
            // src files are all ts files (except tests/template ones) and type definitions
            let src = [
                'typings/browser.d.ts',
                'tools/manual_typings/**/*.d.ts',
                join(APP_SRC, '**/*.ts'),
                '!' + join(APP_SRC, '**/*.spec.ts'),
                '!' + join(APP_SRC, '**/*.e2e.ts')
            ];

            if(debug) plugins.util.log("[inlineNg2TemplatesAndCompileTs] src: ", src);

            let result = gulp.src(src)
                .pipe(plugins.sniff("inlineNg2TemplatesAndCompileTs", { captureFolders: true, captureFilenames: true }))
                .pipe(plugins.plumber())
            // https://www.npmjs.com/package/gulp-inline-ng2-template#configuration
                .pipe(plugins.inlineNg2Template(INLINE_OPTIONS))
                .pipe(plugins.typescript(tsProject))
                .pipe(plugins.template(templateLocals()))
                .pipe(gulp.dest(TMP_DIR));

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
                            .pipe(gulp.dest(TMP_DIR));
            */
        }
    };
};
