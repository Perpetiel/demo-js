// tree.js
(function(exports) {
	"use strict";

	function Tree() {
		var saved = localStorage.getItem('tree'); 
		if (saved !== null) {
			this.firstNode = JSON.parse(saved);
		} else {
			this.firstNode = new Node('');
		}
		
		this.update();
	}
	exports.Tree = Tree;
	
	Tree.prototype = {
		constructor: Tree,
		
		addAfter: function(first, second) {
			if (typeof first.nextNode !== "undefined") {
				first.nextNode.previousNodeId = second.id;
				second.nextNode = first.nextNode;
			}
			first.nextNode = second;
			second.previousNodeId = first.id;
			this.update();
		},
		
		addBefore: function(first, second) {
			if (this.firstNode === first) {
				first.previousNodeId = second.id;
				second.nextNode = first;
				this.firstNode = second;
				this.update();
			} else if (typeof first.previousNodeId !== "undefined") {
				var node = Node.findById(first.previousNodeId, this.firstNode);
				this.addAfter(node, second);
			} else if (typeof first.parentNodeId !== "undefined") {
				var node = Node.findById(first.parentNodeId, this.firstNode);
				this.addChild(node, second);
			}
		},
		
		addChild: function(parent, child) {
			if (typeof parent.childNode !== "undefined") {
				child.nextNode = parent.childNode;
				parent.childNode.previousNodeId = child.id;
				delete parent.childNode.parentNodeId;
			}
			parent.childNode = child;
			child.parentNodeId = parent.id;
			this.update();
		},
		
		remove: function(node) {
			if (typeof node.nextNode !== "undefined") {
				var previous = Node.findById(node.previousNodeId, this.firstNode);
				var parent = Node.findById(node.parentNodeId, this.firstNode);
				if (previous !== null) {
					previous.nextNode = node.nextNode;
					node.nextNode.previousNodeId = previous.id;
				} else if (parent !== null) {
					parent.childNode = node.nextNode;
					node.nextNode.parentNodeId = parent.id;
				} else if (this.firstNode === node) {
					this.firstNode = node.nextNode;
				}
			} else {
				if (this.firstNode === node) {
					this.firstNode = new Node('');
				} else {
					var previous = Node.findById(node.previousNodeId, this.firstNode);
					if (previous !== null) {
						delete previous.nextNode;
					} else {
						var parent = Node.findById(node.parentNodeId, this.firstNode);
						if (parent !== null) {
							delete parent.childNode;
						}
					}
				}
			}
			this.update();
		},
		
		update: function() {
			this.render();
			this.saveToLocalStorage();
		},
		
		saveToLocalStorage: function() {
			localStorage.setItem('tree', JSON.stringify(this.firstNode));
		},
		
		render: function() {
			var tree = document.getElementById("tree");
			if (tree === null) {
				return;
			}
			tree.innerHTML = '';
			var ul = document.createElement("ul");
			tree.appendChild(ul);
			if (typeof this.firstNode === "undefined") {
				this.firstNode = new Node('');
			}
			this.renderList(this.firstNode, ul);
			this.addListeners();
		},
		
		renderList: function(firstNode, ul) {
			var current = firstNode;
			while (typeof current !== "undefined") {
				var li = document.createElement("li");
				li.innerHTML = this.getHTML(current.id, current.value);
				
				var child = current.childNode;
				if (typeof child !== "undefined") {
					var ulChild = document.createElement("ul");
					this.renderList(child, ulChild);
					li.appendChild(ulChild);
				}
				
				ul.appendChild(li);
				current = current.nextNode;
			}
		},
		
		getHTML: function(id, value) {
			var html =
			'<div class="input-group input-group-sm">' +
				'<input type="text" id="' + id + '" class="form-control" aria-label="..." value="' + value + '">' + 
				'<div class="input-group-btn">' +
				'<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Action <span class="caret"></span></button>' +
					'<ul class="dropdown-menu dropdown-menu-right">' +
						'<li><a id="ab_' + id + '" href="">Insert node above</a></li>' +
						'<li><a id="be_' + id + '" href="">Insert node below</a></li>' +
						'<li><a id="ch_' + id + '" href="">Insert child node</a></li>' +
						'<li role="separator" class="divider"></li>' +
						'<li><a id="de_' + id + '" href="">Delete node</a></li>' +
					'</ul>' +
				'</div>' +
			'</div>';
			return html;
		},
		
		addListeners: function() {
			var that = this;
			
			var inputs = document.getElementsByTagName('input');
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].addEventListener('change', function(e) {
					e.preventDefault();
					e.stopPropagation();
					var node = Node.findById(e.currentTarget.id, that.firstNode);
					node.value = e.currentTarget.value;
					that.saveToLocalStorage();
				});
			}
			
			var links = document.getElementsByTagName('a');
			for (var i = 0; i < links.length; i++) {
				links[i].addEventListener('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					switch (e.target.outerText) {
						case 'Insert node above':
						var node = Node.findById(e.target.id.split('_')[1], that.firstNode);
						that.addBefore(node, new Node(''));
						break;
						
						case 'Insert node below':
						var node = Node.findById(e.target.id.split('_')[1], that.firstNode);
						that.addAfter(node, new Node(''));
						break;
						
						case 'Insert child node':
						var node = Node.findById(e.target.id.split('_')[1], that.firstNode);
						that.addChild(node, new Node(''));
						break;
						
						case 'Delete node':
						var node = Node.findById(e.target.id.split('_')[1], that.firstNode);
						that.remove(node);
						break;
						
						default:
						console.log(e);
					}
				});
			}
		}
	};
})(this);