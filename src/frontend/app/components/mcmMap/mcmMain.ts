import {Component, Inject} from '@angular/core';
import { AfterViewInit, ViewChild } from
'@angular/core';
import {upgradeAdapter} from '../../js/upgrade_adapter';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MATERIAL_DIRECTIVES, MATERIAL_PROVIDERS, Media} from "ng2-material";
import {MdToolbar} from '@angular2-material/toolbar';
import {OVERLAY_PROVIDERS} from '@angular2-material/core/overlay/overlay';
// http://stackoverflow.com/questions/35533783/angular2-unable-to-navigate-to-url-using-location-gourl

import { Router, ROUTER_DIRECTIVES} from '@angular/router';

import {McmListComponent} from './mcmListComponent';
import {McmSelectEntityComponent} from './mcmSelectEntity.component';
import {KnalledgeCreateNodeComponent} from '../knalledgeMap/knalledgeCreateNode.component';

import {McmMapPolicyService} from './mcmMapPolicyService';
import {McmMapViewService} from './mcmMapViewService';
import {KnalledgeMapPolicyService} from '../knalledgeMap/knalledgeMapPolicyService';
import {ApprovalNodeService} from '../gardening/approval.node.service';

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
        McmSelectEntityComponent,
        KnalledgeCreateNodeComponent
    ],
    styles: [`
    `]
})

export class McmMain implements AfterViewInit{
    mcmPolicyConfig: any;
    mcmViewConfig: any;
    policyConfig: any;
    status: String;
    itemHighlited: NodeWithChildren;
    itemContainer: NodeWithChildren;
    itemToolbar: any = {
        visible: false
    };
    filterToolbar: any = {
        visible: false
    };
    itemContainerProperties: any = {
        visible: false
    };

    mapLoader: MapLoader;
    model;
    mapStructure;
    mcmMapLayout:McmMapLayout;
    mcmMapInteraction:McmMapInteraction;
    existsDialogueOverItem_binded:Function;

    @ViewChild(McmSelectEntityComponent) private mcmSelectEntityComponent:McmSelectEntityComponent;
    @ViewChild(KnalledgeCreateNodeComponent) private knalledgeCreateNodeComponent:KnalledgeCreateNodeComponent;


    constructor(
        // public router: Router,
        @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
        @Inject('ApprovalNodeService') private approvalNodeService:ApprovalNodeService,
        @Inject('McmMapViewService') mcmMapViewService: McmMapViewService,
        @Inject('McmMapPolicyService') private mcmMapPolicyService: McmMapPolicyService,
        @Inject('KnalledgeMapService') private knalledgeMapService,
        @Inject('KnalledgeMapVOsService') private knalledgeMapVOsService,
        @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray: GlobalEmitterServicesArray
    ) {
        console.log('[McmMain]');
        this.existsDialogueOverItem_binded =
            this.existsDialogueOverItem.bind(this);
        this.mcmViewConfig = mcmMapViewService.get().config;
        this.mcmPolicyConfig = mcmMapPolicyService.get().config;
        this.policyConfig = knalledgeMapPolicyService.get().config;

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

        this.mcmMapLayout =
            new McmMapLayout();
    };
    ngOnInit() {
        this.mapLoader.init();
    }

    ngAfterViewInit() {
    }

    getEntityFullName(entity){
        var fullName = "";
        var parentNodes = [entity.node];

        do{
            var parentNode = parentNodes[0];
            if(parentNode.kNode.type === 'object' ||
            parentNode.kNode.type === 'model_component'){
                fullName = parentNode.kNode.name + (fullName ? "_" + fullName : "");
            }
            parentNodes =
                this.mapStructure.getParentNodes(parentNode);
        }while(parentNodes && parentNodes.length);
        return fullName;
    }

    getEntityFilter(){
        return this.mcmMapLayout.getEntityFilter();
    }

    getEntityFilterText(){
        let entityType =
            this.mcmMapLayout.getEntityFilter();
        var typeToText = {
            object: "Objects",
            grid: "Grids",
            assumption: "Assumptions",
            variable: "Quantities",
            process: "Processes"
        };

        return typeToText[entityType];
    }

    existsDialogueOverItem(item?){
        if(!item){
            item = this.itemHighlited;
        }
      return this.mcmMapLayout
        .existsDialogueOverItem(item.node);
    }

    getEdgeNameFromEntityName(entityType){
        var entityToEdge = {
            object: "containsObject",
            grid: "containsGrid",
            assumption: "containsAssumption",
            variable: "containsVariable",
            process: "containsProcess"
        };
        return entityToEdge[entityType];
    }

    getNumberOfEntities(entityType){
      console.log("[getNumberOfEntities] entityType:", entityType);
      return this.mcmMapLayout.getChildrenNumberForEntityType(entityType);
    }

