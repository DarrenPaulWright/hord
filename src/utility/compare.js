import { get } from 'object-agent';
import { isArray, isNumber } from 'type-enforcer-ui';

const kindOf = (value) => {
	return value === undefined && 3 ||
		value === null && 2 ||
		value !== value && 1 ||
		isNumber(value) && -1 || 0;
};

const compare = (a, b) => {
	const kindA = kindOf(a);
	const kindB = kindOf(b);

	if (kindA !== kindB || kindA > 0) {
		a = kindA;
		b = kindB;
	}

	return a < b && -1 || a > b && 1 || 0;
};

/**
 * Returns a function that compares two values. If paths are provided, compares the values at that path on objects.
 *
 * Notes:
 * - Handles undefined, null, and NaN.
 * - Distinguishes numbers from strings.
 *
 * @example
 * ``` javascript
 * import { compare } from 'hord';
 *
 * compare('id')({id: 1}, {id: 2});
 * // => -1
 * ```
 *
 * @function compare
 *
 * @param {Array|String} [paths] - The path or paths to compare. If multiple paths are provided, then the first key is compared first, if the values are equal then the second key is compared, and so on.
 * @param {Boolean} [desc=false] - If true then inverse values are returned
 *
 * @returns {function} Accepts two arguments to be compared. Returns -1, 0, or 1.
 */
export default (paths, desc = false) => {
	if (paths !== undefined) {
		if (isArray(paths)) {
			return (a, b) => {
				let output = 0;

				for (let index = 0; output === 0 && index < paths.length; index++) {
					output = compare(get(a, paths[index]), get(b, paths[index]));
				}

				return desc ? -output : output;
			};
		}

		return desc ? (a, b) => compare(get(b, paths), get(a, paths)) : (a, b) => compare(get(a, paths), get(b, paths));
	}

	return desc ? (a, b) => compare(b, a) : compare;
};
