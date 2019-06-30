import { clone, get, isEmpty, isEqual, traverse } from 'object-agent';
import onChange from 'on-change';
import {
	enforceBoolean,
	enforceFunction,
	enforceString,
	isArray,
	isInstanceOf,
	isInteger,
	isObject,
	methodInstance
} from 'type-enforcer';
import Model from './Model';
import findLastIndex from './utility/findLastIndex';
import Indexer from './utility/indexer/Indexer';
import someRight from './utility/someRight';

/**
 * Can be either of the following:
 * - A function that accepts one item from the collection and returns true to indicate a match.
 * - An object that is deeply compared to items in the collection for equivalent property values. Only properties on the predicate are compared.
 *
 * If you haven't set up any indexes, or you're searching on properties that aren't indexed, then providing a function will most likely have better performance. If you're searching on even one property that's indexed, then using an object will perform better, as the indexer can narrow the search before iterating over the results for a final match.
 *
 * @typedef predicate
 * @type {function|Object}
 */

const buildFinder = (predicate) => {
	if (isObject(predicate)) {
		const rules = [];

		traverse(predicate, (path, value) => {
			if (path.length && !isArray(value) && !isObject(value)) {
				rules.push((item) => isEqual(get(item, path), value));
			}
		});

		return (item) => rules.every((rule) => item ? rule(item) : false);
	}

	return predicate;
};

export const SETTINGS = Symbol();
const INDEXER = Symbol();
const SKIP_INDEXER = Symbol();
export const INDEXER_BUILDS = Symbol();
const IS_INDEXING_HANDLED = Symbol();
const MODEL = Symbol();
const MODEL_CHANGE_ID = Symbol();

const applyModel = Symbol();

/**
 * An array of objects with optional model enforcement and indexed queries. For info on indexing, see Collection.{@link Collection#model}.
 *
 * The collection class uses the [on-change](https://github.com/sindresorhus/on-change) library (uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) to detect changes and maintain model enforcement and indexing.
 *
 * @class Collection
 * @extends Array
 * @summary
 *
 * ``` javascript
 * import { Collection } from 'hord';
 * ```
 *
 * @arg {Array|Object} - Accepts an array of objects or multiple args of objects.
 */
export default class Collection extends Array {
	constructor(...args) {
		super(...(args.length === 1 && isArray(args[0]) ? args[0] : args));

		const self = this;
		self[SETTINGS] = {};
		self[SETTINGS][INDEXER_BUILDS] = 0;

		return onChange(self, (path, value, previous) => {
			const settings = self[SETTINGS];

			if (!settings[IS_INDEXING_HANDLED] && settings[MODEL]) {
				if (settings[INDEXER] && isInteger(path, true)) {
					path = Number(path);
					self[path] = settings[MODEL].apply(self[path]);
					settings[INDEXER]
						.discard(previous, path)
						.add(value, path);
				}
				else if (settings[INDEXER] && path === 'length') {
					if (value < previous) {
						settings[INDEXER].length(value);
					}
				}
				else {
					self[applyModel]();
				}
			}
		}, {
			isShallow: true
		});
	}

	[applyModel]() {
		const self = this;
		const settings = self[SETTINGS];

		if (settings[MODEL]) {
			settings[IS_INDEXING_HANDLED] = true;

			self.forEach((item, index) => self[index] = settings[MODEL].apply(item));

			if (settings[INDEXER]) {
				settings[INDEXER].rebuild((callback) => super.filter(Boolean).map(callback));
				settings[INDEXER_BUILDS]++;
			}

			settings[IS_INDEXING_HANDLED] = false;
		}
	}

	//          ADD / REMOVE

	/**
	 * Add an item to the end of the collection.
	 *
	 * @summary
	 * _`✎ Updates indexes`_
	 *
	 * @see [Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
	 *
	 * @method push
	 * @memberOf Collection
	 * @instance
	 * @category Add / Remove
	 *
	 * @arg {*} item
	 *
	 * @returns {Number} The new length of the collection
	 */
	push(item) {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_INDEXING_HANDLED] = true;

