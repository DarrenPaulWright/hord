import { forOwn, get, set, traverse } from 'object-agent';
import { isArray, isObject } from 'type-enforcer';
import Index from './Index';

const intersection = (array1, array2) => {
	const result = [];

	array1.forEach((item) => {
		if (array2.includes(item)) {
			result.push(item);
		}
	});

	return result;
};

export default class Indexer {
	constructor() {
		this.indexes = {};
	}

	addIndex(path) {
		this.indexes[path] = new Index();
	}

	hasIndex(path) {
		return this.indexes[path] !== undefined;
	}

	add(item, index) {
		forOwn(this.indexes, (list, path) => {
			list.add(get(item, path), index);
		});
	}

	discard(item, index) {
		forOwn(this.indexes, (list, path) => {
			list.discard(get(item, path), index);
		});

		return this;
	}

	query(matcher) {
		const self = this;
		let match;
		let matches;
		let usedIndexes = false;
		const nonIndexedSearches = {};

		traverse(matcher, (path, value) => {
			if (path !== '' && !isObject(value) && !isArray(value)) {
				if (!self.hasIndex(path)) {
					set(nonIndexedSearches, path, value);
				}
				else {
					usedIndexes = true;
					match = self.indexes[path].query(value);
					matches = matches ? intersection(matches, match) : match;
				}
			}
		});

		if (!matches) {
			matches = [];
		}

		return {matches, nonIndexedSearches, usedIndexes};
	}

	update(path, index, value, previous) {
		if (this.hasIndex(path)) {
			this.indexes[path]
				.discard(previous, index)
				.add(value, index);
		}
	}

	rebuild(map) {
		forOwn(this.indexes, (list, path) => {
			list.rebuild(map, (item) => get(item, path));
		});
	}

	increment(amount, start = 0) {
		forOwn(this.indexes, (list) => {
			list.increment(amount, start);
		});
	}

	length(value) {
		forOwn(this.indexes, (list) => {
			list.length(value);
		});
	}

	clear() {
		forOwn(this.indexes, (list) => list.clear());
		this.indexes = {};
	}
}
