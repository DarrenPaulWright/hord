import {
	enforceArray,
	enforceBoolean,
	enforceDate,
	enforceElement,
	enforceEnum,
	enforceFloat,
	enforceFunction,
	enforceInstanceOf,
	enforceInteger,
	enforceMap,
	enforceNumber,
	enforceObject,
	enforceRegExp,
	enforceSet,
	enforceString,
	enforceSymbol,
	enforceWeakMap,
	enforceWeakSet,
	Enum,
	isArray,
	isBoolean,
	isDate,
	isElement,
	isFloat,
	isFunction,
	isInstanceOf,
	isInteger,
	isMap,
	isNumber,
	isObject,
	isRegExp,
	isSet,
	isString,
	isSymbol,
	isWeakMap,
	isWeakSet,
	strictEquality
} from 'type-enforcer-ui';

export const isAnything = () => true;
export const enforceAnything = (value) => value;

export const checkNumericRange = (rule, value, defaultValue) => {
	let newValue = rule.enforce(value, defaultValue, rule.coerce, rule.min, rule.max);

	if (rule.clamp !== true && newValue !== rule.enforce(value, defaultValue, rule.coerce)) {
		newValue = undefined;
	}

	return newValue;
};

export const checkLength = (rule, value) => {
	return (!rule.minLength || rule.minLength <= value.length) && (!rule.maxLength || rule.maxLength >= value.length);
};

export const instanceRule = {
	check: isInstanceOf,
	enforce: enforceInstanceOf
};

export const sameRule = {
	check: strictEquality,
	enforce: enforceAnything
};

export const TYPE_RULES = new Map()
	.set('*', Object.freeze({
		name: '*',
		check: isAnything,
		enforce: enforceAnything
	}))
	.set(Array, Object.freeze({
		name: 'Array',
		check: isArray,
		enforce: enforceArray
	}))
	.set(Boolean, Object.freeze({
		name: 'Boolean',
		check: isBoolean,
		enforce: enforceBoolean
	}))
	.set(Date, Object.freeze({
		name: 'Date',
		check: isDate,
		enforce: enforceDate
	}))
	.set(Element, Object.freeze({
		name: 'Element',
		check: isElement,
		enforce: enforceElement
	}))
	.set(Enum, Object.freeze({
		name: 'Enum',
		check(value, enumerable) {
			return enumerable.has(value);
		},
		enforce: enforceEnum
	}))
	.set(Function, Object.freeze({
		name: 'function',
		check: isFunction,
		enforce: enforceFunction
	}))
	.set('float', Object.freeze({
		name: 'Float',
		check: isFloat,
		enforce: enforceFloat
	}))
	.set('integer', Object.freeze({
		name: 'Integer',
		check: isInteger,
		enforce: enforceInteger
	}))
	.set(Map, Object.freeze({
		name: 'Map',
		check: isMap,
		enforce: enforceMap
	}))
	.set(Number, Object.freeze({
		name: 'Number',
		check: isNumber,
		enforce: enforceNumber
	}))
	.set(Object, Object.freeze({
		name: 'Object',
		check: isObject,
		enforce: enforceObject
	}))
	.set(RegExp, Object.freeze({
		name: 'RegExp',
		check: isRegExp,
		enforce: enforceRegExp
	}))
	.set(Set, Object.freeze({
		name: 'Set',
		check: isSet,
		enforce: enforceSet
	}))
	.set(String, Object.freeze({
		name: 'String',
		check: isString,
		enforce: enforceString
	}))
	.set(Symbol, Object.freeze({
		name: 'Symbol',
		check: isSymbol,
		enforce: enforceSymbol
	}))
	.set(WeakMap, Object.freeze({
		name: 'WeakMap',
		check: isWeakMap,
		enforce: enforceWeakMap
	}))
	.set(WeakSet, Object.freeze({
		name: 'WeakSet',
		check: isWeakSet,
		enforce: enforceWeakSet
	}))
	.set('Schema', Object.freeze({
		name: 'Schema',
		check(item, schema) {
			return schema.validate(item);
		},
		enforce(item, schema) {
			schema.enforce(item);
			return isObject(item) ? item : undefined;
		}
	}));
