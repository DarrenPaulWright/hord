import { enforce, Enum, is, isObject } from 'type-enforcer';

export const isAnything = () => true;
export const enforceAnything = (value) => value;

export const isSame = (a, b) => a === b;
export const enforceSame = (a) => a;

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
	check: is.instanceOf,
	enforce: enforce.instance
};

export const sameRule = {
	check: isSame,
	enforce: enforceSame
};

export const TYPE_RULES = new Map()
	.set('*', Object.freeze({
		name: '*',
		check: isAnything,
		enforce: enforceAnything
	}))
	.set(Array, Object.freeze({
		name: 'Array',
		check: is.array,
		enforce: enforce.array
	}))
	.set(Boolean, Object.freeze({
		name: 'Boolean',
		check: is.boolean,
		enforce: enforce.boolean
	}))
	.set(Date, Object.freeze({
		name: 'Date',
		check: is.date,
		enforce: enforce.date
	}))
	.set(Element, Object.freeze({
		name: 'Element',
		check: is.element,
		enforce: enforce.element
	}))
	.set(Enum, Object.freeze({
		name: 'Enum',
		check(value, enumerable) {
			return enumerable.has(value);
		},
		enforce: enforce.enum
	}))
	.set(Function, Object.freeze({
		name: 'function',
		check: is.function,
		enforce: enforce.function
	}))
	.set('float', Object.freeze({
		name: 'Float',
		check: is.float,
		enforce: enforce.float
	}))
	.set('integer', Object.freeze({
		name: 'Integer',
		check: is.integer,
		enforce: enforce.integer
	}))
	.set(Number, Object.freeze({
		name: 'Number',
		check: is.number,
		enforce: enforce.number
	}))
	.set(Object, Object.freeze({
		name: 'Object',
		check: is.object,
		enforce: enforce.object
	}))
	.set(RegExp, Object.freeze({
		name: 'RegExp',
		check: is.regExp,
		enforce: enforce.regExp
	}))
	.set(String, Object.freeze({
		name: 'String',
		check: is.string,
		enforce: enforce.string
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
