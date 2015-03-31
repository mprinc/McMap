//if we are providing a global variables we need to get them out of use-strict-function pattern
var interaction;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

interaction = {};

}()); // end of 'use strict';