import { assert } from 'chai';
import checkSchemaType from '../../src/Schema/checkSchemaType';
import { multiTest } from '../TestUtil';
import { schemaTestTypes } from '../testValues';

describe('checkSchemaType', () => {
	const falseValues = [undefined, 'test', true, false, [], {}, 3, /g/];

	it('should return true for null', () => {
		assert.isTrue(checkSchemaType(null));
	});

	multiTest({
		values: schemaTestTypes,
		message: (input) => `should return true for ${input.name || input}`,
		test: (type) => checkSchemaType(type),
		inputKey: 'value',
		assertion: 'isTrue'
	});

	multiTest({
		values: falseValues,
		message: (input) => `should return false for ${input}`,
		test: (type) => checkSchemaType(type),
		assertion: 'isFalse'
	});

	it('should return true for null in an array', () => {
		assert.isTrue(checkSchemaType([null]));
	});

	multiTest({
		values: schemaTestTypes,
		message: (input) => `should return true for ${input.name || input} in an array`,
		test: (type) => checkSchemaType([type]),
		inputKey: 'value',
		assertion: 'isTrue'
	});

	multiTest({
		values: falseValues,
		message: (input) => `should return false for ${input} in an array`,
		test: (type) => checkSchemaType([type]),
		assertion: 'isFalse'
	});

	it('should return true for multiple types and null in an array', () => {
		assert.isTrue(checkSchemaType([String, Boolean, null]));
	});

	it('should return false for multiple types and a non-type in an array', () => {
		assert.isFalse(checkSchemaType([String, 3, null]));
	});

	it('should return true for null in an object with key "type"', () => {
		assert.isTrue(checkSchemaType({
			type: null
		}));
	});

	multiTest({
		values: schemaTestTypes,
		message: (input) => `should return true for ${input.name || input} in an object with key "type"`,
		test: (type) => checkSchemaType({
			type: type
		}),
		inputKey: 'value',
		assertion: 'isTrue'
	});

	multiTest({
		values: falseValues,
		message: (input) => `should return false for ${input} in an object with key "type"`,
		test: (type) => checkSchemaType({
			type: type
		}),
		assertion: 'isFalse'
	});

	it('should return true for multiple types and null in an array in an object with key "type"', () => {
		assert.isTrue(checkSchemaType({
			type: [String, Boolean, null]
		}));
	});

	it('should return false for multiple types and a non-type in an array in an object with key "type"', () => {
		assert.isFalse(checkSchemaType({
			type: [String, 3, null]
		}));
	});

	it('should return true for null in an array in an object with key "type"', () => {
		assert.isTrue(checkSchemaType({
			type: [null]
		}));
	});

	multiTest({
		values: schemaTestTypes,
		message: (input) => `should return true for ${input.name || input} in an array in an object with key "type"`,
		test: (type) => checkSchemaType({
			type: [type]
		}),
		inputKey: 'value',
		assertion: 'isTrue'
	});

	multiTest({
		values: falseValues,
		message: (input) => `should return false for ${input} in an array in an object with key "type"`,
		test: (type) => checkSchemaType({
			type: [type]
		}),
		assertion: 'isFalse'
	});

	it('should return true for multiple types and null in an array in an object with key "type"', () => {
		assert.isTrue(checkSchemaType({
			type: [String, Boolean, null]
		}));
	});

	it('should return true for an object with key "enforce" that is assigned a value that is a function', () => {
		assert.isTrue(checkSchemaType({
			enforce: () => {
			}
		}));
	});

	it('should return false if nothing is provided', () => {
		assert.isFalse(checkSchemaType());
	});
});
