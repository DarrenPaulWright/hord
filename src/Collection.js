import { clone, get, isEqual, traverse } from 'object-agent';
import onChange from 'on-change';
import {
	enforceBoolean,
	enforceFunction,
	enforceString,
	isArray,
	isInstanceOf,
	isObject,
	methodInstance
} from 'type-enforcer';
import Model from './Model';
import findLastIndex from './utility/findLastIndex';
import someRight from './utility/someRight';

/**
 * Can be either of the following:
 * - A function that accepts one item from the collection and returns true to indicate a match.
 * - An object that is deeply compared to items in the collection for equivalent property values. Only properties on the predicate are compared.
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

		return (item) => rules.every((rule) => rule(item));
	}

	return predicate;
};

export const SETTINGS = Symbol();
const IS_BUSY = Symbol();
const MODEL = Symbol();

const applyModel = Symbol();

/**
 * An array of objects with optional model enforcement.
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

		return onChange(self, () => {
			const settings = self[SETTINGS];

			if (!settings[IS_BUSY] && settings[MODEL]) {
				self[applyModel]();
			}
		}, {
			isShallow: true
		});
	}

	[applyModel]() {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_BUSY] = true;

		self.forEach((item, index) => self[index] = settings[MODEL].apply(item));

		settings[IS_BUSY] = false;
	}

	/**
	 * Gets the first item in the collection without removing it.
	 *
	 * @memberOf Collection
	 * @instance
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
	 *
	 * @returns {Object}
	 */
	last() {
		return this[this.length - 1];
	}

	/**
	 * Add an item to the end of the collection.
	 * See [Array.prototype.push()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push)
	 *
	 * @method push
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {*} item
	 *
	 * @returns {Number} The new length of the collection
	 */
	push(item) {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_BUSY] = true;

		const output = super.push(item);

		if (settings[MODEL]) {
			settings[MODEL].apply(self.last());
		}

		settings[IS_BUSY] = false;

		return output;
	}

	/**
	 * Remove the last item from the collection and return it.
	 * See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
	 *
	 * @method pop
	 * @memberOf Collection
	 * @instance
	 *
	 * @returns {*}
	 */

	/**
	 * Add an item to the beginning of the collection.
	 * See [Array.prototype.unshift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/unshift)
	 *
	 * @method unshift
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {*} item
	 *
	 * @returns {Number} The new length of the collection
	 */
	unshift(item) {
		const self = this;
		const settings = self[SETTINGS];

		settings[IS_BUSY] = true;

		const output = super.unshift(item);

		if (settings[MODEL]) {
			settings[MODEL].apply(self.first());
		}

		settings[IS_BUSY] = false;

		return output;
	}

	/**
	 * Remove the first item from the collection and return it.
	 * See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
	 *
	 * @method shift
	 * @memberOf Collection
	 * @instance
	 *
	 * @returns {*}
	 */

	/**
	 * Gets the index of the first matching item.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object} item
	 *
	 * @returns {Number} The index of the item or -1
	 */
	indexOf(item) {
		return super.indexOf(item);
	}

	/**
	 * Gets the index of the last matching item.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object} item
	 *
	 * @returns {Number} The index of the item or -1
	 */
	lastIndexOf(item) {
		return super.lastIndexOf(item);
	}

	/**
	 * Determines if an item exists in the collection.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object} item
	 *
	 * @returns {Boolean}
	 */
	includes(item) {
		return this.indexOf(item) !== -1;
	}

	/**
	 * Like .forEach(), but starts on the last (greatest index) item and progresses backwards
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function} callback
	 */
	forEachRight(callback) {
		for (let index = this.length - 1; index !== -1; index--) {
			callback(this[index], index);
		}
	}

	/**
	 * Like .some(), but starts on the last (greatest index) item and progresses backwards
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function} callback
	 *
	 * @returns {Boolean}
	 */
	someRight(callback) {
		someRight(this, callback);
	}

	/**
	 * Gets the first (lowest index) matching item from the collection.
	 *
	 * @memberOf Collection
	 * @instance
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
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Object} The item or undefined
	 */
	findLast(predicate) {
		return this[this.findLastIndex(predicate)];
	}

	/**
	 * Returns a new collection with the results of calling a provided function on every element.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function} callback - Function that produces an element of the new Array, taking three arguments: the current item, index, and the collection. Context is also set to this collection.
	 * @arg {*} thisArg - Applied to the context of the callback
	 *
	 * @returns {Collection}
	 */
	map(callback, thisArg) {
		return new Collection(super.map(callback, thisArg || this));
	}

	/**
	 * Gets all the matching items from the collection.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Collection}
	 */
	filter(predicate) {
		const self = this;
		const settings = self[SETTINGS];

		return new Collection(super.filter(buildFinder(predicate))).model(settings[MODEL]);
	}

	/**
	 * Gets the index of the first (lowest index) matching item.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Number} The index of the item or -1
	 */
	findIndex(predicate) {
		return super.findIndex(buildFinder(predicate));
	}

	/**
	 * Gets the index of the last (greatest index) matching item.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {predicate} predicate
	 *
	 * @returns {Number} The index of the item or -1
	 */
	findLastIndex(predicate) {
		return findLastIndex(this, buildFinder(predicate));
	}

	/**
	 * Returns a shallow copy of a portion of the collection into a new collection selected from begin to end (end not included).
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object} begin - Index at which to begin extraction.
	 * @arg {Object} [end=collection.length] - Index before which to end extraction
	 *
	 * @returns {Collection}
	 */
	slice(...args) {
		return new Collection(super.slice(...args)).model(this[SETTINGS][MODEL]);
	}

	/**
	 * Like .slice(), but finds the begin and end indexes via predicates. (end is included)
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {predicate} beginPredicate
	 * @arg {predicate} [endPredicate=collection.length]
	 *
	 * @returns {Collection}
	 */
	sliceBy(beginPredicate, endPredicate) {
		let begin = beginPredicate ? Math.max(this.findIndex(beginPredicate), 0) : 0;
		let end = endPredicate ? this.findLastIndex(endPredicate) : this.length;

		if (end < begin) {
			[begin, end] = [end, begin];
		}

		return this.slice(begin, end + 1);
	}

	/**
	 * Returns a new flattened collection
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object}   [settings]
	 * @arg {String}   [settings.childKey='children']
	 * @arg {Boolean}  [settings.saveDepth=false] - if true appends a property "depth" to each returned object with the nested depth of the original object
	 * @arg {Function} [settings.onParent] - Called on every parent item. Provides two args: the parent item and that item's parent. Context is set to the Collection. If true is returned, then the children will not be flattened.
	 * @arg {Function} [settings.onChild] - Called on every child item. Provides two args: the child item and that item's parent. Context is set to the Collection. If true is returned, then this item (and any children) will not be included in the output.
	 *
	 * @returns {Collection}
	 */
	flatten(settings = {}) {
		const self = this;
		const childKey = enforceString(settings.childKey, 'children');
		const saveDepth = enforceBoolean(settings.saveDepth, false);
		const onParent = enforceFunction(settings.onParent, () => false);
		const onChild = enforceFunction(settings.onChild, () => false);

		const flatten = (input, depth, parent) => {
			if (isArray(input)) {
				return input.reduce((result, item) => result.concat(flatten(item, depth, parent)), input instanceof Collection ? new Collection().model(self[SETTINGS][MODEL]) : []);
			}

			const child = clone(input, [childKey]);
			if (saveDepth) {
				child.depth = depth;
			}

			let output = [];
			if (!onChild.call(self, child, parent)) {
				output.push(child);

				if (input && childKey in input) {
					if (!onParent.call(self, child, parent)) {
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
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object}   [settings]
	 * @arg {String}   [settings.idKey='id'] - The id property of items
	 * @arg {String}   [settings.parentKey='parent'] - The key that holds the id of the parent item
	 * @arg {String}   [settings.childKey='children'] - The key to save children under.
	 * @arg {String}   [settings.deleteParentKey=false] - Should the parent key be deleted after nesting
	 *
	 * @returns {Collection}
	 */
	nest(settings = {}) {
		const self = this;
		const idKey = enforceString(settings.idKey, 'id');
		const parentKey = enforceString(settings.parentKey, 'parent');
		const childKey = enforceString(settings.childKey, 'children');
		const deleteParentKey = enforceBoolean(settings.deleteParentKey, false);

		const nest = (parentID) => self
			.filter((item) => item[parentKey] === parentID)
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

		return nest();
	}

	/**
	 * Calls a callback for each nested child
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function} onChild - Called for each item and child item. If true is returned, all iteration stops. Provides three args: the child item, the nested depth of the item, and the items parent. Context is set to this Collection.
	 * @arg {Object}   [settings]
	 * @arg {String}   [settings.childKey=children] - The key that contains children items
	 * @arg {Function} [settings.onParent] - Called for each item that contains children. If true is returned, then the children will not get processed. Provides the same args and context as the onChild callback.
	 */
	eachChild(onChild, settings = {}) {
		const self = this;
		const childKey = enforceString(settings.childKey, 'children');
		const onParent = enforceFunction(settings.onParent, () => false);

		const each = (item, depth, parent) => {
			if (isArray(item)) {
				return item.some((child) => each(child, depth, parent));
			}
			if (onChild.call(self, item, depth, parent)) {
				return true;
			}
			if (childKey in item && !onParent.call(self, item, depth, parent)) {
				return each(item[childKey], depth + 1, item);
			}
			return false;
		};

		each(this, 0);
	}

	/**
	 * Returns a new collection of unique items
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {String} [countKey] - If provided records the number of duplicates, starting at 1 for unique items
	 *
	 * @returns {Collection}
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
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Colection|Collection[]} collections - Either a collection or array of collections to merge with this collection.
	 * @arg {String} idKey - The key to match items from the different collections.
	 * @arg {Function} callback - Called for each unique idKey value. Provides the same number of args as the total number of collections being merged, in the order provided. The returned value is included in the ouptput collection.
	 *
	 * @returns {Collection}
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

					matches = collections.map((innerCollection) => innerCollection.filter((innerItem) => innerItem[idKey] === item[idKey]));
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
	 *
	 * @arg {Array|Collection} value - One or more arrays
	 *
	 * @returns {Collection}
	 */
	concat(...args) {
		return new Collection(super.concat(...args)).model(this[SETTINGS][MODEL]);
	}

	/**
	 * Shallow copies a portion of the collection to another location within the collection.
	 *
	 * @see [Array.prototype.copyWithin()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/copyWithin)
	 *
	 * @method copyWithin
	 * @memberOf Collection
	 * @instance
	 * @chainable
	 *
	 * @arg {Number} target
	 * @arg {Number} [start]
	 * @arg {Number} [end]
	 */
	copyWithin(...args) {
		super.copyWithin(...args);

		return this;
	}

	/**
	 * Fills all or a portion of the collection with a static value.
	 *
	 * @see [Array.prototype.fill()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill)
	 *
	 * @method fill
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {*} value
	 * @arg {Number} [start]
	 * @arg {Number} [end]
	 *
	 * @returns {Iterator}
	 */
	fill(...args) {
		super.fill(...args);

		return this;
	}

	/**
	 * @see [Array.prototype.flat()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Number} [depth=1]
	 *
	 * @returns {Collection} A new Collection without a model.
	 */
	flat(...args) {
		return new Collection(super.flat(...args));
	}

	/**
	 * @see [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {function} callback
	 *
	 * @returns {Collection} A new Collection without a model.
	 */
	flatMap(...args) {
		return new Collection(super.flatMap(...args));
	}

	/**
	 * @see [Array.prototype.reverse()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reverse)
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @returns {Collection} A new Collection with the same model as the calling collection.
	 */
	reverse() {
		return new Collection(super.reverse()).model(this[SETTINGS][MODEL]);
	}

	/**
	 * Sort the contents of the collection in place.
	 *
	 * _* Forces a rebuild of all indexes_
	 *
	 * @see [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
	 *
	 * @memberOf Collection
	 * @instance
	 * @chainable
	 *
	 * @arg {function} [compareFunction]
	 */
	sort(compareFunction) {
		super.sort(compareFunction);

		return this;
	}

	/**
	 * Changes the contents of an collection in place by removing or replacing existing elements and/or adding new elements
	 *
	 * _* Updates all indexes_
	 *
	 * @see [Array.prototype.splice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice)
	 *
	 * @memberOf Collection
	 * @instance
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

		settings[IS_BUSY] = true;

		if (argLength && settings[MODEL]) {
			args = args.map((item) => settings[MODEL].apply(item));
		}

		const result = super.splice(start, deleteCount, ...args);

		return new Collection(result).model(this[SETTINGS][MODEL]);
	}

	/**
	 * Set or return the number of elements in the collection.
	 *
	 * @see [Array.length](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length)
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @returns {Number}
	 */
	get length() {
		return super.length;
	}
}

Object.assign(Collection.prototype, {
	/**
	 * A model that gets enforced on every item in the collection.
	 *
	 * @memberOf Collection
	 * @method model
	 * @instance
	 * @chainable
	 *
	 * @arg {Model|Object} - Can be an instance of class:Model or an object with a schema structure.
	 *
	 * @returns {Model}
	 */
	model: methodInstance({
		instance: Model,
		set: function(model) {
			const self = this;
			const settings = self[SETTINGS];

			if (isObject(model)) {
				self.model(new Model(model));
			}
			else {
				settings[MODEL] = model;

				self[applyModel]();
			}
		},
		other: Object
	})
});

/**
 * See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)
 *
 * @method toString
 * @memberOf Collection
 * @instance
 *
 * @returns {String}
 */

/**
 * See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
 *
 * @method keys
 * @memberOf Collection
 * @instance
 *
 * @returns {Object}
 */

/**
 * See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
 *
 * @method every
 * @memberOf Collection
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {Boolean}
 */

/**
 * See [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
 *
 * @method forEach
 * @memberOf Collection
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {undefined}
 */

/**
 * See [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)
 *
 * @method toLocaleString
 * @memberOf Collection
 * @instance
 *
 * @arg {Array} [locales]
 * @arg {Object} [options]
 *
 * @returns {String}
 */

/**
 * See [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
 *
 * @method join
 * @memberOf Collection
 * @instance
 *
 * @arg {String} [separator=',']
 *
 * @returns {String}
 */

/**
 * See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
 *
 * @method reduce
 * @memberOf Collection
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {*}
 */

/**
 * See [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
 *
 * @method reduceRight
 * @memberOf Collection
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {*}
 */

/**
 * See [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
 *
 * @method some
 * @memberOf Collection
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {Boolean}
 */

