var expect = chai.expect;

describe('Node', function() {
	describe("constructor", function() {
		it("should set node's value", function() {
			var node = new Node("First Element");
			expect(node.value).to.equal("First Element");
		});
	});
	describe("findById", function() {
		it("should find node by id", function() {
			var node = new Node("First Element");
			node.nextNode = new Node("Second Element");
			node.nextNode.nextNode = new Node("Third Element");
			node.nextNode.childNode = new Node("First Child of Second Element");
			node.nextNode.childNode.nextNode = new Node("Second Child of Second Element");
			var id = node.nextNode.childNode.id;
			expect(Node.findById(id, node).value).to.equal("First Child of Second Element");
		});
	});
});

describe('Tree', function() {
	describe("constructor", function() {
		it("should set tree's first node", function() {
			var tree = new Tree();
			expect(tree.firstNode).to.not.be.undefined;
		});
	});
});