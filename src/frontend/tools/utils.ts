export * from './utils/template_locals';
export * from './utils/server';
export * from './utils/tasks_tools';


// creates a TypeScript project from the 'tsconfig.json' file
// https://github.com/ivogabe/gulp-typescript#using-tsconfigjson
export function tsProjectFn(plugins) {
  return plugins.typescript.createProject('tsconfig.json', {
    typescript: require('typescript')
  });
}
