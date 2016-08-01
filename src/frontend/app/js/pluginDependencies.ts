// Here go all dependencies that plugins reuqire,
// but are not explicitly imported from any file reachable
// from the app entry file (in our case `js/app2.js`)

// import {TopPanel} from '../components/topPanel/topPanel';
// var cTopPanel = TopPanel;

import {GardeningControls} from '../components/gardening/gardening-controls.component';
import {RimaUsersList} from '../components/rima/rimaUsersList';
import {IbisTypesList} from '../components/knalledgeMap/ibisTypesList';

export var components:any = {};

components['/components/gardening/gardening-controls.component'] = GardeningControls;
components['/components/rima/rimaUsersList'] = RimaUsersList;
components['/components/knalledgeMap/ibisTypesList'] = IbisTypesList;
