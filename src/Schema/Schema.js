import { appendToPath, clone, superimpose } from 'object-agent';
import { Enum, PrivateVars } from 'type-enforcer';
import findRule from './findRule.js';
import parseSchema from './parse/parseSchema.js';
import processValue from './processValue.js';

/**
 * Schema validation errors
 *
 * @typedef {object} SchemaError
 *
 * @param {string} error - A message about the type of error
 * @param {string} path - The path within the given item to the value causing the error
 * @param {*} value - The value at this path
 * @param {*} item - The original item being validated
 */

/**
 * Schema type definitions. Can be just the type as defined below, or an array of types, or an object with the following options. Any extra options provided will be copied to the rule, which can be accessed via the schema.eachRule() method.
 *
 * '*' can be used as a key to indicate that any keys are allowed in an object.
 *
 * @example
 * ``` javascript
 * import { Schema } from 'hord';
 *
 * // Can be a native type or string
 * const person = new Schema({
 *  first: String,
 *  last: String,
 *  age: 'integer'
 * });
 *
 * // Or with options:
 * const person = new Schema({
 *  first: {
 *      type: String,
 *      isRequired: true
 *  },
 *  last: {
 *      type: String,
 *      isRequired: true
 *  },
 *  age: {
 *      type: 'integer'
 *      min: 0,
 *      coerce: true
 *  }
 * });
 * ```
 *
 * @typedef {*|object} SchemaDefinition
 *
 * @property {*|Array} type - Supported native types are Array, Boolean, Date, Element, Function, Number, Object, RegExp, String. Also supports '*', 'integer', 'float', Enum (from type-enforcer), custom constructors (classes or constructor functions), or instances of Schema or Model.
 * @property {boolean} [isRequired=false] - Empty arrays or objects that aren't required will be removed by schema.enforce().
 * @property {boolean} [default] - If isRequired is true, then schema.enforce() will set this value if the key is undefined.
 * @property {boolean} [coerce=false] - If true then values that can be coerced into the specified type will not return errors and will be coerced in schema.enforce().
 * @property {number} [min] - For Number, 'integer', and 'float'
 * @property {number} [max] - For Number, 'integer', and 'float'
 * @property {number.int} [minLength] - For Arrays and Strings
 * @property {number.int} [maxLength] - For Arrays and Strings
 * @property {boolean} [clamp=false] - Works with min, max, minength, and maxLength. If true then values outside the range will be forced within the range. If false then values outside the range will be deleted.
 * @property {Enum} [enum] - If type is Enum, then this is required
 * @property {object|Array} [content] - For arrays and objects to specify further content
 * @property {Function} [enforce] - This is automatically included, but can be overridden. (See [type-enforcer enforce](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/enforce.md) for more info)
 * @property {Function} [check] - This is automatically included, but can be overridden. (See [type-enforcer checks](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/checks.md) for more info)
 */

const process = (item, rules, path, isEnforce, replace) => {
	const errors = [];

	if (rules !== undefined) {
		processValue(item, rules, path, (error, subPath, value) => {
			errors.push({ error, path: subPath, value, item });
		}, isEnforce, replace);
	}

	return errors;
};

const eachRule = (self, callback, path, rule) => {
	path = path || '';
	rule = rule || _(self).rules;

	if (rule.types[0].schema !== undefined) {
		return !eachRule(rule.types[0].schema, callback, path);
	}

	return callback(path, rule) ||
		(rule.content !== undefined &&
			!rule.content.some((item) => {
				return eachRule(self, callback, appendToPath(path, item.key || 0), item);
			}));
};

const _ = new PrivateVars();

/**
 * @example
 * ``` javascript
 * import { Schema } from 'hord';
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
 * @classdesc Schema enforcement.
 *
 * @param {SchemaDefinition} schema
 */
export default class Schema {
	constructor(schema) {
		_.set(this, {
			definition: clone(schema),
			rules: parseSchema(schema)
		});
	}

	/**
	 * Validate an item against the schema.
	 *
	 * @memberof Schema
	 * @instance
	 *
	 * @param {object} item - The object validate against this schema.
	 * @param {Array} [path=[]] - If provided then only the value at that path will be validated.
	 *
	 * @returns {SchemaError[]}
	 */
	validate(item, path = '') {
		return process(item, findRule(path, _(this).rules), path, false);
	}

	/**
	 * Enforce an items structure against the schema. This function mutates the original item.
	 *
	 * @memberof Schema
	 * @instance
	 *
	 * @param {object} item - The object enforce against this schema.
	 * @param {Array} [path=[]] - If provided then only the value at that path will be enforced.
	 * @param {*} [replace] - If the current value at path is invalid, replace it with this.
	 *
	 * @returns {SchemaError[]}
	 */
	enforce(item, path = '', replace = undefined) {
		return process(item, findRule(path, _(this).rules), path, true, replace);
	}

	/**
	 * Calls a callback for each rule that will be used to validate this schema.
	 *
	 * @memberof Schema
	 * @instance
	 *
	 * @param {Function} callback - Provides two args: the path and the rule. If true is returned then no more callbacks will happen further down this branch, but will continue up a level.
	 */
	eachRule(callback) {
		eachRule(this, callback);
	}

	/**
	 * Returns a new Schema with the rules from the provided schema [superimposed](https://github.com/DarrenPaulWright/object-agent/blob/master/docs/superimpose.md) on the rules from this schema. If no args are provided, then the returned Schema is effectively a clone of this one.
	 *
	 * @memberof Schema
	 * @instance
	 *
	 * @param {SchemaDefinition|Schema} schema - The schema to superimpose on this one.
	 *
	 * @returns {Schema}
	 */
	extend(schema) {
		return new Schema(superimpose(_(this).definition, schema instanceof Schema ? _(schema).definition : schema));
	}
}
