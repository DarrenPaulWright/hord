import { enforce, Enum, is } from 'type-enforcer';

export const isAnything = () => true;
export const enforceAnything = (value) => value;

export const isSame = (a, b) => a === b;
export const enforceSame = (a) => a;

export const checkNumericRange = (rule, value) => rule.enforce(value, false, rule.coerce, rule.min, rule.max) === value;
export const checkArrayLength = (rule, value) => (!rule.minLength || rule.minLength <= value.length) && (!rule.maxLength || rule.maxLength >= value.length);

export const instanceRule = {
	check: is.instanceOf,
	enforce: enforce.instance
};

export const sameRule = {
	check: isSame,
	enforce: enforceSame
};

export const TYPE_RULES = new Map();
TYPE_RULES.set('any', {
	name: 'Anything',
	check: isAnything,
	enforce: enforceAnything
});
TYPE_RULES.set(Array, {
	name: 'Array',
	check: is.array,
	enforce: enforce.array
});
TYPE_RULES.set(Boolean, {
	name: 'Boolean',
	check: is.boolean,
	enforce: enforce.boolean
});
TYPE_RULES.set(Date, {
	name: 'Date',
	check: is.date,
	enforce: enforce.date
});
TYPE_RULES.set(Element, {
	name: 'Element',
	check: is.element,
	enforce: enforce.element
});
TYPE_RULES.set(Enum, {
	name: 'Enum',
	check: (value, enumerable) => enumerable.has(value),
	enforce: enforce.enum
});
TYPE_RULES.set(Function, {
	name: 'Function',
	check: is.function,
	enforce: enforce.function
});
TYPE_RULES.set('integer', {
	name: 'Integer',
	check: is.integer,
	enforce: enforce.integer
});
TYPE_RULES.set(Number, {
	name: 'Number',
	check: is.number,
	enforce: enforce.number
});
TYPE_RULES.set(Object, {
	name: 'Object',
	check: is.object,
	enforce: enforce.object
});
TYPE_RULES.set(RegExp, {
	name: 'RegExp',
	check: is.regExp,
	enforce: enforce.regExp
});
TYPE_RULES.set(String, {
	name: 'String',
	check: is.string,
	enforce: enforce.string
});
