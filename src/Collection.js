import { clone, get, isEmpty, isEqual, traverse } from 'object-agent';
import onChange from 'on-change';
import {
	enforceBoolean,
	enforceFunction,
	enforceString,
	isArray,
	isInstanceOf,
	isNumber,
	isObject,
	PrivateVars,
	sameValueZero
} from 'type-enforcer-ui';
import List from './List';
import Model from './Model';
import findLastIndex from './utility/findLastIndex';
import Indexer from './utility/indexer/Indexer';
import someRight from './utility/someRight';

/**
 * @summary
 * Can be either of the following:
 * - A function that accepts one item from the collection and returns true to indicate a match.
 * - A query object that is deeply compared to items in the collection. Available operators are outlined below.
 *
 * ### Query Operators
 *
 * #### $eq (EQual)
 * The same as not providing any operator. Uses SameValue equality.
 * ``` javascript
 * {age: 23}
 * // OR
 * {age: {$eq: 23}}
 * ```
 *
 * <br>
 *
 * #### $ne (Not Equal)
 * Like $eq, $ne uses SameValue equality, but matches values that don't equal.
 * ``` javascript
 * {age: {$ne: 23}}
 * ```
 *
 * <br>
 *
 * #### $in (IN)
 * Matches any item in an array.
 * ``` javascript
 * {age: {$in: [20, 30, 40]}}
 * ```
 *
 * <br>
 *
 * #### $nin (Not IN)
 * Matches any item not in an array.
 * ``` javascript
 * {age: {$nin: [20, 30, 40]}}
 * ```
 *
 * <br>
 *
 * #### $gt (Greater Than)
 * Matches values greater than the provided value
 * ``` javascript
 * {age: {$gt: 21}}
 * ```
 *
 * <br>
 *
 * #### $gte (Greater Than or Equal)
 * Matches values greater than the provided value
 * ``` javascript
 * {age: {$gte: 21}}
 * ```
 *
 * <br>
 *
 * #### $lt (Less Than)
 * Matches values greater than the provided value
 * ``` javascript
 * {age: {$lt: 21}}
 * ```
 *
 * <br>
 *
 * #### $lte (Less Than or Equal)
 * Matches values greater than the provided value
 * ``` javascript
 * {age: {$lte: 21}}
 * ```
 *
 *
 * @description
 * If you haven't set up any indexes, or you're searching on properties that aren't indexed, then providing a function will most likely have better performance. If you're searching on even one property that's indexed, then using an object will perform better, as the indexer can narrow the search before iterating over the results for a final match.
 *
 * @typedef predicate
 * @type {function|Object}
 */
const buildFinder = (predicate) => {
	if (isObject(predicate)) {
		const rules = [];

		traverse(predicate, (path, value) => {
			if (path.length) {
				let initialLength = rules.length;

				if (isObject(value)) {
					if (value.$in !== undefined) {
						rules.push((item) => {
							return value.$in.includes(get(item, path));
						});
					}
					if (value.$nin !== undefined) {
						rules.push((item) => !value.$nin.includes(get(item, path)));
					}
					if (value.$gt !== undefined) {
						rules.push((item) => get(item, path) > value.$gt);
					}
					if (value.$gte !== undefined) {
						rules.push((item) => get(item, path) >= value.$gte);
					}
					if (value.$lt !== undefined) {
						rules.push((item) => get(item, path) < value.$lt);
					}
					if (value.$lte !== undefined) {
						rules.push((item) => get(item, path) <= value.$lte);
					}
					if (value.$eq !== undefined) {
						rules.push((item) => isEqual(get(item, path), value.$eq));
					}
					if (value.$ne !== undefined) {
						rules.push((item) => !isEqual(get(item, path), value.$ne));
					}

					if (initialLength !== rules.length) {
						return true;
					}
				}
				else if (!isArray(value)) {
					rules.push((item) => isEqual(get(item, path), value));
				}
			}
		}, true);

		return (item) => rules.every((rule) => item ? rule(item) : false);
	}

	return predicate;
};

export const _ = new PrivateVars();

const applyModelAll = Symbol();
const registerModelOnChange = Symbol();
const spawn = Symbol();

