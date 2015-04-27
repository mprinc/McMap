//if we are providing a global variables we need to get them out of use-strict-function pattern
(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

mcm.list = {};

}()); // end of 'use strict';