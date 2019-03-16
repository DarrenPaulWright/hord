import defaultCompare from 'default-compare';
import { isArray, methodFunction } from 'type-enforcer';

const sorters = Object.freeze({
	default: defaultCompare,
	string: {
		asc: (a, b) => a.localeCompare(b),
		desc: (a, b) => b.localeCompare(a)
	},
	number: {
		asc: (a, b) => a - b,
		desc: (a, b) => b - a
	},
	id: {
		asc: (a, b) => defaultCompare(a, b, 'id'),
		desc: (a, b) => defaultCompare(b, a, 'id')
	}
});

export const sortedIndexOf = (array, item, sorter, isInsert = false, isLast = false) => {
	let high = array.length;
	let low = 0;
	let mid;
	let diff;

	while (low < high) {
		mid = high + low >>> 1;
		diff = sorter(array[mid], item);

		if (diff < 0 || (isLast && !diff && !sorter(array[mid + 1], array[mid]))) {
			low = mid + 1;
		}
		else if (diff > 0 || (!isLast && mid !== 0 && !sorter(array[mid - 1], array[mid]))) {
			high = mid;
		}
		else {
			return mid;
		}
	}

	return isInsert ? (diff > 0 ? --mid : mid) : -1;
};

const ARRAY = Symbol();

/**
 * Always sorted array.
 *
 * List maintains a sorted state internally, but doesn't observe changes to it's contents, so items manipulated externally can cause problems. If you must do this, the .sort() method is provided to resort the list.
 *
 * ## Usage
 * ``` javascript
 * import { List } from 'hord';
 * ```
 *
 * @class List
 *
 * @arg {Array} [values]
 */
export default class List {
	constructor(values) {
		this.values(values || []);
	}

	/**
	 * Sort the items.
	 *
	 * @memberOf List
	 * @instance
	 */
	sort() {
		if (this[ARRAY].length) {
			this[ARRAY].sort(this.sorter());
		}
		return this;
	}

	/**
	 * Add an item to the list. Uses binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Item is inserted into the list such that the items are still sorted.
	 *
	 * @returns {this}
	 */
	add(item) {
		this[ARRAY].splice(sortedIndexOf(this[ARRAY], item, this.sorter(), true) + 1, 0, item);

		return this;
	}

	/**
	 * Add an item to the list if it isn't already included. Uses binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Item is inserted into the list such that the items are still sorted.
	 *
	 * @returns {this}
	 */
	addUnique(item) {
		if (this[ARRAY].length === 0) {
			this[ARRAY][0] = item;
		}
		else {
			const sorter = this.sorter();
			let index = sortedIndexOf(this[ARRAY], item, sorter, true);

			if (index === -1 || sorter(this[ARRAY][index], item) !== 0) {
				this[ARRAY].splice((index || -1) + 1, 0, item);
			}
		}

		return this;
	}

	/**
	 * Get a new List of the unique (as determined by the sorter) values in this List.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {List}
	 */
	unique() {
		const sorter = this.sorter();
		const output = [];
		let previous;

		this.forEach((item, index) => {
			if (index === 0 || sorter(previous, item)) {
				output.push(item);
				previous = item;
			}
		});

		return new List().sorter(sorter).values(output);
	}

	/**
	 * Merges one or more arrays with the list.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} values
	 *
	 * @returns {this}
	 */
	concat(...args) {
		const self = this;
		[].concat(...args).forEach((item) => self.add(item));
		return self;
	}

	/**
	 * Discard an item from the list. Uses binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {this}
	 */
	discard(item) {
		this[ARRAY].splice(sortedIndexOf(this[ARRAY], item, this.sorter(), true), 1);

		return this;
	}

	/**
	 * Discard all items from the list.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {this}
	 */
	discardAll() {
		this[ARRAY].length = 0;

		return this;
	}

	/**
	 * The current items in the list.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {Array} [values] - If provided, replaces any previous values with these, otherwise return the current values.
	 *
	 * @returns {this|Array}
	 */
	values(values) {
		if (isArray(values)) {
			this[ARRAY] = values;
			return this.sort();
		}

		return this[ARRAY];
	}

	/**
	 * Gets the index of the first matching item. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {Number} - The index of the item or -1
	 */
	indexOf(item) {
		return sortedIndexOf(this[ARRAY], item, this.sorter());
	}

	/**
	 * Gets the index of the last matching item. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {Number} - The index of the item or -1
	 */
	lastIndexOf(item) {
		return sortedIndexOf(this[ARRAY], item, this.sorter(), false, true);
	}

	/**
	 * Determines if an item exists in the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
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
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {*} - The item or undefined
	 */
	find(item) {
		return this[ARRAY][this.indexOf(item)];
	}

	/**
	 * Gets the last matching item from the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {*} - The item or undefined
	 */
	findLast(item) {
		return this[ARRAY][this.lastIndexOf(item)];
	}

	/**
	 * Gets all the matching items from the list. Uses a binary search.
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {List} - A list of items
	 */
	findAll(item) {
		return new List()
			.sorter(this.sorter())
			.values(this[ARRAY].slice(this.indexOf(item), this.lastIndexOf(item) + 1));
	}

	/**
	 * Gets the index of the first matching item. Uses a binary search. (Identical to indexOf)
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {Number} - The index of the item or -1
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
	 * @arg {*} item - Uses the sorter function to determine equality.
	 *
	 * @returns {Number} - The index of the item or -1
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
		return this[ARRAY][0];
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
		return this[ARRAY][this[ARRAY].length - 1];
	}

	/**
	 * The number of items in the list
	 *
	 * @memberOf List
	 * @instance
	 *
	 * @returns {Number}
	 */
	get length() {
		return this[ARRAY].length;
	}
}

/**
 * Some simple sorter functions.
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
List.sorter = sorters;

/**
 * The sorting function. This function is used by .sort() and the binary search to determine equality.
 *
 * See the compareFunction for [Array.prototype.sort](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#Parameters) for details.
 * A few simple sorter functions are provided via the static property [List.sorter](#List.sorter)
 *
 * If you're setting this, you may want to call this before setting the values, like this:
 * ``` javascript
 * import { List } from 'hord';
 *
 * const list = new List().sorter(List.sorter.number.asc).values([1,2,3]);
 * ```
 *
 * @method sorter
 * @memberOf List
 * @instance
 *
 * @arg {Function} sorter
 *
 * @returns {*}
 */
List.prototype.sorter = methodFunction({
	init: sorters.default,
	set: function() {
		this.sort();
	}
});

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
		return this[ARRAY][key]();
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
		return this[ARRAY][key](...args);
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
		const newList = new List()
			.sorter(this.sorter());
		newList[ARRAY] = this[ARRAY][key](...args);
		return newList;
	};
});
