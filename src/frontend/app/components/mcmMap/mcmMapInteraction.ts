// external from the JS world
declare var knalledge;
declare var window:Window;
declare var debugpp;

const STATUS_MAP: string = "STATUS_MAP";
const STATUS_EDITOR: string = "STATUS_EDITOR";

import {NodeWithChildren} from './mcmMapLayout';

export class McmMapInteraction {
    private status: string;

    /**
    * @var {debugPP} debug - namespaced debug for the class
    * @memberof interaction.Keyboard
    */
    private debug;
    private editingNodeInProgress;

    constructor(
        public clientApi,
        public localApi
    ) {
        this.clientApi = clientApi;
        this.debug = debugpp.debug('interaction.McmMapInteraction');
        this.init();
    };

    init() {
        var that = this;
        this.status = STATUS_MAP;
    };

    isEditingNode(): boolean {
        return this.editingNodeInProgress !== null;
    }

    isStatusEditor(): boolean {
        return this.status === STATUS_EDITOR;
    }

    isStatusMap(): boolean {
        return this.status === STATUS_MAP;
    }

    setStatus(status) {
        this.status = status;
    };

    getStatus() {
        return this.status;
    };

    searchNodeByName() {
        // if(!this.isStatusMap()) return;

        this.clientApi.searchNodeByName();
    };

    deleteNode(item: NodeWithChildren) {
        if (!this.isStatusMap()) return;
        // if (!this.clientApi.getSelectedNode()) return;
        if (!item) return;
        //var that = this;
        //if(confirm("Are you sure you want to delete this node od KnAllEdge?")) {
        this.clientApi.deleteNode(item.node);

        this.localApi.setHighlitedItem();
        this.clientApi.update();
    };

    navigateBack() {
        let parentNodes = this.clientApi.getParentNodes(this.localApi.getItemContainer().node);
        this.localApi.setHighlitedItem();
        if(parentNodes.length > 0){
            this.clientApi.setSelectedNode(parentNodes[0]);
            this.clientApi.update();
        }
    };

    navigateItem(item: NodeWithChildren) {
        if(!item) return;

        this.clientApi.setSelectedNode(item.node);
        this.localApi.setHighlitedItem();
        this.clientApi.update();
    };

    discussItem(item: NodeWithChildren) {
        if(!item) return;
        console.log("[discussItem]", item);
        var mapId: string = item.node.kNode.mapId;
        var nodeId: string = item.node.kNode._id;
        this.openNode(mapId, nodeId);
        // this.clientApi.setSelectedNode(item.node);
        // this.localApi.setHighlitedItem();
        // this.clientApi.update();
    };

    commentItem(item: NodeWithChildren) {
        if(!item) return;
        console.log("[discussItem]", item);
        var mapId: string = item.node.kNode.mapId;
        var nodeId: string = item.node.kNode._id;
        this.openNode(mapId, nodeId);
    };

    questionItem(item: NodeWithChildren) {
        if(!item) return;
        console.log("[discussItem]", item);
        var mapId: string = item.node.kNode.mapId;
        var nodeId: string = item.node.kNode._id;
        this.openNode(mapId, nodeId);
    };

    openNode(mapId: string, nodeId: string){
      var mapRoute = 'map'; //Config.Plugins.mapsList.config.openMap.routes[0].route;
      window.location.href = "#"+ mapRoute +"/id/" + mapId + "?node_id=" + nodeId; //
      //e.g. http://localhost:5555/#/map/id/56f53217ff0a4e5536dc770b?node_id=56f54eb5ff0a4e5536dc775e
    }

    addSiblingNode(nodeType?, edgeType?) {
        var parentNode = this.clientApi.getSelectedNode().parent;
        this.addNode(parentNode, nodeType, edgeType);
    };

    addChildNode(nodeType?, edgeType?) {
        var parentNode = this.clientApi.getSelectedNode();
        this.addNode(parentNode, nodeType, edgeType);
    };

    addNode(parentNode, nodeType?, edgeType?) {
        if (typeof nodeType === 'undefined') nodeType = this.clientApi.getActiveIbisType();
        if (typeof nodeType === 'undefined') nodeType = knalledge.KNode.TYPE_KNOWLEDGE;

        if (typeof edgeType === 'undefined') edgeType = this.clientApi.getActiveIbisType();
        if (typeof edgeType === 'undefined') edgeType = knalledge.KEdge.TYPE_KNOWLEDGE;

        console.log("exitEditingNode");
        this.debug.log("on('tab'): this.editingNodeInProgress: ", this.editingNodeInProgress);
        if (this.editingNodeInProgress) return; // in typing mode
        this.debug.log("on('tab'): this.clientApi.getSelectedNode(): ", this.clientApi.getSelectedNode());

        if (!this.clientApi.getSelectedNode()) return; // no parent node selected
        var that = this;
        var newNode = this.clientApi.createNode(null, nodeType);
        var newEdge = this.clientApi.createEdgeBetweenNodes(parentNode, newNode, edgeType);
        newEdge.kEdge.$promise.then(function(kEdgeFromServer) {
            if (!parentNode.isOpen) {
                parentNode.isOpen = true;
                that.clientApi.expandNode(parentNode, function() {
                    return;
                });
            }

            that.clientApi.update(parentNode, function() {
                that.clientApi.nodeSelected(newNode);
                that.clientApi.update(parentNode, function() {
                    // that._setEditing(newNode);
                    // we need to position explicitly here again even though that.clientApi.nodeSelected(newNode) is doing it
                    // since that._setEditing(newNode); is destroying positioning
                    that.clientApi.positionToDatum(newNode);
                });
            });
        });
    };
};
