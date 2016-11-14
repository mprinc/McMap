// Here go all dependencies that plugins reuqire,
// but are not explicitly imported from any file reachable
// from the app entry file (in our case `js/app2.js`)

// import {TopPanel} from '../components/topPanel/topPanel';
// var cTopPanel = TopPanel;

export var components:any = {};

import {GardeningControls} from '../components/gardening/gardening-controls.component';
components['/components/gardening/gardening-controls.component'] = GardeningControls;

import {RimaUsersList} from '../components/rima/rimaUsersList';
components['/components/rima/rimaUsersList'] = RimaUsersList;

import {IbisTypesList} from '../../dev_puzzles/ibis/ibisTypesList';
components['cf.puzzles.ibis.typesList'] = IbisTypesList;

import {NavigationBreadcrumb} from '../../dev_puzzles/navigation/breadcrumb';
components['cf.puzzles.navigation.breadcrumb'] = NavigationBreadcrumb;

export var servicesDependencies:any = {};

import {CfPuzzlesIbisService} from '../../dev_puzzles/ibis/cf.puzzles.ibis.service';
servicesDependencies['cf.puzzles.ibis.service'] = CfPuzzlesIbisService;

export var modules:any = {};
