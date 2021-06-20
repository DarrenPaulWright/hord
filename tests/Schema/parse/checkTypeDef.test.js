import { assert } from 'type-enforcer';
import { multiTest } from 'type-enforcer-test-helper';
import checkSchemaType from '../../../src/Schema/parse/checkTypeDef.js';
import { schemaTestTypes } from '../../helpers/testValues.js';

describe('checkSchemaType', () => {
	const falseValues = [undefined, 'test', true, false, [], {}, 3, /g/u];

	it('should return true for null', () => {
		assert.is(checkSchemaType(null, false), true);
	});

	multiTest({
		values: schemaTestTypes,
		message(input) {
			return `should return true for ${input.name || input}`;
		},
		test(type) {
			return checkSchemaType(type, false);
		},
		inputKey: 'value',
		assertion: 'true'
	});

	multiTest({
		values: falseValues,
		message(input) {
			return `should return false for ${input}`;
		},
		test(type) {
			return checkSchemaType(type, false);
		},
		assertion: 'false'
	});

	it('should return true for null in an array', () => {
		assert.is(checkSchemaType([null], false), true);
	});

	multiTest({
		values: schemaTestTypes,
		message(input) {
			return `should return true for ${input.name || input} in an array`;
		},
		test(type) {
			return checkSchemaType([type], false);
		},
		inputKey: 'value',
		assertion: 'true'
	});

	multiTest({
		values: falseValues,
		message(input) {
			return `should return false for ${input} in an array`;
		},
		test(type) {
			return checkSchemaType([type], false);
		},
		assertion: 'false'
	});

	it('should return true for multiple types and null in an array', () => {
		assert.is(checkSchemaType([String, Boolean, null], false), true);
	});

	it('should return false for multiple types and a non-type in an array', () => {
		assert.is(checkSchemaType([String, 3, null], false), false);
	});

	it('should return true for null in an object with key "type"', () => {
		assert.is(checkSchemaType({
			type: null
		}, true), true);
	});

	multiTest({
		values: schemaTestTypes,
		message(input) {
			return `should return true for ${input.name || input} in an object with key "type"`;
		},
		test(type) {
			return checkSchemaType({
				type
			}, true);
		},
		inputKey: 'value',
		assertion: 'true'
	});

	multiTest({
		values: falseValues,
		message(input) {
			return `should return false for ${input} in an object with key "type"`;
		},
		test(type) {
			return checkSchemaType({
				type
			}, true);
		},
		assertion: 'false'
	});

	it('should return true for multiple types and null in an array in an object with key "type"', () => {
		assert.is(checkSchemaType({
			type: [String, Boolean, null]
		}, true), true);
	});

	it('should return false for multiple types and a non-type in an array in an object with key "type"', () => {
		assert.is(checkSchemaType({
			type: [String, 3, null]
		}, true), false);
	});

	it('should return true for null in an array in an object with key "type"', () => {
		assert.is(checkSchemaType({
			type: [null]
		}, true), true);
	});

	multiTest({
		values: schemaTestTypes,
		message(input) {
			return `should return true for ${input.name || input} in an array in an object with key "type"`;
		},
		test(type) {
			return checkSchemaType({
				type: [type]
			}, true);
		},
		inputKey: 'value',
		assertion: 'true'
	});

	multiTest({
		values: falseValues,
		message(input) {
			return `should return false for ${input} in an array in an object with key "type"`;
		},
		test(type) {
			return checkSchemaType({
				type: [type]
			}, true);
		},
		assertion: 'false'
	});

	it('should return true for an object with key "enforce" that is assigned a value that is a function', () => {
		assert.is(checkSchemaType({
			enforce() {
			}
		}, true), true);
	});

	it('should return false if nothing is provided', () => {
		assert.is(checkSchemaType(), false);
	});
});
