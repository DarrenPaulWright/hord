import { castArray, PrivateVars, Queue } from 'type-enforcer-ui';
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

const _ = new PrivateVars();

/**
 * A Graph Database designed for front end data visualization
 *
 * @class GraphDB
 * @private
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

		const _self = _.set(self, {
			ready: false,
			whenReady: new Queue(),
			nodes: new Collection().model(buildModel(settings.nodeModel || null, baseNodeSchema)),
			links: new Collection().model(buildModel(settings.linkModel || null, baseLinkSchema)),
			nodeCrawler: new List().sorter(List.sorter.id.asc)
		});

		self
			.nodes(settings.nodes || [])
			.then(() => self.links(settings.links || []))
			.then(() => {
				_self.ready = true;
				_self.whenReady.trigger().discardAll();
			});
	}

	[mapNewLink](link) {
		const self = this;
		const _self = _(self);

		if (link.source !== undefined && link.source.id === undefined) {
			link.source = _self.nodes.find({id: link.source});
		}
		if (link.target !== undefined && link.target.id === undefined) {
			link.target = _self.nodes.find({id: link.target});
		}

		if (link.source && link.target) {
			self[addToNodeCrawler](link);
			return link;
		}

		return null;
	}

	[addToNodeCrawler](link) {
		const self = this;
		const _self = _(self);

		const getCrawlNode = (node) => {
			let item = _self.nodeCrawler.find(node);

			if (!item) {
				item = {
					id: node.id,
					node,
					in: [],
					out: [],
					both: []
				};
				_self.nodeCrawler.add(item);
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
		const _self = _(self);

		return new Promise((resolve) => {
			if (_self.ready) {
				resolve(self);
			}
			else {
				_self.whenReady.add(() => {
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
		const _self = _(self);

		return new Promise((resolve) => {
			if (nodes) {
				_self.nodes.splice(0, _self.nodes.length, ...nodes);

				resolve();
			}
			else {
				resolve(_self.nodes);
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
		const _self = _(self);

		return new Promise((resolve) => {
			castArray(nodes).forEach((node) => {
				_self.nodes.push(node);
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
		const _self = _(self);

		return new Promise((resolve) => {
			if (links) {
				_self.nodeCrawler.discardAll();

				links = links.map(self[mapNewLink], self).filter(Boolean);
				_self.links.splice(0, _self.links.length, ...links);

				resolve();
			}
			else {
				resolve(_self.links);
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
		const _self = _(self);

		return new Promise((resolve) => {
			castArray(links).forEach((link) => {
				_self.links.push(self[mapNewLink](link));
			});

			resolve();
		});
	}

	get query() {
		const self = this;
		const _self = _(self);

		return {
			get nodes() {
				return nodeQuery(new Promise((resolve) => {
					resolve(_self.nodes);
				}), _self.nodes, _self.links);
			},
			get links() {
				return linkQuery(new Promise((resolve) => {
					resolve(_self.links);
				}), _self.nodes, _self.links);
			}
		};
	}

	shortestPaths(source, target) {
		const self = this;
		const _self = _(self);
		let shortest = _self.nodeCrawler.length;

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

		_self.nodeCrawler.forEach((item) => item.distance = shortest);

		return new Promise((resolve) => {
			let paths = processNode(_self.nodeCrawler.find({id: source.id}), 1);

			paths = paths.map((path) => {
				return path.map((link) => link.node);
			});

			resolve(paths);
		});
	}
}