		const output = super.push(item);

		if (settings[MODEL]) {
			const index = self.length - 1;

			self[index] = settings[MODEL].apply(self[index]);

			if (settings[INDEXER]) {
				settings[INDEXER].add(self[index], index);
			}
		}

		return output;
	}

	/**
	 * Remove the last item from the collection and return it.
	 *
	 * @summary
	 * _`✎ Updates indexes`_
	 *
	 * @see [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
	 *
	 * @method pop
	 * @memberOf Collection
	 * @instance
	 * @category Add / Remove
	 *
	 * @returns {*}
	 */
	pop() {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_INDEXING_HANDLED] = true;

		const output = super.pop();

		if (settings[INDEXER]) {
			settings[INDEXER].discard(output, self.length);
		}

		return output;
	}

	/**
	 * Add an item to the beginning of the collection.
	 *
	 * @summary
	 * _`✎ Updates indexes`_
	 *
	 * @see [Array.prototype.unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
	 *
	 * @method unshift
	 * @memberOf Collection
	 * @instance
	 * @category Add / Remove
	 *
	 * @arg {*} item
	 *
	 * @returns {Number} The new length of the collection
	 */
	unshift(item) {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_INDEXING_HANDLED] = true;

		const output = super.unshift(item);

		if (settings[MODEL]) {
			self[0] = settings[MODEL].apply(self[0]);

			if (settings[INDEXER]) {
				settings[INDEXER].increment(1);
				settings[INDEXER].add(self[0], 0);
			}
		}

		return output;
	}

	/**
	 * Remove the first item from the collection and return it.
	 *
	 * @summary
	 * _`✎ Updates indexes`_
	 *
	 * @see [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
	 *
	 * @method shift
	 * @memberOf Collection
	 * @instance
	 * @category Add / Remove
	 *
	 * @returns {*}
	 */
	shift() {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_INDEXING_HANDLED] = true;

		const output = super.shift();

		if (settings[INDEXER]) {
			settings[INDEXER]
				.discard(output, 0)
				.increment(-1);
		}

		return output;
	}

	//          ITERATIVE

	/**
	 * Calls a provided callback once for each array element in order starting at 0.
	 * Unlike the native forEach, this one returns an instance of collection for chaining.
	 *
	 * @see [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
	 *
	 * @method forEach
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 * @chainable
	 *
	 * @arg {Function} callback
	 * @arg {*} [thisArg=this]
	 */
	forEach(callback, thisArg) {
		super.forEach(callback, thisArg || this);

		return this;
	}

	/**
	 * Like .forEach(), but starts on the last (greatest index) item
	 * and progresses backwards
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 * @chainable
	 *
	 * @arg {Function} callback
	 * @arg {*} [thisArg=this]
	 */
	forEachRight(callback, thisArg) {
		callback = callback.bind(thisArg || this);

		for (let index = this.length - 1; index !== -1; index--) {
			callback(this[index], index);
		}

		return this;
	}

	/**
	 * @see [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
	 *
	 * @method some
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} callback
	 * @arg {Object} [thisArg]
	 *
	 * @returns {Boolean}
	 */

	/**
	 * Like .some(), but starts on the last (greatest index) item and progresses backwards
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} callback
	 *
	 * @returns {Boolean}
	 */
	someRight(callback) {
		return someRight(this, callback);
	}

	/**
	 * @see [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
	 *
	 * @method every
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} callback
	 * @arg {Object} [thisArg]
	 *
	 * @returns {Boolean}
	 */

	/**
	 * @see [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
	 *
	 * @method reduce
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} callback
	 * @arg {Object} [thisArg]
	 *
	 * @returns {*}
	 */

	/**
	 * @see [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
	 *
	 * @method reduceRight
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} callback
	 * @arg {Object} [thisArg]
	 *
	 * @returns {*}
	 */

	/**
	 * Returns a new collection with the results of calling a provided
	 * function on every element.
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} callback - Function that produces an element of the new Array, taking three arguments: the current item, index, and the collection. Context is also set to this collection.
	 * @arg {*} thisArg - Applied to the context of the callback
	 *
	 * @returns {Collection} A new Collection without a model.
	 */
	map(callback, thisArg) {
		return new Collection(super.map(callback, thisArg || this));
	}

	/**
	 * Calls a callback for each nested child
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Function} onChild - Called for each item and child item. If true is returned, all iteration stops. Provides three args: the child item, the nested depth of the item, and the items parent. Context is set to this Collection.
	 * @arg {Object}   [settings]
	 * @arg {String}   [settings.childKey=children] - The key that contains children items
	 * @arg {Function} [settings.onParent] - Called for each item that contains children. If true is returned, then the children will not get processed. Provides the same args and context as the onChild callback.
	 */
	eachChild(onChild, settings = {}) {
		const self = this;
		const childKey = enforceString(settings.childKey, 'children');
		let onParent = enforceFunction(settings.onParent, () => false);

		onChild = onChild.bind(self);
		onParent = onParent.bind(self);

		const each = (item, depth, parent) => {
			if (isArray(item)) {
				return item.some((child) => each(child, depth, parent));
			}
			if (onChild(item, depth, parent)) {
				return true;
			}
			if (childKey in item && !onParent(item, depth, parent)) {
				return each(item[childKey], depth + 1, item);
			}
			return false;
		};

		each(this, 0);
	}

	/**
	 * Creates a new array with all sub-array elements concatenated into it recursively up to the specified depth.
	 *
	 * @see [Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Number} [depth=1]
	 *
	 * @returns {Collection} A new Collection without a model.
	 */
	flat(depth) {
		return new Collection(super.flat(depth));
	}

	/**
	 * Maps each element using a mapping function, then flattens the result into a new array. Same as .map().flat().
	 *
	 * @see [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {function} callback
	 * @arg {*} thisArg
	 *
	 * @returns {Collection} A new Collection without a model.
	 */
	flatMap(callback, thisArg) {
		return new Collection(super.flatMap(callback, thisArg));
	}

	//          IMMUTABLE QUERIES

	/**
	 * Gets the index of the item using exact equality.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {Object} item
	 *
	 * @returns {Number} The index of the item or -1
	 */
	indexOf(item) {
		const self = this;
		const settings = self[SETTINGS];

		if (settings[INDEXER] && !settings[SKIP_INDEXER]) {
			const result = settings[INDEXER].query(item);

			if (result.usedIndexes) {
				let output = -1;

				result.matches.some((index) => {
					if (self[index] === item) {
						output = index;
						return true;
					}
				});

				return output;
			}
		}

		return super.indexOf(item);
	}

	/**
	 * Gets the index of the last matching item.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {Object} item
	 *
	 * @returns {Number} The index of the item or -1
	 */
	lastIndexOf(item) {
		const self = this;
		const settings = self[SETTINGS];

		if (settings[INDEXER]) {
			const result = settings[INDEXER].query(item);

			if (result.usedIndexes) {
				let output = -1;

				someRight(result.matches, (index) => {
					if (self[index] === item) {
						output = index;
						return true;
					}
				});

				return output;
			}
		}

		return super.lastIndexOf(item);
	}

	/**
	 * Determines if an item exists in the collection.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {Object} item
	 *
	 * @returns {Boolean}
	 */
	includes(item) {
		return this.indexOf(item) !== -1;
	}

	/**
	 * Gets the index of the first (lowest index) matching item.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Number} The index of the item or -1
	 */
	findIndex(predicate) {
		const self = this;
		const settings = self[SETTINGS];

		if (settings[INDEXER] && isObject(predicate)) {
			const result = settings[INDEXER].query(predicate);

			if (result.usedIndexes) {
				if (result.matches.length && !isEmpty(result.nonIndexedSearches)) {
					const map = result.matches
						.map((index) => ({
							item: self[index],
							i: index
						}));
					const index = map.findIndex(buildFinder({
						item: result.nonIndexedSearches
					}));

					return index > -1 ? map[index].i : -1;
				}

				return result.matches.length ? result.matches[0] : -1;
			}
		}

		return super.findIndex(buildFinder(predicate));
	}

	/**
	 * Gets the index of the last (greatest index) matching item.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Number} The index of the item or -1
	 */
	findLastIndex(predicate) {
		const self = this;
		const settings = self[SETTINGS];

		if (settings[INDEXER] && isObject(predicate)) {
			const result = settings[INDEXER].query(predicate);

			if (result.usedIndexes) {
				if (result.matches.length && !isEmpty(result.nonIndexedSearches)) {
					const map = result.matches
						.map((index) => ({
							item: self[index],
							i: index
						}));
					const index = findLastIndex(map, buildFinder({
						item: result.nonIndexedSearches
					}));

					return index > -1 ? map[index].i : -1;
				}

				return result.matches.length ? result.matches[result.matches.length - 1] : -1;
			}
		}

		return findLastIndex(self, buildFinder(predicate));
	}

	/**
	 * Gets the first (lowest index) matching item from the collection.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Object} The item or undefined
	 */
	find(predicate) {
		return this[this.findIndex(predicate)];
	}

	/**
	 * Gets the last (greatest index) matching item from the collection.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Object} The item or undefined
	 */
	findLast(predicate) {
		return this[this.findLastIndex(predicate)];
	}

	/**
	 * Gets all the matching items from the collection.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	filter(predicate) {
		const self = this;
		const settings = self[SETTINGS];

		if (settings[INDEXER] && isObject(predicate)) {
			const result = settings[INDEXER].query(predicate);

			if (result.usedIndexes) {
				const map = result.matches.map((index) => self[index]);

				if (result.matches.length && !isEmpty(result.nonIndexedSearches)) {
					return map.filter(buildFinder(result.nonIndexedSearches));
				}

				return map;
			}
		}

		return new Collection(super.filter(buildFinder(predicate))).model(settings[MODEL]);
	}

	/**
	 * Like .slice(), but finds the begin and end indexes via predicates. (end is included)
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Queries
	 *
	 * @arg {predicate} beginPredicate
	 * @arg {predicate} [endPredicate=collection.length]
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	sliceBy(beginPredicate, endPredicate) {
		let begin = beginPredicate ? Math.max(this.findIndex(beginPredicate), 0) : 0;
		let end = endPredicate ? this.findLastIndex(endPredicate) : this.length;

		if (end < begin) {
			[begin, end] = [end, begin];
		}

		return this.slice(begin, end + 1);
	}

	//          IMMUTABLE RETRIEVAL

	/**
	 * Gets the first item in the collection without removing it.
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @returns {Object}
	 */
	first() {
		return this[0];
	}

	/**
	 * Gets the last item in the collection without removing it.
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @returns {Object}
	 */
	last() {
		return this[this.length - 1];
	}

	/**
	 * Returns a shallow copy of a portion of the collection selected from begin to end (end not included).
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {Object} begin - Index at which to begin extraction.
	 * @arg {Object} [end=collection.length] - Index before which to end extraction
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	slice(...args) {
		return new Collection(super.slice(...args)).model(this[SETTINGS][MODEL]);
	}

	/**
	 * Returns a new flattened collection
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {Object}   [settings]
	 * @arg {String}   [settings.childKey='children']
	 * @arg {Boolean}  [settings.saveDepth=false] - if true appends a property "depth" to each returned object with the nested depth of the original object
	 * @arg {Function} [settings.onParent] - Called on every parent item. Provides two args: the parent item and that item's parent. Context is set to the Collection. If true is returned, then the children will not be flattened.
	 * @arg {Function} [settings.onChild] - Called on every child item. Provides two args: the child item and that item's parent. Context is set to the Collection. If true is returned, then this item (and any children) will not be included in the output.
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	flatten(settings = {}) {
		const self = this;
		const childKey = enforceString(settings.childKey, 'children');
		const saveDepth = enforceBoolean(settings.saveDepth, false);
		const onParent = enforceFunction(settings.onParent, () => false).bind(self);
		const onChild = enforceFunction(settings.onChild, () => false).bind(self);

		const flatten = (input, depth, parent) => {
			if (isArray(input)) {
				return input.reduce((result, item) => {
					return result.concat(flatten(item, depth, parent));
				}, input instanceof Collection ? new Collection().model(self[SETTINGS][MODEL]) : []);
			}

			const child = clone(input, [childKey]);
			if (saveDepth) {
				child.depth = depth;
			}

			let output = [];
			if (!onChild(child, parent)) {
				output.push(child);

				if (input && childKey in input) {
					if (!onParent(child, parent)) {
						output = output.concat(flatten(input[childKey], depth + 1, child));
					}
					delete child[childKey];
				}
			}

			return output;
		};

		return flatten(this, 0);
	}

	/**
	 * Returns a new nested collection
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {Object}   [settings]
	 * @arg {String}   [settings.idKey='id'] - The id property of items
	 * @arg {String}   [settings.parentKey='parent'] - The key that holds the id of the parent item. _Performance improvement if indexed_
	 * @arg {String}   [settings.childKey='children'] - The key to save children under. _Performance improvement if indexed_
	 * @arg {String}   [settings.deleteParentKey=false] - Should the parent key be deleted after nesting
	 *
	 * @returns {Collection} A new Collection without a model.
	 */
	nest(settings = {}) {
		const self = this;
		const idKey = enforceString(settings.idKey, 'id');
		const parentKey = enforceString(settings.parentKey, 'parent');
		const childKey = enforceString(settings.childKey, 'children');
		const deleteParentKey = enforceBoolean(settings.deleteParentKey, false);
		const filterObject = {};

		const nest = (parentID) => {
			filterObject[parentKey] = parentID;

			return self
				.filter(filterObject)
				.map((item) => {
					if (idKey in item) {
						const children = nest(item[idKey]);

						if (children.length) {
							item[childKey] = children;
						}

						if (deleteParentKey) {
							delete item[parentKey];
						}
					}
					return item;
				});
		};

		return nest();
	}

	/**
	 * Returns a new collection of unique items
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {String} [countKey] - If provided records the number of duplicates, starting at 1 for unique items
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	unique(countKey) {
		const output = new Collection().model(this[SETTINGS][MODEL]);

		this.forEach((item) => {
			const index = output.findIndex(item);
			if (index === -1) {
				if (countKey !== undefined) {
					item[countKey] = 1;
				}
				output.push(item);
			}
			else if (countKey !== undefined) {
				output[index][countKey]++;
			}
		});

		return output;
	}

	/**
	 * Merges this collection with one or more other collections. Returns a new collection.
	 *
	 * @summary
	 * _`⚡ Utilizes indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {Colection|Collection[]} collections - Either a collection or array of collections to merge with this collection.
	 * @arg {String} idKey - The key to match items from the different collections.
	 * @arg {Function} callback - Called for each unique idKey value. Provides the same number of args as the total number of collections being merged, in the order provided. The returned value is included in the ouptput collection.
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	merge(collections, idKey, callback) {
		let output = new Collection().model(this[SETTINGS][MODEL]);
		let matches = [];
		let maxLength;
		let idSet = new Set();

		if (isInstanceOf(collections, Collection)) {
			collections = [collections];
		}
		collections.unshift(this);

		collections.forEach((collection) => {
			collection.forEach((item) => {
				if (item[idKey] !== undefined && !idSet.has(item[idKey])) {
					idSet.add(item[idKey]);

					const filterObject = {};
					filterObject[idKey] = item[idKey];

					matches = collections.map((collection) => collection.filter(filterObject));
					maxLength = matches.reduce((result, match) => Math.max(result, match.length - 1), 0);

					while (maxLength >= 0) {
						output.push(callback(...matches.map((match) => match[Math.min(maxLength, match.length - 1)])));
						maxLength--;
					}
				}
			});
		});

		matches.length = 0;

		return output;
	}

	/**
	 * Returns a shallow clone of this collection with the contents of one or more arrays or collections appended.
	 *
	 * @see [Array.prototype.concat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat)
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {Array|Collection} value - One or more arrays
	 *
	 * @returns {Collection}
	 */
	concat(...args) {
		return new Collection(super.concat(...args)).model(this[SETTINGS][MODEL]);
	}

	/**
	 * @see [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)
	 *
	 * @method toString
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @returns {String}
	 */

	/**
	 * @see [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)
	 *
	 * @method toLocaleString
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {Array} [locales]
	 * @arg {Object} [options]
	 *
	 * @returns {String}
	 */

	/**
	 * @see [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
	 *
	 * @method join
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @arg {String} [separator=',']
	 *
	 * @returns {String}
	 */

	/**
	 * @see [Array.prototype.entries()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/entries)
	 *
	 * @method entries
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @returns {Iterator}
	 */

	/**
	 * @see [Array.prototype.values()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/values)
	 *
	 * @method values
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @returns {Iterator}
	 */

	/**
	 * @see [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
	 *
	 * @method keys
	 * @memberOf Collection
	 * @instance
	 * @category Immutable Retrieval
	 *
	 * @returns {Object}
	 */

	//          MUTABLE

	/**
	 * Shallow copies a portion of the collection to another location within the collection.
	 *
	 * @summary
	 * _`⚠ Forces a rebuild of all indexes`_
	 *
	 * @see [Array.prototype.copyWithin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
	 *
	 * @method copyWithin
	 * @memberOf Collection
	 * @instance
	 * @chainable
	 * @category Mutable
	 *
	 * @arg {Number} target
	 * @arg {Number} [start]
	 * @arg {Number} [end]
	 */
	copyWithin(...args) {
		const self = this;

		self[SETTINGS][IS_INDEXING_HANDLED] = true;
		super.copyWithin(...args);
		self[applyModel]();

		return self;
	}

	/**
	 * Fills all or a portion of the collection with a static value.
	 *
	 * @summary
	 * _`⚠ Forces a rebuild of all indexes`_
	 *
	 * @see [Array.prototype.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
	 *
	 * @method fill
	 * @memberOf Collection
	 * @instance
	 * @chainable
	 * @category Mutable
	 *
	 * @arg {*} value
	 * @arg {Number} [start]
	 * @arg {Number} [end]
	 */
	fill(...args) {
		const self = this;

		self[SETTINGS][IS_INDEXING_HANDLED] = true;
		super.fill(...args);
		self[applyModel]();

		return self;
	}

	/**
	 * Reverses the order of items in place.
	 *
	 * @see [Array.prototype.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
	 *
	 * @summary
	 * _`⚠ Forces a rebuild of all indexes`_
	 *
	 * @memberOf Collection
	 * @instance
	 * @chainable
	 * @category Mutable
	 */
	reverse() {
		const self = this;

		self[SETTINGS][IS_INDEXING_HANDLED] = true;
		super.reverse();
		self[applyModel]();

		return self;
	}

	/**
	 * Sort the contents of the collection in place.
	 *
	 * @summary
	 * _`⚠ Forces a rebuild of all indexes`_
	 *
	 * @see [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
	 *
	 * @memberOf Collection
	 * @instance
	 * @chainable
	 * @category Mutable
	 *
	 * @arg {function} [compareFunction]
	 */
	sort(compareFunction) {
		const self = this;

		self[SETTINGS][IS_INDEXING_HANDLED] = true;
		super.sort(compareFunction);
		self[applyModel]();

		return self;
	}

	/**
	 * Changes the contents of an collection in place by removing or replacing existing elements and/or adding new elements
	 *
	 * @summary
	 * _`✎ Updates indexes`_
	 *
	 * @see [Array.prototype.splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Mutable
	 *
	 * @arg {Number} start
	 * @arg {Number} [deleteCount]
	 * @arg {*} [item1, item2, ...]
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection. Contains the elements removed from the calling collection.
	 */
	splice(start, deleteCount, ...args) {
		const self = this;
		const settings = self[SETTINGS];
		const argLength = args.length;

		settings[IS_INDEXING_HANDLED] = true;

		if (argLength && settings[MODEL]) {
			args = args.map((item) => settings[MODEL].apply(item));
		}

		const result = super.splice(start, deleteCount, ...args);

		if (settings[INDEXER]) {
			result.forEach((item, index) => {
				settings[INDEXER].discard(item, start + index);
			});

			if (argLength - deleteCount) {
				settings[INDEXER].increment(argLength - deleteCount, start + deleteCount);
			}

			args.forEach((item, index) => {
				settings[INDEXER].add(item, start + index);
			});

			settings[IS_INDEXING_HANDLED] = false;
		}

		return new Collection(result).model(this[SETTINGS][MODEL]);
	}

	/**
	 * Removes all model onChange events and indexes and empties the collection.
	 *
	 * @memberOf Collection
	 * @instance
	 * @category Mutable
	 */
	remove() {
		this
			.model(null)
			.length = 0;
	}
}