    getNumberOfFilteredEntities(){
      return this.itemContainer && this.itemContainer.children ? this.itemContainer.children.length : null;
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
        this.mcmMapLayout.init(this.mapStructure);
        this.itemContainer = this.mcmMapLayout.generateView();
        this.onSelectedItem();

        var clientApi = {
            getParentNodes: this.mapStructure.getParentNodes.bind(this.mapStructure),
            setSelectedNode: this.mapStructure.setSelectedNode.bind(this.mapStructure),
            generateView: this.mcmMapLayout.generateView.bind(this.mcmMapLayout),
            deleteNode:
            this.mapStructure.deleteNode.bind(this.mapStructure),
            update: this.update.bind(this)
        };
        var localApi = {
            getItemContainer: this.getItemContainer.bind(this),
            setItemContainer: this.setItemContainer.bind(this),
            setHighlitedItem: this.setHighlitedItem.bind(this)
        };
        this.mcmMapInteraction = new McmMapInteraction(clientApi, localApi);
    }

    setHighlitedItem(item: NodeWithChildren=null){
        item = (this.itemHighlited !== item) ? item : null;
        this.itemHighlited = item;
        this.itemToolbar.visible = !!item;
        // this.filterToolbar.visible = false;
    }

    getItemContainer(){
        return this.itemContainer;
    }

    setItemContainer(item){
        this.itemContainer = item;
    }

    toAddEntity(entityType, item){
        console.log("[toAddEntity] entityType: %s, item:", entityType, item);

        var sourceNode = this.mapStructure.getSelectedNode();

        var vkNode = new knalledge.VKNode();
    	vkNode.kNode = new knalledge.KNode();
        vkNode.kNode.type = entityType;
        vkNode.kNode.name = item.node.name;

        var vkEdge = new knalledge.VKEdge();
        vkEdge.kEdge = new knalledge.KEdge();
        vkEdge.kEdge.type = this.getEdgeNameFromEntityName(entityType);

        this.mapStructure.createNodeWithEdge(sourceNode, vkEdge, vkNode, function(){
            this.update();
        }.bind(this));
    }

    addEntity(){
        let entityType = this.mcmMapLayout.getEntityFilter();
        this.mcmSelectEntityComponent.show(entityType, this.toAddEntity.bind(this));
    }


    toAddCFNode(knalledgeNodeType, knalledgeEdgeType, nodeName){
        console.log("[toAddCFNode] knalledgeNodeType: %s, knalledgeEdgeType: %s, nodeName:",
        knalledgeNodeType, knalledgeEdgeType, nodeName);

        var sourceNode = this.itemHighlited.node;

        var vkNode = new knalledge.VKNode();
    	  vkNode.kNode = new knalledge.KNode();
        vkNode.kNode.type = knalledgeNodeType;
        vkNode.kNode.name = nodeName;

        var vkEdge = new knalledge.VKEdge();
        vkEdge.kEdge = new knalledge.KEdge();
        vkEdge.kEdge.type = knalledgeEdgeType;

        this.mapStructure.createNodeWithEdge(sourceNode, vkEdge, vkNode, function(){
            this.update();
        }.bind(this));
    }

    addCFNode(knalledgeNodeType, knalledgeEdgeType, title: string = null){
        this.knalledgeCreateNodeComponent.show(knalledgeNodeType, knalledgeEdgeType, title, this.toAddCFNode.bind(this));
    }

    collaborateOnEntity(){
        this.mcmMapInteraction.questionItem(this.itemHighlited);
    }

    // http://learnangular2.com/events/
    onSelectedItem(item: NodeWithChildren=null) {
        this.setHighlitedItem(item);
    }

    onEnteredItem(item: NodeWithChildren) {
        this.mcmMapInteraction.navigateItem(item);
        // this.filterToolbar.visible = false;
    }

    onDeleteItem(item: NodeWithChildren) {
        this.mcmMapInteraction.deleteNode(item);
    }

    onDiscussItem(item: NodeWithChildren) {
        this.mcmMapInteraction.discussItem(item);
    }

    onCommentItem(item: NodeWithChildren) {
    //   this.policyConfig.knalledgeMap.nextNodeType = "type_ibis_comment";
    //   this.mcmMapInteraction.commentItem(item);
        this.addCFNode("type_ibis_comment", "type_ibis_comment");
    }

    disapproveItem(item){
      this.approvalNodeService.disapproveNode(item.node);
    }

    onDisapprovingItem(item: NodeWithChildren) {
    //   this.policyConfig.knalledgeMap.nextNodeType = "type_ibis_comment";
    //   this.mcmMapInteraction.commentItem(item);
        this.disapproveItem(item);
        this.addCFNode("type_ibis_comment", "type_ibis_comment", "Why you disapprove it?");
    }

    onQuestionItem(item: NodeWithChildren) {
      this.policyConfig.knalledgeMap.nextNodeType = "type_ibis_question";
    //   this.mcmMapInteraction.questionItem(item);
        this.addCFNode("type_ibis_question", "type_ibis_question");
    }



    setEntityFilter(entityType:string) {
        this.mcmMapLayout.setEntityFilter(entityType);
        // this.filterToolbar.visible = false;
        this.update();
    }

    update() {
        let nodeWChildren = this.mcmMapLayout.generateView();
        this.setItemContainer(nodeWChildren);
    }

    navigateBack() {
        this.mcmMapInteraction.navigateBack();
        // this.filterToolbar.visible = false;
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
