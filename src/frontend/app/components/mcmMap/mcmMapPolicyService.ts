/**
 * Service that configures policy aspects of the KnAllEdge system
 * @class McmMapPolicyService
 * @memberof knalledge.knalledgeMap
*/

export class McmMapPolicyService {
  private provider: any = {
    config: {
      broadcasting: {
          enabled: false, //broaadcasting toward receviers
          receiveNavigation: true, //going through map (changing selected nodes), ...
          receiveStructural: true, //knawledge management (creation, delete, ....)
          receiveVisualization: true, //changes in view settings (showInages, showNodeTypes, limit range of visible nodes, IBIS, etc)
          receiveBehaviours: true, //receive changes in behaviours/modes (broadcasting, etc)
      },
      moderating: {
          enabled: false
      },
      behaviour: {
          brainstorming: 0 //0:off, 1:phase 1; ... 4:phase 4
      },
      state: {
        id: 0,
        name: ""
        // id: 1,
        // name: "CollaboArthon"
      },
      mediation: {
        sendRequest: true
      }
    }
  };

  get():any {
      return this.provider;
  }
}
