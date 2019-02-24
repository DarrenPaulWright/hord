import { isEmpty } from 'object-agent';
import parseSchema from './parseSchema';
import processValue from './processValue';

const RULES = Symbol();

/**
 * Schema enforcement.
 *
 * @example
 * ``` javascript
 * import { Schema } from 'type-enforcer';
 *
 * const person = new Schema({
 *  first: String,
 *  last: String,
 *  age: 'integer',
 *  hobbies: {
 *      type: Array,
 *      content: String
 *  }
 * });
 *
 * person.validate({
 *  first: 'John',
 *  last: 'Doe',
 *  age: 21
 * });
 * // => []
 * ```
 *
 * @class Schema
 *
 * @arg {Object} schema
 */
export default class Schema {
	constructor(schema) {
		this[RULES] = parseSchema(schema);
	}

	/**
	 * Validate an item against the schema
	 *
	 * @memberOf Schema
	 * @instance
	 *
	 * @arg {Object} item
	 *
	 * @returns {Object[]} An array of error objects. Each object contains: "error" - A message about the type of error, "path" - The path within the given item to the value causing the error, "value" - The value at this path, "item" -  The original item being validated
	 */
	validate(item) {
		const errors = [];

		const buildError = (message, path, value) => {
			errors.push({
				error: message,
				path: path.join('.'),
				value: value,
				item: item
			});
		};

		processValue(item, this[RULES], [], buildError, false);
		return errors;
	}

	/**
	 * Enforce an items structure against the schema. This function mutates the original item.
	 *
	 * @memberOf Schema
	 * @instance
	 *
	 * @arg {Object} item
	 *
	 * @returns {Object} The enforced item
	 */
	enforce(item) {
		processValue(item, this[RULES], [], null, true);
		return isEmpty(item) ? undefined : item;
	}

	/**
	 * Calls a callback for each rule that will be used to validate this schema.
	 *
	 * @memberOf Schema
	 * @instance
	 *
	 * @arg {Function} callback - Provides two args: the path and the rule. If true is returned then no more callbacks will happen further down this branch, but will continue up a level.
	 */
	eachRule(callback) {
		const processRule = (path, rule) => {
			if (callback(path, rule)) {
				return true;
			}
			if (rule.content) {
				rule.content.some((item) => processRule(path.concat(item.key || 0), item));
			}
		};

		processRule([], this[RULES]);
	}
}
