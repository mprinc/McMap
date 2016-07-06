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

import {MapLoader} from '../../js/knalledge/mapLoader';
import {McmMapLayout, NodeWithChildren} from './mcmMapLayout';
import {McmMapInteraction} from './mcmMapInteraction';

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

declare var knalledge;
declare var window;

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
    itemContainer: NodeWithChildren;
    itemToolbar: any = {
        visible: false
    };
    mapLoader: MapLoader;
    model;
    mapStructure;
    mcmMapLayout:McmMapLayout;
    mcmMapInteraction:McmMapInteraction;

    constructor(
        // public router: Router,
        @Inject('McmMapViewService') mcmMapViewService: McmMapViewService,
        @Inject('McmMapPolicyService') private mcmMapPolicyService: McmMapPolicyService,
        @Inject('KnalledgeMapService') private knalledgeMapService,
        @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    ) {
        console.log('[McmMain]');
        this.viewConfig = mcmMapViewService.get().config;
        this.policyConfig = mcmMapPolicyService.get().config;

        var nodeMediaClickedEventName = "nodeMediaClickedEvent";
        this.globalEmitterServicesArray.register(nodeMediaClickedEventName);

        this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('mcmMap.Main', function(vkNode) {
            console.log("media clicked: ", vkNode.kNode.name);
        });

        let parsedObj = this.parseParameters();
        // '5564ce0e77a67c82a0394699'
        let mapId = parsedObj.parameters.id;
        this.mapLoader = new MapLoader(mapId,
            this.knalledgeMapService, this.knalledgeMapVOsService,
            this.globalEmitterServicesArray);
        this.mapLoader.onMapLoaded(this.mapLoaded.bind(this));

        var clientApi = {};
        this.mcmMapInteraction = new McmMapInteraction();
    };
    ngOnInit() {
        this.mapLoader.init();
    }

    parseParameters(url?){
        url = (typeof url !== 'undefined') ? url :
            window.location.href;

        // http://localhost:5556/#/mcmap/id/5564ce0e77a67c82a0394699/?node_id=55a42cf9d625640931bcd685
        let parsedObj:any = {
            path: '',
            parameters: {}
        };
        let regex = new RegExp(
            "\\#\\/([^\\/]+)(\\/([^\\/]+)\\/([^\\/\\?\\&]+))+"
        );

        let results = regex.exec(url);

        if(!results) return parsedObj;

        parsedObj.path = results[1];
        parsedObj.parameters[results[3]] = results[4];

        regex = new RegExp(
            "\\?(([^\\=]+)\\=([^\\/\\?\\&]+))"
        );
        results = regex.exec(url);
        if(!results) return parsedObj;

        parsedObj.parameters[results[2]] = results[3];

        return parsedObj;
    }

    mapLoaded(model){
        this.model = model;
        this.mapStructure = this.knalledgeMapVOsService.mapStructure;
        this.mcmMapLayout = new McmMapLayout(this.mapStructure);
        this.itemContainer = this.mcmMapLayout.generateView();
        this.onSelectedItem();
    }

    // http://learnangular2.com/events/
    onSelectedItem(item: NodeWithChildren=null) {
        item = (this.itemSelected !== item) ? item : null;
        this.itemSelected = item;
        this.itemToolbar.visible = !!item;
    }

    onEnteredItem(item: NodeWithChildren) {
        // TODO: move to map
        this.mapStructure.setSelectedNode(item.node);
        this.itemContainer = this.mcmMapLayout.generateView();
        this.onSelectedItem();
    }

    // TODO: move to map
    navigateBack() {
        let parentNodes = this.mapStructure.getParentNodes(this.itemContainer.node);
        this.onSelectedItem();
        if(parentNodes.length > 0){
            this.mapStructure.setSelectedNode(parentNodes[0]);
            this.itemContainer = this.mcmMapLayout.generateView();
        }
    }

    onItemContainerChanged(item: any) {
        item = (this.itemContainer !== item) ? item : null;
        this.itemContainer = item;
        this.onSelectedItem();
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
