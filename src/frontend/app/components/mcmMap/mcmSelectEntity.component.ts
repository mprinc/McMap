import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {McmMapPolicyService} from './mcmMapPolicyService';
import {McmMapViewService} from './mcmMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

import {NodeWithChildren} from './mcmMapLayout';

/**
 * Directive that handles the main KnAllEdge or rather CollaboFramework user interface
 *
 * Selector: `mcm-list-component`
 * @class McmSelectEntityComponent
 * @memberof mcm
 * @constructor
*/

@Component({
    selector: 'mcm-select-entity',
    moduleId: module.id,
    templateUrl: 'partials/mcm-select-entity-component.tpl.html',
    providers: [
        MATERIAL_PROVIDERS,
        OVERLAY_PROVIDERS
    ],
    directives: [
        MATERIAL_DIRECTIVES,
        MD_SIDENAV_DIRECTIVES,
        ROUTER_DIRECTIVES,
        MdToolbar
    ],
    styles: [`
    `]
})

export class McmSelectEntityComponent {
    @Input() itemContainer: NodeWithChildren;
    itemSelected: NodeWithChildren;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @Output() selectItem = new EventEmitter<any>();
    @Output() enterItem = new EventEmitter<any>();

    constructor(
        // public router: Router,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    ) {
        console.log('[McmSelectEntityComponent]');
    };

    onClicked(item: any){
        this.itemSelected = this.itemSelected !== item ?
            item : null;
        this.selectItem.emit(item);
    }

    onEnterItemClicked(item: any){
        this.enterItem.emit(item);
    }
}
