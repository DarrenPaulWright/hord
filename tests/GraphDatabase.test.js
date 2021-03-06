import { clone } from 'object-agent';
import { assert } from 'type-enforcer';
import { GraphDatabase } from '../index.js';

const testNodes = [{
	id: 0,
	label: 'person',
	first: 'John',
	last: 'Doe'
}, {
	id: 1,
	label: 'person',
	first: 'Jane',
	last: 'Doe'
}, {
	id: 2,
	label: 'person',
	first: 'Jane',
	last: 'Smith'
}, {
	id: 3,
	label: 'person',
	first: 'Steve',
	last: 'Smith'
}, {
	id: 4,
	label: 'person',
	first: 'Sarah',
	last: 'Jones'
}, {
	id: 5,
	label: 'hobby',
	name: 'programming'
}, {
	id: 6,
	label: 'hobby',
	name: 'basketball'
}];

const testNodeModel = {
	first: String,
	last: String,
	name: String
};
const testNodeModelIndexed = {
	first: {
		type: String,
		index: true
	},
	last: {
		type: String,
		index: true
	},
	name: {
		type: String,
		index: true
	}
};

const testLinks = [{
	id: 'link0',
	source: 1,
	target: 5,
	label: 'has'
}, {
	id: 'link1',
	source: 3,
	target: 6,
	label: 'has'
}, {
	id: 'link2',
	source: 3,
	target: 2,
	label: 'married'
}, {
	id: 'link3',
	source: 2,
	target: 3,
	label: 'married'
}, {
	id: 'link4',
	source: 0,
	target: 1,
	label: 'married'
}, {
	id: 'link5',
	source: 1,
	target: 0,
	label: 'married'
}, {
	id: 'link6',
	source: 4,
	target: 5,
	label: 'has'
}];

const testLinksProcessed = testLinks.map((link) => {
	return {
		id: link.id,
		source: testNodes[link.source],
		target: testNodes[link.target],
		label: link.label
	};
});

