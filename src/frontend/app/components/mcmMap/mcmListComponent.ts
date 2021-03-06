import {Component, Inject, EventEmitter, Output, Input} from '@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {NodeGardened, ApprovalState} from '../gardening/NodeGardened';

// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import {McmMapPolicyService} from './mcmMapPolicyService';
import {McmMapViewService} from './mcmMapViewService';
// import {RequestService} from '../request/request.service';
import {GlobalEmitterServicesArray} from '../collaboPlugins/GlobalEmitterServicesArray';

import {NodeWithChildren} from './mcmMapLayout';

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
    ],
    styles: [`
    `]
})

export class McmListComponent {
    policyConfig: any;
    viewConfig: any;
    @Input() itemContainer: NodeWithChildren;
    @Input() existsDialogueOverItem: Function;
    itemSelected: NodeWithChildren;
    // https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#child-to-parent
    @Output() selectItem = new EventEmitter<any>();
    @Output() enterItem = new EventEmitter<any>();

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
    };

    onClicked(item: any){
        this.itemSelected = this.itemSelected !== item ?
            item : null;
        this.selectItem.emit(item);
    }

    onEnterItemClicked(item: any){
        this.enterItem.emit(item);
    }

    isDisapproved(item){
      return NodeGardened.getApprovalState(item.node.kNode) === ApprovalState.DISAPPROVED;
    }

    _existsDialogueOverItem(item){
        //   return false; //TOOD: because of not being able to access mcmMapLayout from here to call existsDialogueOverItem()
        var existDialogue = this.existsDialogueOverItem(item);
        return existDialogue;
    }
}
