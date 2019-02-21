import { forOwn, get, isEmpty, set, traverse, unset } from 'object-agent';
import { castArray, enforce, Enum, is } from 'type-enforcer';
import { checkArrayLength, checkNumericRange, instanceRule, sameRule, TYPE_RULES } from './schemaTypeRules';

const KEY_SEPARATOR = '.';
const OR_SEPARATOR = ' OR ';

const MISSING_ENUM_ERROR = 'Enum types must provide an enum';
const KEY_NOT_FOUND_ERROR = 'Key found that isn\'t in the schema';
const CHECK_ERROR = 'Value should be a ';
const REQUIRED_ERROR = 'A value is required';
const NUMERIC_RANGE_ERROR = 'Value is outside range';
const ARRAY_LENGTH_ERROR = 'Array length is outside range';

const isType = (type) => TYPE_RULES.has(type) || is.function(type) || type === null;

const isAllType = (value) => value.length !== 0 && value.every(isType);

export const checkSchemaType = (value) => {
	if (is.object(value)) {
		if ('type' in value) {
			return is.array(value.type) ? isAllType(value.type) : isType(value.type);
		}
		return is.function(value.enforce);
	}
	return is.array(value) ? isAllType(value) : isType(value);
};

export const findRule = (path, schemaValues) => {
	return path.reduce((result, key) => result.content.find((item) => item.key === key), schemaValues);
};

export const traverseSchema = (item, callback) => {
	const subTraverse = (basePath, item) => {
		traverse(item, (path, value) => {
			const last = path[path.length - 1];

			if (is.number(last) && last > 0) {
				return true;
			}

			const isAnObject = is.object(value);
			const isSchemaType = checkSchemaType(value);

			if (!isSchemaType) {
				value = isAnObject ? Object : is.array(value) ? Array : value;
			}

			if (!basePath.length || path.length) {
				callback(basePath.concat(path), value, isAnObject, isSchemaType);
			}

			if (isSchemaType && isAnObject && ('content' in value)) {
				subTraverse(basePath.concat(path), isType(value.content) ? [[value.content]] : [value.content]);
			}

			return isSchemaType;
		}, true);
	};

	subTraverse([], item);
};

export const parseSchema = (schema) => {
	const buildRule = (type, value) => {
		const isConstructor = is.function(type);
		const rule = Object.assign({}, TYPE_RULES.get(type) || (isConstructor ? instanceRule : sameRule));

		if (!TYPE_RULES.has(type)) {
			rule.name = isConstructor ? type.name : type + '';
		}
		rule.type = type;

		forOwn(enforce.object(value, {}), (subValue, subKey) => {
			if (!['content', 'type', 'name', 'isRequired', 'default'].includes(subKey)) {
				rule[subKey] = subValue;
			}
		});

		if ((type === 'integer' || type === Number) && ('min' in rule || 'max' in rule)) {
			rule.numericRange = checkNumericRange;
		}
		if ((rule.type === Array) && ('minLength' in rule || 'maxLength' in rule)) {
			rule.arrayLength = checkArrayLength;
		}

		return rule;
	};

	let schemaValues;

	traverseSchema(schema, (path, value, isAnObject, isSchemaType) => {
		const last = path[path.length - 1];
		const output = {
			types: []
		};

		if (path.length) {
			output.key = last;
		}

		const types = castArray((isAnObject && 'type' in value) ? value.type : value);
		types.forEach((type) => {
			if (isAnObject) {
				if (is.function(value.enforce) && !('type' in type)) {
					type = 'any';
				}
				if (type === Enum && !('enum' in value)) {
					throw new Error(MISSING_ENUM_ERROR);
				}
			}
			output.types.push(buildRule(type, value, isAnObject));
		});

		if (isAnObject) {
			if ('isRequired' in value) {
				output.isRequired = value.isRequired;
			}
			if ('default' in value) {
				output.default = value.default;
			}
			if (!isSchemaType) {
				output.keys = [];
			}
		}

		if (!path.length) {
			schemaValues = output;
		}
		else {
			const parent = findRule(path.slice(0, -1), schemaValues);
			if (!parent.content) {
				parent.content = [];
			}
			parent.content.push(output);
			if (parent.keys) {
				parent.keys.push(last);
			}
		}
	});

	if (isEmpty(schemaValues.content)) {
		throw new Error('Schema must contain a value');
	}

	return schemaValues;
};

