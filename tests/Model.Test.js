import { assert } from 'chai';
import Model from '../src/Model';

describe('Model', () => {
	it('should be able to get initial values', () => {
		const Person = Model({
			first: String,
			last: String,
			age: Number
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		assert.equal(person.get('first'), 'John');
		assert.equal(person.get('last'), 'Doe');
		assert.equal(person.get('age'), 21);
	});

	it('should be able to set values', () => {
		const Person = Model({
			first: String,
			last: String,
			age: Number
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		person.set('age', 32);

		assert.equal(person.first, 'John');
		assert.equal(person.last, 'Doe');
		assert.equal(person.age, 32);
	});

	it('should be able to unset values', () => {
		const Person = Model({
			first: String,
			last: String,
			age: Number
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		person.unset('age');

		assert.equal(person.get('first'), 'John');
		assert.equal(person.get('last'), 'Doe');
		assert.equal(person.get('age'), undefined);
	});

	it('should be able to set multiple values', () => {
		const Person = Model({
			first: String,
			last: String,
			age: Number
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		person.set({
			first: 'Jane',
			age: 32
		});

		assert.equal(person.get('first'), 'Jane');
		assert.equal(person.get('last'), 'Doe');
		assert.equal(person.get('age'), 32);
	});

	it('should enforce the schema', () => {
		const Person = Model({
			first: String,
			last: String,
			age: {
				type: Number,
				min: 0,
				max: 120
			}
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		person.age = 1200;

		assert.equal(person.toString(), '{"first":"John","last":"Doe","age":120}');
	});

	it('should enforce the schema', () => {
		const Person = Model({
			first: String,
			last: String,
			age: {
				type: Number,
				min: 0,
				max: 120
			}
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		person.set('hobbies.0.name', 'programming');

		assert.equal(person.toString(), '{"first":"John","last":"Doe","age":21}');
	});

	it('should be able to set multiple values', () => {
		const Person = Model({
			first: String,
			last: String,
			age: Number
		});

		const person = new Person({
			first: 'John',
			last: 'Doe',
			age: 21
		});

		assert.equal(person.toString(), '{"first":"John","last":"Doe","age":21}');
	});
});
