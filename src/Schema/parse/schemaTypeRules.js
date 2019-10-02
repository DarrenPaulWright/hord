import { enforce, Enum, is } from 'type-enforcer';

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
	.set('*', {
		name: '*',
		check: isAnything,
		enforce: enforceAnything
	})
	.set(Array, {
		name: 'Array',
		check: is.array,
		enforce: enforce.array
	})
	.set(Boolean, {
		name: 'Boolean',
		check: is.boolean,
		enforce: enforce.boolean
	})
	.set(Date, {
		name: 'Date',
		check: is.date,
		enforce: enforce.date
	})
	.set(Element, {
		name: 'Element',
		check: is.element,
		enforce: enforce.element
	})
	.set(Enum, {
		name: 'Enum',
		check(value, enumerable) {
			return enumerable.has(value);
		},
		enforce: enforce.enum
	})
	.set(Function, {
		name: 'function',
		check: is.function,
		enforce: enforce.function
	})
	.set('float', {
		name: 'Float',
		check: is.float,
		enforce: enforce.float
	})
	.set('integer', {
		name: 'Integer',
		check: is.integer,
		enforce: enforce.integer
	})
	.set(Number, {
		name: 'Number',
		check: is.number,
		enforce: enforce.number
	})
	.set(Object, {
		name: 'Object',
		check: is.object,
		enforce: enforce.object
	})
	.set(RegExp, {
		name: 'RegExp',
		check: is.regExp,
		enforce: enforce.regExp
	})
	.set(String, {
		name: 'String',
		check: is.string,
		enforce: enforce.string
	});
