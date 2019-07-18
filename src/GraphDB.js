import { castArray, privateProp, Queue } from 'type-enforcer';
import Collection from './Collection';
import List from './List';
import Model, { MODEL_ERROR_LEVEL } from './Model';
import linkQuery from './query/linkQuery';
import nodeQuery from './query/nodeQuery';
import Schema from './Schema/Schema';

const baseNodeSchema = new Schema({
	id: {
		type: [String, Number],
		isRequired: true,
		index: true
	},
	label: {
		type: String,
		index: true
	},
	'*': '*'
});

const baseLinkSchema = new Schema({
	label: {
		type: String,
		index: true
	},
	source: {
		type: [String, Number, Object],
		isRequired: true,
		content: {
			id: {
				type: [String, Number],
				index: true
			},
			'*': '*'
		}
	},
	target: {
		type: [String, Number, Object],
		isRequired: true,
		content: {
			id: {
				type: [String, Number],
				index: true
			},
			'*': '*'
		}
	},
	'*': '*'
});

const buildModel = (model, schema) => {
	if (model === null) {
		model = new Model(schema);
	}
	else {
		if (!(model instanceof Model)) {
			model = new Model(model);
		}
		model = model.extend(schema);
	}

	model.errorLevel(MODEL_ERROR_LEVEL.WARN);

	return model;
};

const mapNewLink = Symbol();
const addToNodeCrawler = Symbol();

const READY = Symbol();
const WHEN_READY = Symbol();
const NODES = Symbol();
const LINKS = Symbol();
const NODE_CRAWLER = Symbol();

/**
 * A Graph Database designed for front end data visualization
 *
 * @class GraphDB
 * @summary
 *
 * ``` javascript
 * import { GraphDB } from 'hord';
 * ```
 *
 * @arg {Object} [settings]
 * @arg {Model} [settings.nodeModel]
 * @arg {Model} [settings.linkModel]
 * @arg {Array} [settings.nodes]
 * @arg {Array} [settings.links]
 */
export default class GraphDB {
	constructor(settings = {}) {
		const self = this;

		privateProp(self, READY, false);
		privateProp(self, WHEN_READY, new Queue());

		privateProp(self, NODES, new Collection()
			.model(buildModel(settings.nodeModel || null, baseNodeSchema)));
		privateProp(self, LINKS, new Collection()
			.model(buildModel(settings.linkModel || null, baseLinkSchema)));

		privateProp(self, NODE_CRAWLER, new List().sorter(List.sorter.id.asc));

		self
			.nodes(settings.nodes || [])
			.then(() => self.links(settings.links || []))
			.then(() => {
				self[READY] = true;
				if (self[WHEN_READY].length) {
					self[WHEN_READY].trigger();
					self[WHEN_READY].discardAll();
				}
			});
	}

	[mapNewLink](link) {
		const self = this;

		if (link.source !== undefined && link.source.id === undefined) {
			link.source = self[NODES].find({id: link.source});
		}
		if (link.target !== undefined && link.target.id === undefined) {
			link.target = self[NODES].find({id: link.target});
		}

		if (link.source && link.target) {
			self[addToNodeCrawler](link);
			return link;
		}

		return null;
	}

	[addToNodeCrawler](link) {
		const self = this;

		const getCrawlNode = (node) => {
			let item = self[NODE_CRAWLER].find(node);

			if (!item) {
				item = {
					id: node.id,
					node: node,
					in: [],
					out: [],
					both: []
				};
				self[NODE_CRAWLER].add(item);
			}

			return item;
		};

		const addNode = (node1, node2, direction) => {
			if (!node1[direction].includes(node2)) {
				node1[direction].push(node2);
			}
			if (!node1.both.includes(node2)) {
				node1.both.push(node2);
			}
		};

		const source = getCrawlNode(link.source);
		const target = getCrawlNode(link.target);

		addNode(source, target, 'out');
		addNode(target, source, 'in');
	}

