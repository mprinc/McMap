import {Component, Inject, EventEmitter, Output} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {McmMapPolicyService} from './mcmMapPolicyService';
import {McmMapViewService} from './mcmMapViewService';
// import {RequestService} from '../request/request.service';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

// TODO: probable remove later, this is just to trigger starting the service
// import {BroadcastManagerService} from '../collaboBroadcasting/broadcastManagerService';

/**
 * Directive that handles the main KnAllEdge or rather CollaboFramework user interface
 *
 * Selector: `mcm-list-component`
 * @class McmListComponent
 * @memberof mcm
 * @constructor
*/

@Component({
    selector: 'mcm-list-component',
    moduleId: module.id,
    templateUrl: 'partials/mcm-list-component.tpl.html',
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
        MdToolbar
        //  upgradeAdapter.upgradeNg1Component('ibisTypesList'),
    ],
    // necessary for having relative paths for templateUrl
    // http://schwarty.com/2015/12/22/angular2-relative-paths-for-templateurl-and-styleurls/
    // t_emplateUrl: 'components/mcmMap/partials/main.tpl.html',
    styles: [`
    `]
})

export class McmListComponent {
    policyConfig: any;
    viewConfig: any;
    item: any;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @Output() selectedItem = new EventEmitter<any>();

    constructor(
        // public router: Router,
        @Inject('McmMapViewService') mcmMapViewService: McmMapViewService,
        @Inject('McmMapPolicyService') private mcmMapPolicyService: McmMapPolicyService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    // @Inject('BroadcastManagerService') broadcastManagerService:BroadcastManagerService
        ) {
        console.log('[McmMain]');
        this.viewConfig = mcmMapViewService.get().config;
        this.policyConfig = mcmMapPolicyService.get().config;

        var nodeMediaClickedEventName = "nodeMediaClickedEvent";
        this.globalEmitterServicesArray.register(nodeMediaClickedEventName);

        this.globalEmitterServicesArray.get(nodeMediaClickedEventName).subscribe('mcmMap.Main', function(vkNode) {
            console.log("media clicked: ", vkNode.kNode.name);
        });

        this.item = {
            entityGroups: [{
                name: 'objects',
                values: [
                    {
                        name: "river"
                    },
                    {
                        name: "bank"
                    }
                ]
            },
                {
                    name: 'assumptions',
                    values: [
                        {
                            name: "boundary"
                        },
                        {
                            name: "divided"
                        }
                    ]
                }
            ]
        };
    };

    onClicked(value: any){
        this.selectedItem.emit(value);
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
