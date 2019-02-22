import { assert } from 'chai';
import {
	enforceArray,
	enforceBoolean,
	enforceObject,
	enforceString,
	isArray,
	isBoolean,
	isObject,
	isString
} from 'type-enforcer';
import parseSchema from '../../src/Schema/parseSchema';
import { checkNumericRange, enforceSame, isAnything, isSame } from '../../src/Schema/schemaTypeRules';
import { multiTest } from '../TestUtil';
import { schemaTestTypes } from '../testValues';

const testEnforce = () => {
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
