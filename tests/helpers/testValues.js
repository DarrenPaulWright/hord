import {
	enforceBoolean,
	enforceDate,
	enforceFloat,
	enforceFunction,
	enforceInstanceOf,
	enforceInteger,
	enforceNumber,
	enforceRegExp,
	enforceString,
	isBoolean,
	isDate,
	isFloat,
	isFunction,
	isInstanceOf,
	isInteger,
	isNumber,
	isRegExp,
	isString
} from 'type-enforcer';
import {
	booleanData,
	dateData,
	floatData,
	functionData,
	instanceData,
	integerData,
	numberData,
	regExpData,
	stringData,
	TestClass,
	testValues
} from 'type-enforcer-test-helper';
import { enforceElement, isElement } from 'type-enforcer-ui';
import { Model, Schema } from '../../index.js';
import {
	enforceAnything,
	isAnything,
	TYPE_RULES
} from '../../src/Schema/parse/typeRules.js';

export const testSchema = new Schema({ key: String });
export const testModel = new Model({ key: String });

const validElements = [document.createElement('div')];

testValues.push(validElements);

const schemaTestTypes = [{
	...instanceData,
	value: TestClass,
	name: new TestClass().constructor.name,
	check: isInstanceOf,
	enforce: enforceInstanceOf
}, {
	value: '*',
	name: '*',
	check: isAnything,
	enforce: enforceAnything,
	true: testValues.filter((value) => value !== undefined),
	false: [],
	coerceTrue: [],
	coerceFalse: []
}, {
	...booleanData,
	check: isBoolean,
	enforce: enforceBoolean
}, {
	...dateData,
	check: isDate,
	enforce: enforceDate
}, {
	value: Element,
	name: 'element',
	check: isElement,
	enforce: enforceElement,
	true: validElements,
	false: testValues.filter((value) => value !== undefined && !validElements.includes(value)),
	coerceTrue: [],
	coerceFalse: []
}, {
	...functionData,
	check: isFunction,
	enforce: enforceFunction
}, {
	...integerData,
	value: 'integer',
	check: isInteger,
	enforce: enforceInteger
}, {
	...floatData,
	value: 'float',
	check: isFloat,
	enforce: enforceFloat
}, {
	...numberData,
	check: isNumber,
	enforce: enforceNumber
}, {
	...regExpData,
	check: isRegExp,
	enforce: enforceRegExp
}, {
	...stringData,
	check: isString,
	enforce: enforceString
}, {
	value: testSchema,
	name: TYPE_RULES.get('Schema').name,
	check: TYPE_RULES.get('Schema').check,
	enforce: TYPE_RULES.get('Schema').enforce,
	true: [{
		key: 'test'
	}],
	false: testValues.filter((value) => value !== undefined),
	coerceTrue: [],
	coerceFalse: []
}, {
	value: testModel,
	name: TYPE_RULES.get('Schema').name,
	check: TYPE_RULES.get('Schema').check,
	enforce: TYPE_RULES.get('Schema').enforce,
	true: [{
		key: 'test'
	}],
	false: testValues.filter((value) => value !== undefined),
	coerceTrue: [],
	coerceFalse: []
}];

export { schemaTestTypes };