Object.assign(Collection.prototype, {
	/**
	 * A model that gets enforced on every item in the collection.
	 * To create indexes, add 'index: true' to the schema type definition
	 * like in the example below.
	 *
	 * @example
	 * ``` javascript
	 * import { Collection, Model } from 'hord';
	 *
	 * const Person = new Model({
	 *     id: {
	 *         type: Number,
	 *         index: true
	 *     },
	 *     first: {
	 *         type: String,
	 *         index: true
	 *     },
	 *     last: {
	 *         type: String,
	 *         index: true
	 *     },
	 *     age: Number
	 * });
	 *
	 * const people = new Collection().model(Person);
	 *
	 * // OR
	 *
	 * const people = new Collection().model({
	 *     id: {
	 *         type: Number,
	 *         index: true
	 *     },
	 *     first: {
	 *         type: String,
	 *         index: true
	 *     },
	 *     last: {
	 *         type: String,
	 *         index: true
	 *     },
	 *     age: Number
	 * });
	 * ```
	 *
	 * @summary
	 * _`✎ Builds indexes`_
	 *
	 * @memberOf Collection
	 * @method model
	 * @instance
	 * @chainable
	 * @category Mutable
	 *
	 * @arg {Model|Object} - Can be an instance of class:Model or an object with a schema structure.
	 *
	 * @returns {Model}
	 */
	model: methodInstance({
		instance: Model,
		before: function(model) {
			const self = this;
			const settings = self[SETTINGS];

			if (settings[MODEL]) {
				model.onChange().discard(settings[MODEL_CHANGE_ID]);
				settings[MODEL_CHANGE_ID] = null;
				settings[MODEL] = null;

				if (settings[INDEXER]) {
					settings[INDEXER].clear();
					settings[INDEXER] = null;
				}
			}
		},
		set: function(model) {
			const self = this;
			const settings = self[SETTINGS];

			if (model) {
				if (isObject(model)) {
					self.model(new Model(model));
				}
				else {
					settings[MODEL] = model;

					settings[MODEL].schema.eachRule((path, rule) => {
						const type = rule.types[0];

						if (rule.types.length === 1 && type.name !== 'Array' && type.name !== 'Object' && type.index === true) {
							if (!settings[INDEXER]) {
								settings[INDEXER] = new Indexer();
							}
							settings[INDEXER].addIndex(path[0]);
						}
					});

					settings[MODEL_CHANGE_ID] = model.onChange()
						.add(function(path, value, previous) {
							if (settings[INDEXER] && settings[INDEXER].hasIndex(path)) {
								settings[SKIP_INDEXER] = true;
								const index = self.indexOf(this);
								settings[SKIP_INDEXER] = false;

								if (index !== -1) {
									settings[INDEXER].update(path, index, value, previous);
								}
							}
						});

					self[applyModel]();
				}
			}
		},
		other: [Object, null]
	})
});

/**
 * Set or return the number of elements in the collection.
 *
 * @summary
 * _`✎ Updates indexes`_
 *
 * @see [Array.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)
 *
 *
 * @member {Number} length
 * @memberOf Collection
 * @instance
 */
