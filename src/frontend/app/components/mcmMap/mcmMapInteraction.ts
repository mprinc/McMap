// external from the JS world
declare var knalledge;
declare var window:Window;
declare var debugpp;

const STATUS_MAP: string = "STATUS_MAP";
const STATUS_EDITOR: string = "STATUS_EDITOR";

export class McmMapInteraction {
    private status: string;

    /**
    * @var {debugPP} debug - namespaced debug for the class
    * @memberof interaction.Keyboard
    */
    private debug;
    private editingNodeInProgress;

    constructor(
        public clientApi
    ) {
        this.clientApi = clientApi;
        this.debug = debugpp.debug('interaction.McmMapInteraction');
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

    nodeMediaClicked(node) {
      if(!this.isStatusMap()) return;
      if(!node){
          node = this.clientApi.getSelectedNode();
      }
      if(node){
        this.clientApi.nodeMediaClicked(node);
      }
    }

    addLink() {
        window.alert("This funcionality is not supported yet");
        return;
        // var node = this.clientApi.getSelectedNode();
        // if (node) { // if source node is selected
        //     this.clientApi.knalledgeState.addingLinkFrom = node;
        // }
    };

    deleteNode() {
        if (!this.isStatusMap()) return;
        if (!this.clientApi.getSelectedNode()) return; // no parent node selected
        //var that = this;
        //if(confirm("Are you sure you want to delete this node od KnAllEdge?")) {
        var parentNodes = this.clientApi.getParentNodes(this.clientApi.getSelectedNode());
        this.clientApi.deleteNode(this.clientApi.getSelectedNode());
        if (parentNodes.length > 0 && parentNodes[0]) {
            this.clientApi.nodeSelected(parentNodes[0]);
        }

        this.clientApi.update(this.clientApi.getSelectedNode(), function() {
            // that.clientApi.nodeSelected(null); //TODO: set to parent
        });
        //}
    };

    addImage() {
        if (!this.isStatusMap()) return;
        var node = this.clientApi.getSelectedNode();

        this.clientApi.addImage(node);
    };

    removeImage() {
        if (!this.isStatusMap()) return;
        console.log("Removing image");
        this.clientApi.removeImage();
    };

    exitEditingNode() {
        if (this.editingNodeInProgress) {
            // this._exitEditingNode();
        }
        if (!this.isStatusMap()) return;
    }

    navigateLeft() {
        if (this.editingNodeInProgress || !this.clientApi.getSelectedNode()) return;
        if (!this.isStatusMap()) return;

        // TODO: TOFIX: BUG: This will work only for a map that injects parent property in node
        if (this.clientApi.getSelectedNode().parent) {
            this.clientApi.nodeSelected(this.clientApi.getSelectedNode().parent);
        }
    };

    navigateRight() {
        if (this.editingNodeInProgress || !this.clientApi.getSelectedNode()) return;
        if (!this.isStatusMap()) return;

        if (this.clientApi.getSelectedNode().children) {
            this.clientApi.nodeSelected(this.clientApi.getSelectedNode().children[0]);
        }
    };

    _iterateThroughSiblings(shouldConsiderNodeFunc) {
        // currently selected node
        var currentNode = this.clientApi.getSelectedNode();
        // {x,y} coordinates of the currently selected node
        var currentNodePos = this.clientApi.getCoordinatesFromDatum(currentNode);
        if (this.editingNodeInProgress || !currentNode) return;
        if (!this.isStatusMap()) return;

        // siblings of the currently selected node
        var siblings = currentNode.parent ? currentNode.parent.children : null;
        if (!siblings) return;

        // position of the current node among siblings
        var currentNodeIndex = null;
        for (var i = 0; i < siblings.length; i++) {
            if (siblings[i] === currentNode) {
                currentNodeIndex = i;
            }
        }

        var chosenSibling = null;
        var chosenSiblingPos = null;
        var chosenSiblingIndex = null;
        for (var i = 0; i < siblings.length; i++) {
            var sibling = siblings[i];
            if (sibling === currentNode) continue;

            var siblingPos = this.clientApi.getCoordinatesFromDatum(sibling);
            if (shouldConsiderNodeFunc(currentNode, currentNodePos, currentNodeIndex,
                sibling, siblingPos, i, chosenSibling, chosenSiblingPos, chosenSiblingIndex)
                ) {
                chosenSibling = siblings[i];
                chosenSiblingPos = siblingPos;
                chosenSiblingIndex = i;
            }
        }

        if (chosenSibling) this.clientApi.nodeSelected(chosenSibling);
    };

    navigateDown() {
        var shouldConsiderNodeFunc: Function = function(currentNode, currentNodePos,
            currentNodeIndex, sibling, siblingPos, siblingIndex,
            chosenSiblingBellow, chosenSiblingBellowPos, chosenSiblingBellowIndex
            ) {
            var consider: boolean = (
                siblingPos &&
                // if sibling is bellow (by x) or after (by index) current node
                (siblingPos.y > currentNodePos.y || siblingIndex >= currentNodeIndex) &&
                // if sibling is above (by x) or before (by index) of the chosenSiblingBellow
                (!chosenSiblingBellow ||
                    (siblingPos.y < chosenSiblingBellowPos.y || siblingIndex < chosenSiblingBellowIndex)
                    )
                );
            return consider;
        };
        this._iterateThroughSiblings(shouldConsiderNodeFunc);
    };

    navigateUp() {
        var shouldConsiderNodeFunc: Function = function(currentNode, currentNodePos,
            currentNodeIndex, sibling, siblingPos, siblingIndex,
            chosenSiblingAbove, chosenSiblingAbovePos, chosenSiblingAboveIndex
            ) {
            var consider: boolean = (
                siblingPos &&
                // if sibling is above (by x) or before (by index) current node
                (siblingPos.y < currentNodePos.y || siblingIndex < currentNodeIndex) &&
                // if sibling is bellow (by x) or after (by index) of the chosenSiblingAbove
                (!chosenSiblingAbove ||
                    (siblingPos.y > chosenSiblingAbovePos.y || siblingIndex > chosenSiblingAboveIndex)
                    )
                );
            return consider;
        };
        this._iterateThroughSiblings(shouldConsiderNodeFunc);
    };

    toggleNode() {
        if (this.editingNodeInProgress) return;
        if (!this.isStatusMap()) return;
        var node = this.clientApi.getSelectedNode();
        node.isOpen = !node.isOpen;
        this.clientApi.updateNode(node, knalledge.MapStructure.UPDATE_NODE_APPEARENCE);
        this.clientApi.update(node);
    };

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