describe('GraphDatabase', () => {
	describe('init', () => {
		it('should initialize without settings', () => {
			assert.notThrows(() => {
				new GraphDatabase();
			});
		});
	});

	describe('.nodes', () => {
		it('should accept an array of nodes in settings', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				nodeModel: testNodeModel
			});

			return graph.nodes()
				.then((nodes) => {
					assert.equal(nodes, testNodes);
				});
		});

		it('should accept an array of nodes', () => {
			const graph = new GraphDatabase({
				nodeModel: testNodeModel
			});

			return graph.nodes(clone(testNodes))
				.then(() => graph.nodes())
				.then((nodes) => {
					assert.equal(nodes, testNodes);
				});
		});
	});

	describe('.addNodes', () => {
		it('should add a node', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				nodeModel: testNodeModel
			});

			return graph.whenReady()
				.then(() => graph
					.addNodes({
						id: 13245,
						label: 'qwerty'
					}))
				.then(() => graph.nodes())
				.then((nodes) => {
					assert.equal(nodes, [...testNodes, {
						id: 13245,
						label: 'qwerty'
					}]);
				});
		});

		it('should add a multiple nodes', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				nodeModel: testNodeModel
			});

			return graph.whenReady()
				.then(() => graph.addNodes([{
						id: 13245,
						label: 'qwerty'
					}, {
						id: 132456,
						label: 'qwerty'
					}])
				)
				.then(() => graph.nodes())
				.then((nodes) => {
					assert.equal(nodes, [...testNodes, {
						id: 13245,
						label: 'qwerty'
					}, {
						id: 132456,
						label: 'qwerty'
					}]);
				});
		});
	});

	describe('.links', () => {
		it('should accept an array of links in settings', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				links: clone(testLinks)
			});

			return graph.links()
				.then((links) => {
					assert.equal(links, testLinksProcessed);
				});
		});

		it('should accept an array of links', () => {
			const graph = new GraphDatabase();

			return graph.nodes(clone(testNodes))
				.then(() => graph.links(clone(testLinks)))
				.then(() => graph.links())
				.then((links) => {
					assert.equal(links, testLinksProcessed);
				});
		});
	});

	describe('.addLinks', () => {
		it('should add a link', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				links: clone(testLinks)
			});

			return graph.whenReady()
				.then(() => graph
					.addLinks({
						source: 4,
						target: 6
					}))
				.then(() => graph.links())
				.then((links) => {
					assert.is(links.length, 8);
					assert.equal(links, [...testLinksProcessed, {
						source: testNodes[4],
						target: testNodes[6]
					}]);
				});
		});

		it('should add multiple links', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				links: clone(testLinks)
			});

			return graph.whenReady()
				.then(() => graph
					.addLinks([{
						source: 4,
						target: 6
					}, {
						source: 5,
						target: 6
					}]))
				.then(() => graph.links())
				.then((links) => {
					assert.is(links.length, 9);
					assert.equal(links, [...testLinksProcessed, {
						source: testNodes[4],
						target: testNodes[6]
					}, {
						source: testNodes[5],
						target: testNodes[6]
					}]);
				});
		});
	});

	describe('.query', () => {
		const doTests = (model) => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				links: clone(testLinks),
				nodeModel: model
			});

			describe('.nodes', () => {
				it('should return the nodes', () => {
					return graph.query.nodes
						.then((result) => {
							assert.equal(result, testNodes);
						});
				});

				it('should filter the results when .filter is called', () => {
					return graph.query.nodes
						.filter({ label: 'person' })
						.then((result) => {
							assert.equal(result, testNodes.slice(0, 5));
						});
				});

				it('should filter the results twice when .filter is called twice', () => {
					return graph.query.nodes
						.filter({ label: 'person' })
						.filter({ last: 'Smith' })
						.then((result) => {
							assert.equal(result, [testNodes[2], testNodes[3]]);
						});
				});

				it('should return the links pointing to the selected nodes when .inLink is called', () => {
					return graph.query.nodes
						.filter({
							label: 'person',
							last: { $ne: 'Smith' }
						})
						.inLink
						.then((result) => {
							assert.is(result.length, 2);
							assert.equal(result[0].source, testNodes[0]);
							assert.equal(result[0].target, testNodes[1]);
							assert.equal(result[1].source, testNodes[1]);
							assert.equal(result[1].target, testNodes[0]);
						});
				});

				it('should return the links pointing to the selected nodes when .in is called', () => {
					return graph.query.nodes
						.filter({
							label: 'person',
							last: { $ne: 'Smith' }
						})
						.in
						.then((result) => {
							assert.is(result.length, 2);
							assert.equal(result[0], testNodes[0]);
							assert.equal(result[1], testNodes[1]);
						});
				});

				it('should return the links pointing from the selected nodes when .outLink is called', () => {
					return graph.query.nodes
						.filter({
							label: 'person',
							last: { $ne: 'Smith' }
						})
						.outLink
						.then((result) => {
							assert.is(result.length, 4);
							assert.equal(result[0].source, testNodes[1]);
							assert.equal(result[0].target, testNodes[5]);
							assert.equal(result[1].source, testNodes[0]);
							assert.equal(result[1].target, testNodes[1]);
							assert.equal(result[2].source, testNodes[1]);
							assert.equal(result[2].target, testNodes[0]);
							assert.equal(result[3].source, testNodes[4]);
							assert.equal(result[3].target, testNodes[5]);
						});
				});

				it('should return the links pointing from the selected nodes when .out is called', () => {
					return graph.query.nodes
						.filter({
							label: 'person',
							last: { $ne: 'Smith' }
						})
						.out
						.then((result) => {
							assert.is(result.length, 3);
							assert.equal(result[0], testNodes[5]);
							assert.equal(result[1], testNodes[1]);
							assert.equal(result[2], testNodes[0]);
						});
				});

				it('should return the links pointing from the selected nodes when .bothLink is called', () => {
					return graph.query.nodes
						.filter({
							label: 'person',
							last: { $ne: 'Smith' }
						})
						.bothLink
						.then((result) => {
							assert.is(result.length, 4);
							assert.equal(result[0].source, testNodes[1]);
							assert.equal(result[0].target, testNodes[5]);
							assert.equal(result[1].source, testNodes[0]);
							assert.equal(result[1].target, testNodes[1]);
							assert.equal(result[2].source, testNodes[1]);
							assert.equal(result[2].target, testNodes[0]);
							assert.equal(result[3].source, testNodes[4]);
							assert.equal(result[3].target, testNodes[5]);
						});
				});

				it('should return the links pointing from the selected nodes when .both is called', () => {
					return graph.query.nodes
						.filter({
							label: 'person',
							last: { $ne: 'Smith' }
						})
						.both
						.then((result) => {
							assert.is(result.length, 4);
							assert.equal(result[0], testNodes[1]);
							assert.equal(result[1], testNodes[0]);
							assert.equal(result[2], testNodes[4]);
							assert.equal(result[3], testNodes[5]);
						});
				});

				it('should return nodes and links of depth 1 when .extent is called', () => {
					return graph.query.nodes
						.filter({ id: 1 })
						.extent()
						.then((result) => {
							assert.is(result.nodes.length, 3);
							assert.equal(result.nodes[0], testNodes[1]);
							assert.equal(result.nodes[1], testNodes[0]);
							assert.equal(result.nodes[2], testNodes[5]);

							assert.is(result.links.length, 3);
							assert.equal(result.links[0], testLinksProcessed[0]);
							assert.equal(result.links[1], testLinksProcessed[5]);
							assert.equal(result.links[2], testLinksProcessed[4]);
						});
				});

				it('should return nodes and links of depth 2 when .extent is called', () => {
					return graph.query.nodes
						.filter({ id: 1 })
						.extent(2)
						.then((result) => {
							assert.is(result.nodes.length, 4);
							assert.equal(result.nodes[0], testNodes[1]);
							assert.equal(result.nodes[1], testNodes[0]);
							assert.equal(result.nodes[2], testNodes[5]);
							assert.equal(result.nodes[3], testNodes[4]);

							assert.is(result.links.length, 4);
							assert.equal(result.links[0], testLinksProcessed[0]);
							assert.equal(result.links[1], testLinksProcessed[4]);
							assert.equal(result.links[2], testLinksProcessed[5]);
							assert.equal(result.links[3], testLinksProcessed[6]);
						});
				});
			});

			describe('.links', () => {
				it('should return the links', () => {
					return graph.query.links.then((result) => {
						assert.equal(result, testLinksProcessed);
					});
				});

				it('should filter the results when .filter is called', () => {
					return graph.query.links
						.filter({ label: 'married' })
						.then((result) => {
							assert.equal(result, testLinksProcessed.slice(2, 6));
						});
				});

				it('should filter the results twice when .filter is called twice', () => {
					return graph.query.links
						.filter({ label: 'married' })
						.filter({ id: 'link3' })
						.then((result) => {
							assert.equal(result, testLinksProcessed.slice(3, 4));
						});
				});

				it('should return the links pointing to the selected nodes when .inNode is called', () => {
					return graph.query.links
						.filter({
							label: 'married',
							id: { $ne: 'link3' }
						})
						.inNode
						.then((result) => {
							assert.is(result.length, 3);
							assert.equal(result[0], testNodes[2]);
							assert.equal(result[1], testNodes[1]);
							assert.equal(result[2], testNodes[0]);
						});
				});

				it('should return the links pointing to the selected nodes when .in is called', () => {
					return graph.query.links
						.filter({
							label: 'married',
							id: { $ne: 'link3' }
						})
						.in
						.then((result) => {
							assert.is(result.length, 4);
							assert.equal(result[0], testLinksProcessed[0]);
							assert.equal(result[1], testLinksProcessed[3]);
							assert.equal(result[2], testLinksProcessed[4]);
							assert.equal(result[3], testLinksProcessed[5]);
						});
				});

				it('should return the links pointing from the selected nodes when .outNode is called', () => {
					return graph.query.links
						.filter({
							label: 'married',
							id: { $ne: 'link3' }
						})
						.outNode
						.then((result) => {
							assert.is(result.length, 3);
							assert.equal(result[0], testNodes[3]);
							assert.equal(result[1], testNodes[0]);
							assert.equal(result[2], testNodes[1]);
						});
				});

				it('should return the links pointing from the selected nodes when .out is called', () => {
					return graph.query.links
						.filter({
							label: 'married',
							id: { $ne: 'link3' }
						})
						.out
						.then((result) => {
							assert.is(result.length, 3);
							assert.equal(result[0], testLinksProcessed[3]);
							assert.equal(result[1], testLinksProcessed[4]);
							assert.equal(result[2], testLinksProcessed[5]);
						});
				});

				it('should return the links pointing from the selected nodes when .bothNode is called', () => {
					return graph.query.links
						.filter({
							label: 'married',
							id: { $ne: 'link3' }
						})
						.bothNode
						.then((result) => {
							assert.is(result.length, 4);
							assert.equal(result[0], testNodes[3]);
							assert.equal(result[1], testNodes[0]);
							assert.equal(result[2], testNodes[1]);
							assert.equal(result[3], testNodes[2]);
						});
				});

				it('should return the links pointing from the selected nodes when .both is called', () => {
					return graph.query.links
						.filter({
							label: 'married',
							id: { $ne: 'link3' }
						})
						.both
						.then((result) => {
							assert.is(result.length, 6);
							assert.equal(result[0], testLinksProcessed[0]);
							assert.equal(result[1], testLinksProcessed[1]);
							assert.equal(result[2], testLinksProcessed[2]);
							assert.equal(result[3], testLinksProcessed[3]);
							assert.equal(result[4], testLinksProcessed[4]);
							assert.equal(result[5], testLinksProcessed[5]);
						});
				});
			});
		};

		describe('(without indexes)', () => {
			doTests(testNodeModel);
		});

		describe('(with indexes)', () => {
			doTests(testNodeModelIndexed);
		});
	});

	describe('.shortestPaths', () => {
		it('should return an empty array if two nodes are not linked', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				links: clone(testLinks)
			});

			return graph.whenReady()
				.then(() => graph.shortestPaths(testNodes[2], testNodes[1]))
				.then((paths) => {
					assert.is(paths.length, 0);
				});
		});

		it('should find the shortest path between two nodes', () => {
			const graph = new GraphDatabase({
				nodes: clone(testNodes),
				links: clone(testLinks)
			});

			return graph.whenReady()
				.then(() => graph.shortestPaths(testNodes[0], testNodes[4]))
				.then((paths) => {
					assert.is(paths.length, 1);
					assert.is(paths[0].length, 4);
					assert.equal(paths, [[testNodes[4], testNodes[5], testNodes[1], testNodes[0]]]);
				});
		});
	});
});
