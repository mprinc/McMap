//if we are providing a global variables we need to get them out of use-strict-function pattern
var mcm;

(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

mcm = {};

}()); // end of 'use strict';