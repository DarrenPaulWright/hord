import { assert } from 'chai';
import { deepEqual, diffUpdate, intersection, set } from 'object-agent';
import { isObject } from 'type-enforcer';
import { Model, MODEL_ERROR_LEVEL, Schema } from '../src';

describe('Model', () => {
	it('should return the schema', () => {
		const schema = new Schema({
			testKey: [{
				level2: Number
			}],
			testKey2: String
		});

		const model = new Model(schema);

		assert.equal(model.schema, schema);
	});

	it('should still resemble an Object', () => {
		const schema = new Schema({
			testKey: [{
				level2: Number
			}],
			testKey2: String
		});

		const model = new Model(schema);
		const thing = model.apply({
			testKey2: 'test'
		});

		assert.isTrue(isObject(thing));
	});

	describe('get', () => {
		it('should be able to get initial values', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: ['programming']
			});

			assert.equal(person.first, 'John');
			assert.equal(person.last, 'Doe');
			assert.equal(person.age, 21);
			assert.equal(person.hobbies, undefined);
		});
	});

	describe('set', () => {
		it('should enforce the schema when directly setting a value', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120,
					clamp: true
				}
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			person.age = 1200;

			assert.equal(person.age, 120);
		});

		it('should enforce the schema when setting a value with Object.defineProperty', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120,
					clamp: true
				}
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			Object.defineProperty(person, 'age', {
				value: 1200
			});

			assert.equal(person.age, 120);
		});

		it('should enforce the schema when setting a value with Object.deleteProperty', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120,
					isRequired: true,
					default: 0
				}
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			delete person.age;

			assert.equal(person.age, 0);
		});

		it('should be able to set values', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			set(person, 'age', 32);

			assert.equal(person.first, 'John');
			assert.equal(person.last, 'Doe');
			assert.equal(person.age, 32);
		});

		it('should enforce the schema in an array', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120
				},
				hobbies: {
					type: Array,
					content: {
						name: String,
						strength: {
							type: Number,
							min: 0,
							max: 1,
							clamp: true
						}
					}
				}
			});
			const output = {
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [{
					name: 'programming',
					strength: 1
				}]
			};

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			set(person, 'hobbies.0', {
				name: 'programming',
				strength: 2
			});

			assert.deepEqual(person, output);
		});

		it('should enforce the schema in an array #2', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120
				},
				hobbies: {
					type: Array,
					content: {
						name: String,
						strength: {
							type: Number,
							min: 0,
							max: 1,
							clamp: true
						}
					}
				}
			});
			const output = {
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [{
					name: 'programming',
					strength: 1
				}]
			};

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [{
					name: 'programming',
					strength: 1
				}]
			});

			person.hobbies[0].strength = 3;

			assert.deepEqual(person, output);
		});
	});

	describe('diffUpdate', () => {
		it('should return an object with only keys that differ from the original', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			const output = diffUpdate(person, {
				first: 'John',
				last: 'Buck',
				age: 32
			});

			assert.deepEqual(output, {
				last: 'Buck',
				age: 32
			});
		});
	});

	describe('deepEqual', () => {
		it('should return true for two models with the same values', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			const person2 = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			assert.isTrue(deepEqual(person, person2));
		});

		it('should return false for two models with the different values', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			const person2 = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 22
			});

			assert.isFalse(deepEqual(person, person2));
		});

		it('should return false for two models with the different keys', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			const person2 = Person.apply({
				first: 'John',
				last: 'Doe'
			});

			assert.isFalse(deepEqual(person, person2));
		});

		it('should return true for two models with the same nested models', () => {
			const Hobby = new Model({
				name: String,
				strength: Number
			});
			const Person = new Model({
				first: String,
				last: String,
				age: Number,
				hobbies: {
					type: Array,
					content: Hobby
				}
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [Hobby.apply({
					name: 'programming',
					strength: 1
				})]
			});

			const person2 = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [Hobby.apply({
					name: 'programming',
					strength: 1
				})]
			});

			assert.isTrue(deepEqual(person, person2));
		});

		it('should return false for two models with the different nested models', () => {
			const Hobby = new Model({
				name: String,
				strength: Number
			});
			const Person = new Model({
				first: String,
				last: String,
				age: Number,
				hobbies: {
					type: Array,
					content: Hobby
				}
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [Hobby.apply({
					name: 'programming',
					strength: 1
				})]
			});

			const person2 = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21,
				hobbies: [Hobby.apply({
					name: 'programming',
					strength: 0.1
				})]
			});

			assert.isFalse(deepEqual(person, person2));
		});
	});

	describe('intersection', () => {
		it('should return an object with only keys that differ from the original', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: Number
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			const output = intersection([person, {
				first: 'John',
				last: 'Buck',
				age: 32
			}]);

			assert.deepEqual(output, {
				first: 'John'
			});
		});
	});

	describe('.onChange', () => {
		it('should call the onChange callback when directly setting a value', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120,
					clamp: true
				}
			});
			let context;
			let returnedPath;
			let returnedValue;
			let returnedPrevious;
			let callCount = 0;

			Person.onChange(function(path, value, previous) {
				context = this;
				returnedPath = path;
				returnedValue = value;
				returnedPrevious = previous;
				callCount++;
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			person.age = 1200;

			assert.equal(context, person);
			assert.equal(returnedPath, 'age');
			assert.equal(returnedValue, 1200);
			assert.equal(returnedPrevious, 21);
			assert.equal(callCount, 1);
		});

		it('should only call the onChange callback once if aplly is called multiple times', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120,
					clamp: true
				}
			});
			let context;
			let returnedPath;
			let returnedValue;
			let returnedPrevious;
			let callCount = 0;

			Person.onChange(function(path, value, previous) {
				context = this;
				returnedPath = path;
				returnedValue = value;
				returnedPrevious = previous;
				callCount++;
			});

			let person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});
			person = Person.apply(person);
			person = Person.apply(person);

			person.age = 1200;

			assert.equal(context, person);
			assert.equal(returnedPath, 'age');
			assert.equal(returnedValue, 1200);
			assert.equal(returnedPrevious, 21);
			assert.equal(callCount, 1);
		});
	});

	describe('.onError', () => {
		Model.defaultErrorLevel(MODEL_ERROR_LEVEL.UNSET);

		it('should call the onError callback when setting a value that breaks the schemas rules', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120
				}
			});
			let context;
			let returnedErrors;
			let callCount = 0;

			Person
				.onError(function(errors) {
					context = this;
					returnedErrors = errors;
					callCount++;
				});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			person.age = 1200;

			assert.equal(context, person);
			assert.equal(returnedErrors.length, 1);
			assert.equal(callCount, 1);
		});
	});

	describe('.errorLevel', () => {
		it('should not throw an error by default', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120
				}
			});

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			assert.doesNotThrow(() => {
				person.age = 1200;
			});
		});

		it('should throw an error if set that way', () => {
			const Person = new Model({
				first: String,
				last: String,
				age: {
					type: Number,
					min: 0,
					max: 120
				}
			});

			Person
				.errorLevel(MODEL_ERROR_LEVEL.THROW);

			const person = Person.apply({
				first: 'John',
				last: 'Doe',
				age: 21
			});

			assert.throws(() => {
				person.age = 1200;
			});
		});
	});

	describe('.extend', () => {
		it('should accept undefined', () => {
			let total = 0;
			let testVar = 0;

			const model = new Model({
				testKey: [{
					level2: Number
				}],
				testKey2: String,
				testKey3: Date
			});

			const result = model.extend();

			model.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === Number) {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === String) {
					testVar++;
				}
				if (deepEqual(path, 'testKey3') && rule.types[0].type === Date) {
					testVar++;
				}
			});

			result.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === Number) {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === String) {
					testVar++;
				}
				if (deepEqual(path, 'testKey3') && rule.types[0].type === Date) {
					testVar++;
				}
			});

			assert.equal(total, 12);
			assert.equal(testVar, 12);
			assert.notEqual(model, result);
		});

		it('should accept an object', () => {
			let total = 0;
			let testVar = 0;

			const model = new Model({
				testKey: [{
					level2: Number
				}],
				testKey2: String,
				testKey3: Date
			});

			const result = model.extend({
				testKey: [{
					level2: 'integer'
				}],
				testKey2: Number
			});

			model.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === Number) {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === String) {
					testVar++;
				}
				if (deepEqual(path, 'testKey3') && rule.types[0].type === Date) {
					testVar++;
				}
			});

			result.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === 'integer') {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === Number) {
					testVar++;
				}
				if (deepEqual(path, 'testKey3') && rule.types[0].type === Date) {
					testVar++;
				}
			});

			assert.equal(total, 12);
			assert.equal(testVar, 12);
		});

		it('should accept an instance of Schema', () => {
			let total = 0;
			let testVar = 0;

			const model = new Model({
				testKey: [{
					level2: Number
				}],
				testKey2: String,
				testKey3: Date
			});
			const model2 = new Model({
				testKey: [{
					level2: 'integer'
				}],
				testKey2: Number
			});

			const result = model.extend(model2);

			model.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === Number) {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === String) {
					testVar++;
				}
				if (deepEqual(path, 'testKey3') && rule.types[0].type === Date) {
					testVar++;
				}
			});

			model2.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === 'integer') {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === Number) {
					testVar++;
				}
			});

			result.schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule.types[0].type === Array) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule.types[0].type === Object) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule.types[0].type === 'integer') {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule.types[0].type === Number) {
					testVar++;
				}
				if (deepEqual(path, 'testKey3') && rule.types[0].type === Date) {
					testVar++;
				}
			});

			assert.equal(total, 17);
			assert.equal(testVar, 17);
		});
	});
});
