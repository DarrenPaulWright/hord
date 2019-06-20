import { enforce, is } from 'type-enforcer';
import { enforceAnything, isAnything } from '../src/Schema/schemaTypeRules';

const difference = (array1, ...args) => {
	let diffArrays = [].concat(...args);
	return array1.filter((item1) => diffArrays.every((item2) => item1 !== item2));
};

class CustomClass {
	constructor() {
	}
}

const validArrays = [[1]];
const validBooleans = [true, false];
const validDates = [new Date('01/15/2010')];
const validElements = [document.createElement('div')];
const validFunctions = [function() {
}, () => {
}];
const validIntegers = [1];
const validFloats = [3.14159];
const validNumbers = [Infinity];
const validObjects = [{
	test1: 1
}];
const validRegExps = [/asdf/g];
const validStrings = ['test'];

const testValues = [].concat(
	validArrays,
	validBooleans,
	validDates,
	validElements,
	validFunctions,
	validIntegers,
	validFloats,
	validNumbers,
	validObjects,
	validRegExps,
	validStrings
);

const schemaTestTypes = [{
	value: CustomClass,
	nativeName: 'CustomClass',
	check: is.instanceOf,
	enforce: enforce.instance,
	true: [new CustomClass()],
	false: testValues,
	coerceTrue: [],
	coerceFalse: []
}, {
	value: '*',
	nativeName: '*',
	check: isAnything,
	enforce: enforceAnything,
	true: testValues,
	false: [],
	coerceTrue: [],
	coerceFalse: []
}, {
	value: Boolean,
	name: 'boolean',
	nativeName: 'Boolean',
	check: is.boolean,
	enforce: enforce.boolean,
	true: validBooleans,
	false: difference(testValues, validBooleans),
	coerceTrue: difference(testValues, validBooleans),
	coerceFalse: []
}, {
	value: Date,
	name: 'date',
	nativeName: 'Date',
	check: is.date,
	enforce: enforce.date,
	true: validDates,
	false: difference(testValues, validDates),
	coerceTrue: ['10/12/1980', 'January 8, 2014'],
	coerceFalse: difference(testValues, validDates, validArrays, validNumbers, validIntegers, validRegExps)
}, {
	value: Element,
	name: 'element',
	nativeName: 'Element',
	check: is.element,
	enforce: enforce.element,
	true: validElements,
	false: difference(testValues, validElements),
	coerceTrue: [],
	coerceFalse: []
}, {
	value: Function,
	name: 'function',
	nativeName: 'function',
	check: is.function,
	enforce: enforce.function,
	true: validFunctions,
	false: difference(testValues, validFunctions),
	coerceTrue: [],
	coerceFalse: []
}, {
	value: 'integer',
	name: 'integer',
	nativeName: 'Integer',
	check: is.integer,
	enforce: enforce.integer,
	skip: ['number', 'float'],
	true: validIntegers,
	false: difference(testValues, validIntegers),
	coerceTrue: ['10'],
	coerceFalse: ['$1.00']
}, {
	value: 'float',
	name: 'float',
	nativeName: 'Float',
	check: is.float,
	enforce: enforce.float,
	skip: ['number'],
	true: validFloats,
	false: difference(testValues, validIntegers, validFloats),
	coerceTrue: ['10.3'],
	coerceFalse: ['$1.04']
}, {
	value: Number,
	name: 'number',
	nativeName: 'Number',
	check: is.number,
	enforce: enforce.number,
	true: validNumbers,
	false: difference(testValues, validNumbers, validIntegers, validFloats),
	coerceTrue: ['10'],
	coerceFalse: ['$1.00']
}, {
	value: RegExp,
	name: 'regExp',
	nativeName: 'RegExp',
	check: is.regExp,
	enforce: enforce.regExp,
	true: validRegExps,
	false: difference(testValues, validRegExps),
	coerceTrue: ['test', '/[a-z]+/', '/[a-z]+/gi'],
	coerceFalse: difference(testValues, validStrings, validRegExps)
}, {
	value: String,
	name: 'string',
	nativeName: 'String',
	check: is.string,
	enforce: enforce.string,
	true: validStrings,
	false: difference(testValues, validStrings),
	coerceTrue: difference(testValues, validStrings, [null, undefined]),
	coerceFalse: [null]
}];

export { schemaTestTypes };
