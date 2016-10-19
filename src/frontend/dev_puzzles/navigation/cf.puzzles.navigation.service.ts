import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3: any;

export const PLUGIN_NAME: string = 'PUZZLE_IBIS';

@Injectable()
export class CfPuzzlesNavigationService {
  puzzleNavigationPluginInfo: any;

  /**
  * the namespace for navigation puzzle
  * @namespace cf.puzzles.navigation
  */

  private mapStructure: any;
  private mapUpdate: Function;
  private mapNodeSelected: Function;
  private positionToDatum: Function;

  /**
  * Service serving to navigation puzzle
  * @class CfPuzzlesNavigationService
  * @memberof cf.puzzles.navigation
  */
  constructor(
    @Inject('KnalledgeMapViewService') private knalledgeMapViewService,
    @Inject('CollaboPluginsService') private collaboPluginsService
    ) {
    var that: CfPuzzlesNavigationService = this;

    // access to CF internals through plugin mechanism
    this.puzzleNavigationPluginInfo = {
      name: "puzzles.navigation",
      components: {

      },
      references: {
        map: {
          items: {
            mapStructure: {
            }
          },
          $resolved: false,
          callback: null,
          $promise: null
        }
      },
      apis: {
        map: {
          items: {
            update: null,
            nodeSelected: null,
            positionToDatum: null,
          },
          $resolved: false,
          callback: null,
          $promise: null
        }
      }
    };

    this.puzzleNavigationPluginInfo.references.map.callback = function() {
      that.puzzleNavigationPluginInfo.references.map.$resolved = true;
      that.mapStructure = that.puzzleNavigationPluginInfo.references.map.items.mapStructure;
    };

    this.puzzleNavigationPluginInfo.apis.map.callback = function() {
      that.puzzleNavigationPluginInfo.apis.map.$resolved = true;
      that.mapUpdate = that.puzzleNavigationPluginInfo.apis.map.items.update;
      that.mapNodeSelected = that.puzzleNavigationPluginInfo.apis.map.items.nodeSelected;
      that.positionToDatum = that.puzzleNavigationPluginInfo.apis.map.items.positionToDatum;
    };

    this.collaboPluginsService.registerPlugin(this.puzzleNavigationPluginInfo);
  }

  getParentNodes(vkNode){
    var parentNodes = [];
    if(this.mapStructure){
      parentNodes = this.mapStructure.getParentNodes(vkNode);
    }
    return parentNodes;
  }

  getSelectedNode(){
    var selectedNode = null;
    if(this.mapStructure){
      selectedNode = this.mapStructure.getSelectedNode();
    }
    return selectedNode;
  }
}
