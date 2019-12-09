import { assert } from 'chai';
import displayValue from 'display-value';
import {
	enforceArray,
	enforceBoolean,
	enforceObject,
	enforceString,
	isArray,
	isBoolean,
	isObject,
	isString,
	strictEquality
} from 'type-enforcer-ui';
import parseSchema from '../../../src/Schema/parse/parseSchema';
import { checkNumericRange, enforceAnything, isAnything } from '../../../src/Schema/parse/typeRules';
import Schema from '../../../src/Schema/Schema';
import { multiTest } from '../../TestUtil';
import { schemaTestTypes, testSchema } from '../../testValues';

const testEnforce = () => {
};

const getTypeRule = (type) => {
	const getName = (name) => {
		return name.length === 1 ? name : name.charAt(0).toUpperCase() + name.slice(1);
	};

	const output = {
		name: type.name === 'function' ? 'function' : getName(type.name),
		check: type.check,
		enforce: type.enforce,
		type: type.value
	};

	if (type.name === 'Schema') {
		return {
			...output,
			type: Schema,
			schema: testSchema
		};
	}

	return output;
};

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
							check: strictEquality,
							enforce: enforceAnything,
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
							check: strictEquality,
							enforce: enforceAnything,
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
							check: strictEquality,
							enforce: enforceAnything,
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
							types: [{
								name: 'Object',
								check: isObject,
								enforce: enforceObject,
								type: Object
							}],
							keys: ['level1'],
							content: [{
								key: 'level1',
								types: [getTypeRule(type)]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for ${displayValue(input.level1)}`;
				},
				test(value) {
					return parseSchema(value);
				},
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
							check: strictEquality,
							enforce: enforceAnything,
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
							check: strictEquality,
							enforce: enforceAnything,
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
							check: strictEquality,
							enforce: enforceAnything,
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
							types: [{
								name: 'Object',
								check: isObject,
								enforce: enforceObject,
								type: Object
							}],
							keys: ['level1'],
							content: [{
								types: [getTypeRule(type)],
								key: 'level1'
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for ${displayValue(input.level1.type)} as an object with type`;
				},
				test(value) {
					return parseSchema(value);
				},
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
										...getTypeRule(type),
										numericRange: checkNumericRange,
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
								types: [{
									check: isObject,
									enforce: enforceObject,
									name: 'Object',
									type: Object
								}],
								keys: ['level1'],
								content: [{
									key: 'level1',
									isRequired: true,
									types: [{
										...getTypeRule(type),
										min: 0,
										max: 10
									}]
								}]
							}
						};
					}
				}),
				message(input) {
					return `should return a map for ${displayValue(input.level1.type)} as an object with type and other keys`;
				},
				test(value) {
					return parseSchema(value);
				},
				inputKey: 'input',
				outputKey: 'output',
				assertion: 'deepEqual'
			});

			describe('overrides', () => {
				it('should return a map for enforce as an object with enforce and type "*"', () => {
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
								name: '*',
								check: isAnything,
								enforce: testEnforce,
								type: '*'
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
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
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level2'],
									key: 0,
									content: [{
										key: 'level2',
										types: [getTypeRule(type)]
									}]
								}]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for a ${displayValue(input.level1[0].level2)} in an array`;
				},
				test(value) {
					return parseSchema(value);
				},
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
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
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level2'],
									key: 0,
									content: [{
										key: 'level2',
										types: [getTypeRule(type)]
									}]
								}]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for a ${displayValue(input.level1[0].level2.type)} in an array as an object with type`;
				},
				test(value) {
					return parseSchema(value);
				},
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
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
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
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level2'],
									key: 0,
									content: [{
										key: 'level2',
										types: [getTypeRule(type)],
										isRequired: true
									}]
								}]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for a ${displayValue(input.level1[0].level2.type)} in an array as an object with type and other keys`;
				},
				test(value) {
					return parseSchema(value);
				},
				inputKey: 'input',
				outputKey: 'output',
				assertion: 'deepEqual'
			});

			describe('overrides', () => {
				it('should return a map for enforce in an array as an object with enforce and type "*"', () => {
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
										name: '*',
										check: isAnything,
										type: '*',
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
								name: '*',
								check: isAnything,
								type: '*',
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
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
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level2'],
									key: 0,
									content: [{
										key: 'level2',
										types: [getTypeRule(type)]
									}]
								}]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for a ${displayValue(input.level1.content.level2)} in an array`;
				},
				test(value) {
					return parseSchema(value);
				},
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
								check: strictEquality,
								enforce: enforceAnything,
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
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
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
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level2'],
									key: 0,
									content: [{
										key: 'level2',
										types: [getTypeRule(type)]
									}]
								}]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for a ${displayValue(input.level1.content.level2.type)} in an array as an object with type`;
				},
				test(value) {
					return parseSchema(value);
				},
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
							types: [{
								check: isObject,
								enforce: enforceObject,
								name: 'Object',
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
										name: 'Object',
										check: isObject,
										enforce: enforceObject,
										type: Object
									}],
									keys: ['level2'],
									key: 0,
									content: [{
										key: 'level2',
										types: [getTypeRule(type)],
										isRequired: true
									}]
								}]
							}]
						}
					};
				}),
				message(input) {
					return `should return a map for a ${displayValue(input.level1.content.level2.type)} in an array as an object with type and other keys`;
				},
				test(value) {
					return parseSchema(value);
				},
				inputKey: 'input',
				outputKey: 'output',
				assertion: 'deepEqual'
			});

			describe('overrides', () => {
				it('should return a map for enforce in an array as an object with enforce and type "*"', () => {
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
										name: '*',
										check: isAnything,
										type: '*',
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
