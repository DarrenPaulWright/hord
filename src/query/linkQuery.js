import bothNode from './bothNode';
import filter from './filter';
import inNode from './inNode';
import nodeQuery from './nodeQuery';
import outNode from './outNode';

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
