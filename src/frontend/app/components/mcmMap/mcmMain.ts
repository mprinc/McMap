import {Component, Inject} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {McmListComponent} from './mcmListComponent';

import {McmMapPolicyService} from './mcmMapPolicyService';
import {McmMapViewService} from './mcmMapViewService';
// import {RequestService} from '../request/request.service';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

/**
 * Directive that handles the MCM main directive
 *
 * Selector: `mcm-main`
 * @class McmMain
 * @memberof mcm.mcmMap
 * @constructor
*/

// @RouteConfig([
//     {
//         path: "/",
//         name: "root",
//         redirectTo: ["/Home"]
//     },
//
//     {
//         path: "/maps",
//         name: "Maps",
//         // component: HomeComponent,
//         redirectTo: ["/maps"]
//      useAsDefault: true
//  },
//     {path: '/disaster', name: 'Asteroid', redirectTo: ['CrisisCenter', 'CrisisDetail', {id:3}]}
// ])
//

@Component({
    selector: 'mcm-main',
    moduleId: module.id,
    templateUrl: 'partials/mcm-main.tpl.html',
    providers: [
        MATERIAL_PROVIDERS,
        OVERLAY_PROVIDERS
        // provideRouter
        // RequestService
        // ROUTER_PROVIDERS
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        MD_SIDENAV_DIRECTIVES,
        ROUTER_DIRECTIVES,
        MdToolbar,
        McmListComponent,
        upgradeAdapter.upgradeNg1Component('mcmMapList'),
    //  upgradeAdapter.upgradeNg1Component('ibisTypesList'),
    ],
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/mcmMap/partials/main.tpl.html',
    styles: [`
    `]
})

export class McmMain {
    policyConfig: any;
    viewConfig: any;
    status: String;
    itemSelected: any;
    itemToolbar: any = {
        visible: false
    };

    constructor(
      // public router: Router,
      @Inject('McmMapViewService') mcmMapViewService: McmMapViewService,
      @Inject('McmMapPolicyService') private mcmMapPolicyService: McmMapPolicyService,
      @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
      ) {
      console.log('[McmMain]');
      this.viewConfig = mcmMapViewService.get().config;
      this.policyConfig = mcmMapPolicyService.get().config;
      // globalEmitterServicesArray.register('McmMain');
      // globalEmitterServicesArray.get().subscribe('McmMain', (data) => alert("[McmMain]:"+data));
      // globalEmitterServicesArray.broadcast('McmMain', "Hello from KnalledgeMaMcmMainpTools!");

      var nodeMediaClickedEventName = "nodeMediaClickedEvent";
      this.globalEmitterServicesArray.register(nodeMediaClickedEventName);

      this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('mcmMap.Main', function(vkNode) {
          console.log("media clicked: ", vkNode.kNode.name);
      });
    };

    // http://learnangular2.com/events/
    onSelectedItem(item: any) {
        item = (this.itemSelected !== item) ? item : null;
        this.itemSelected = item;
        this.itemToolbar.visible = !!item;
    }

    go(path: string) {
        // TODO: not implemented
        // alert("Not implemented");
        // this.router.navigate(['/hero', hero.id]);
        //I assumed your `/home` route name is `Home`
        // this._router.navigate([path]); //this will navigate to Home state.
        //below way is to navigate by URL
        //this.router.navigateByUrl('/home')
        // https://angular.io/docs/ts/latest/api/common/index/Location-class.html
        // this.location.go('#/' + path);
        window.location.href = '#/' + path;
    };
}
