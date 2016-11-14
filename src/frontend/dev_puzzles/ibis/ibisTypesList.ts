import {Component, Inject} from '@angular/core';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

@Component({
    selector: 'ibis-types-list',
    providers: [
        //MATERIAL_PROVIDERS
    ],
    moduleId: module.id,
    templateUrl: 'partials/ibisTypes-list.tpl.html',
    styles: [`
    `]
})
export class IbisTypesList {
  public items:Array<any> = [];
  public selectedItem:any = null;
  private componentShown:boolean = true;
  private ibisTypesService;
  private viewConfig:any;
  private policyConfig:any;
  private knalledgeNodeTypeChanged: string = "knalledgeNodeTypeChanged";


  constructor(
    @Inject('IbisTypesService') _IbisTypesService_,
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray
  ) {
      // console.log('[IbisTypesList]');
      this.ibisTypesService = _IbisTypesService_;

      this.items = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('IbisTypesList', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  selectItem (item) {
    this.selectedItem = item;
    this.ibisTypesService.selectActiveType(item);

    if(this.policyConfig.knalledgeMap){
      this.policyConfig.knalledgeMap.nextNodeType = null;
    }

    if(this.viewConfig.states.editingNode){
      this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged)
      .broadcast('IbisTypesList',{node:this.viewConfig.states.editingNode,type:item.type});
      //, this.selectedItem
    }
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }
}
