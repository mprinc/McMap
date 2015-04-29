(function () { // This prevents problems when concatenating scripts that aren't strict.
'use strict';

var MoveAndDrag =  interaction.MoveAndDrag = function(){
};

/**
 * @ngdoc object
 * @name initializeManipulation
 * @function
 *
 * @description
 * Initializes support for manipulation of objects of specified class
 * reference: // http://stackoverflow.com/questions/4679785/graphael-bar-chart-with-text-x-axis
 * @param {Object} config contains all parameters relevant for the initialization
*/

MoveAndDrag.InitializeDragging = function (config) {
	var staticPlaceholder = null;
	var movingPlaceholder = null;

	// target elements with the "draggable" class
	interact(config.target.refCategory)
		.draggable({
			// enable inertial throwing
			inertia: true,
			// keep the element within the area of it's parent
			// restrict: {
			// 	restriction: "parent",
			// 	endOnly: true,
			// 	elementRect: { top: 1, left: 1, bottom: 1, right: 1 }
			// },

			// call this function on every dragmove event
			onstart: function (event) {
				var target = event.target;
				var targetD3 = d3.select(target);

				// remember original z-index
				targetD3.attr('data-z-index', targetD3.style("z-index"));
				// set it to the top of the index and reduce opacity
				targetD3
					.style("opacity", config.target.opacity);

				// clone node with jQuery
				// https://api.jquery.com/clone/
				// http://www.w3schools.com/jsref/met_node_clonenode.asp
				// https://www.safaribooksonline.com/library/view/jquery-cookbook/9780596806941/ch01s14.html
				// http://stackoverflow.com/questions/8702165/how-to-clone-and-restore-a-dom-subtree
				// http://stackoverflow.com/questions/1848445/duplicating-an-element-and-its-style-with-javascript
				var clonedJQ = $(event.target).clone(true, true);
				// create D3 selector
				var clonedD3 = d3.select(clonedJQ.get(0));

				if(config.debug.origVsClone){
					targetD3
						.text("Orig");
					clonedD3
						.text("Clone");
				}

				// append cloned node to the map
				// http://stackoverflow.com/questions/21727202/append-dom-element-to-the-d3
				// http://jsperf.com/innertext-vs-fragment/24
				// http://stackoverflow.com/questions/16429199/selections-in-d3-how-to-use-parentnode-appendchild
				config.target.cloningContainer.appendChild(clonedD3.node());

				if(config.draggTargetElement){
					staticPlaceholder = clonedD3;
					movingPlaceholder = targetD3;
				}else{
					movingPlaceholder = clonedD3;
					staticPlaceholder = targetD3;
				}
				movingPlaceholder
					.style("z-index", config.target.zIndex);
			},

			// call this function on every dragmove event
			onmove: function (event) {
				var target = event.target,
					targetD3 = d3.select(target),

				// keep the dragged position in the data-x/data-y attributes
				x = (parseFloat(targetD3.attr('data-x')) || 0) + event.dx,
				y = (parseFloat(targetD3.attr('data-y')) || 0) + event.dy;

				// update the posiion attributes
				targetD3.attr('data-x', x);
				targetD3.attr('data-y', y);

				// translate the cloned node
				var translate = 'translate(' + x + 'px, ' + y + 'px)';
				movingPlaceholder
					.style("transform", translate)
					//.style("position", "absolute")
					;
			},
			// call this function on every dragend event
			onend: function (event) {
				// return;
				var target = event.target;
				var targetD3 = d3.select(event.target);
				var d = targetD3.datum();
				if(config.target.leaveAtDraggedPosition){
					targetD3.style("left", (isNaN(parseInt(targetD3.style("left"))) ? 0 : parseInt(targetD3.style("left"))) + event.dx + "px");
					targetD3.style("top", (isNaN(parseInt(targetD3.style("top"))) ? 0 : parseInt(targetD3.style("top"))) + event.dy + "px");
				}
				if(d){
					if(config.target.updateDatumPosition){
						config.target.updateDatumPosition(d, event.dx, event.dy);
					}else{
						// update manual values for datum
						d.x += event.dx;
						d.y += event.dy;

						d.xM = d.x;
						d.yM = d.y;
					}
				}

				// var textEl = event.target.querySelector('p');
				// textEl && (textEl.textContent =
				// "moving: " + d.manualX + ", " + d.manualY);
				// 'moved a distance of '
				// + (Math.sqrt(event.dx * event.dx +
				//              event.dy * event.dy)|0) + 'px');

				targetD3
					.style("opacity", 1.0)
					.style("z-index", target.getAttribute('data-z-index'));
				targetD3.attr('data-z-index', null);

				// resetting element translation
				targetD3.style("transform", null);
				// update the posiion attributes
				targetD3.attr('data-x', null);
				targetD3.attr('data-y', null);

				var clonedD3 = null;

				if(config.draggTargetElement){
					clonedD3 = staticPlaceholder;
				}else{
					clonedD3 = movingPlaceholder;
				}
				clonedD3.remove();
				clonedD3 = null;

				staticPlaceholder = null;
				movingPlaceholder = null;

				if(typeof config.target.callbacks.onend == 'function'){
					config.target.callbacks.onend(targetD3);
				}
		}
	});
	console.log("[InitializeDragging]");
};

/**
 * @ngdoc object
 * @name InitializeDraggingIn
 * @function
 *
 * @description
 * Initializes support for manipulation of objects of specified class
 * reference: // http://stackoverflow.com/questions/4679785/graphael-bar-chart-with-text-x-axis
 * @param {Object} config contains all parameters relevant for the initialization
*/

MoveAndDrag.InitializeDraggingIn = function (config) {
	var draggedIn = false;
	var draggedInTarget = null;
	var droppedIn = false;
	var droppedInTarget = null;

	/* The dragging code for '.draggable' from the demo above
	* applies to this demo as well so it doesn't have to be repeated. */

	// enable draggables to be dropped into this
	interact(config.dropzone.refCategory).dropzone({
		// only accept elements matching this CSS selector
		accept: config.draggable.refCategory,
		// Require a 75% element overlap for a drop to be possible
		overlap: config.dropzone.overlap,

		// listen for drop related events:

		ondropactivate: function (event) {
			// add active dropzone feedback
			event.target.classList.add(config.dropzone.activeClass);
			draggedInTarget = null;
			draggedIn = false;
		},
		ondragenter: function (event) {
			var draggableElement = event.relatedTarget,
			dropzoneElement = event.target;

			// feedback the possibility of a drop
			dropzoneElement.classList.add(config.dropzone.dragenteredClass);
			draggableElement.classList.add(config.draggable.candropClass);
			if(config.debug.draggingStatus && config.draggable.messages.in) draggableElement.textContent = config.draggable.messages.in;
			draggedIn = true;
			draggedInTarget = dropzoneElement;
		},
		ondragleave: function (event) {
			// remove the drop feedback style
			event.target.classList.remove(config.dropzone.dragenteredClass);
			event.relatedTarget.classList.remove(config.draggable.candropClass);
			if(config.debug.draggingStatus && config.draggable.messages.out) event.relatedTarget.textContent = config.draggable.messages.out;

			if(draggedInTarget == event.target){
				draggedInTarget = null;
				draggedIn = false;
			}
		},
		ondrop: function (event) {
			droppedInTarget = event.target;
			droppedIn = true;
			if(config.debug.draggingStatus && config.draggable.messages.dropped) event.relatedTarget.textContent = config.draggable.messages.dropped;
			if(typeof config.draggable.callbacks.onend == 'function'){
				config.draggable.callbacks.onend(d3.select(droppedInTarget), d3.select(event.relatedTarget), true);
			}
		},
		ondropdeactivate: function (event) {
			// remove active dropzone feedback
			event.target.classList.remove(config.dropzone.activeClass);
			event.target.classList.remove(config.dropzone.dragenteredClass);
			event.relatedTarget.classList.remove(config.draggable.candropClass);
		}
	});
	console.log("[InitializeDraggingIn]");
};

MoveAndDrag.InitializeResizing = function (config) {
	interact("."+config.target.refClass)
	// .draggable({
	// 	onmove: window.dragMoveListener
	// })
	.resizable({
		edges: { left: true, right: true, bottom: true, top: true }
	})
	.on('resizemove', function (event) {
		var target = event.target,
		x = (parseFloat(target.getAttribute('data-x')) || 0),
		y = (parseFloat(target.getAttribute('data-y')) || 0);

		// update the element's style
		target.style.width  = event.rect.width + 'px';
		target.style.height = event.rect.height + 'px';

		// translate when resizing from top or left edges
		x += event.deltaRect.left;
		y += event.deltaRect.top;

		target.style.webkitTransform = target.style.transform =
		'translate(' + x + 'px,' + y + 'px)';

		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
		if(config.debug.size) target.textContent = event.rect.width + '×' + event.rect.height;
	});
};

}()); // end of 'use strict';