/**
 *
 * ``` javascript
 * import { Collection } from 'hord';
 * ```
 * For info on indexing, see Collection.{@link Collection#model}.
 * The collection class uses the [on-change](https://github.com/sindresorhus/on-change) library (uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) to detect changes and maintain model enforcement and indexing.
 *
 * @class Collection
 * @extends Array
 * @classdesc An array of objects with optional model enforcement and indexed queries.
 *
 * @arg {Array|Object} - Accepts an array of objects or multiple args of objects.
 */
export default class Collection extends Array {
	constructor(...args) {
		super(...(args.length === 1 && isArray(args[0]) ? args[0] : args));

		const self = this;

		const output = onChange(self, (path, value, previous) => {
			if (_(output).indexer && _(output).indexer.isHandled === false && _(output).model) {
				if (isNumber(path, true)) {
					path = Number(path);
					self[path] = _(output).model.apply(self[path]);
					_(output).indexer
						.discard(previous, path)
						.add(value, path);
				}
				else if (path === 'length') {
					if (value < previous) {
						_(output).indexer.length(value);
					}
				}
			}
		}, {
			isShallow: true,
			ignoreSymbols: true
		});

		_.set(output);

		return output;
	}

	[applyModelAll]() {
		const self = this;

		if (_(self).model) {
			if (_(self).indexer) {
				_(self).indexer.isHandled = true;
			}

			self.forEach((item, index) => self[index] = _(self).model.apply(item));

			if (_(self).indexer) {
				_(self).indexer.rebuild((callback) => super.filter(Boolean).map(callback));
				_(self).indexer.isHandled = false;
			}
		}
	}

	[registerModelOnChange]() {
		const self = this;

		_(self).modelChangeId = _(self).model.onChange()
			.add(function(path, value, previous) {
				if (_(self).indexer && _(self).indexer.hasIndex(path)) {
					_(self).indexer.skip = true;
					const index = self.indexOf(this);
					_(self).indexer.skip = false;

					if (index !== -1) {
						_(self).indexer.update(path, index, value, previous);
					}
				}
			});

		self[applyModelAll]();
	}

