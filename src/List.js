import { castArray, PrivateVars } from 'type-enforcer-ui';
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
 * @arg {Array} [values]
 */
export default class List {
	constructor(values = []) {
		if (arguments[1] === spawn) {
			_.set(this, values);
		}
		else {
			_.set(this, {
				comparer: comparers.default,
				array: castArray(values).sort(comparers.default)
			});
		}
	}

	/**
	 * Used by .sort() and the binary search to determine equality.
	 *
	 * See the compare function for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters) for details.
	 * A few simple comparer functions are provided via the static property [List.comparers](#List.comparers)
	 *
	 * If you're setting this, you may want to call this before setting the values, like this:
	 * ``` javascript
	 * import { List } from 'hord';
	 *
	 * const list = new List().comparer(List.comparers.number.asc).values([1,2,3]);
	 * ```
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {Function} comparer
	 *
	 * @returns {Function}
	 */
	comparer(comparer) {
		if (arguments.length) {
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
	 * @arg {*} item - Item is inserted into the list such that the items are still sorted.
	 *
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
	 * @arg {*} item - Item is inserted into the list such that the items are still sorted.
	 */
	addUnique(item) {
		const _self = _(this);

		if (_self.array.length === 0) {
			_self.array[0] = item;
		}
		else {
			let index = binarySearchLeft(_self.array, item, _self.comparer, true);

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
	 * @arg {*} values
	 */
	concat(...args) {
		const _self = _(this);

		return new List({
			array: _self.array.concat(...args.map((item) => {
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
	 * @arg {*} item - Uses the comparer function to determine equality.
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
	 * @arg {*} index
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
	 * @arg {Array} [values] - Replaces any previous values and immediately sorts them.
	 *
	 * @returns {Array} A shallow clone of the values
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
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {Number} The index of the item or -1
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
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {Number} The index of the item or -1
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
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {Boolean}
	 */
	includes(item) {
		return this.indexOf(item) !== -1;
	}

	/**
	 * Gets the first matching item from the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {*} The item or undefined
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
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {*} The item or undefined
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
	 * @arg {*} item - Uses the comparer function to determine equality.
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
	 * Gets the index of the first matching item. Uses a binary search. (Identical to indexOf)
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {Number} The index of the item or -1
	 */
	findIndex(item) {
		return this.indexOf(item);
	}

	/**
	 * Gets the index of the last matching item. Uses a binary search. (Identical to lastIndexOf)
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the comparer function to determine equality.
	 *
	 * @returns {Number} The index of the item or -1
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
	 * @returns {*}
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
	 * @returns {*}
	 */
	last() {
		const _self = _(this);

		return _self.array[_self.array.length - 1];
	}

	/**
	 * Like .some(), but starts on the last (greatest index) item and progresses backwards
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {function} callback
	 * @arg {Object} [thisArg]
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
	 * @arg {List|Array} array
	 *
	 * @returns {List}
	 */
	intersection(array) {
		array = array.filter((item) => this.includes(item));

		return array instanceof List ? array : new List(array);
	}

	/**
	 * The number of items in the list
	 *
	 * @memberOf List
	 * @instance
	 * @readonly
	 *
	 * @returns {Number}
	 */
	get length() {
		return _(this).array.length;
	}
}

/**
 * Some simple comparer functions.
 *
 * @memberOf List
 * @readonly
 * @static
 *
 * @property {Function} default - Replicates the default behavior of Array.sort()
 * @property {Object} string
 * @property {Function} string.asc - Uses localeCompare to sort strings. This is less efficient, but is useful for lists that will be displayed to users.
 * @property {Function} string.desc - Inverse of string.asc
 * @property {Object} number
 * @property {Function} number.asc - Sorts numbers in numeric order
 * @property {Function} number.desc - Inverse of number.asc
 */
List.comparers = comparers;

/**
 * See [Array.prototype.pop()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/pop)
 *
 * @method pop
 * @memberOf List
 * @instance
 *
 * @returns {*}
 */
/**
 * See [Array.prototype.shift()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/shift)
 *
 * @method shift
 * @memberOf List
 * @instance
 *
 * @returns {*}
 */
/**
 * See [Array.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toString)
 *
 * @method toString
 * @memberOf List
 * @instance
 *
 * @returns {String}
 */
/**
 * See [Array.prototype.keys()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/keys)
 *
 * @method keys
 * @memberOf List
 * @instance
 *
 * @returns {Object}
 */
[
	'pop',
	'shift',
	'toString',
	'keys'
].forEach((key) => {
	List.prototype[key] = function() {
		return _(this).array[key]();
	};
});

/**
 * See [Array.prototype.every()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every)
 *
 * @method every
 * @memberOf List
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
 * @memberOf List
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
 * @memberOf List
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
 * @memberOf List
 * @instance
 *
 * @arg {String} [separator=',']
 *
 * @returns {String}
 */
/**
 * See [Array.prototype.map()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
 *
 * @method map
 * @memberOf List
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {Array}
 */
/**
 * See [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce)
 *
 * @method reduce
 * @memberOf List
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
 * @memberOf List
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
 * @memberOf List
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {Boolean}
 */
[
	'every',
	'forEach',
	'toLocaleString',
	'join',
	'map',
	'reduce',
	'reduceRight',
	'some'
].forEach((key) => {
	List.prototype[key] = function(...args) {
		return _(this).array[key](...args);
	};
});

/**
 * See [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
 *
 * @method filter
 * @memberOf List
 * @instance
 *
 * @arg {Function} callback
 * @arg {Object} [thisArg]
 *
 * @returns {List}
 */
/**
 * See [Array.prototype.slice()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice)
 *
 * @method slice
 * @memberOf List
 * @instance
 *
 * @arg {Number} [begin=0]
 * @arg {Number} [end=array.length]
 *
 * @returns {List}
 */
[
	'filter',
	'slice'
].forEach((key) => {
	List.prototype[key] = function(...args) {
		return new List({
			array: _(this).array[key](...args),
			comparer: _(this).comparer
		}, spawn);
	};
});
