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
    itemParent: NodeWithChildren;
    entityType: string;
    mapStructure: any;

    constructor() {
        this.setEntityFilter('object');
    };

    init(mapStructure:any){
        this.mapStructure = mapStructure;
        this.setEntityFilter('object');
    }

    setEntityFilter(entityType:string){
        this.entityType = entityType;
    }

    getEntityFilter(){
        return this.entityType;
    }

    generateView() {
        this.itemParent = new NodeWithChildren();
        this.itemParent.node =
            this.mapStructure.getSelectedNode() ||
            this.mapStructure.rootNode;
        let childrenEdges = this.mapStructure.getChildrenEdges(this.itemParent.node);
        this.itemParent.children = [];
        for (let eI = 0; eI < childrenEdges.length; eI++) {
            let edge = childrenEdges[eI];
            let nWR = new NodeWithEdge();
            nWR.edge = edge;
            nWR.node = this.mapStructure.getVKNodeByKId(edge.kEdge.targetId);
            if(!this.entityType || (nWR.node && nWR.node.kNode.type === this.entityType)){
                this.itemParent.children.push(nWR);
            }
        }
        console.log("[McmMapLayout] this.itemParent: ", this.itemParent);

        return this.itemParent;
    };

    getChildrenNumberForEntityType(entityType) {
      let itemNo: number = 0;
      var vkNode = this.mapStructure.getSelectedNode();
      let childrenNodes = this.mapStructure.getChildrenNodes(vkNode);
      for (let eI = 0; eI < childrenNodes.length; eI++) {
          let node =childrenNodes[eI];
          if(node && node.kNode.type === entityType){
              itemNo++;
          }
      }
      return itemNo;
    }

    existsDialogueOverItem(vkNode?:any) {
      if (!vkNode){
        vkNode = this.mapStructure.getSelectedNode();
      }
      if(vkNode){
        let childrenNodes = this.mapStructure.getChildrenNodes(vkNode);
        for (let eI = 0; eI < childrenNodes.length; eI++) {
            if(childrenNodes[eI].kNode.isIbis()){
              return true;
            }
        }
      }
      return false;
    }
}
