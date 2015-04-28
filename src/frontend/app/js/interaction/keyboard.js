(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

//http://robertwhurst.github.io/KeyboardJS/
//	https://github.com/RobertWHurst/KeyboardJS
var Keyboard =  interaction.Keyboard = function(clientApi){
	this.clientApi = clientApi;
	this.editingNodeHtml = null;
};

Keyboard.prototype.init = function(){
	this.initializeKeyboard();
};

// http://robertwhurst.github.io/KeyboardJS/
Keyboard.prototype.initializeKeyboard = function() {
	var that = this;
	this.editingNodeHtml = null;

	// Delete node:
	KeyboardJS.on("ctrl + delete", function(){
		console.log("ctrl + delete");
		if(!this.clientApi.getSelectedNode()) return; // no parent node selected
		var that = this;
		//if(confirm("Are you sure you want to delete this node od KnAllEdge?")){
			this.clientApi.deleteNode(this.clientApi.getSelectedNode());
			this.clientApi.update(null, function(){
				// that.clientApi.setSelectedNode(null); //TODO: set to parent
			});
		//}
	}.bind(this), function(){}.bind(this));
	
	//TODO: Delete edge
};

}()); // end of 'use strict';