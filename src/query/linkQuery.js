import bothNode from './bothNode.js';
import filter from './filter.js';
import inNode from './inNode.js';
import nodeQuery from './nodeQuery.js';
import outNode from './outNode.js';

const linkQuery = function(promise, mainNodes, mainLinks) {
	const nextNodes = (callback) => {
		return nodeQuery(promise.then(callback()), mainNodes, mainLinks);
	};

	return {
		filter(matcher) {
			return linkQuery(promise.then(filter(matcher)), mainNodes, mainLinks);
		},
		get in() {
			return this.inNode.outLink;
		},
		get out() {
			return this.outNode.inLink;
		},
		get both() {
			return this.bothNode.bothLink;
		},
		get inNode() {
			return nextNodes(inNode);
		},
		get outNode() {
			return nextNodes(outNode);
		},
		get bothNode() {
			return nextNodes(bothNode);
		},
		then(callback) {
			return promise.then(callback);
		}
	};
};

export default linkQuery;
