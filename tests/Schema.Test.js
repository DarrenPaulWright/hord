import { assert } from 'chai';
import { clone, deepEqual } from 'object-agent';
import {
	enforceArray,
	enforceBoolean,
	enforceObject,
	enforceString,
	Enum,
	isArray,
	isBoolean,
	isObject,
	isString
} from 'type-enforcer';
import { Schema } from '../src/index';
import { checkSchemaType, findRule, parseSchema, traverseSchema } from '../src/Schema';
import { checkNumericRange, enforceSame, isAnything, isSame } from '../src/schemaTypeRules';
import { multiTest } from './TestUtil';
import { schemaTestTypes } from './testValues';

const testEnforce = () => {
};

describe('Schema', () => {
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

	describe('findRule', () => {
		const schema = {
			key: '',
			content: [{
				key: 'test1'
			}, {
				key: 'test2',
				content: [{
					key: 0,
					content: [{
						key: 'test3'
					}, {
						key: 'test4'
					}]
				}]
			}]
		};

		it('should return the full schema if an empty array is given', () => {
			assert.deepEqual(findRule([], schema), schema);
		});

		it('should return first level keys', () => {
			assert.deepEqual(findRule(['test2'], schema), {
				key: 'test2',
				content: [{
					key: 0,
					content: [{
						key: 'test3'
					}, {
						key: 'test4'
					}]
				}]
			});
		});

		it('should return arrays', () => {
			assert.deepEqual(findRule(['test2', 0], schema), {
				key: 0,
				content: [{
					key: 'test3'
				}, {
					key: 'test4'
				}]
			});
		});

		it('should return items in arrays', () => {
			assert.deepEqual(findRule(['test2', 0, 'test4'], schema), {
				key: 'test4'
			});
		});
	});

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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['test'])) {
					testVar++;
				}
				if (deepEqual(path, ['test', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
		});

		it('should call the callback once for an array of multiple types', () => {
			let total = 0;
			let testVar = 0;
			const testSchema = {
				test: [String, Boolean]
			};

			traverseSchema(testSchema, (path, value) => {
				total++;
				if (deepEqual(path, ['test']) && value[0] === String) {
					testVar++;
				}
			});

			assert.equal(total, 2);
			assert.equal(testVar, 1);
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
				if (deepEqual(path, ['test']) && isObject(value)) {
					testVar++;
				}
			});

			assert.equal(total, 2);
			assert.equal(testVar, 1);
		});

		it('should call the callback for an object with key "type"', () => {
			let total = 0;
			let testVar = 0;
			const testSchema = {
				test: {}
			};

			traverseSchema(testSchema, (path, value) => {
				total++;
				if (deepEqual(path, ['test']) && value === Object) {
					testVar++;
				}
			});

			assert.equal(total, 2);
			assert.equal(testVar, 1);
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
				if (deepEqual(path, ['test']) && value === testTypeObject) {
					testVar++;
				}
			});

			assert.equal(testVar, 1);
		});

		it('should call the callback for an object with key "enforce"', () => {
			let total = 0;
			let testVar = 0;
			const testTypeObject = {
				enforce: () => {
				}
			};
			const testSchema = {
				test: testTypeObject
			};

			traverseSchema(testSchema, (path, value) => {
				total++;
				if (deepEqual(path, ['test']) && value === testTypeObject) {
					testVar++;
				}
			});

			assert.equal(total, 2);
			assert.equal(testVar, 1);
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
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
			});

			assert.equal(total, 2);
			assert.equal(testVar, 1);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0, 'level2'])) {
					testVar++;
				}
			});

			assert.equal(total, 4);
			assert.equal(testVar, 4);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, [])) {
					testVar++;
				}
				if (deepEqual(path, ['level1'])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0])) {
					testVar++;
				}
				else if (deepEqual(path, ['level1', 0, 'level2'])) {
					testVar++;
				}
			});

			assert.equal(total, 4);
			assert.equal(testVar, 4);
		});

		multiTest({
			values: schemaTestTypes.filter((item) => {
				return item.name !== 'array';
			}),
			message: (input) => `should call the callback with ${input.name || input}`,
			test: (type) => {
				let testVar = 0;
				const testSchema = {
					test: {
						type: type
					}
				};

				traverseSchema(testSchema, (path, value) => {
					if (deepEqual(path, ['test']) && value.type === type) {
						testVar++;
					}
				});

				return testVar;
			},
			inputKey: 'value',
			output: 1,
			assertion: 'deepEqual'
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
				if (deepEqual(path, ['test']) && value === Array) {
					testVar++;
				}
				else if (deepEqual(path, ['test', 0]) && value === Array) {
					testVar++;
				}
			});

			assert.equal(total, 3);
			assert.equal(testVar, 2);
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
				if (deepEqual(path, ['test'])) {
					testVar++;
				}
				else if (deepEqual(path, ['test', 0])) {
					testVar++;
				}
				else if (deepEqual(path, ['test', 0, 0])) {
					testVar++;
				}
			});

			assert.equal(total, 4);
			assert.equal(testVar, 3);
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
				if (deepEqual(path, ['test']) && value === Array) {
					testVar++;
				}
				else if (deepEqual(path, ['test', 0]) && value === Object) {
					testVar++;
				}
				else if (deepEqual(path, ['test', 0, 'level2']) && value === String) {
					testVar++;
				}
			});

			assert.equal(total, 4);
			assert.equal(testVar, 3);
		});
	});

	describe('parseSchema', () => {
		it('should throw an error if an empty object is provided', () => {
			assert.throws(() => {
				parseSchema({});
			}, 'Schema must contain a value');
		});

		describe('(first level key)', () => {
			describe('(simple definitions)', () => {
				it('should return a map for an array literal', () => {
					const schema = {
						level1: []
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an Array', () => {
					const schema = {
						level1: Array
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an object literal', () => {
					const schema = {
						level1: {}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							keys: [],
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
								type: Object
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an Object', () => {
					const schema = {
						level1: Object
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
								type: Object
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null', () => {
					const schema = {
						level1: null
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'null',
								check: isSame,
								enforce: enforceSame,
								type: null
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null in an array', () => {
					const schema = {
						level1: [null]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								check: isSame,
								enforce: enforceSame,
								name: 'null',
								type: null
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null and a type in an array', () => {
					const schema = {
						level1: [String, null]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'String',
								check: isString,
								enforce: enforceString,
								type: String
							}, {
								check: isSame,
								enforce: enforceSame,
								name: 'null',
								type: null
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for two types in an array', () => {
					const schema = {
						level1: [String, Boolean]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'String',
								check: isString,
								enforce: enforceString,
								type: String
							}, {
								name: 'Boolean',
								check: isBoolean,
								enforce: enforceBoolean,
								type: Boolean
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: type.value
							},
							output: {
								keys: ['level1'],
								types: [{
									name: 'Object',
									check: isObject,
									enforce: enforceObject,
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: type.nativeName,
										check: type.check,
										enforce: type.enforce,
										type: type.value
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for ${input.level1.name || input.level1}`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});
			});

			describe('(object definitions)', () => {
				it('should return a map for an array as an object', () => {
					const schema = {
						level1: {
							type: Array
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null', () => {
					const schema = {
						level1: {
							type: null
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'null',
								check: isSame,
								enforce: enforceSame,
								type: null
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null in an array', () => {
					const schema = {
						level1: {
							type: [null]
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								check: isSame,
								enforce: enforceSame,
								name: 'null',
								type: null
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null and a type in an array', () => {
					const schema = {
						level1: {
							type: [String, null]
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'String',
								check: isString,
								enforce: enforceString,
								type: String
							}, {
								check: isSame,
								enforce: enforceSame,
								name: 'null',
								type: null
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for two types in an array', () => {
					const schema = {
						level1: {
							type: [String, Boolean]
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'String',
								check: isString,
								enforce: enforceString,
								type: String
							}, {
								name: 'Boolean',
								check: isBoolean,
								enforce: enforceBoolean,
								type: Boolean
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: {
									type: type.value
								}
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: type.nativeName,
										check: type.check,
										enforce: type.enforce,
										type: type.value
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for ${input.level1.type.name || input.level1.type} as an object with type`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						if (type.value === 'integer' || type.value === Number) {
							return {
								input: {
									level1: {
										type: type.value,
										isRequired: true,
										min: 0,
										max: 10
									}
								},
								output: {
									types: [{
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level1'],
									content: [{
										key: 'level1',
										isRequired: true,
										types: [{
											name: type.nativeName,
											check: type.check,
											numericRange: checkNumericRange,
											enforce: type.enforce,
											type: type.value,
											min: 0,
											max: 10
										}]
									}]
								}
							};
						}
						else {
							return {
								input: {
									level1: {
										type: type.value,
										isRequired: true,
										min: 0,
										max: 10
									}
								},
								output: {
									keys: ['level1'],
									types: [{
										check: isObject,
										enforce: enforceObject,
										name: 'Object',
										type: Object
									}],
									content: [{
										key: 'level1',
										isRequired: true,
										types: [{
											name: type.nativeName,
											check: type.check,
											enforce: type.enforce,
											type: type.value,
											min: 0,
											max: 10
										}]
									}]
								}
							};
						}
					}),
					message: (input) => `should return a map for ${input.level1.type.name || input.level1.type} as an object with type and other keys`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});

				describe('overrides', () => {
					it('should return a map for enforce as an object with enforce and type "any"', () => {
						const schema = {
							level1: {
								enforce: testEnforce
							}
						};
						const output = {
							keys: ['level1'],
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
								type: Object
							}],
							content: [{
								key: 'level1',
								types: [{
									name: 'Anything',
									check: isAnything,
									enforce: testEnforce,
									type: 'any'
								}]
							}]
						};

						assert.deepEqual(parseSchema(schema), output);
					});
				});
			});

			it('should return a map for an array of types', () => {
				const schema = {
					level1: {
						type: [String, Boolean]
					}
				};
				const output = {
					keys: ['level1'],
					types: [{
						check: isObject,
						enforce: enforceObject,
						name: 'Object',
						type: Object
					}],
					content: [{
						key: 'level1',
						types: [{
							name: 'String',
							check: isString,
							type: String,
							enforce: enforceString
						}, {
							name: 'Boolean',
							check: isBoolean,
							type: Boolean,
							enforce: enforceBoolean
						}]
					}]
				};

				assert.deepEqual(parseSchema(schema), output);
			});
		});

		describe('(inside an array literal)', () => {
			describe('(simple definitions)', () => {
				it('should return a map for nested array literals', () => {
					const schema = {
						level1: [[]]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'Array',
									check: isArray,
									enforce: enforceArray,
									type: Array
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an Array in an array literal', () => {
					const schema = {
						level1: [Array]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an empty object in an array', () => {
					const schema = {
						level1: [{}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								keys: [],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an Object in an array', () => {
					const schema = {
						level1: [Object]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
								type: Object
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null in two array literals', () => {
					const schema = {
						level1: [[null]]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null and a type in two array literals', () => {
					const schema = {
						level1: [[String, null]]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for two types in an array', () => {
					const schema = {
						level1: [[String, Boolean]]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									name: 'Boolean',
									check: isBoolean,
									enforce: enforceBoolean,
									type: Boolean
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: [{
									level2: type.value
								}]
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: 'Array',
										check: isArray,
										enforce: enforceArray,
										type: Array
									}],
									content: [{
										key: 0,
										keys: ['level2'],
										types: [{
											name: 'Object',
											check: isObject,
											enforce: enforceObject,
											type: Object
										}],
										content: [{
											key: 'level2',
											types: [{
												name: type.nativeName,
												check: type.check,
												enforce: type.enforce,
												type: type.value
											}]
										}]
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for a ${input.level1[0].level2.name || input.level1[0].level2} in an array`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});
			});

			describe('object definitions', () => {
				it('should return a map for null', () => {
					const schema = {
						level1: [{
							type: null
						}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'null',
									check: isSame,
									enforce: enforceSame,
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null in an array', () => {
					const schema = {
						level1: [{
							type: [null]
						}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null and a type in an array', () => {
					const schema = {
						level1: [{
							type: [String, null]
						}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for two types in an array', () => {
					const schema = {
						level1: [{
							type: [String, Boolean]
						}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									name: 'Boolean',
									check: isBoolean,
									enforce: enforceBoolean,
									type: Boolean
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: [{
									level2: {
										type: type.value
									}
								}]
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: 'Array',
										check: isArray,
										enforce: enforceArray,
										type: Array
									}],
									content: [{
										key: 0,
										keys: ['level2'],
										types: [{
											name: 'Object',
											check: isObject,
											enforce: enforceObject,
											type: Object
										}],
										content: [{
											key: 'level2',
											types: [{
												name: type.nativeName,
												check: type.check,
												enforce: type.enforce,
												type: type.value
											}]
										}]
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for a ${input.level1[0].level2.type.name || input.level1[0].level2.type} in an array as an object with type`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: [{
									level2: {
										type: type.value,
										isRequired: true
									}
								}]
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: 'Array',
										check: isArray,
										enforce: enforceArray,
										type: Array
									}],
									content: [{
										key: 0,
										keys: ['level2'],
										types: [{
											name: 'Object',
											check: isObject,
											enforce: enforceObject,
											type: Object
										}],
										content: [{
											key: 'level2',
											types: [{
												name: type.nativeName,
												check: type.check,
												enforce: type.enforce,
												type: type.value
											}],
											isRequired: true
										}]
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for a ${input.level1[0].level2.type.name || input.level1[0].level2.type} in an array as an object with type and other keys`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});

				describe('overrides', () => {
					it('should return a map for enforce in an array as an object with enforce and type "any"', () => {
						const schema = {
							level1: [{
								level2: {
									enforce: testEnforce
								}
							}]
						};
						const output = {
							keys: ['level1'],
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
								type: Object
							}],
							content: [{
								key: 'level1',
								types: [{
									name: 'Array',
									check: isArray,
									enforce: enforceArray,
									type: Array
								}],
								content: [{
									key: 0,
									keys: ['level2'],
									types: [{
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									content: [{
										key: 'level2',
										types: [{
											name: 'Anything',
											check: isAnything,
											type: 'any',
											enforce: testEnforce
										}]
									}]
								}]
							}]
						};

						assert.deepEqual(parseSchema(schema), output);
					});
				});
			});

			it('should only process maps for the first item in an array', () => {
				const schema = {
					level1: [{
						level2: {
							enforce: testEnforce
						}
					}, {
						level2: {
							enforce: testEnforce
						}
					}]
				};
				const output = {
					keys: ['level1'],
					types: [{
						name: 'Object',
						check: isObject,
						enforce: enforceObject,
						type: Object
					}],
					content: [{
						key: 'level1',
						types: [{
							name: 'Array',
							check: isArray,
							enforce: enforceArray,
							type: Array
						}],
						content: [{
							key: 0,
							keys: ['level2'],
							types: [{
								name: 'Object',
								check: isObject,
								enforce: enforceObject,
								type: Object
							}],
							content: [{
								key: 'level2',
								types: [{
									name: 'Anything',
									check: isAnything,
									type: 'any',
									enforce: testEnforce
								}]
							}]
						}]
					}]
				};

				assert.deepEqual(parseSchema(schema), output);
			});
		});

		describe('inside an array type definition', () => {
			describe('simple definitions', () => {
				it('should return a map for nested array literals', () => {
					const schema = {
						level1: {
							type: Array,
							content: []
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'Array',
									check: isArray,
									enforce: enforceArray,
									type: Array
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an Array in an array literal', () => {
					const schema = {
						level1: {
							type: Array,
							content: Array
						}
					};
					const output = {
						types: [{
							name: 'Object',
							check: isObject,
							enforce: enforceObject,
							type: Object
						}],
						keys: ['level1'],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'Array',
									check: isArray,
									enforce: enforceArray,
									type: Array
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an empty object in an array', () => {
					const schema = {
						level1: {
							type: Array,
							content: {}
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								keys: [],
								types: [{
									name: 'Object',
									check: isObject,
									enforce: enforceObject,
									type: Object
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for an Object in an array', () => {
					const schema = {
						level1: {
							type: Array,
							content: Object
						}
					};
					const output = {
						types: [{
							name: 'Object',
							check: isObject,
							enforce: enforceObject,
							type: Object
						}],
						keys: ['level1'],
						content: [{
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							key: 'level1',
							content: [{
								key: 0,
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null', () => {
					const schema = {
						level1: {
							type: Array,
							content: null
						}
					};
					const output = {
						types: [{
							name: 'Object',
							check: isObject,
							enforce: enforceObject,
							type: Object
						}],
						keys: ['level1'],
						content: [{
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							key: 'level1',
							content: [{
								key: 0,
								types: [{
									name: 'null',
									check: isSame,
									enforce: enforceSame,
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null in an array', () => {
					const schema = {
						level1: {
							type: Array,
							content: [null]
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null and a type in an array', () => {
					const schema = {
						level1: {
							type: Array,
							content: [String, null]
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for two types in an array', () => {
					const schema = {
						level1: {
							type: Array,
							content: {
								type: [String, Boolean]
							}
						}
					};
					const output = {
						types: [{
							name: 'Object',
							check: isObject,
							enforce: enforceObject,
							type: Object
						}],
						keys: ['level1'],
						content: [{
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							key: 'level1',
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									name: 'Boolean',
									check: isBoolean,
									enforce: enforceBoolean,
									type: Boolean
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: {
									type: Array,
									content: {
										level2: type.value
									}
								}
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: 'Array',
										check: isArray,
										enforce: enforceArray,
										type: Array
									}],
									content: [{
										key: 0,
										keys: ['level2'],
										types: [{
											name: 'Object',
											check: isObject,
											enforce: enforceObject,
											type: Object
										}],
										content: [{
											key: 'level2',
											types: [{
												name: type.nativeName,
												check: type.check,
												enforce: type.enforce,
												type: type.value
											}]
										}]
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for a ${input.level1.content.level2.name || input.level1.content.level2} in an array`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});
			});

			describe('object definitions', () => {
				it('should return a map for an array as an object', () => {
					const schema = {
						level1: {
							type: Array,
							content: {
								type: Array
							}
						}
					};
					const output = {
						types: [{
							name: 'Object',
							check: isObject,
							enforce: enforceObject,
							type: Object
						}],
						keys: ['level1'],
						content: [{
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							key: 'level1',
							content: [{
								types: [{
									name: 'Array',
									check: isArray,
									enforce: enforceArray,
									type: Array
								}],
								key: 0
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null', () => {
					const schema = {
						level1: {
							type: Array,
							content: {
								type: null
							}
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'null',
									check: isSame,
									enforce: enforceSame,
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null in an array', () => {
					const schema = {
						level1: {
							type: Array,
							content: {
								type: [null]
							}
						}
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for null and a type in an array', () => {
					const schema = {
						level1: [{
							type: [String, null]
						}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									check: isSame,
									enforce: enforceSame,
									name: 'null',
									type: null
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				it('should return a map for two types in an array', () => {
					const schema = {
						level1: [{
							type: [String, Boolean]
						}]
					};
					const output = {
						keys: ['level1'],
						types: [{
							check: isObject,
							enforce: enforceObject,
							name: 'Object',
							type: Object
						}],
						content: [{
							key: 'level1',
							types: [{
								name: 'Array',
								check: isArray,
								enforce: enforceArray,
								type: Array
							}],
							content: [{
								key: 0,
								types: [{
									name: 'String',
									check: isString,
									enforce: enforceString,
									type: String
								}, {
									name: 'Boolean',
									check: isBoolean,
									enforce: enforceBoolean,
									type: Boolean
								}]
							}]
						}]
					};

					assert.deepEqual(parseSchema(schema), output);
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: {
									type: Array,
									content: {
										level2: {
											type: type.value
										}
									}
								}
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: 'Array',
										check: isArray,
										enforce: enforceArray,
										type: Array
									}],
									content: [{
										key: 0,
										keys: ['level2'],
										types: [{
											name: 'Object',
											check: isObject,
											enforce: enforceObject,
											type: Object
										}],
										content: [{
											key: 'level2',
											types: [{
												name: type.nativeName,
												check: type.check,
												enforce: type.enforce,
												type: type.value
											}]
										}]
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for a ${input.level1.content.level2.type.name || input.level1.content.level2.type} in an array as an object with type`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});

				multiTest({
					values: schemaTestTypes.map((type) => {
						return {
							input: {
								level1: {
									type: Array,
									content: {
										level2: {
											type: type.value,
											isRequired: true
										}
									}
								}
							},
							output: {
								keys: ['level1'],
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								content: [{
									key: 'level1',
									types: [{
										name: 'Array',
										check: isArray,
										enforce: enforceArray,
										type: Array
									}],
									content: [{
										key: 0,
										keys: ['level2'],
										types: [{
											name: 'Object',
											check: isObject,
											enforce: enforceObject,
											type: Object
										}],
										content: [{
											key: 'level2',
											types: [{
												name: type.nativeName,
												check: type.check,
												enforce: type.enforce,
												type: type.value
											}],
											isRequired: true
										}]
									}]
								}]
							}
						};
					}),
					message: (input) => `should return a map for a ${input.level1.content.level2.type.name || input.level1.content.level2.type} in an array as an object with type and other keys`,
					test: (value) => parseSchema(value),
					inputKey: 'input',
					outputKey: 'output',
					assertion: 'deepEqual'
				});

				describe('overrides', () => {
					it('should return a map for enforce in an array as an object with enforce and type "any"', () => {
						const schema = {
							level1: {
								type: Array,
								content: {
									level2: {
										enforce: testEnforce
									}
								}
							}
						};
						const output = {
							keys: ['level1'],
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
								type: Object
							}],
							content: [{
								key: 'level1',
								types: [{
									name: 'Array',
									check: isArray,
									enforce: enforceArray,
									type: Array
								}],
								content: [{
									key: 0,
									keys: ['level2'],
									types: [{
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									content: [{
										key: 'level2',
										types: [{
											name: 'Anything',
											check: isAnything,
											type: 'any',
											enforce: testEnforce
										}]
									}]
								}]
							}]
						};

						assert.deepEqual(parseSchema(schema), output);
					});
				});
			});
		});
	});

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

