import {Component, Inject} from '@angular/core';
import {NgIf, CORE_DIRECTIVES} from "@angular/common";
import {MATERIAL_DIRECTIVES} from 'ng2-material';
import {MdToolbar} from '@angular2-material/toolbar';
import {FORM_DIRECTIVES} from '@angular/forms';
import {MD_INPUT_DIRECTIVES} from '@angular2-material/input';

import {KnalledgeMapViewService} from '../../app/components/knalledgeMap/knalledgeMapViewService';
import {KnalledgeMapPolicyService} from '../../app/components/knalledgeMap/knalledgeMapPolicyService';
import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';
import {CfPuzzlesNavigationService} from './cf.puzzles.navigation.service';

@Component({
    selector: 'navigation-breadcrumb',
    providers: [
        //MATERIAL_PROVIDERS
        CfPuzzlesNavigationService
    ],
    directives: [
      MATERIAL_DIRECTIVES,
      MdToolbar,
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
  private viewConfig:any;
  private policyConfig:any;
  private knalledgeNodeTypeChanged: string = "knalledgeNodeTypeChanged";


  constructor(
    @Inject('KnalledgeMapViewService') knalledgeMapViewService:KnalledgeMapViewService,
    @Inject('KnalledgeMapPolicyService') knalledgeMapPolicyService:KnalledgeMapPolicyService,
    @Inject('GlobalEmitterServicesArray') private globalEmitterServicesArray:GlobalEmitterServicesArray,
    private service:CfPuzzlesNavigationService
  ) {

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

  getEntityFullName(entity?){
    if(!entity) entity = {
      node: this.service.getSelectedNode()
    }
    var fullName = "";
    var parentNodes = [entity.node];

    do{
      var parentNode = parentNodes[0];
      if(!parentNode) break;

      if(parentNode.kNode.type === 'object'){
          fullName = parentNode.kNode.name + (fullName ? "_" + fullName : "");
      }
      if(parentNode.kNode.type === 'model_component'){
          fullName = parentNode.kNode.name + (fullName ? " : " + fullName : "");
      }

      // parentNodes = [];
      parentNodes =
          this.service.getParentNodes(parentNode);
    }while(parentNodes && parentNodes.length);
    return fullName;
  }

}
