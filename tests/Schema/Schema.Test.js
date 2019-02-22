import { assert } from 'chai';
import { clone } from 'object-agent';
import { Enum } from 'type-enforcer';
import { Schema } from '../../src/index';
import { schemaTestTypes } from '../testValues';

describe('Schema', () => {
	describe('.validate', () => {
		schemaTestTypes.forEach((data) => {
			data.true.forEach((datum) => {
				it(`should NOT return an error for a value that matches a ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};

					const schema = new Schema({
						testKey: data.value
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});

				it(`should NOT return an error for a value that matches a ${data.nativeName} and isRequired=true`, () => {
					const item = {
						testKey: datum
					};

					const schema = new Schema({
						testKey: {
							type: data.value,
							isRequired: true
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});

				it(`should return an error for a value of undefined when the type is ${data.nativeName} and isRequired=true`, () => {
					const item = {
						testKey: undefined
					};

					const schema = new Schema({
						testKey: {
							type: data.value,
							isRequired: true
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 1);
				});

				it(`should NOT return an error for a value of undefined when the type is ${data.nativeName} and isRequired=true and a default value is given`, () => {
					const item = {
						testKey: undefined
					};

					const schema = new Schema({
						testKey: {
							type: data.value,
							isRequired: true,
							default: data.true[0]
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});

				it(`should NOT return an error for a value that matches a ${data.nativeName} in a nested object`, () => {
					const item = {
						testKey: {
							testKey2: datum
						}
					};

					const schema = new Schema({
						testKey: {
							testKey2: data.value
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});

				it(`should return an error for a key with a ${data.nativeName} not in the schema`, () => {
					const item = {
						testKey: 'test string',
						testKey2: datum
					};

					const schema = new Schema({
						testKey: String
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 1);
					assert.equal(errors[0].error, 'Key found that isn\'t in the schema');
					assert.equal(errors[0].path, 'testKey2');
					assert.equal(errors[0].value, datum);
				});

				it(`should NOT return an error for a ${data.nativeName} in an array`, () => {
					const item = {
						testKey: [datum]
					};

					const schema = new Schema({
						testKey: []
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});

				it(`should NOT return an error for a key that matches a ${data.nativeName} in an object in an array`, () => {
					const item = {
						testKey: [{
							testKey2: datum
						}]
					};

					const schema = new Schema({
						testKey: [{
							testKey2: data.value
						}]
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});
			});

			data.false.forEach((datum) => {
				it(`should return an error for a value that doesn't match a ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};

					const schema = new Schema({
						testKey: data.value
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 1);
					assert.isTrue(errors[0].error.indexOf('Value should be a') !== -1);
					assert.equal(errors[0].path, 'testKey');
					assert.equal(errors[0].value, datum);
				});

				it(`should return an error for a value that doesn\'t match a ${data.nativeName} in a nested object`, () => {
					const item = {
						testKey: {
							testKey2: datum
						}
					};

					const schema = new Schema({
						testKey: {
							testKey2: data.value
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 1);
					assert.isTrue(errors[0].error.indexOf('Value should be a') !== -1);
					assert.equal(errors[0].path, 'testKey.testKey2');
					assert.equal(errors[0].value, datum);
				});

				it(`should return an error for a key that doesn\'t match a ${data.nativeName} in an object in an array`, () => {
					const item = {
						testKey: [{
							testKey2: datum
						}]
					};

					const schema = new Schema({
						testKey: [{
							testKey2: data.value
						}]
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 1);
				});
			});

			data.coerceTrue.forEach((datum) => {
				it(`should NOT return an error for a value that is coercable to ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};

					const schema = new Schema({
						testKey: {
							type: data.value,
							coerce: true
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 0);
				});
			});

			data.coerceFalse.forEach((datum) => {
				it(`should return an error for a value that is not coercable to ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};

					const schema = new Schema({
						testKey: {
							type: data.value,
							coerce: true
						}
					});

					const errors = schema.validate(item);

					assert.equal(errors.length, 1);
					assert.isTrue(errors[0].error.indexOf('Value should be a') !== -1);
					assert.equal(errors[0].path, 'testKey');
					assert.equal(errors[0].value, datum);
				});
			});
		});

		it('should NOT mutate the item being validated', () => {
			const item = {
				testKey: [],
				testKey2: 'something'
			};
			const clonedItem = clone(item);

			const schema = new Schema({
				testKey: [],
				testKey2: String
			});

			schema.validate(item);

			assert.deepEqual(item, clonedItem);
		});

		it('should NOT return an error for a key that matches an array', () => {
			const item = {
				testKey: [],
				testKey2: 'something'
			};

			const schema = new Schema({
				testKey: [],
				testKey2: String
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should NOT return an error for a key that matches null', () => {
			const item = {
				testKey: null
			};

			const schema = new Schema({
				testKey: null
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should NOT return an error for a key that matches String or null', () => {
			const item = {
				testKey: null
			};

			const schema = new Schema({
				testKey: [String, null]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for a key that doesn\'t match an array', () => {
			const item = {
				testKey: 'inValid'
			};

			const schema = new Schema({
				testKey: []
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 1);
		});

		it('should NOT return an error for a key that matches empty nested arrays', () => {
			const item = {
				testKey: [
					['test1', 'test2'],
					['test3', 'test4', 'test5']
				]
			};

			const schema = new Schema({
				testKey: [
					[]
				]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for a key that doesn\'t match empty nested arrays', () => {
			const item = {
				testKey: ['test1', 'test2']
			};

			const schema = new Schema({
				testKey: [
					[]
				]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 2);
		});

		it('should NOT return errors for multiple items in an array', () => {
			const item = {
				testKey: ['test1', 'test2', 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String]
				]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for a bad type amongst multiple items in an array', () => {
			const item = {
				testKey: ['test1', 3, 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String]
				]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 1);
		});

		it('should NOT return an error for a good value when multiple types are given', () => {
			const item = {
				testKey: ['test1', 3, 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String, Number]
				]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for a bad value when multiple types are given', () => {
			const item = {
				testKey: ['test1', 3, 'test3', true]
			};

			const schema = new Schema({
				testKey: [
					[String, Number]
				]
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 1);
		});

		it('should NOT return an error for a key that matches a nested array', () => {
			const item = {
				testKey: {
					testKey2: []
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should NOT return an error for objects in an empty array', () => {
			const item = {
				testKey: {
					testKey2: [{
						testKey3: 'test'
					}]
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should NOT return an error for an empty array', () => {
			const item = {
				testKey: {
					testKey2: []
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: [{
						testKey3: String
					}]
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for an empty array that should be an object', () => {
			const item = {
				testKey: []
			};

			const schema = new Schema({
				testKey: {
					testKey2: [{
						testKey3: String
					}]
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 1);
		});

		it('should NOT return an error for an empty array that can have strings', () => {
			const item = {
				testKey: []
			};

			const schema = new Schema({
				testKey: {
					type: Array,
					content: String
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for a key that doesn\'t match a nested array', () => {
			const item = {
				testKey: {
					testKey2: 'inValid'
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 1);
		});

		it('should NOT return an error for a key that matches a String in a nested array', () => {
			const item = {
				testKey: {
					testKey2: ['asdf']
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 0);
		});

		it('should return an error for a key that doesn\'t match a String in a nested array', () => {
			const item = {
				testKey: {
					testKey2: 'inValid'
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.validate(item);

			assert.equal(errors.length, 1);
		});

		describe('array length', () => {
			it('should NOT return an error for an array length greater than minLength', () => {
				const item = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						minLength: 2
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should return an error for an array length less than minLength', () => {
				const item = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						minLength: 3
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Array length is outside range');
			});

			it('should NOT return an error for an array length less than maxLength', () => {
				const item = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						maxLength: 2
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should return an error for an array length greater than maxLength', () => {
				const item = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						maxLength: 1
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Array length is outside range');
			});
		});

		describe('numeric', () => {
			it('should NOT return an error for an integer greater than min', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 10
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should NOT return an error for an integer less than max', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 20
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should return an error for an integer less than min', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 20
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value is outside range');
			});

			it('should return an error for an integer greater than max', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 10
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value is outside range');
			});

			it('should NOT return an error for a number greater than min', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 10
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should NOT return an error for a number less than max', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 20
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should return an error for a number less than min', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 20
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value is outside range');
			});

			it('should return an error for a number greater than max', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value is outside range');
			});

			it('should return an error for a non-number when a range is given', () => {
				const item = {
					testKey: 'test'
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value should be a Number');
			});
		});

		describe('enum', () => {
			const things = new Enum({
				thing1: 'thing 1',
				thing2: 'thing 2'
			});

			it('should throw an error if enum is not given', () => {
				assert.throws(() => {
					new Schema({
						testKey: {
							type: Enum
						}
					});
				}, 'Enum types must provide an enum');
			});

			it('should NOT return an error for a value that is in an enum', () => {
				const item = {
					testKey: 'thing 1'
				};

				const schema = new Schema({
					testKey: {
						type: Enum,
						enum: things
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});

			it('should return an error for a value that is not in an enum', () => {
				const item = {
					testKey: 'something'
				};

				const schema = new Schema({
					testKey: {
						type: Enum,
						enum: things
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value should be a Enum');
			});

			it('should return an error for a value that is not in an enum or a number', () => {
				const item = {
					testKey: 'something'
				};

				const schema = new Schema({
					testKey: {
						type: [Enum, Number],
						enum: things
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 1);
				assert.equal(errors[0].error, 'Value should be a Enum OR Value should be a Number');
			});

			it('should NOT return an error for a value that is in an enum or a number', () => {
				const item = {
					testKey: 10
				};

				const schema = new Schema({
					testKey: {
						type: [Enum, Number],
						enum: things
					}
				});

				const errors = schema.validate(item);

				assert.equal(errors.length, 0);
			});
		});
	});

	describe('.enforce', () => {
		schemaTestTypes.forEach((data) => {
			data.true.forEach((datum) => {
				it(`should NOT modify a value that matches a ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};
					const output = {
						testKey: datum
					};

					const schema = new Schema({
						testKey: data.value
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				it(`should NOT modify a value that matches a ${data.nativeName} and isRequired=true`, () => {
					const item = {
						testKey: datum
					};
					const output = clone(item);

					const schema = new Schema({
						testKey: {
							type: data.value,
							isRequired: true
						}
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				if (data.value !== 'any') {
					it(`should modify a value of undefined when the type is ${data.nativeName} and isRequired=true`, () => {
						const item = {
							testKey: undefined
						};
						const output = {
							testKey: null
						};

						const schema = new Schema({
							testKey: {
								type: data.value,
								isRequired: true
							}
						});

						assert.deepEqual(schema.enforce(item), output);
					});

					it(`should NOT modify a value of undefined when the type is ${data.nativeName} and isRequired=true and a default value is given`, () => {
						const item = {
							testKey: undefined
						};
						const output = {
							testKey: data.true[0]
						};

						const schema = new Schema({
							testKey: {
								type: data.value,
								isRequired: true,
								default: data.true[0]
							}
						});

						assert.deepEqual(schema.enforce(item), output);
					});
				}

				it(`should NOT modify a value that matches a ${data.nativeName} in a nested object`, () => {
					const item = {
						testKey: {
							testKey2: datum
						}
					};
					const output = {
						testKey: {
							testKey2: datum
						}
					};

					const schema = new Schema({
						testKey: {
							testKey2: data.value
						}
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				it(`should unset a key with a ${data.nativeName} not in the schema`, () => {
					const item = {
						testKey: 'test string',
						testKey2: datum
					};
					const output = {
						testKey: 'test string'
					};

					const schema = new Schema({
						testKey: String
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				it(`should NOT remove a ${data.nativeName} in an array`, () => {
					const item = {
						testKey: [datum]
					};
					const output = {
						testKey: [datum]
					};

					const schema = new Schema({
						testKey: []
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				it(`should NOT modify a value that matches a ${data.nativeName} in an object in an array`, () => {
					const item = {
						testKey: [{
							testKey2: datum
						}]
					};
					const output = {
						testKey: [{
							testKey2: datum
						}]
					};

					const schema = new Schema({
						testKey: [{
							testKey2: data.value
						}]
					});

					assert.deepEqual(schema.enforce(item), output);
				});
			});

			data.false.forEach((datum) => {
				it(`should modify a value that doesn't match a ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};
					const output = undefined;

					const schema = new Schema({
						testKey: data.value
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				it(`should modify a value that doesn\'t match a ${data.nativeName} in a nested object`, () => {
					const item = {
						testKey: {
							testKey2: datum
						}
					};
					const output = undefined;

					const schema = new Schema({
						testKey: {
							testKey2: data.value
						}
					});

					assert.deepEqual(schema.enforce(item), output);
				});

				it(`should modify a key that doesn\'t match a ${data.nativeName} in an object in an array`, () => {
					const item = {
						testKey: [{
							testKey2: datum
						}]
					};
					const output = undefined;

					const schema = new Schema({
						testKey: [{
							testKey2: data.value
						}]
					});

					assert.deepEqual(schema.enforce(item), output);
				});
			});

			data.coerceTrue.forEach((datum) => {
				it(`should NOT modify a value that is coercable to ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};
					const output = {
						testKey: data.enforce(datum, null, true)
					};

					const schema = new Schema({
						testKey: {
							type: data.value,
							coerce: true
						}
					});

					assert.deepEqual(schema.enforce(item), output);
				});
			});

			data.coerceFalse.forEach((datum) => {
				it(`should modify a value that is not coercable to ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};
					const output = undefined;

					const schema = new Schema({
						testKey: {
							type: data.value,
							coerce: true
						}
					});

					assert.deepEqual(schema.enforce(item), output);
				});
			});
		});

		it('should NOT modify a key that matches an array', () => {
			const item = {
				testKey: [],
				testKey2: 'something'
			};
			const output = {
				testKey2: 'something'
			};

			const schema = new Schema({
				testKey: [],
				testKey2: String
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify a key that matches null', () => {
			const item = {
				testKey: null
			};
			const output = {
				testKey: null
			};

			const schema = new Schema({
				testKey: null
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify a key that matches String or null', () => {
			const item = {
				testKey: null
			};
			const output = {
				testKey: null
			};

			const schema = new Schema({
				testKey: [String, null]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify a key that doesn\'t match an array', () => {
			const item = {
				testKey: 'inValid'
			};
			const output = undefined;

			const schema = new Schema({
				testKey: []
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify a key that matches empty nested arrays', () => {
			const item = {
				testKey: [
					['test1', 'test2'],
					['test3', 'test4', 'test5']
				]
			};
			const output = {
				testKey: [
					['test1', 'test2'],
					['test3', 'test4', 'test5']
				]
			};

			const schema = new Schema({
				testKey: [
					[]
				]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify a key that doesn\'t match empty nested arrays', () => {
			const item = {
				testKey: ['test1', 'test2']
			};
			const output = undefined;

			const schema = new Schema({
				testKey: [
					[]
				]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT return errors for multiple items in an array', () => {
			const item = {
				testKey: ['test1', 'test2', 'test3']
			};
			const output = {
				testKey: ['test1', 'test2', 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String]
				]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify a bad type amongst multiple items in an array', () => {
			const item = {
				testKey: ['test1', 3, 'test3']
			};
			const output = {
				testKey: ['test1', 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String]
				]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify a good value when multiple types are given', () => {
			const item = {
				testKey: ['test1', 3, 'test3']
			};
			const output = {
				testKey: ['test1', 3, 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String, Number]
				]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify a bad value when multiple types are given', () => {
			const item = {
				testKey: ['test1', 3, 'test3', true]
			};
			const output = {
				testKey: ['test1', 3, 'test3']
			};

			const schema = new Schema({
				testKey: [
					[String, Number]
				]
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify a key that matches a nested array', () => {
			const item = {
				testKey: {
					testKey2: ['test']
				}
			};
			const output = {
				testKey: {
					testKey2: ['test']
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify objects in an empty array', () => {
			const item = {
				testKey: {
					testKey2: [{
						testKey3: 'test'
					}]
				}
			};
			const output = {
				testKey: {
					testKey2: [{
						testKey3: 'test'
					}]
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should remove an empty array', () => {
			const item = {
				testKey: {
					testKey2: []
				}
			};
			const output = undefined;

			const schema = new Schema({
				testKey: {
					testKey2: [{
						testKey3: String
					}]
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify an empty array that should be an object', () => {
			const item = {
				testKey: []
			};
			const output = undefined;

			const schema = new Schema({
				testKey: {
					testKey2: [{
						testKey3: String
					}]
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify an empty array that can have strings if isRequired=true', () => {
			const item = {
				testKey: []
			};
			const output = {
				testKey: []
			};

			const schema = new Schema({
				testKey: {
					type: Array,
					isRequired: true,
					content: String
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify a key that doesn\'t match a nested array', () => {
			const item = {
				testKey: {
					testKey2: 'inValid'
				}
			};
			const output = undefined;

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should NOT modify a key that matches a String in a nested array', () => {
			const item = {
				testKey: {
					testKey2: ['asdf']
				}
			};
			const output = {
				testKey: {
					testKey2: ['asdf']
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		it('should modify a key that doesn\'t match a String in a nested array', () => {
			const item = {
				testKey: {
					testKey2: 'inValid'
				}
			};
			const output = undefined;

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			assert.deepEqual(schema.enforce(item), output);
		});

		describe('array length', () => {
			it('should NOT modify an array length greater than minLength', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						minLength: 2
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify an array length less than minLength', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {
					testKey: []
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						minLength: 3,
						isRequired: true
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should NOT modify an array length less than maxLength', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						maxLength: 2
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify an array length greater than maxLength', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {
					testKey: ['test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						maxLength: 1
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});
		});

		describe('numeric', () => {
			it('should NOT modify an integer greater than min', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 10
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should NOT modify an integer less than max', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 20
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify an integer less than min', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 20
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 20
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify an integer greater than max', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 10
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 10
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should NOT modify a number greater than min', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 10
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should NOT modify a number less than max', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 20
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify a number less than min', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 20
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 20
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify a number greater than max', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 10
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify a non-number when a range is given', () => {
				const item = {
					testKey: 'test'
				};
				const output = undefined;

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});
		});

		describe('enum', () => {
			const things = new Enum({
				thing1: 'thing 1',
				thing2: 'thing 2'
			});

			it('should NOT modify a value that is in an enum', () => {
				const item = {
					testKey: 'thing 1'
				};
				const output = {
					testKey: 'thing 1'
				};

				const schema = new Schema({
					testKey: {
						type: Enum,
						enum: things
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify a value that is not in an enum', () => {
				const item = {
					testKey: 'something'
				};
				const output = undefined;

				const schema = new Schema({
					testKey: {
						type: Enum,
						enum: things
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should modify a value that is not in an enum or a number', () => {
				const item = {
					testKey: 'something'
				};
				const output = undefined;

				const schema = new Schema({
					testKey: {
						type: [Enum, Number],
						enum: things
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});

			it('should NOT modify a value that is in an enum or a number', () => {
				const item = {
					testKey: 10
				};
				const output = {
					testKey: 10
				};

				const schema = new Schema({
					testKey: {
						type: [Enum, Number],
						enum: things
					}
				});

				assert.deepEqual(schema.enforce(item), output);
			});
		});
	});
});

