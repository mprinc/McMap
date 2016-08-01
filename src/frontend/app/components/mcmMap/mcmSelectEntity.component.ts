import {Component, Inject, EventEmitter, Output, Input, AfterViewInit, ViewChild} from '@angular/core';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdDialog} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {McmMapPolicyService} from './mcmMapPolicyService';
import {McmMapViewService} from './mcmMapViewService';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

import {NodeWithChildren, NodeWithEdge} from './mcmMapLayout';

/**
 * Directive that handles the main KnAllEdge or rather CollaboFramework user interface
 *
 * Selector: `mcm-list-component`
 * @class McmSelectEntityComponent
 * @memberof mcm
 * @constructor
*/

declare var window;

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
        MdToolbar,
        MD_INPUT_DIRECTIVES
    ],
    styles: [`
    `]
})

export class McmSelectEntityComponent implements AfterViewInit{
    itemContainer: NodeWithChildren;
    itemSelected: NodeWithChildren;
    searchCriteria: string = "";
    searchTitle: string = "Create Assumption";
    showEntityType: string;
    showCallback: Function;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @Output() selectItem = new EventEmitter<any>();
    @Output() enterItem = new EventEmitter<any>();
    @ViewChild(MdDialog) private mdDialog:MdDialog;

    constructor(
        // public router: Router,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray,
        @Inject('McmMapAssumptionService') private mcmMapAssumptionService,
        @Inject('McmMapObjectService') private mcmMapObjectService
    ) {
        console.log('[McmSelectEntityComponent]');
    };

    ngAfterViewInit() {
    }

    show(entityType, callback){
        this.showEntityType = entityType;
        this.showCallback = callback;
        this.searchCriteria = "";

        // window.alert("Showing select dialog");
        var items = this.mcmMapAssumptionService.getAssumptionsDesByName(this.searchCriteria);
        this.generateView(items);

        this.mdDialog.show();
    }

    onClicked(item: any){
        this.itemSelected = this.itemSelected !== item ?
            item : null;
        this.selectItem.emit(item);
        if(typeof this.showCallback === 'function'){
            this.mdDialog.close();
            this.showCallback(this.showEntityType, item);
        }
    }

    generateView(items){
        this.itemContainer = new NodeWithChildren();
        this.itemContainer.node = {
            name: "Assumptions"
        };
        this.itemContainer.children = [];
        for (let eI in items) {
            var item = items[eI];
            let nWR = new NodeWithEdge();
            nWR.edge = null;
            nWR.node = {
                name: item.name,
                item: item
            };
            this.itemContainer.children.push(nWR);
        }
        console.log("[McmMapLayout] this.itemContainer: ", this.itemContainer);

        return this.itemContainer;
    }

    onSearchChanged(){
        console.log("[onSearchChanged] this.searchCriteria:", this.searchCriteria);
        var items = this.mcmMapAssumptionService.getAssumptionsDesByName(this.searchCriteria);
        this.generateView(items);
    }

    onEnterItemClicked(item: any){
        this.enterItem.emit(item);
    }

    onSelectEntityDialogClosed(){

    }
}
