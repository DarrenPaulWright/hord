import { castArray, isArray, PrivateVars } from 'type-enforcer';
import compare from './utility/compare.js';
import binarySearchLeft from './utility/searchers/binarySearchLeft.js';
import binarySearchRight from './utility/searchers/binarySearchRight.js';
import someRight from './utility/someRight.js';

const comparers = Object.freeze({
	default: compare(),
	string: {
		asc(a, b) {
			return a.localeCompare(b);
		},
		desc(a, b) {
			return b.localeCompare(a);
		}
	},
	number: {
		asc(a, b) {
			return a - b;
		},
		desc(a, b) {
			return b - a;
		}
	},
	id: {
		asc: compare('id'),
		desc: compare('id', true)
	}
});

const spawn = Symbol();

export const _ = new PrivateVars();

/**
 * ``` javascript
 * import { List } from 'hord';
 * ```
 * List maintains a sorted state internally, but doesn't observe changes to it's contents, so items manipulated externally can cause problems. If you must do this, the .sort() method is provided to resort the list.
 *
 * @class List
 * @classdesc Always sorted array.
 *
 * @param {...*|Array} values - Accepts an array of objects or multiple args of objects.
 */
export default class List {
	constructor(...values) {
		if (values[values.length - 1] === spawn) {
			_.set(this, values[0]);
		}
		else {
			if (values.length === 1 && isArray(values[0])) {
				values = values[0];
			}

			_.set(this, {
				comparer: comparers.default,
				array: castArray(values).sort(comparers.default),
				spawn() {
					return new List().comparer();
				}
			});
		}
	}

	/**
	 * Used by .sort() and the binary search to determine equality.
	 *
	 * If you're setting this, you may want to call this before setting the values to prevent sorting twice, like this:
	 * ``` javascript
	 * import { List } from 'hord';
	 *
	 * const list = new List().comparer(List.comparers.number.asc).values([1, 2, 3]);
	 * ```
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} comparer - See the compare function for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters) for details. A few simple comparer functions are provided via the static property [List.comparers](#List.comparers).
	 *
	 * @returns {Function | this}
	 */
	comparer(comparer) {
		if (arguments.length !== 0) {
			_(this).comparer = comparer;

			return this.sort();
		}

		return _(this).comparer;
	}

	/**
	 * Sort the items.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @returns {object} Returns `this`.
	 */
	sort() {
		const _self = _(this);

		if (_self.array.length !== 0) {
			_self.array.sort(_self.comparer);
		}

		return this;
	}

	/**
	 * Add an item to the list. Uses binary search.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @param {unknown} item - Item is inserted into the list such that the items are still sorted.
	 *
	 * @returns {object} Returns `this`.
	 */
	add(item) {
		const _self = _(this);

		_self.array.splice(binarySearchLeft(_self.array, item, _self.comparer, true) + 1, 0, item);

		return this;
	}

	/**
	 * Add an item to the list if it isn't already included. Uses binary search.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @param {unknown} item - Item is inserted into the list such that the items are still sorted.
	 *
	 * @returns {object} Returns `this`.
	 */
	addUnique(item) {
		const _self = _(this);

		if (_self.array.length === 0) {
			_self.array[0] = item;
		}
		else {
			const index = binarySearchLeft(_self.array, item, _self.comparer, true);

			if (index === -1 || _self.comparer(_self.array[index], item) !== 0) {
				_self.array.splice(index + 1, 0, item);
			}
		}

		return this;
	}

	/**
	 * Get a new List of the unique (as determined by the comparer) values in this List.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {List}
	 */
	unique() {
		const _self = _(this);
		let previous = _self.array[0];
		const output = [previous];

		_self.array.forEach((item) => {
			if (_self.comparer(previous, item)) {
				output.push(item);
				previous = item;
			}
		});

		return new List({
			array: output,
			comparer: _self.comparer
		}, spawn);
	}

	/**
	 * Returns a shallow clone of this list with the contents of one or more arrays or lists appended.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @param {...Array|List} lists - One or more lists or arrays to concat to this list.
	 *
	 * @returns {List}
	 */
	concat(...lists) {
		const _self = _(this);

		return new List({
			array: _self.array.concat(...lists.map((item) => {
				return item instanceof List ? _(item).array : item;
			})).sort(_self.comparer),
			comparer: _self.comparer
		}, spawn);
	}

	/**
	 * Discard an item from the list. Uses binary search.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {object} Returns `this`.
	 */
	discard(item) {
		const _self = _(this);

		_self.array.splice(binarySearchLeft(_self.array, item, _self.comparer, true), 1);

		return this;
	}

	/**
	 * Discard an item from the list at a specified index.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @param {unknown} index - The index of the item to be discarded.
	 *
	 * @returns {object} Returns `this`.
	 */
	discardAt(index) {
		_(this).array.splice(index, 1);

		return this;
	}

	/**
	 * Discard all items from the list.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @returns {object} Returns `this`.
	 */
	discardAll() {
		_(this).array.length = 0;

		return this;
	}

