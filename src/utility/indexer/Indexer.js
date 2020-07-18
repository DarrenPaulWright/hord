import { forOwn, get, mapOwn, set, traverse } from 'object-agent';
import { isArray, isObject } from 'type-enforcer-ui';
import List from '../../List.js';
import operators from '../operators.js';
import Index from './Index.js';

export default class Indexer {
	constructor() {
		this.indexes = {};
		this.builds = 0;
		this.isHandled = false;
		this.skip = false;
	}

	spawn(indexes) {
		const spawn = new Indexer();

		spawn.indexes = mapOwn(this.indexes, (index) => {
			return index.spawn(indexes);
		});

		return spawn;
	}

	rebuild(map) {
		forOwn(this.indexes, (index, path) => {
			index.rebuild(map, (item) => get(item, path));
		});

		this.builds++;
	}

	addIndex(path) {
		this.indexes[path] = new Index();

		return this;
	}

	hasIndex(path) {
		return this.indexes[path] !== undefined;
	}

	add(item, offset) {
		forOwn(this.indexes, (index, path) => {
			index.add(get(item, path), offset);
		});
	}

	discard(item, offset) {
		forOwn(this.indexes, (index, path) => {
			index.discard(get(item, path), offset);
		});

		return this;
	}

	query(matcher) {
		const self = this;
		let match;
		let matches;
		let usedIndexes = false;
		const nonIndexedSearches = {};
		let didSubQuery = false;

		const subQuery = (path, value, operator) => {
			didSubQuery = true;

			if (!self.hasIndex(path)) {
				set(nonIndexedSearches, path, value);
			}
			else {
				usedIndexes = true;
				match = self.indexes[path].query(value[operator], operator);
				matches = matches ? matches.intersection(match) : match;
			}
		};

		traverse(matcher, (path, value) => {
			if (path !== '') {
				didSubQuery = false;

				if (isObject(value)) {
					operators.each((operator) => {
						if (value[operator] !== undefined) {
							subQuery(path, value, operator);
						}
					});
				}
				else if (!isArray(value)) {
					subQuery(path, { $eq: value }, operators.EQUAL);
				}

				return didSubQuery;
			}
		}, true);

		if (!matches) {
			matches = new List();
		}

		return { matches, nonIndexedSearches, usedIndexes };
	}

	update(path, index, value, previous) {
		if (this.hasIndex(path)) {
			this.indexes[path]
				.discard(previous, index)
				.add(value, index);
		}
	}

	increment(amount, start = 0) {
		forOwn(this.indexes, (index) => {
			index.increment(amount, start);
		});
	}

	length(value) {
		forOwn(this.indexes, (index) => {
			index.length(value);
		});
	}

	clear() {
		forOwn(this.indexes, (index) => index.clear());
		this.indexes = {};
	}
}
