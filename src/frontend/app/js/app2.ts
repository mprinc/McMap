// https://github.com/angular/angular/blob/master/modules/angular2/src/upgrade/upgrade_adapter.ts
import {upgradeAdapter, moduleProviders, moduleDeclarations, moduleImports} from './upgrade_adapter';

import {LoginStatusComponent} from '../components/login/login-status-component';
import {McmMain} from '../components/mcmMap/mcmMain';
import {KnalledgeMapPolicyService} from '../components/knalledgeMap/knalledgeMapPolicyService';
import {KnalledgeMapViewService} from '../components/knalledgeMap/knalledgeMapViewService';
import {McmMapPolicyService} from '../components/mcmMap/mcmMapPolicyService';
import {McmMapViewService} from '../components/mcmMap/mcmMapViewService';
import {TopiChatReports} from '../components/topiChat/reports';
import {GlobalEmitterService} from '../components/collaboPlugins/globalEmitterService';
import {GlobalEmitterServicesArray} from '../components/collaboPlugins/globalEmitterServicesArray';
import {TopiChatConfigService} from '../components/topiChat/topiChatConfigService';
import {TopiChatService} from '../components/topiChat/topiChatService';
import {ApprovalNodeService} from '../components/gardening/approval.node.service';
import {ChangeService} from '../components/change/change.service';

import {CollaboGrammarService} from '../components/collaboPlugins/CollaboGrammarService';

// add only if knalledgeMap plugin is added
import { MapInteraction } from './interaction/mapInteraction';
import { MapLoader } from './knalledge/mapLoader';

import { Injector } from '../components/utils/injector';
var injector:Injector = new Injector();
/// <reference path="../../../typings/browser/ambient/angular/angular.d.ts" />
/// <reference path="../../../typings/browser/ambient/angular-route/angular-route.d.ts" />

// Loading external puzzles-containers dependencies
// like injecting services, providers, etc
import './pluginDependencies';
import {PluginsPreloader} from '../components/collaboPlugins/pluginsPreloader';
injector.addPath("puzzles.collaboPlugins.PluginsPreloader", PluginsPreloader);
declare var Config:any;
for(let puzzleName in Config.Plugins.external){
  let puzzleInfo = Config.Plugins.external[puzzleName];
  PluginsPreloader.loadServicesFromExternalPuzzleContainer(puzzleInfo);
}

/** used instead of
* import {MATERIAL_PROVIDERS} from 'ng2-material';
* because of the bug
* https://github.com/justindujardin/ng2-material/issues/271
*/
//upgradeAdapter.addProvider(provide(OVERLAY_CONTAINER_TOKEN, {useValue: createOverlayContainer()}));
// upgradeAdapter.addProvider(MATERIAL_PROVIDERS);

/** for Angular Forms:
* instead of
* `bootstrap(AppComponent, [
* disableDeprecatedForms(),
* provideForms()
* ])`
* that cannot be used until we bootstrap as Angular 2
*/
// upgradeAdapter.addProvider(disableDeprecatedForms());
// upgradeAdapter.addProvider(provideForms());

declare var angular;

import {KnalledgeMapMain} from '../components/knalledgeMap/main';
import {MapsList} from '../components/mapsList/maps-list.component';

// registering ng2 directives in ng1 space
angular.module('knalledgeMapDirectives')
    .directive({
       'knalledgeMapMain':
           upgradeAdapter.downgradeNg2Component(KnalledgeMapMain)
    })
//     .directive({
//         'loginStatus':
//             upgradeAdapter.downgradeNg2Component(LoginStatusComponent)
//     })
    .directive({
       'mapsList':
           upgradeAdapter.downgradeNg2Component(MapsList)
   })
    ;

// angular.module('McModelarNg2', ['mcmMapsDirectives']);

angular.module('mcmMapsDirectives')
     .directive({
         'mcmMain':
             upgradeAdapter.downgradeNg2Component(McmMain)
    })
    ;

/** for Angular Forms:
* instead of
* `bootstrap(AppComponent, [
* disableDeprecatedForms(),
* provideForms()
* ])`
* that cannot be used until we bootstrap as Angular 2
*/

var topiChatServices = angular.module('topiChatServices');
topiChatServices
    .service('TopiChatConfigService', TopiChatConfigService)
    .service('TopiChatService', TopiChatService)
    ;

var gardeningServices = angular.module('gardeningServices');
gardeningServices
    .service('ApprovalNodeService', ApprovalNodeService)
    ;


// In Angular 2, we have to add a provider configuration for the component’s injector,
// but since we don’t bootstrap using Angular 2, there’s no way to do so.
// ngUpgrade allows us to add a provider using the addProvider() method to solve this scenario.
// upgradeAdapter.addProvider(GlobalEmitterServicesArray);

// registering ng1 services (written in TypeScript) into/as ng1 services
var knalledgeMapServicesModule =
    angular.module('knalledgeMapServices');
knalledgeMapServicesModule
  .service('KnalledgeMapPolicyService', KnalledgeMapPolicyService)
  .service('KnalledgeMapViewService', KnalledgeMapViewService);

var mcmMapServicesModule =
    angular.module('mcmMapServices');