	/**
	 * The current items in the list.
	 *
	 * @memberOf List
	 * @instance
	 * @chainable
	 *
	 * @param {Array} [values] - Replaces any previous values and immediately sorts them.
	 *
	 * @returns {Array} A shallow clone of the values.
	 */
	values(values) {
		if (values !== undefined) {
			_(this).array = castArray(values);

			return this.sort();
		}

		return _(this).array.slice();
	}

	/**
	 * Gets the index of the first matching item. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {number} The index of the item or -1.
	 */
	indexOf(item) {
		const _self = _(this);

		return binarySearchLeft(_self.array, item, _self.comparer);
	}

	/**
	 * Gets the index of the last matching item. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {number} The index of the item or -1.
	 */
	lastIndexOf(item) {
		const _self = _(this);

		return binarySearchRight(_self.array, item, _self.comparer);
	}

	/**
	 * Determines if an item exists in the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {boolean}
	 */
	includes(item) {
		return this.indexOf(item) !== -1; // eslint-disable-line unicorn/prefer-includes
	}

	/**
	 * Gets the first matching item from the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {unknown} The item or undefined.
	 */
	find(item) {
		return _(this).array[this.indexOf(item)];
	}

	/**
	 * Gets the last matching item from the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {unknown} The item or undefined.
	 */
	findLast(item) {
		return _(this).array[this.lastIndexOf(item)];
	}

	/**
	 * Gets all the matching items from the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {List}
	 */
	findAll(item) {
		return new List({
			array: _(this).array.slice(this.indexOf(item), this.lastIndexOf(item) + 1),
			comparer: _(this).comparer
		}, spawn);
	}

	/**
	 * Gets the index of the first matching item. Uses a binary search (Identical to indexOf).
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {number} The index of the item or -1.
	 */
	findIndex(item) {
		return this.indexOf(item);
	}

	/**
	 * Gets the index of the last matching item. Uses a binary search (Identical to lastIndexOf).
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {unknown} item - Uses the comparer function to determine equality.
	 *
	 * @returns {number} The index of the item or -1.
	 */
	findLastIndex(item) {
		return this.lastIndexOf(item);
	}

	/**
	 * Gets the first item in the list without removing it.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {unknown}
	 */
	first() {
		return _(this).array[0];
	}

	/**
	 * Gets the last item in the list without removing it.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {unknown}
	 */
	last() {
		const _self = _(this);

		return _self.array[_self.array.length - 1];
	}

	/**
	 * Like .some(), but starts on the last (greatest index) item and progresses backwards.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback - Provides two arguments, the element and the index of the element.
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {List}
	 */
	someRight(callback, thisArg) {
		callback = callback.bind(thisArg || this);

		return someRight(_(this).array, callback);
	}

	/**
	 * Gets the items that exist both in this list and in another list or array. Equality of items is determined by the comparer.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {List|Array} array - Another list or array.
	 *
	 * @returns {List}
	 */
	intersection(array) {
		array = array.filter((item) => this.includes(item));

		return array instanceof List ? array : new List(array);
	}

	/**
	 * If the values in the list are Numbers, then this will return the median value. If there are an odd number of elements, then the value of the middle element is returned. If there are an even number of elements then the mean of the middle two elements is returned. To get the mean of a range of elements, low and high can be provided.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @param {number} [low=0] - Index of a range to start at.
	 * @param {number} [high=n] - Index of a range to end at.
	 *
	 * @returns {number}
	 */
	median(low, high) {
		const array = _(this).array;
		low = low || 0;
		const length = (high === undefined ? array.length - 1 : high) - low + 1;
		const halfLength = length / 2;

		if (length % 2 === 0) {
			return (array[low + halfLength - 1] + array[low + halfLength]) / 2;
		}

		return array[low + halfLength - 0.5];
	}

	/**
	 * If the values in the list are Numbers, then this will return the total value of all the elements added together.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {number}
	 */
	get total() {
		return _(this).array.reduce((total, value) => total + value, 0);
	}

	/**
	 * If the values in the list are Numbers, then this will return the mean(average) of all the elements.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {number}
	 */
	mean() {
		return this.total / this.length;
	}

	/**
	 * If the values in the list are Numbers, then this will return an object with a [quartile](https://en.wikipedia.org/wiki/Quartile) summary.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {{ min: number, Q1: number, median: number, Q3: number, max: number, outliers: Array<number> }} Contains min, Q1, median, Q3, max, and outliers. All are numbers except outliers, which is an array of all outliers (low and high).
	 */
	quartiles() {
		const array = _(this).array;
		const output = {
			median: this.median()
		};
		const mid = (array.length - 1) / 2;

		if (array.length === 1) {
			output.Q1 = array[0];
			output.Q3 = array[0];
		}
		else if (array.length % 2 === 0) {
			output.Q1 = this.median(0, Math.floor(mid));
			output.Q3 = this.median(Math.ceil(mid));
		}
		else {
			output.Q1 = this.median(0, mid);
			output.Q3 = this.median(mid);
		}

		const IQR = output.Q3 - output.Q1;
		const min = output.Q1 - (IQR * 1.5);
		const max = output.Q3 + (IQR * 1.5);

		output.min = array.findIndex((value) => value >= min);
		output.outliers = array.slice(0, output.min);
		output.min = array[output.min];

		output.max = array.findIndex((value) => value > max);
		output.max = (output.max === -1) ? array.length - 1 : output.max - 1;
		output.outliers = output.outliers.concat(array.slice(output.max + 1));
		output.max = array[output.max];

		return output;
	}

