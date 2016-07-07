/**
* Service that configures visual aspects of the KnAllEdge system
* @class McmMapViewService
* @memberof knalledge.knalledgeMap
*/

export class McmMapViewService {
    private provider: any = {
        config: {
            visualDiagram: {
                visible: true
            },
            entities: {
                showCounts: true
            }
        }
    };

    get():any {
        return this.provider;
    }
}
