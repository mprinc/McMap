import { Injectable, Inject } from '@angular/core';

import {GlobalEmitterServicesArray} from '../../app/components/collaboPlugins/GlobalEmitterServicesArray';

declare var d3:any;

export const PLUGIN_NAME:string = 'PUZZLE_IBIS';

@Injectable()
export class CfPuzzlesIbisService {
    plugins:any = {
        mapVisualizePlugins: {
            service: this,
            init: function init() {
                var that = this;
            },

            nodeHtmlUpdate: function(nodeHtmlUpdate){
              var that = this;
              nodeHtmlUpdate.select(".node_type")
            		.style("display", function(d){
            			return (that.service.knalledgeMapViewService.provider.config.nodes.showTypes && d.kNode && d.kNode.type) ? "block" : "none";
            		})
            		.html(function(d){
            			var label = "";
            			if(d.kNode && d.kNode.type){
            				var type = d.kNode.type;
            				switch(type){
            					case "type_ibis_question":
            						type = "ibis:QUESTION";
            						break;
            					case "type_ibis_idea":
            						type = "ibis:IDEA";
            						break;
            					case "type_ibis_argument":
            						type = "ibis:ARGUMENT";
            						break;
            					case "type_ibis_comment":
            						type = "ibis:COMMENT";
            						break;
            					case "type_knowledge":
            						type = "kn:KnAllEdge";
            						break;

            					case "model_component":
            						type = "csdms:COMPONENT";
            						break;
            					case "object":
            						type = "csdms:OBJECT";
            						break;
            					case "variable":
            						type = "csdms:VARIABLE";
            						break;
            					case "assumption":
            						type = "csdms:ASSUMPTION";
            						break;
            					case "grid_desc":
            						type = "csdms:GRID DESC";
            						break;
            					case "grid":
            						type = "csdms:GRID";
            						break;
            					case "process":
            						type = "csdms:PROCESS";
            						break;
            				}
            				label = "%" + type;
            			}
            			return label;
            		})
            		.on("click", function(d){
            			console.log('type clicked for node ',d.kNode.name);
            			d3.event.stopPropagation();
            			that.upperAPI.nodeTypeClicked(d);
            		});
            }
        }
    };

    /**
    * the namespace for core services for the Notify system
    * @namespace knalledge.gardening.gardeningServices
    */

    /**
    * Service that is a plugin into knalledge.MapVisualization
    * @class CfPuzzlesIbisService
    * @memberof knalledge.gardening.gardeningServices
    */
    constructor(
      @Inject('KnalledgeMapViewService') private knalledgeMapViewService
    ) {
    }
}
