// external from the JS world
declare var knalledge;

/**
 * Deals with knalledge.Map and helps loading map
 */

export class NodeWithChildren {
     node: any;
     children: NodeWithEdge[];
}

export class NodeWithEdge {
    node: any;
    edge: any;
};

export class McmMapLayout {
    itemParent:NodeWithChildren;

    constructor(private mapStructure) {
    };

    generateView() {
        this.itemParent = new NodeWithChildren();
        this.itemParent.node =
        this.mapStructure.rootNode;
        let childrenEdges = this.mapStructure.getChildrenEdges(this.itemParent.node);
        this.itemParent.children = [];
        for(let eI=0; eI<childrenEdges.length; eI++){
            let edge = childrenEdges[eI];
            let nWR = new NodeWithEdge();
            nWR.edge = edge;
            nWR.node = this.mapStructure.getVKNodeByKId(edge.kEdge.sourceId);
        }
        console.log("[McmMapLayout] this.itemParent: ", this.itemParent);

        // this.mapStructure.getSelectedNode();
    };
}
