import { repeat } from 'object-agent';
import bothLink from './bothLink';
import filter from './filter';
import inLink from './inLink';
import linkQuery from './linkQuery';
import outLink from './outLink';

const nodeQuery = function(promise, mainNodes, mainLinks) {
	const nextLinks = (promise, callback) => {
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
			return nextLinks(promise, inLink);
		},
		get outLink() {
			return nextLinks(promise, outLink);
		},
		get bothLink() {
			return nextLinks(promise, bothLink);
		},
		extent(depth = 1) {
			return new Promise((resolve) => {
				promise = promise.then((nodes) => {
					return {
						nodes,
						links: []
					};
				});

				repeat(depth, () => {
					promise = promise.then((graph) => new Promise((resolve) => {

						nodeQuery(new Promise((resolve) => {
							resolve(graph.nodes);
						}), mainNodes, mainLinks)
							.bothLink
							.then((links) => {
								graph.links = links.concat(graph.links);

								return linkQuery(new Promise((resolve) => {
									resolve(graph.links);
								}), mainNodes, mainLinks)
									.bothNode;
							})
							.then((nodes) => {
								graph.nodes = graph.nodes.concat(nodes);
								resolve(graph);
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
