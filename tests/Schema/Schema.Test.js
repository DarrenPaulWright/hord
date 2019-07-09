import { assert } from 'chai';
import { clone, deepEqual } from 'object-agent';
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

					assert.deepEqual(errors, [{
						error: 'A value is required',
						path: 'testKey',
						value: undefined,
						item: item
					}]);
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

					assert.deepEqual(errors, [{
						error: 'Key found that isn\'t in the schema',
						path: 'testKey2',
						value: datum,
						item: item
					}]);
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

					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey',
						value: datum,
						item: item
					}]);
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

					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey.testKey2',
						value: datum,
						item: item
					}]);
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

					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey.0.testKey2',
						value: datum,
						item: item
					}]);
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

					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey',
						value: datum,
						item: item
					}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey',
				value: 'inValid',
				item: item
			}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey.0',
				value: 'test1',
				item: item
			}, {
				error: 'Value should be a Array',
				path: 'testKey.1',
				value: 'test2',
				item: item
			}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a String',
				path: 'testKey.1',
				value: 3,
				item: item
			}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a String OR Value should be a Number',
				path: 'testKey.3',
				value: true,
				item: item
			}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a Object',
				path: 'testKey',
				value: [],
				item: item
			}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey.testKey2',
				value: 'inValid',
				item: item
			}]);
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

			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey.testKey2',
				value: 'inValid',
				item: item
			}]);
		});

		it('should validate a specific path', () => {
			const item = {
				testKey: {
					testKey2: 'valid',
					testKey3: 10
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: String,
					testKey3: String
				}
			});

			let errors = schema.validate(item, 'testKey.testKey2');

			assert.deepEqual(errors, []);

			errors = schema.validate(item, 'testKey.testKey3');

			assert.deepEqual(errors, [{
				error: 'Value should be a String',
				path: 'testKey.testKey3',
				value: 10,
				item: item
			}]);
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

				assert.deepEqual(errors, [{
					error: 'Length is outside range',
					path: 'testKey',
					value: ['test', 'test'],
					item: item
				}]);
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

				assert.deepEqual(errors, [{
					error: 'Length is outside range',
					path: 'testKey',
					value: ['test', 'test'],
					item: item
				}]);
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

				assert.deepEqual(errors, []);
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

				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should NOT return an error for an integer less than min if clamp===true', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 20,
						clamp: true
					}
				});

				const errors = schema.validate(item);

				assert.deepEqual(errors, []);
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

				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should NOT return an error for an integer greater than max if clamp===true', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 10,
						clamp: true
					}
				});

				const errors = schema.validate(item);

				assert.deepEqual(errors, []);
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

				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should NOT return an error for a number less than min if clamp===true', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 20,
						clamp: true
					}
				});

				const errors = schema.validate(item);

				assert.deepEqual(errors, []);
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

				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should NOT return an error for a number greater than max if clamp===true', () => {
				const item = {
					testKey: 12
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10,
						clamp: true
					}
				});

				const errors = schema.validate(item);

				assert.deepEqual(errors, []);
			});

			it('should  NOT return an error for a string that can be coerced into a number within a range', () => {
				const item = {
					testKey: '8'
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 0,
						max: 10,
						coerce: true
					}
				});

				const errors = schema.validate(item);

				assert.deepEqual(errors, []);
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

				assert.deepEqual(errors, [{
					error: 'Value should be a Number',
					path: 'testKey',
					value: 'test',
					item: item
				}]);
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

				assert.deepEqual(errors, [{
					error: 'Value should be a Enum',
					path: 'testKey',
					value: 'something',
					item: item
				}]);
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

				assert.deepEqual(errors, [{
					error: 'Value should be a Enum OR Value should be a Number',
					path: 'testKey',
					value: 'something',
					item: item
				}]);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.equal(errors.length, 0);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.equal(errors.length, 0);
				});

				if (data.value !== '*') {
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

						const errors = schema.enforce(item);

						assert.deepEqual(item, output);
						assert.deepEqual(errors, [{
							error: 'A value is required',
							path: 'testKey',
							value: undefined,
							item: item
						}]);
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

						const errors = schema.enforce(item);

						assert.deepEqual(item, output);
						assert.equal(errors.length, 0);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.equal(errors.length, 0);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.deepEqual(errors, [{
						error: 'Key found that isn\'t in the schema',
						path: 'testKey2',
						value: undefined,
						item: item
					}]);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.equal(errors.length, 0);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.equal(errors.length, 0);
				});
			});

			data.false.forEach((datum) => {
				it(`should modify a value that doesn't match a ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};
					const output = {};

					const schema = new Schema({
						testKey: data.value
					});

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey',
						value: datum,
						item: item
					}]);
				});

				it(`should modify a value that doesn\'t match a ${data.nativeName} in a nested object`, () => {
					const item = {
						testKey: {
							testKey2: datum
						}
					};
					const output = {};

					const schema = new Schema({
						testKey: {
							testKey2: data.value
						}
					});

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey.testKey2',
						value: datum,
						item: item
					}]);
				});

				it(`should modify a key that doesn\'t match a ${data.nativeName} in an object in an array`, () => {
					const item = {
						testKey: [{
							testKey2: datum
						}]
					};
					const output = {};

					const schema = new Schema({
						testKey: [{
							testKey2: data.value
						}]
					});

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey.0.testKey2',
						value: datum,
						item: item
					}]);
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

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.equal(errors.length, 0);
				});
			});

			data.coerceFalse.forEach((datum) => {
				it(`should modify a value that is not coercable to ${data.nativeName}`, () => {
					const item = {
						testKey: datum
					};
					const output = {};

					const schema = new Schema({
						testKey: {
							type: data.value,
							coerce: true
						}
					});

					const errors = schema.enforce(item);

					assert.deepEqual(item, output);
					assert.deepEqual(errors, [{
						error: 'Value should be a ' + data.nativeName,
						path: 'testKey',
						value: datum,
						item: item
					}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should modify a key that doesn\'t match an array', () => {
			const item = {
				testKey: 'inValid'
			};
			const output = {};

			const schema = new Schema({
				testKey: []
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey',
				value: 'inValid',
				item: item
			}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should modify a key that doesn\'t match empty nested arrays', () => {
			const item = {
				testKey: ['test1', 'test2']
			};
			const output = {};

			const schema = new Schema({
				testKey: [
					[]
				]
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey.0',
				value: 'test1',
				item: item
			}, {
				error: 'Value should be a Array',
				path: 'testKey.1',
				value: 'test2',
				item: item
			}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a String',
				path: 'testKey.1',
				value: 3,
				item: item
			}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a String OR Value should be a Number',
				path: 'testKey.3',
				value: true,
				item: item
			}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should remove an empty array', () => {
			const item = {
				testKey: {
					testKey2: []
				}
			};
			const output = {};

			const schema = new Schema({
				testKey: {
					testKey2: [{
						testKey3: String
					}]
				}
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should modify an empty array that should be an object', () => {
			const item = {
				testKey: []
			};
			const output = {};

			const schema = new Schema({
				testKey: {
					testKey2: [{
						testKey3: String
					}]
				}
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a Object',
				path: 'testKey',
				value: [],
				item: item
			}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should modify an empty object if isRequired=false', () => {
			const item = {
				testKey: {}
			};
			const output = {};

			const schema = new Schema({
				testKey: {
					type: Object,
					content: String
				}
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should NOT modify an empty object if isRequired=true', () => {
			const item = {
				testKey: {}
			};
			const output = {
				testKey: {}
			};

			const schema = new Schema({
				testKey: {
					type: Object,
					isRequired: true,
					content: String
				}
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should set a value to a previous value if isRequired=true', () => {
			const item = {
				testKey: 10
			};
			const output = {
				testKey: 'previous'
			};

			const schema = new Schema({
				testKey: {
					type: String,
					isRequired: true
				}
			});

			const errors = schema.enforce(item, 'testKey', 'previous');

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a String',
				path: 'testKey',
				value: 10,
				item: item
			}]);
		});

		it('should modify a key that doesn\'t match a nested array', () => {
			const item = {
				testKey: {
					testKey2: 'inValid'
				}
			};
			const output = {};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey.testKey2',
				value: 'inValid',
				item: item
			}]);
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

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.equal(errors.length, 0);
		});

		it('should modify a key that doesn\'t match a String in a nested array', () => {
			const item = {
				testKey: {
					testKey2: 'inValid'
				}
			};
			const output = {};

			const schema = new Schema({
				testKey: {
					testKey2: []
				}
			});

			const errors = schema.enforce(item);

			assert.deepEqual(item, output);
			assert.deepEqual(errors, [{
				error: 'Value should be a Array',
				path: 'testKey.testKey2',
				value: 'inValid',
				item: item
			}]);
		});

		it('should enforce a specific path', () => {
			const item = {
				testKey: {
					testKey2: 'valid',
					testKey3: 10
				}
			};

			const schema = new Schema({
				testKey: {
					testKey2: String,
					testKey3: String
				}
			});

			let errors = schema.enforce(item, 'testKey.testKey2');

			assert.deepEqual(errors, []);

			errors = schema.enforce(item, 'testKey.testKey3');

			assert.deepEqual(errors, [{
				error: 'Value should be a String',
				path: 'testKey.testKey3',
				value: 10,
				item: item
			}]);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should delete an array if length is less than minLength', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: Array,
						minLength: 3,
						isRequired: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Length is outside range',
					path: 'testKey',
					value: ['test', 'test'],
					item: item
				}]);
			});

			it('should modify an array length less than minLength if clamp: true', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {
					testKey: ['test', 'test', undefined]
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						minLength: 3,
						isRequired: true,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should delete an array if length greater than maxLength', () => {
				const item = {
					testKey: ['test', 'test']
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: Array,
						maxLength: 1
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Length is outside range',
					path: 'testKey',
					value: ['test', 'test'],
					item: item
				}]);
			});

			it('should modify an array length greater than maxLength if clamp: true', () => {
				const item = {
					testKey: ['test', 'test', 'test']
				};
				const output = {
					testKey: ['test', 'test']
				};

				const schema = new Schema({
					testKey: {
						type: Array,
						maxLength: 2,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});
		});

		describe('string length', () => {
			it('should NOT modify a string length greater than minLength', () => {
				const item = {
					testKey: 'test'
				};
				const output = {
					testKey: 'test'
				};

				const schema = new Schema({
					testKey: {
						type: String,
						minLength: 2
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should delete a string if length is less than minLength', () => {
				const item = {
					testKey: 'test'
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: String,
						minLength: 5,
						isRequired: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Length is outside range',
					path: 'testKey',
					value: 'test',
					item: item
				}]);
			});

			it('should modify a string length less than minLength if clamp: true', () => {
				const item = {
					testKey: 'test'
				};
				const output = {
					testKey: 'test'
				};

				const schema = new Schema({
					testKey: {
						type: String,
						minLength: 3,
						isRequired: true,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});

			it('should NOT modify a string length less than maxLength', () => {
				const item = {
					testKey: 'test'
				};
				const output = {
					testKey: 'test'
				};

				const schema = new Schema({
					testKey: {
						type: String,
						maxLength: 6
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should delete a string if length greater than maxLength', () => {
				const item = {
					testKey: 'test'
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: String,
						maxLength: 1
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Length is outside range',
					path: 'testKey',
					value: 'test',
					item: item
				}]);
			});

			it('should modify a string length greater than maxLength if clamp: true', () => {
				const item = {
					testKey: 'test'
				};
				const output = {
					testKey: 'te'
				};

				const schema = new Schema({
					testKey: {
						type: String,
						maxLength: 2,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should modify an integer less than min if clamp:true', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 20
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 20,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});

			it('should remove an integer less than min', () => {
				const item = {
					testKey: 12
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						min: 20
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should modify an integer greater than max if clamp:true', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 10
				};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 10,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});

			it('should remove an integer greater than max', () => {
				const item = {
					testKey: 12
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: 'integer',
						max: 10
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should modify a number less than min if clamp:true', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 20
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 20,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});

			it('should remove a number less than min', () => {
				const item = {
					testKey: 12
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 20
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should modify a number greater than max if clamp:true', () => {
				const item = {
					testKey: 12
				};
				const output = {
					testKey: 10
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10,
						clamp: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});

			it('should remove a number greater than max', () => {
				const item = {
					testKey: 12
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value is outside range',
					path: 'testKey',
					value: 12,
					item: item
				}]);
			});

			it('should coerce a number within a range', () => {
				const item = {
					testKey: '8'
				};
				const output = {
					testKey: 8
				};

				const schema = new Schema({
					testKey: {
						type: Number,
						min: 0,
						max: 10,
						coerce: true
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, []);
			});

			it('should modify a non-number when a range is given', () => {
				const item = {
					testKey: 'test'
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: Number,
						max: 10
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value should be a Number',
					path: 'testKey',
					value: 'test',
					item: item
				}]);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});

			it('should modify a value that is not in an enum', () => {
				const item = {
					testKey: 'something'
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: Enum,
						enum: things
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value should be a Enum',
					path: 'testKey',
					value: 'something',
					item: item
				}]);
			});

			it('should modify a value that is not in an enum or a number', () => {
				const item = {
					testKey: 'something'
				};
				const output = {};

				const schema = new Schema({
					testKey: {
						type: [Enum, Number],
						enum: things
					}
				});

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.deepEqual(errors, [{
					error: 'Value should be a Enum OR Value should be a Number',
					path: 'testKey',
					value: 'something',
					item: item
				}]);
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

				const errors = schema.enforce(item);

				assert.deepEqual(item, output);
				assert.equal(errors.length, 0);
			});
		});
	});

	describe('.eachRule', () => {
		it('should call the callback for every rule', () => {
			let total = 0;
			let testVar = 0;

			const schema = new Schema({
				testKey: [{
					level2: Number
				}],
				testKey2: String
			});

			schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule) {
					testVar++;
				}
			});

			assert.equal(total, 5);
			assert.equal(testVar, 5);
		});

		it('should stop calling the callback after true is returned', () => {
			let total = 0;
			let testVar = 0;

			const schema = new Schema({
				testKey: [{
					level2: Number
				}],
				testKey2: String
			});

			schema.eachRule((path, rule) => {
				total++;
				if (deepEqual(path, '') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey.0') && rule) {
					testVar++;
					return true;
				}
				if (deepEqual(path, 'testKey.0.level2') && rule) {
					testVar++;
				}
				if (deepEqual(path, 'testKey2') && rule) {
					testVar++;
				}
			});

			assert.equal(total, 4);
			assert.equal(testVar, 4);
		});
	});

	describe('.extend', () => {
		it('should accept undefined', () => {
			let total = 0;
			let testVar = 0;

			const schema = new Schema({
				testKey: [{
					level2: Number
				}],
				testKey2: String,
				testKey3: Date
			});

			const result = schema.extend();

			schema.eachRule((path, rule) => {
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

			result.eachRule((path, rule) => {
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
			assert.notEqual(schema, result);
		});

		it('should accept an object', () => {
			let total = 0;
			let testVar = 0;

			const schema = new Schema({
				testKey: [{
					level2: Number
				}],
				testKey2: String,
				testKey3: Date
			});

			const result = schema.extend({
				testKey: [{
					level2: 'integer'
				}],
				testKey2: Number
			});

			schema.eachRule((path, rule) => {
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

			result.eachRule((path, rule) => {
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

			const schema = new Schema({
				testKey: [{
					level2: Number
				}],
				testKey2: String,
				testKey3: Date
			});
			const schema2 = new Schema({
				testKey: [{
					level2: 'integer'
				}],
				testKey2: Number
			});

			const result = schema.extend(schema2);

			schema.eachRule((path, rule) => {
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

			schema2.eachRule((path, rule) => {
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

			result.eachRule((path, rule) => {
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