const checkRule = (rule, value) => {
	if (!rule.check(value, rule.enum || rule.coerce || rule.type)) {
		return rule.message || CHECK_ERROR + rule.name;
	}
	if (rule.numericRange && !rule.numericRange(rule, value)) {
		return NUMERIC_RANGE_ERROR;
	}
	if (rule.arrayLength && !rule.arrayLength(rule, value)) {
		return ARRAY_LENGTH_ERROR;
	}
};

const enforceRule = (rule, item, path, value) => {
	const defaultValue = 'default' in rule ? rule.default : rule.isRequired ? null : undefined;
	let newValue = null;

	rule.types.some((type) => {
		if (type.enforce === enforce.enum) {
			newValue = type.enforce(value, type.enum, defaultValue, type.coerce);
		}
		else if (type.enforce === enforce.instance) {
			newValue = type.enforce(value, type.type, defaultValue, type.coerce);
		}
		else {
			newValue = type.enforce(value, defaultValue, type.coerce);
		}
		if (type.numericRange) {
			newValue = type.enforce(value, defaultValue, type.coerce, type.min, type.max);
		}

		return newValue !== null && newValue !== undefined;
	});

	if (newValue === undefined && !rule.isRequired) {
		unset(item, path);
	}
	else if (newValue !== value) {
		set(item, path, newValue);
	}
};

const processValue = (item, rule, path, onError, isEnforce) => {
	const value = get(item, path);

	if (value === undefined) {
		if (isEnforce) {
			enforceRule(rule, item, path, value);
		}
		else {
			if (rule.isRequired && rule.default === undefined) {
				onError(REQUIRED_ERROR, path, value);
			}
		}
	}
	else {
		const subErrors = [];

		if (isEnforce) {
			enforceRule(rule, item, path, value);
		}
		else {
			if (!rule.types.some((type) => !subErrors[subErrors.push(checkRule(type, value)) - 1])) {
				onError(subErrors.join(OR_SEPARATOR), path, value);
			}
		}

		if (rule.content) {
			if (rule.types[0].type === Array) {
				processArray(item, rule, path, value, onError, isEnforce);
			}
			else {
				processObject(item, rule, path, value, onError, isEnforce);
			}
		}

		if (isEnforce) {
			if ('arrayLength' in rule.types[0]) {
				if ('minLength' in rule.types[0] && rule.types[0].minLength > value.length) {
					value.length = 0;
				}
				if ('maxLength' in rule.types[0] && rule.types[0].maxLength < value.length) {
					set(item, path, value.slice(0, rule.types[0].maxLength));
				}
			}

			if ((rule.types[0].type === Array || rule.types[0].type === Object) && !rule.isRequired && isEmpty(value)) {
				unset(item, path);
			}
		}
	}
};

const processArray = (item, rule, path, value, onError, isEnforce) => {
	for (let index = 0, length = value.length; index < length; index++) {
		rule.content.forEach((rule) => {
			processValue(item, rule, path.concat(index), onError, isEnforce);
		});
	}
	set(item, path, value.filter((item) => item !== undefined));
};

const processObject = (item, rule, path, value, onError, isEnforce) => {
	const keys = Object.keys(value).filter((key) => !rule.keys.includes(key));

	if (keys.length !== 0) {
		keys.forEach((key) => {
			if (isEnforce) {
				unset(item, path.concat(key));
			}
			else {
				onError(KEY_NOT_FOUND_ERROR, path.concat(key), value[key]);
			}
		});
	}

	rule.content.forEach((rule) => {
		processValue(item, rule, path.concat(rule.key), onError, isEnforce);
	});
};

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
				path: path.join(KEY_SEPARATOR),
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
}