	[spawn](values, indexes) {
		const self = this;

		if (!values) {
			if (indexes) {
				values = new Collection(indexes.map((index) => self[index]));
			}
			else {
				values = new Collection();
			}
		}

		if (_(self).indexer && values.length > 1) {
			if (!indexes) {
				indexes = new List(values.map((item) => self.indexOf(item)));
			}

			_(values).indexer = _(self).indexer.spawn(indexes);
		}

		if (_(self).model) {
			_(values).model = _(self).model;
			values[registerModelOnChange]();
		}

		return values;
	}

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
	model(model) {
		const self = this;

		const addModel = (model) => {
			_(self).model = model;

			_(self).model.schema.eachRule((path, rule) => {
				const type = rule.types[0];

				if (type.name !== 'Array' && type.name !== 'Object' && type.index === true) {
					if (!_(self).indexer) {
						_(self).indexer = new Indexer();
					}
					_(self).indexer.addIndex(path);
				}
			});

			self[registerModelOnChange]();
		};

		const removeModel = () => {
			_(self).model.onChange().discard(_(self).modelChangeId);
			_(self).modelChangeId = null;
			_(self).model = undefined;

			if (_(self).indexer) {
				_(self).indexer.clear();
				_(self).indexer = null;
			}
		};

		if (arguments.length) {
			if (model !== _(self).model) {
				if (_(self).model) {
					removeModel();
				}

				if (model) {
					addModel(isObject(model) ? new Model(model) : model);
				}
			}

			return self;
		}

		return _(self).model;
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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		const output = super.push(item);

		if (_(self).model) {
			const index = self.length - 1;

			self[index] = _(self).model.apply(self[index]);

			if (_(self).indexer) {
				_(self).indexer.add(self[index], index);
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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		const output = super.pop();

		if (_(self).indexer) {
			_(self).indexer.discard(output, self.length);
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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		const output = super.unshift(item);

		if (_(self).model) {
			self[0] = _(self).model.apply(self[0]);

			if (_(self).indexer) {
				_(self).indexer.increment(1);
				_(self).indexer.add(self[0], 0);
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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		const output = super.shift();

		if (_(self).indexer) {
			_(self).indexer
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
	 * @arg {Object} [thisArg]
	 *
	 * @returns {Boolean}
	 */
	someRight(callback, thisArg) {
		callback = callback.bind(thisArg || this);
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
		return super.map(callback, thisArg || this);
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
	 * @method flat
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {Number} [depth=1]
	 *
	 * @returns {Collection} A new Collection without a model.
	 */

	/**
	 * Maps each element using a mapping function, then flattens the result into a new array. Same as .map().flat().
	 *
	 * @see [Array.prototype.flatMap()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flatMap)
	 *
	 * @method flatMap
	 * @memberOf Collection
	 * @instance
	 * @category Iterative
	 *
	 * @arg {function} callback
	 * @arg {*} thisArg
	 *
	 * @returns {Collection} A new Collection without a model.
	 */

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

		if (_(self).indexer && !_(self).indexer.skip) {
			const result = _(self).indexer.query(item);

			if (result.usedIndexes) {
				let output = -1;

				result.matches.some((index) => {
					if (sameValueZero(self[index], item)) {
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

		if (_(self).indexer) {
			const result = _(self).indexer.query(item);

			if (result.usedIndexes) {
				let output = -1;

				result.matches.someRight((index) => {
					if (sameValueZero(self[index], item)) {
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

		if (_(self).indexer && isObject(predicate)) {
			const result = _(self).indexer.query(predicate);

			if (result.usedIndexes) {
				if (result.matches.length && !isEmpty(result.nonIndexedSearches)) {
					const finder = buildFinder(result.nonIndexedSearches);
					let output = -1;
					result.matches.some((index) => {
						if (finder(self[index])) {
							output = index;
							return true;
						}
					});

					return output;
				}

				return result.matches.length ? result.matches.first() : -1;
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

		if (_(self).indexer && isObject(predicate)) {
			const result = _(self).indexer.query(predicate);

			if (result.usedIndexes) {
				if (result.matches.length && !isEmpty(result.nonIndexedSearches)) {
					const finder = buildFinder(result.nonIndexedSearches);
					let output = -1;
					result.matches.someRight((index) => {
						if (finder(self[index])) {
							output = index;
							return true;
						}
					});

					return output;
				}

				return result.matches.length ? result.matches.last() : -1;
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

		if (_(self).indexer && isObject(predicate)) {
			const result = _(self).indexer.query(predicate);

			if (result.usedIndexes) {
				if (result.matches.length !== 0 && !isEmpty(result.nonIndexedSearches)) {
					const finder = buildFinder(result.nonIndexedSearches);

					return self[spawn](false, result.matches
						.filter((index) => finder(self[index])));
				}

				return self[spawn](false, result.matches);
			}
		}

		return self[spawn](super.filter(buildFinder(predicate)));
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

		return (end < begin) ? this.slice(end, begin + 1) : this.slice(begin, end + 1);
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
		return this[spawn](super.slice(...args));
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
				}, input instanceof Collection ? self[spawn]() : []);
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
	 * Returns a new collection of deeply unique items
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
		const output = this[spawn]();

		if (countKey !== undefined) {
			this.forEach((item) => {
				const index = output.findIndex(item);

				if (index === -1) {
					item[countKey] = 1;
					output.push(item);
				}
				else {
					output[index][countKey]++;
				}
			});
		}
		else {
			this.forEach((item) => {
				if (output.findIndex(item) === -1) {
					output.push(item);
				}
			});
		}

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
		let output = this[spawn]();
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
		return this[spawn](super.concat(...args));
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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		super.copyWithin(...args);
		self[applyModelAll]();

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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		super.fill(...args);
		self[applyModelAll]();

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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		super.reverse();
		self[applyModelAll]();

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

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		super.sort(compareFunction);
		self[applyModelAll]();

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
		const argLength = args.length;

		if (_(self).indexer) {
			_(self).indexer.isHandled = true;
		}

		if (argLength && _(self).model) {
			args = args.map((item) => _(self).model.apply(item));
		}

		const result = super.splice(start, deleteCount, ...args);

		if (_(self).indexer) {
			result.forEach((item, index) => {
				_(self).indexer.discard(item, start + index);
			});

			if (argLength - deleteCount) {
				_(self).indexer.increment(argLength - deleteCount, start + deleteCount);
			}

			args.forEach((item, index) => {
				_(self).indexer.add(item, start + index);
			});

			_(self).indexer.isHandled = false;
		}

		return self[spawn](result);
	}
}