	whenReady() {
		const self = this;

		return new Promise((resolve) => {
			if (self[READY]) {
				resolve(self);
			}
			else {
				self[WHEN_READY].add(() => {
					resolve(self);
				});
			}
		});
	}

	/**
	 * Set the nodes. An 'id' property is required for all nodes and can be a `String` or a `Number`.
	 *
	 * @memberOf GraphDB
	 * @instance
	 *
	 * @arg {Array|Collection} nodes
	 *
	 * @returns {Promise} If getting the nodes then resolves with the nodes
	 */
	nodes(nodes) {
		const self = this;

		return new Promise((resolve) => {
			if (nodes) {
				self[NODES].splice(0, self[NODES].length, ...nodes);

				resolve();
			}
			else {
				resolve(self[NODES]);
			}
		});
	}

	/**
	 * Add nodes. An 'id' property is required for all nodes and can be a `String` or a `Number`.
	 *
	 * @memberOf GraphDB
	 * @instance
	 *
	 * @arg {Array|Collection} nodes
	 *
	 * @returns {Promise}
	 */
	addNodes(nodes) {
		const self = this;

		return new Promise((resolve) => {
			castArray(nodes).forEach((node) => {
				self[NODES].push(node);
			});

			resolve();
		});
	}

	/**
	 * Set the links. If link.source or link.target of any link doesn't map to an existing node.id, or is not already mapped to a node, then the link is removed
	 *
	 * @memberOf GraphDB
	 * @instance
	 *
	 * @arg {Array|Collection} links
	 *
	 * @returns {Promise} If getting the nodes then resolves with the nodes
	 */
	links(links) {
		const self = this;

		return new Promise((resolve) => {
			if (links) {
				self[NODE_CRAWLER].discardAll();

				links = links.map(self[mapNewLink], self).filter(Boolean);
				self[LINKS].splice(0, self[LINKS].length, ...links);

				resolve();
			}
			else {
				resolve(self[LINKS]);
			}
		});
	}

	/**
	 * Add links. If link.source or link.target of any link doesn't map to an existing node.id, or is not already mapped to a node, then the link is removed
	 *
	 * @memberOf GraphDB
	 * @instance
	 *
	 * @arg {Array|Collection} links
	 *
	 * @returns {Promise}
	 */
	addLinks(links) {
		const self = this;

		return new Promise((resolve) => {
			castArray(links).forEach((link) => {
				self[LINKS].push(self[mapNewLink](link));
			});

			resolve();
		});
	}

	get query() {
		const self = this;

		return {
			get nodes() {
				return nodeQuery(new Promise((resolve) => {
					resolve(self[NODES]);
				}), self[NODES], self[LINKS]);
			},
			get links() {
				return linkQuery(new Promise((resolve) => {
					resolve(self[LINKS]);
				}), self[NODES], self[LINKS]);
			}
		};
	}

	shortestPaths(source, target) {
		const self = this;
		let shortest = self[NODE_CRAWLER].length;

		const processNode = (node, distance) => {
			let paths = [];
			let localShortest = Infinity;
			let checkFurther = [];

			if (node && node.both) {
				node.both.some((linkedNode) => {
					if (distance <= linkedNode.distance) {
						linkedNode.distance = distance;

						if (linkedNode.id === target.id) {
							shortest = distance;
							paths = [[linkedNode, node]];
							return true;
						}
						else if (distance < shortest && linkedNode.both.length) {
							checkFurther.push(linkedNode);
						}
					}
				});
			}

			distance++;

			checkFurther.forEach((linkedNode) => {
				processNode(linkedNode, distance)
					.forEach((path) => {
						if (path.length < localShortest) {
							localShortest = path.push(node);
							paths.push(path);
						}
					});
			});

			return paths.filter((path) => path.length <= localShortest);
		};

		self[NODE_CRAWLER].forEach((item) => item.distance = shortest);

		return new Promise((resolve) => {
			let paths = processNode(self[NODE_CRAWLER].find({id: source.id}), 1);

			paths = paths.map((path) => {
				return path.map((link) => link.node);
			});

			resolve(paths);
		});
	}
}