mcmMapServicesModule
    .service('McmMapPolicyService', McmMapPolicyService)
    .service('McmMapViewService', McmMapViewService)

 // .service('GlobalEmitterService', upgradeAdapter.downgradeNg2Provider(GlobalEmitterService))
 // .service('GlobalEmitterService', GlobalEmitterService)
 .service('GlobalEmitterServicesArray', GlobalEmitterServicesArray)
 // .service('BroadcastManagerService', BroadcastManagerService)
  ;

// upgrading ng1 services into ng2 space
upgradeAdapter.upgradeNg1Provider('KnAllEdgeRealTimeService');
upgradeAdapter.upgradeNg1Provider('RimaService');
upgradeAdapter.upgradeNg1Provider('CollaboPluginsService');
upgradeAdapter.upgradeNg1Provider('Plugins');
upgradeAdapter.upgradeNg1Provider('ENV');
// upgradeAdapter.upgradeNg1Provider('$injector');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapVOsService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapService');
// upgradeAdapter.upgradeNg1Provider('BroadcastManagerService');
upgradeAdapter.upgradeNg1Provider('TopiChatConfigService');
upgradeAdapter.upgradeNg1Provider('TopiChatService');
upgradeAdapter.upgradeNg1Provider('GlobalEmitterServicesArray');

// upgrading ng1 services (written in TS) into ng2 space
upgradeAdapter.upgradeNg1Provider('KnalledgeMapViewService');
upgradeAdapter.upgradeNg1Provider('KnalledgeMapPolicyService');
upgradeAdapter.upgradeNg1Provider('McmMapPolicyService');
upgradeAdapter.upgradeNg1Provider('ApprovalNodeService');
upgradeAdapter.upgradeNg1Provider('IbisTypesService');

upgradeAdapter.upgradeNg1Provider('McmMapSchemaService');
upgradeAdapter.upgradeNg1Provider('McmMapAssumptionService');
upgradeAdapter.upgradeNg1Provider('McmMapObjectService');
upgradeAdapter.upgradeNg1Provider('McmMapVariableQuantityService');
upgradeAdapter.upgradeNg1Provider('McmMapVariableOperatorService');
upgradeAdapter.upgradeNg1Provider('McmMapChangesService');
upgradeAdapter.upgradeNg1Provider('McmMapProcessService');
upgradeAdapter.upgradeNg1Provider('McmMapGridService');
upgradeAdapter.upgradeNg1Provider('McmMapVisualService');
upgradeAdapter.upgradeNg1Provider('McmMapViewService');

injector.addPath("utils.Injector", Injector);
injector.addPath("interaction.MapInteraction", MapInteraction);
injector.addPath("knalledge.MapLoader", MapLoader);

angular.module('Config')
	.constant("injector", injector)
;


var changeServices =
    angular.module('changeServices');
changeServices.
    service('ChangeService', upgradeAdapter.downgradeNg2Provider(ChangeService));

var collaboServices =
    angular.module('collaboPluginsServices');
collaboServices.
    service('CollaboGrammarService', upgradeAdapter.downgradeNg2Provider(CollaboGrammarService));

// console.log('GOTOVO ng2 a');

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {HttpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '@angular/material';
// Bootstrap 4 + ng2
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Ng2MaterialModule} from 'ng2-material';

// NG2 TS services
moduleProviders.push(ChangeService);
moduleProviders.push(CollaboGrammarService);

// import {KnalledgeMapTools} from '../components/knalledgeMap/tools';
import {MainModule} from '../components/knalledgeMap/main';
import {McmMainModule} from '../components/mcmMap/mcmMain';
import {MapsListModule} from '../components/mapsList/maps-list.component';
// NG1 components
// moduleDeclarations.push(upgradeAdapter.upgradeNg1Component('knalledgeMapsList'));
// NG2 components
moduleDeclarations.push(KnalledgeMapMain);
moduleDeclarations.push(McmMain);

moduleImports.push(BrowserModule);
moduleImports.push(FormsModule);
moduleImports.push(HttpModule);
// moduleImports.push(RouterModule.forRoot(DEMO_APP_ROUTES));
moduleImports.push(MaterialModule.forRoot());
moduleImports.push(Ng2MaterialModule.forRoot());
moduleImports.push(NgbModule.forRoot());

// CF modules
moduleImports.push(MainModule);
moduleImports.push(MapsListModule);
moduleImports.push(McmMainModule);

@NgModule({
  imports: moduleImports,
  declarations: moduleDeclarations,
  providers: moduleProviders,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  // entryComponents: [
  //   // DemoApp,
  // ],
})
export class AppModule {}

// patching fake NgModule with a real one
// TODO: NOTE: this part is implementation speciffic and needs to be checked against new angular versions
upgradeAdapter['ng2AppModule'] = AppModule;

// bootstrapping app
upgradeAdapter.bootstrap(document.body, ['McModelarApp'], {strictDi: false})
.ready((ref) => {
  var knalledgeMapViewService = ref.ng1Injector.get('KnalledgeMapViewService');
  knalledgeMapViewService.get().config.edges.showUnknownEdges = true;
  knalledgeMapViewService.get().config.nodes.showUnknownNodes = true;

  // notify to the rest of the system that ng1 and ng2 ratrace is finished and
  // that services ara available so loading of the system can start
  var knalledgeMapPolicyService = ref.ng1Injector.get('KnalledgeMapPolicyService');
  // alert('KnalledgeMapPolicyService: ' + knalledgeMapPolicyService);
  knalledgeMapPolicyService.get().config.running.ng1ng2Ready = true;
});

// console.log('GOTOVO ng2 b');
