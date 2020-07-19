import { repeat } from 'object-agent';
import bothLink from './bothLink.js';
import filter from './filter.js';
import inLink from './inLink.js';
import linkQuery from './linkQuery.js';
import outLink from './outLink.js';

const nodeQuery = function(promise, mainNodes, mainLinks) {
	const nextLinks = (callback) => {
		return linkQuery(promise.then(callback(mainLinks)), mainNodes, mainLinks);
	};

	return {
		filter(matcher) {
			return nodeQuery(promise.then(filter(matcher)), mainNodes, mainLinks);
		},
		get in() {
			return this.inLink.outNode;
		},
		get out() {
			return this.outLink.inNode;
		},
		get both() {
			return this.bothLink.bothNode;
		},
		get inLink() {
			return nextLinks(inLink);
		},
		get outLink() {
			return nextLinks(outLink);
		},
		get bothLink() {
			return nextLinks(bothLink);
		},
		extent(depth = 1) {
			return new Promise((resolve) => {
				promise = promise.then((nodes) => ({ nodes, links: [] }));

				repeat(depth, () => {
					promise = promise.then((graph) => new Promise((innerResolve) => {
						nodeQuery(Promise.resolve(graph.nodes), mainNodes, mainLinks)
							.bothLink
							.then((links) => {
								graph.links = links.concat(graph.links);

								return linkQuery(Promise.resolve(graph.links), mainNodes, mainLinks)
									.bothNode;
							})
							.then((nodes) => {
								graph.nodes = graph.nodes.concat(nodes);
								innerResolve(graph);
							});
					}));
				});

				promise.then((graph) => {
					resolve({
						nodes: graph.nodes.unique(),
						links: graph.links.unique()
					});
				});
			});
		},
		then(callback) {
			return promise.then(callback);
		}
	};
};

export default nodeQuery;
