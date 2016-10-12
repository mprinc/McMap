import {Component, Inject} from '@angular/core';
import {NgIf, CORE_DIRECTIVES} from "@angular/common";
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {FORM_DIRECTIVES} from '@angular/forms';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

@Component({
    selector: 'navigation-breadcrumb',
    providers: [
        //MATERIAL_PROVIDERS
    ],
    directives: [
      MATERIAL_DIRECTIVES,
      // MdList, MdListItem, MdContent, MdButton, MdSwitch,
      NgIf, FORM_DIRECTIVES,
      // MdRadioButton, MdRadioGroup,
      //
      MD_INPUT_DIRECTIVES
   ],
    moduleId: module.id,
    templateUrl: 'partials/breadcrumb.tpl.html',
    styles: [`
    `]
})
export class NavigationBreadcrumb {
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
      // console.log('[NavigationBreadcrumb]');
      this.ibisTypesService = _IbisTypesService_;

      this.items = this.ibisTypesService.getTypes();
      this.selectedItem = this.ibisTypesService.getActiveType();
      this.viewConfig = knalledgeMapViewService.get().config;
      this.policyConfig = knalledgeMapPolicyService.get().config;
      this.globalEmitterServicesArray.register(this.knalledgeNodeTypeChanged);
      // this.globalEmitterServicesArray.get(this.knalledgeNodeTypeChanged).subscribe('NavigationBreadcrumb', function(vkNode,type) {
      //     console.log("knalledgeNodeTypeChanged: ", vkNode.kNode.name, type);
      // });
  }

  hideShowComponent (){
    this.componentShown = !this.componentShown;
  }

  getEntityFullName(entity){
    var fullName = "";
    var parentNodes = [entity.node];

    do{
      var parentNode = parentNodes[0];
      if(parentNode.kNode.type === 'object'){
          fullName = parentNode.kNode.name + (fullName ? "_" + fullName : "");
      }
      if(parentNode.kNode.type === 'model_component'){
          fullName = parentNode.kNode.name + (fullName ? " : " + fullName : "");
      }
      parentNodes =
          this.mapStructure.getParentNodes(parentNode);
    }while(parentNodes && parentNodes.length);
    return fullName;
  }

}
