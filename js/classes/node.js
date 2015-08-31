// node.js
(function(exports) {
	"use strict";

	function Node(value) {
		this.id = 'a' + new Date().getTime() + Math.floor((Math.random() * 100) + 1);
		this.value = value;
	}
	exports.Node = Node;
	
	Node.findById = function(id, firstNode) {
		var current = firstNode;
		while (typeof current !== "undefined") {
			if (current.id === id) {
				return current;
			}
			var temp = Node.findById(id, current.childNode);
			if (temp !== null) {
				return temp;
			}
			current = current.nextNode;
		}
		return null;
	};
})(this);