import { deepEqual } from 'object-agent';
import { assert, isObject } from 'type-enforcer';
import { multiTest } from 'type-enforcer-test-helper';
import Model from '../../../src/Model.js';
import traverseSchema from '../../../src/Schema/parse/traverseSchema.js';
import Schema from '../../../src/Schema/Schema.js';
import { schemaTestTypes } from '../../helpers/testValues.js';

describe('traverseSchema', () => {
	it('should call the callback twice for a nested empty array', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: [
				[]
			]
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'test')) {
				testVar++;
			}
			if (deepEqual(path, 'test.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback once for an array of multiple types', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: [String, Boolean]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value[0] === String) {
				testVar++;
			}
		});

		assert.is(total, 2);
		assert.is(testVar, 1);
	});

	it('should call the callback once for an array of multiple types in an object', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: {
				type: [String, Boolean]
			}
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && isObject(value)) {
				testVar++;
			}
		});

		assert.is(total, 2);
		assert.is(testVar, 1);
	});

	it('should call the callback for an empty object', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: {}
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (path === 'test' && value === Object) {
				testVar++;
			}
		});

		assert.is(total, 2);
		assert.is(testVar, 1);
	});

	it('should call the callback for an object with key "type"', () => {
		let testVar = 0;
		const testTypeObject = {
			type: String
		};
		const testSchema = {
			test: testTypeObject
		};

		traverseSchema(testSchema, (path, value) => {
			if (path === 'test' && value === testTypeObject) {
				testVar++;
			}
		});

		assert.is(testVar, 1);
	});

	it('should call the callback for an object with key "enforce"', () => {
		let total = 0;
		let testVar = 0;
		const testTypeObject = {
			enforce() {
			}
		};
		const testSchema = {
			test: testTypeObject
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === testTypeObject) {
				testVar++;
			}
		});

		assert.is(total, 2);
		assert.is(testVar, 1);
	});

	it('should call the callback once for an array object', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
		});

		assert.is(total, 2);
		assert.is(testVar, 1);
	});

	it('should call the callback four times for an array object with key "content"', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: {
					level2: String
				}
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0.level2')) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 4);
	});

	it('should call the callback four times for an array object with key "content" with a type', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: Object
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback four times for an array object with key "content" with multiple types', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: [Object, String]
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback four times for an array object with key "content" with multiple types as an object', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: {
					type: [Object, String]
				}
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback four times for an array object with key "content" with a type Array', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: {
					type: Array
				}
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback four times for an array object with key "content" with null', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: null
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback four times for an array object with key "content" with null as an object', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: {
				type: Array,
				content: {
					type: null
				}
			}
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 3);
	});

	it('should call the callback four times for an array with an object', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			level1: [{
				level2: {
					type: String
				}
			}]
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, '')) {
				testVar++;
			}
			if (deepEqual(path, 'level1')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0')) {
				testVar++;
			}
			else if (deepEqual(path, 'level1.0.level2')) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 4);
	});

	multiTest({
		values: schemaTestTypes.filter((item) => {
			return item.name !== 'array';
		}),
		message(input) {
			return `should call the callback with ${input.name || input}`;
		},
		test(type) {
			let testVar = 0;
			const testSchema = {
				test: {
					type
				}
			};

			traverseSchema(testSchema, (path, value) => {
				if (deepEqual(path, 'test') && value.type === type) {
					testVar++;
				}
			});

			return testVar;
		},
		inputKey: 'value',
		output: 1,
		assertion: 'equal'
	});

	it('should call the callback twice for nested empty arrays', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: [
				[]
			]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === Array) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0') && value === Array) {
				testVar++;
			}
		});

		assert.is(total, 3);
		assert.is(testVar, 2);
	});

	it('should call the callback three times for nested arrays with content', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: [
				['string']
			]
		};

		traverseSchema(testSchema, (path) => {
			total++;
			if (deepEqual(path, 'test')) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0')) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0.0')) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 3);
	});

	it('should call the callback three times for an array with an object and keys', () => {
		let total = 0;
		let testVar = 0;
		const testSchema = {
			test: [{
				level2: String
			}]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === Array) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0') && value === Object) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0.level2') && value === String) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 3);
	});

	it('should handle a nested Schema', () => {
		let total = 0;
		let testVar = 0;
		const subSchema = new Schema({
			first: String,
			last: String
		});
		const testSchema = {
			test: [{
				level2: subSchema
			}]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === Array) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0') && value === Object) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0.level2') && value === subSchema) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 3);
	});

	it('should handle a nested Schema in an object with key "type"', () => {
		let total = 0;
		let testVar = 0;
		const subSchema = new Schema({
			first: String,
			last: String
		});
		const testTypeObject = {
			type: subSchema
		};
		const testSchema = {
			test: [{
				level2: testTypeObject
			}]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === Array) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0') && value === Object) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0.level2') && value === testTypeObject) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 3);
	});

	it('should handle a nested Model', () => {
		let total = 0;
		let testVar = 0;
		const subModel = new Model({
			first: String,
			last: String
		});
		const testSchema = {
			test: [{
				level2: subModel
			}]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === Array) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0') && value === Object) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0.level2') && value === subModel) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 3);
	});

	it('should handle a nested Model in an object with key "type"', () => {
		let total = 0;
		let testVar = 0;
		const subModel = new Model({
			first: String,
			last: String
		});
		const testTypeObject = {
			type: subModel
		};
		const testSchema = {
			test: [{
				level2: testTypeObject
			}]
		};

		traverseSchema(testSchema, (path, value) => {
			total++;
			if (deepEqual(path, 'test') && value === Array) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0') && value === Object) {
				testVar++;
			}
			else if (deepEqual(path, 'test.0.level2') && value === testTypeObject) {
				testVar++;
			}
		});

		assert.is(total, 4);
		assert.is(testVar, 3);
	});
});
