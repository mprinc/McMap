import * as gulp from 'gulp';
import {runSequence, task} from './tools/utils';
import {WATCH_BUILD_RULES, WATCH_CHANGED} from './tools/config';

// --------------
// Clean (override).
gulp.task('clean', done => task('clean', 'all')(done));
gulp.task('clean.dev', done => task('clean', 'dev')(done));
gulp.task('clean.prod', done => task('clean', 'prod')(done));
gulp.task('check.versions', () => task('check.versions'));
gulp.task('build.docs', () => task('build.docs'));
gulp.task('serve.docs', () => task('serve.docs'));
gulp.task('serve.coverage', task('serve.coverage'));

gulp.task('build.compass', task('build.compass'));
gulp.task('build.assets.dev', task('build.assets.dev'));
gulp.task('tslint', task('tslint'));
gulp.task('build.js.dev', task('build.js.dev'));
gulp.task('build.index.dev', task('build.index.dev'));

// --------------
// Build dev.
gulp.task('build.dev', done =>
  runSequence('clean.dev', // cleans prod (folder, ...)
              'tslint', // ts linting
              'build.compass', // compiles COMPASS files -> APP_DEST
              'build.assets.dev',   // copies asset files (not *.ts) from APP_SRC -> APP_DEST
                                    // (and dependencies assets -> d.dest)
              'build.js.dev', // compiles ts files, replace templates and adds sourcemaps -> APP_DEST
              'build.index.dev', // inject all dependencies under coresponding placeholders
              done));

// --------------
// Build dev.
gulp.task('build.dev.fast', done =>
runSequence(// 'clean.dev', // cleans prod (folder, ...)
            // 'tslint', // ts linting
            // 'build.compass', // compiles COMPASS files -> APP_DEST
            'build.assets.dev',   // copies asset files (not *.ts) from APP_SRC -> APP_DEST
                                  // (and dependencies assets -> d.dest)
            'build.js.dev', // compiles ts files, replace templates and adds sourcemaps -> APP_DEST
            // 'build.index.dev', // inject all dependencies under coresponding placeholders
            done));

// builds project in a smart way, building only necessary phases
// waiting for user to aprove building, etc
import {buildProject} from './tools/utils/build.dev.smart';
gulp.task('build.dev.smart', function(done){
    buildProject(done);
});


// --------------
// Build dev watch.
gulp.task('build.dev.watch', done =>
  runSequence('build.dev',
              'watch.dev', // watch for any change in the APP_SRC folder
              done));

// --------------
// Build e2e.
gulp.task('build.e2e', done =>
  runSequence('clean.dev',
              'tslint',
              'build.compass', // compiles COMPASS files -> APP_DEST
              'build.assets.dev',
              'build.js.e2e',
              'build.index.dev',
              done));

// --------------
// Build prod.
gulp.task('build.prod', done =>
  runSequence('clean.prod', // cleans prod (folder, ...)
              'tslint', // ts linting
              'build.compass', // compiles COMPASS files -> APP_DEST
              'build.assets.prod',  // copies set of asset files to APP_DEST
                                    // (not *.ts, *.js, *.html, *.css)
                                    // dependencies assets -> d.dest
              'build.html_css.prod',    // project css and html (templates) -> TMP_DIR,
                                        // external css -> CSS_DEST
              'build.js.prod', // ng2/Lo-Dash/Underscore templates, compiles typescript -> TMP_DIR
              'build.bundles', // JS: minify and concatenate all js dependencies -> JS_DEST/JS_PROD_SHIMS_BUNDLE
              'build.bundles.app',  // builds with SystemJS Builder from SYSTEM_BUILDER_CONFIG.paths (all code used in the project)
                                    // a SystemJS bundle into JS_DEST/JS_PROD_APP_BUNDLE
              'build.index.prod', // injects css/js shims/bundles -> APP_SRC/'index.html'
              done));


// Exports the build.js.prod task mainly to provide documentation generation
// for the TypeScript
gulp.task('build.js.prod', done =>
    runSequence(
        'build.js.prod', // ng2/Lo-Dash/Underscore templates, compiles typescript -> TMP_DIR
        done));

// just for testing and accessing directly to a task
// it is ok to rename build.bundles to anything
// you need to set env before that:
// for production: export NODE_ENV=prod
// for development: export NODE_ENV=dev
// then run: npm run temp
gulp.task('temp', done =>
    runSequence(
        'build.bundles.app',
        done));

// just for testing and accessing directly to a task
// it is ok to rename build.bundles.app to anything
gulp.task('build.bundles.app', done =>
    runSequence(
        'build.bundles.app', // ng2/Lo-Dash/Underscore templates, compiles typescript -> TMP_DIR
        done));

// just for testing and accessing directly to a task
// it is ok to rename build.index.prod to anything
gulp.task('build.index.prod', done =>
    runSequence(
        'build.index.prod', // ng2/Lo-Dash/Underscore templates, compiles typescript -> TMP_DIR
        done));


// --------------
// Build test.
gulp.task('build.test', done =>
  runSequence('clean.dev',
              'tslint',
              'build.compass', // compiles COMPASS files -> APP_DEST
              'build.assets.dev',
              'build.js.test',
              'build.index.dev',
              done));

// --------------
// Build test watch.
gulp.task('build.test.watch', done =>
  runSequence('build.test',
              'watch.test',
              done));

// --------------
// Docs
// Disabled until https://github.com/sebastian-lenz/typedoc/issues/162 gets resolved
gulp.task('docs', done =>
  runSequence('build.docs',
              'serve.docs',
              done));

// --------------
// Serve dev
gulp.task('serve.dev', done =>
  runSequence('build.dev', // builds dev version of project
            'server.start', // starts server
            'watch.serve', // watch on the project changes
                        // (if any file in APP_SRC is changed it runs 'build.dev' again)
            done));

// --------------
// Start smart server development
// builds project in a smart way, watching for and then building only necessary phases
// waiting for user to aprove building, etc
import {printCommands} from './tools/utils/build.dev.smart';
gulp.task('serve.dev.smart', done =>
  runSequence(
            'build.dev.smart', // builds dev version of project
            'server.start', // starts server
            'watch.serve.smart', // watch on the project changes
                        // (if any file in APP_SRC is changed it runs 'build.dev' again)
            function(err){
              printCommands();
              done(err);
            }));

// --------------
// Serve dev
gulp.task('serve.dev.fast', done =>
  runSequence('build.dev.fast', // builds dev version of project
            'server.start', // starts server
            'watch.serve.fast', // watch on the project changes
                        // (if any file in APP_SRC is changed it runs 'build.dev' again)
            done));

// --------------
// Run server
gulp.task('serve.run', done =>
  runSequence('server.start', // starts server
            done));

// --------------
// Serve e2e
gulp.task('serve.e2e', done =>
  runSequence('build.e2e',
              'server.start',
              'watch.serve',
              done));

// --------------
// Serve prod
gulp.task('serve.prod', done =>
  runSequence('build.prod',
              'server.start',
              'watch.serve',
              done));

// --------------
// Test.
gulp.task('test', done =>
  runSequence('build.test',
              'karma.start',
              done));
