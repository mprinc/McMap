import * as CONFIG from '../config';

// returns CONFIG exports to be used in templates
// TODO: Add an interface to register more template locals.
export function templateLocals() {
  return CONFIG;
}
