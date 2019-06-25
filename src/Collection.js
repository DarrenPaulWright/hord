import { clone, deepEqual } from 'object-agent';
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

const buildFinder = (matcher) => {
	if (isObject(matcher)) {
		const rules = Object.entries(matcher).map(([key, value]) => (item) => deepEqual(item[key], value));
		return (item) => rules.every((rule) => rule(item));
	}
	return matcher;
};

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

		return onChange(this, () => {
			if (!self[IS_BUSY] && self[MODEL]) {
				self[applyModel]();
			}
		}, {
			isShallow: true
		});
	}

	[applyModel]() {
		const self = this;

		self[IS_BUSY] = true;

		self.forEach((item, index) => self[index] = self[MODEL].apply(item));

		self[IS_BUSY] = false;
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

		self[IS_BUSY] = true;

		const output = super.push(item);

		if (self[MODEL]) {
			self[MODEL].apply(self.last());
		}

		self[IS_BUSY] = false;

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

		self[IS_BUSY] = true;

		const output = super.unshift(item);

		if (self[MODEL]) {
			self[MODEL].apply(self.first());
		}

		self[IS_BUSY] = false;

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
	 * @arg {Function|Object} matcher - A function that returns true for a matched item, or an Object that represents the data you want to match.
	 *
	 * @returns {Object} - The item or undefined
	 */
	find(matcher) {
		return this[this.findIndex(matcher)];
	}

	/**
	 * Gets the last (greatest index) matching item from the collection.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function|Object} matcher - A function that returns true for a matched item, or an Object that represents the data you want to match.
	 *
	 * @returns {Object} - The item or undefined
	 */
	findLast(matcher) {
		return this[this.findLastIndex(matcher)];
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
		return new Collection(super.map(callback, thisArg || this)).model(this.model());
	}

	/**
	 * Gets all the matching items from the collection.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function|Object} matcher - A function that returns true for a matched item, or an Object that represents the data you want to match.
	 *
	 * @returns {Collection}
	 */
	filter(matcher) {
		return new Collection(super.filter(buildFinder(matcher))).model(this.model());
	}

	/**
	 * Gets the index of the first (lowest index) matching item.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function|Object} matcher - A function that returns true for a matched item, or an Object that represents the data you want to match.
	 *
	 * @returns {Number} - The index of the item or -1
	 */
	findIndex(matcher) {
		return super.findIndex(buildFinder(matcher));
	}

	/**
	 * Gets the index of the last (greatest index) matching item.
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Function|Object} matcher - A function that returns true for a matched item, or an Object that represents the data you want to match.
	 *
	 * @returns {Number} - The index of the item or -1
	 */
	findLastIndex(matcher) {
		return findLastIndex(this, buildFinder(matcher));
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
		return new Collection(super.slice(...args)).model(this.model());
	}

	/**
	 * Like .slice(), but finds the begin and end indexes via matchers. (end is included)
	 *
	 * @memberOf Collection
	 * @instance
	 *
	 * @arg {Object} beginMatcher - A function that returns true for a matched item, or an Object that represents the data you want to match.
	 * @arg {Object} [endMatcher=collection.length] - A function that returns true for a matched item, or an Object that represents the data you want to match. (end is included)
	 *
	 * @returns {Collection}
	 */
	sliceBy(beginMatcher, endMatcher) {
		let begin = Math.max(beginMatcher ? this.findIndex(beginMatcher) : 0, 0);
		let end = endMatcher ? this.findLastIndex(endMatcher) : this.length;

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
				return input.reduce((result, item) => result.concat(flatten(item, depth, parent)), input instanceof Collection ? new Collection() : []);
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
		const output = new Collection();

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
		let output = new Collection();
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

			if (isObject(model)) {
				self.model(new Model(model));
			}
			else {
				self[MODEL] = model;
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