	/**
	 * The number of items in the list.
	 *
	 * @memberOf List
	 * @instance
	 * @readonly
	 *
	 * @returns {number}
	 */
	get length() {
		return _(this).array.length;
	}

	/**
	 * See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
	 *
	 * @method pop
	 * @memberOf List
	 * @instance
	 *
	 * @returns {unknown}
	 */
	pop() {
		return _(this).array.pop();
	}

	/**
	 * See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
	 *
	 * @method shift
	 * @memberOf List
	 * @instance
	 *
	 * @returns {unknown}
	 */
	shift() {
		return _(this).array.shift();
	}

	/**
	 * See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)
	 *
	 * @method toString
	 * @memberOf List
	 * @instance
	 *
	 * @returns {string}
	 */
	toString() {
		return _(this).array.toString();
	}

	/**
	 * See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
	 *
	 * @method keys
	 * @memberOf List
	 * @instance
	 *
	 * @returns {object}
	 */
	keys() {
		return _(this).array.keys();
	}

	/**
	 * See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
	 *
	 * @method every
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback - Provides two arguments, the element and the index of the element.
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {boolean}
	 */
	every(...args) {
		return _(this).array.every(...args);
	}

	/**
	 * See [Array.prototype.forEach()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach)
	 *
	 * @method forEach
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback - Provides two arguments, the element and the index of the element.
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {undefined}
	 */
	forEach(...args) {
		return _(this).array.forEach(...args);
	}

	/**
	 * See [Array.prototype.toLocaleString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toLocaleString)
	 *
	 * @method toLocaleString
	 * @memberOf List
	 * @instance
	 *
	 * @param {Array} [locales]
	 * @param {object} [options]
	 *
	 * @returns {string}
	 */
	toLocaleString(...args) {
		return _(this).array.toLocaleString(...args);
	}

	/**
	 * See [Array.prototype.join()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join)
	 *
	 * @method join
	 * @memberOf List
	 * @instance
	 *
	 * @param {string} [separator=',']
	 *
	 * @returns {string}
	 */
	join(...args) {
		return _(this).array.join(...args);
	}

	/**
	 * See [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
	 *
	 * @method map
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback - Provides two arguments, the element and the index of the element.
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {Array}
	 */
	map(...args) {
		return _(this).array.map(...args);
	}

	/**
	 * See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
	 *
	 * @method reduce
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {unknown}
	 */
	reduce(...args) {
		return _(this).array.reduce(...args);
	}

	/**
	 * See [Array.prototype.reduceRight()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight)
	 *
	 * @method reduceRight
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {unknown}
	 */
	reduceRight(...args) {
		return _(this).array.reduceRight(...args);
	}

	/**
	 * See [Array.prototype.some()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some)
	 *
	 * @method some
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback - Provides two arguments, the element and the index of the element.
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {boolean}
	 */
	some(...args) {
		return _(this).array.some(...args);
	}

	/**
	 * See [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
	 *
	 * @method filter
	 * @memberOf List
	 * @instance
	 *
	 * @param {Function} callback - Provides two arguments, the element and the index of the element.
	 * @param {object} [thisArg=this] - A value to use as `this` when executing `callback`.
	 *
	 * @returns {List}
	 */
	filter(...args) {
		return new List({
			array: _(this).array.filter(...args),
			comparer: _(this).comparer
		}, spawn);
	}

	/**
	 * See [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
	 *
	 * @method slice
	 * @memberOf List
	 * @instance
	 *
	 * @param {number} [begin=0]
	 * @param {number} [end=array.length]
	 *
	 * @returns {List}
	 */
	slice(...args) {
		return new List({
			array: _(this).array.slice(...args),
			comparer: _(this).comparer
		}, spawn);
	}
}

/**
 * Some simple comparer functions.
 *
 * @memberOf List
 * @readonly
 * @static
 *
 * @property {Function} default - Replicates the default behavior of Array.sort().
 * @property {object} string
 * @property {Function} string.asc - Uses localeCompare to sort strings. This is less efficient, but is useful for lists that will be displayed to users.
 * @property {Function} string.desc - Inverse of string.asc
 * @property {object} number
 * @property {Function} number.asc - Sorts numbers in numeric order
 * @property {Function} number.desc - Inverse of number.asc
 */
List.comparers = comparers;
