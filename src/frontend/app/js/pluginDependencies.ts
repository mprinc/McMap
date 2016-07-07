// Here go all dependencies that plugins reuqire,
// but are not explicitly imported from any file reachable
// from the app entry file (in our case `js/app2.js`)

// import {TopPanel} from '../components/topPanel/topPanel';
// var cTopPanel = TopPanel;

import {GardeningControls} from '../components/gardening/gardening-controls.component';
var cGardeningControls = GardeningControls;

import {RimaUsersList} from '../components/rima/rimaUsersList';
var cRimaUsersList = RimaUsersList;

import {IbisTypesList} from '../components/knalledgeMap/ibisTypesList';
var cIbisTypesList = IbisTypesList;
