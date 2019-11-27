import {
	enforceBoolean,
	enforceDate,
	enforceElement,
	enforceFloat,
	enforceFunction,
	enforceInstance,
	enforceInteger,
	enforceNumber,
	enforceRegExp,
	enforceString,
	isBoolean,
	isDate,
	isElement,
	isFloat,
	isFunction,
	isInstanceOf,
	isInteger,
	isNumber,
	isRegExp,
	isString
} from 'type-enforcer';
import { Model, Schema } from '../src';
import { enforceAnything, isAnything, TYPE_RULES } from '../src/Schema/parse/schemaTypeRules';

const difference = (array1, ...args) => {
	let diffArrays = [].concat(...args);
	return array1.filter((item1) => diffArrays.every((item2) => item1 !== item2));
};

class CustomClass {
	constructor() {
	}
}

export const testSchema = new Schema({
	key: String
});

export const testModel = new Model({
	key: String
});

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
	nativeName: new CustomClass().constructor.name,
	check: isInstanceOf,
	enforce: enforceInstance,
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
	check: isBoolean,
	enforce: enforceBoolean,
	true: validBooleans,
	false: difference(testValues, validBooleans),
	coerceTrue: difference(testValues, validBooleans),
	coerceFalse: []
}, {
	value: Date,
	name: 'date',
	nativeName: 'Date',
	check: isDate,
	enforce: enforceDate,
	true: validDates,
	false: difference(testValues, validDates),
	coerceTrue: ['10/12/1980', 'January 8, 2014'],
	coerceFalse: difference(testValues, validDates, validArrays, validNumbers, validIntegers, validRegExps)
}, {
	value: Element,
	name: 'element',
	nativeName: 'Element',
	check: isElement,
	enforce: enforceElement,
	true: validElements,
	false: difference(testValues, validElements),
	coerceTrue: [],
	coerceFalse: []
}, {
	value: Function,
	name: 'function',
	nativeName: 'function',
	check: isFunction,
	enforce: enforceFunction,
	true: validFunctions,
	false: difference(testValues, validFunctions),
	coerceTrue: [],
	coerceFalse: []
}, {
	value: 'integer',
	name: 'integer',
	nativeName: 'Integer',
	check: isInteger,
	enforce: enforceInteger,
	skip: ['number', 'float'],
	true: validIntegers,
	false: difference(testValues, validIntegers),
	coerceTrue: ['10'],
	coerceFalse: ['$1.00']
}, {
	value: 'float',
	name: 'float',
	nativeName: 'Float',
	check: isFloat,
	enforce: enforceFloat,
	skip: ['number'],
	true: validFloats,
	false: difference(testValues, validIntegers, validFloats),
	coerceTrue: ['10.3'],
	coerceFalse: ['$1.04']
}, {
	value: Number,
	name: 'number',
	nativeName: 'Number',
	check: isNumber,
	enforce: enforceNumber,
	true: validNumbers,
	false: difference(testValues, validNumbers, validIntegers, validFloats),
	coerceTrue: ['10'],
	coerceFalse: ['$1.00']
}, {
	value: RegExp,
	name: 'regExp',
	nativeName: 'RegExp',
	check: isRegExp,
	enforce: enforceRegExp,
	true: validRegExps,
	false: difference(testValues, validRegExps),
	coerceTrue: ['test', '/[a-z]+/', '/[a-z]+/gi'],
	coerceFalse: difference(testValues, validStrings, validRegExps)
}, {
	value: String,
	name: 'string',
	nativeName: 'String',
	check: isString,
	enforce: enforceString,
	true: validStrings,
	false: difference(testValues, validStrings),
	coerceTrue: difference(testValues, validStrings, [null, undefined]),
	coerceFalse: [null]
}, {
	value: testSchema,
	nativeName: TYPE_RULES.get('Schema').name,
	check: TYPE_RULES.get('Schema').check,
	enforce: TYPE_RULES.get('Schema').enforce,
	true: [{
		key: 'test'
	}],
	false: testValues,
	coerceTrue: [],
	coerceFalse: []
}, {
	value: testModel,
	nativeName: TYPE_RULES.get('Schema').name,
	check: TYPE_RULES.get('Schema').check,
	enforce: TYPE_RULES.get('Schema').enforce,
	true: [{
		key: 'test'
	}],
	false: testValues,
	coerceTrue: [],
	coerceFalse: []
}];

export { schemaTestTypes };
