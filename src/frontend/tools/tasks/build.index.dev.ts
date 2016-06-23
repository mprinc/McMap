import {join} from 'path';
import {APP_SRC, APP_DEST, DEV_DEPENDENCIES, SUB_PROJECT} from '../config';
import {templateLocals} from '../utils';

// inject all (shims/libs/and inject='true') dependencies under coresponding placeholders
// adds a versioning (current date) sufix to each file to avoid cashing issues
export = function buildIndexDev(gulp, plugins) {
  var dateTime = '?'+Date.now();
  console.log("[build.index.dev] process.cwd(): ", process.cwd());

  return function () {
    var stream = gulp.src(join(APP_DEST, 'index.html'))
      .pipe(inject('shims')) // inject all depencencies (d.inject == 'shims') under 'shims' placeholder
      .pipe(inject('libs')) // d.inject == 'libs'
      .pipe(inject())   // inject all depencencies (d.inject == true)
                        // under default ('inject:js' or 'inject:css' depending on the file type) placeholder
      // uses CONFIG exports in templates
      .pipe(plugins.template(templateLocals()))
      .pipe(gulp.dest(APP_DEST));

      stream.on('end', function() {
          console.log("[build.index.dev] injected:", plugins.sniff.get("injected"));
      });

    return stream;
  };

  // injects all dependencies (filenames) that conforms to the inject parameter
  // into a html file
  function inject(name?: string) {
    var nameInner = name || 'default';

    var sourceStream = gulp.src(getInjectablesDependenciesRef(name), { read: false })
        .pipe(plugins.sniff(nameInner, {captureFolders: true, captureFilenames: true}));

    sourceStream.on('end', function() {
        console.log("[build.index.dev] (name:%s): ", nameInner, plugins.sniff.get(nameInner));
    });

    let injectOpt = {
      name: name,
      relative: true,
      addRootSlash: false
    };
    if(SUB_PROJECT.COMPILATION.ADD_ANTICACHE_SUFIX) {
        injectOpt['addSuffix'] = dateTime;
    }
    return plugins.inject(sourceStream, injectOpt);
  }

  // get all dependencies that conforms with the inject == name or inject == true if no name
  function getInjectablesDependenciesRef(name?: string | boolean) {
    name = name || true;
    let dependencies = DEV_DEPENDENCIES
      .filter(dep => dep['inject'] && dep['inject'] === name)
      .map(mapPath);
    console.log("[getInjectablesDependenciesRef] dependencies['%s']: ", name, dependencies);
    return dependencies;
  }

  // allows dependencies to have APP_SRC path in it
  // (it get replaced with APP_DEST)
  function mapPath(dep) {
    let envPath = dep.src;
    if (envPath.startsWith(APP_SRC)) {
      envPath = join(APP_DEST, dep.src.replace(APP_SRC, ''));
    }
    return envPath;
  }
};
