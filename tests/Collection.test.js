import { assert } from 'type-enforcer';
import { Collection, Model } from '../index.js';
import { INDEXER, MODEL } from '../src/Collection.js';
import compare from '../src/utility/compare.js';

describe('Collection', () => {
	const noIndexModel = new Model({
		id: Number,
		first: String,
		last: String,
		age: Number,
		hobbies: [{ name: String, start: Date }]
	});

	const singleIndexModel = new Model({
		id: Number,
		first: { type: String, index: true },
		last: String,
		age: Number,
		hobbies: {
			type: Array,
			content: new Model({ name: String, start: Date })
		}
	});

	const fullIndexModel = new Model({
		id: { type: 'integer', index: true },
		first: { type: String, index: true },
		last: { type: String, index: true },
		age: { type: [Number, String], min: 0, index: true },
		hobbies: {
			type: Array,
			content: new Model({
				name: { type: String, index: true },
				start: { type: Date, index: true }
			})
		}
	});

	const iterationCollection = new Collection({
		id: 2,
		value: 'test 2'
	}, {
		id: 3,
		value: 'test 3'
	}, {
		id: 4,
		value: 'test 4'
	}, {
		id: 1,
		value: 'test 1'
	});

	describe('init', () => {
		it('should accept an array when instantiated', () => {
			assert.is(new Collection([{ value: 1 }]).length, 1);
		});
	});

	describe('.forEach', () => {
		it('should call a callback for each item in collection', () => {
			let total = 0;
			let testVar = 0;

			const result = iterationCollection.forEach(function(item, index) {
				total++;
				if (index === testVar && this === iterationCollection) {
					testVar++;
				}
			});

			assert.is(result, iterationCollection);
			assert.is(testVar, 4);
			assert.is(total, 4);
		});

		it('should bind thisArg to the callback', () => {
			let total = 0;
			let testVar = 0;

			const result = iterationCollection.forEach(function(item, index) {
				total++;
				if (index === testVar && this === noIndexModel) {
					testVar++;
				}
			}, noIndexModel);

			assert.is(result, iterationCollection);
			assert.is(testVar, 4);
			assert.is(total, 4);
		});
	});

	describe('.forEachRight', () => {
		it('should call a callback for each item in collection, starting at the right', () => {
			let total = 0;
			let testVar = 3;

			const result = iterationCollection.forEachRight(function(item, index) {
				total++;
				if (index === testVar && this === iterationCollection) {
					testVar--;
				}
			});

			assert.is(result, iterationCollection);
			assert.is(testVar, -1);
			assert.is(total, 4);
		});

		it('should bind thisArg to the callback', () => {
			let total = 0;
			let testVar = 3;

			const result = iterationCollection.forEachRight(function(item, index) {
				total++;
				if (index === testVar && this === noIndexModel) {
					testVar--;
				}
			}, noIndexModel);

			assert.is(result, iterationCollection);
			assert.is(testVar, -1);
			assert.is(total, 4);
		});
	});

	describe('.some', () => {
		it('should call a callback for each item in collection until true is returned', () => {
			let total = 0;
			let testVar = 0;

			const result = iterationCollection.some((item, index) => {
				total++;
				if (index === testVar) {
					testVar++;
					return index === 2;
				}
			});

			assert.is(result, true);
			assert.is(testVar, 3);
			assert.is(total, 3);
		});

		it('should call a callback for each item in collection', () => {
			let total = 0;
			let testVar = 0;

			const result = iterationCollection.some((item, index) => {
				total++;
				if (index === testVar) {
					testVar++;
				}
			});

			assert.is(result, false);
			assert.is(testVar, 4);
			assert.is(total, 4);
		});
	});

	describe('.someRight', () => {
		it('should call a callback for each item in collection until true is returned, starting at the right', () => {
			let total = 0;
			let testVar = 3;

			const result = iterationCollection.someRight((item, index) => {
				total++;
				if (index === testVar) {
					testVar--;
				}
				if (index === 2) {
					return true;
				}
			});

			assert.is(result, true);
			assert.is(testVar, 1);
			assert.is(total, 2);
		});

		it('should call a callback for each item in collection, starting at the right', () => {
			let total = 0;
			let testVar = 3;

			const result = iterationCollection.someRight((item, index) => {
				total++;
				if (index === testVar) {
					testVar--;
				}
			});

			assert.is(result, false);
			assert.is(testVar, -1);
			assert.is(total, 4);
		});
	});

	describe('.every', () => {
		it('should call a callback for each item in collection if true is always returned', () => {
			let total = 0;
			let testVar = 0;

			const result = iterationCollection.every((item, index) => {
				total++;
				if (index === testVar) {
					testVar++;
					return true;
				}
			});

			assert.is(result, true);
			assert.is(testVar, 4);
			assert.is(total, 4);
		});

		it('should call a callback for each item in collection until false is returned', () => {
			let total = 0;
			let testVar = 0;

			const result = iterationCollection.every((item, index) => {
				total++;
				if (index === testVar) {
					testVar++;
					return index !== 2;
				}
			});

			assert.is(result, false);
			assert.is(testVar, 3);
			assert.is(total, 3);
		});
	});

	describe('.reduce', () => {
		it('should return the cumulative result of calling a callback on every item in collection', () => {
			const result = iterationCollection.reduce((value, item) => {
				value += item.id;
				return value;
			}, '');

			assert.is(result, '2341');
		});
	});

	describe('.reduceRight', () => {
		it('should return the cumulative result of calling a callback on every item in collection, starting at right', () => {
			const result = iterationCollection.reduceRight((value, item) => {
				value += item.id;
				return value;
			}, '');

			assert.is(result, '1432');
		});
	});

	describe('.map', () => {
		it('should return the cumulative result of calling a callback on every item in collection', () => {
			const result = iterationCollection.map((item) => {
				return item.id;
			});

			assert.is(result.length, 4);
			assert.is(result[0], 2);
			assert.is(result[1], 3);
			assert.is(result[2], 4);
			assert.is(result[3], 1);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.eachChild', () => {
		it('should call a callback for each child of the collection', () => {
			let total = 0;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild(() => {
				total++;
			});

			assert.is(total, 6);
		});

		it('should stop calling a callback if true is returned from the callback', () => {
			let total = 0;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild((item) => {
				total++;
				return item.prop === 'test 4';
			});

			assert.is(total, 3);
		});

		it('should NOT call the callback for children that don\'t match the childKey', () => {
			let total = 0;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild(() => {
				total++;
			}, {
				childKey: 'children2'
			});

			assert.is(total, 3);
		});

		it('should call the callback for children that match the childKey', () => {
			let total = 0;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children2: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children2: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild(() => {
				total++;
			}, {
				childKey: 'children2'
			});

			assert.is(total, 6);
		});

		it('should provide the depth of each child', () => {
			let total = 0;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children2: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children2: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild((item, depth) => {
				total += depth;
			}, {
				childKey: 'children2'
			});

			assert.is(total, 4);
		});

		it('should call the onParent callback if provided', () => {
			let total = 0;
			let parentContext = null;
			let childContext = null;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild(function() {
				childContext = this;
			}, {
				onParent(item, depth) {
					parentContext = this;
					total += depth;
				}
			});

			assert.is(total, 1);
			assert.is(parentContext, testCollection);
			assert.is(childContext, testCollection);
		});

		it('should not call the callback for children when onParent returns true', () => {
			let total = 0;
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});

			testCollection.eachChild(() => {
				total++;
			}, {
				onParent(item) {
					return item.prop === 'test 5';
				}
			});

			assert.is(total, 5);
		});
	});

	describe('.flat', () => {
		it('should return a flat collection', () => {
			const unflatCollection = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, [{
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			}]);

			const result = unflatCollection.flat();

			assert.equal(result, iterationCollection);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.flatMap', () => {
		it('should return a flat collection', () => {
			const unflatCollection = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, [{
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			}]);

			const result = unflatCollection.flatMap((item) => {
				return item;
			});

			assert.equal(result, iterationCollection);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.first', () => {
		it('should return the first item in the collection', () => {
			const testCollection = new Collection({
				id: 2,
				two: 10,
				value: 'test 2'
			}, {
				id: 3,
				two: 11,
				value: 'test 3'
			}, {
				id: 3,
				two: 12,
				value: 'test 4'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.equal(testCollection.first(), {
				id: 2,
				two: 10,
				value: 'test 2'
			});
			assert.is(testCollection.length, 4);
		});
	});

	describe('.last', () => {
		it('should return the first item in the collection', () => {
			const testCollection = new Collection({
				id: 2,
				two: 10,
				value: 'test 2'
			}, {
				id: 3,
				two: 11,
				value: 'test 3'
			}, {
				id: 3,
				two: 12,
				value: 'test 4'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.equal(testCollection.last(), {
				id: 1,
				two: 13,
				value: 'test 1'
			});
			assert.is(testCollection.length, 4);
		});
	});

	describe('.slice', () => {
		it('should return an empty collection if the collection is empty', () => {
			const result = new Collection().slice();
			assert.equal(result, []);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.flatten', () => {
		it('should return an empty collection if the collection is empty', () => {
			const result = new Collection().flatten();
			assert.equal(result, []);
			assert.is(result instanceof Collection, true);
		});

		it('should return the input if the input is an object without children', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			});
			const output = [{
				prop: 'test 1'
			}];
			const result = testCollection.flatten();

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should return an array that is already flat', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 4'
			}, {
				prop: 'test 5'
			}, {
				prop: 'test 6'
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 4'
			}, {
				prop: 'test 5'
			}, {
				prop: 'test 6'
			}, {
				prop: 'test 3'
			}];
			const result = testCollection.flatten();

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should flatten a nested array', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 4'
			}, {
				prop: 'test 5'
			}, {
				prop: 'test 6'
			}, {
				prop: 'test 3'
			}];
			const result = testCollection.flatten();

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should flatten a nested array using a specific child property', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				asdf: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 4'
			}, {
				prop: 'test 5',
				children: [{
					prop: 'test 6'
				}]
			}, {
				prop: 'test 3'
			}];
			const settings = {
				childKey: 'asdf'
			};
			const result = testCollection.flatten(settings);

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should add a depth property to each returned object if saveDepth is true', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1',
				depth: 0
			}, {
				prop: 'test 2',
				depth: 0
			}, {
				prop: 'test 4',
				depth: 1
			}, {
				prop: 'test 5',
				depth: 1
			}, {
				prop: 'test 6',
				depth: 2
			}, {
				prop: 'test 3',
				depth: 0
			}];
			const settings = {
				saveDepth: true
			};
			const result = testCollection.flatten(settings);

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should save properties set in the onParent callback', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2',
				testProperty: 'test 2'
			}, {
				prop: 'test 4'
			}, {
				prop: 'test 5',
				testProperty: 'test 5'
			}, {
				prop: 'test 6'
			}, {
				prop: 'test 3'
			}];
			const settings = {
				onParent(item) {
					item.testProperty = item.prop;
				}
			};
			const result = testCollection.flatten(settings);

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should save properties set in the onChild callback', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1',
				testProperty: 'test 1'
			}, {
				prop: 'test 2',
				testProperty: 'test 2'
			}, {
				prop: 'test 4',
				testProperty: 'test 4'
			}, {
				prop: 'test 5',
				testProperty: 'test 5'
			}, {
				prop: 'test 6',
				testProperty: 'test 6'
			}, {
				prop: 'test 3',
				testProperty: 'test 3'
			}];
			const settings = {
				onChild(item) {
					item.testProperty = item.prop;
				}
			};
			const result = testCollection.flatten(settings);

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should ignore children of objects when onParent returns true', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					ignoreChildren: true,
					children: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 4'
			}, {
				ignoreChildren: true,
				prop: 'test 5'
			}, {
				prop: 'test 3'
			}];
			const settings = {
				onParent(item) {
					return item.ignoreChildren;
				}
			};
			const result = testCollection.flatten(settings);

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should be able to use all the settings together', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children2: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					ignoreChildren: true,
					children2: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1',
				depth: 0,
				testProperty: 'child test 1'
			}, {
				prop: 'test 2',
				depth: 0,
				testProperty: 'parent test 2'
			}, {
				prop: 'test 5',
				depth: 1,
				parentProp: 'test 2',
				ignoreChildren: true,
				testProperty: 'parent test 5'
			}, {
				prop: 'test 3',
				depth: 0,
				testProperty: 'child test 3'
			}];
			let parentContext = null;
			let childContext = null;
			const settings = {
				childKey: 'children2',
				saveDepth: true,
				onParent(item, parent) {
					parentContext = this;
					item.testProperty = 'parent ' + item.prop;
					if (parent) {
						item.parentProp = parent.prop;
					}
					return item.ignoreChildren;
				},
				onChild(item, parent) {
					childContext = this;
					item.testProperty = 'child ' + item.prop;
					if (parent) {
						item.parentProp = parent.prop;
					}
					return item.prop === 'test 4';
				}
			};
			const result = testCollection.flatten(settings);

			assert.equal(result, output);
			assert.is(parentContext, testCollection);
			assert.is(childContext, testCollection);
			assert.is(result instanceof Collection, true);
		});

		it('should not modify the original collection', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children2: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					ignoreChildren: true,
					children2: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			});
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2',
				children2: [{
					prop: 'test 4'
				}, {
					prop: 'test 5',
					ignoreChildren: true,
					children2: [{
						prop: 'test 6'
					}]
				}]
			}, {
				prop: 'test 3'
			}];
			const settings = {
				childKey: 'children2',
				saveDepth: true,
				ignoreChildKey: 'ignoreChildren',
				onParent(item) {
					item.testProperty = 'parent ' + item.prop;
				},
				onChild(item) {
					item.testProperty = 'child ' + item.prop;
				}
			};

			testCollection.flatten(settings);

			assert.equal(testCollection, output);
		});
	});

	describe('.nest', () => {
		it('should return an empty collection if the collection is empty', () => {
			const result = new Collection().nest();
			assert.equal(result, []);
			assert.is(result instanceof Collection, true);
		});

		it('should return the input if the input doesn\'t have parents', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			});
			const output = [{
				prop: 'test 1'
			}];
			const result = testCollection.nest();

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should return properly nested data', () => {
			const testCollection = new Collection({
				id: 1,
				prop: 'test 1'
			}, {
				id: 2,
				prop: 'test 2'
			}, {
				id: 3,
				prop: 'test 3',
				parent: 2
			}, {
				id: 4,
				prop: 'test 4',
				another: 'something',
				parent: 2
			}, {
				id: 5,
				prop: 'test 5',
				parent: 4
			}, {
				id: 6,
				prop: 'test 6',
				parent: 2
			});
			const output = [{
				id: 1,
				prop: 'test 1'
			}, {
				id: 2,
				prop: 'test 2',
				children: [{
					id: 3,
					prop: 'test 3',
					parent: 2
				}, {
					id: 4,
					prop: 'test 4',
					another: 'something',
					children: [{
						id: 5,
						prop: 'test 5',
						parent: 4
					}],
					parent: 2
				}, {
					id: 6,
					prop: 'test 6',
					parent: 2
				}]
			}];
			const result = testCollection.nest();

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});

		it('should remove the parent property from items if deleteParentKey = true', () => {
			const testCollection = new Collection({
				id: 1,
				prop: 'test 1'
			}, {
				id: 2,
				prop: 'test 2'
			}, {
				id: 3,
				prop: 'test 3',
				parent: 2
			}, {
				id: 4,
				prop: 'test 4',
				another: 'something',
				parent: 2
			}, {
				id: 5,
				prop: 'test 5',
				parent: 4
			}, {
				id: 6,
				prop: 'test 6',
				parent: 2
			});
			const output = [{
				id: 1,
				prop: 'test 1'
			}, {
				id: 2,
				prop: 'test 2',
				children: [{
					id: 3,
					prop: 'test 3'
				}, {
					id: 4,
					prop: 'test 4',
					another: 'something',
					children: [{
						id: 5,
						prop: 'test 5'
					}]
				}, {
					id: 6,
					prop: 'test 6'
				}]
			}];
			const result = testCollection.nest({
				deleteParentKey: true
			});

			assert.equal(result, output);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.unique', () => {
		it('should return an empty collection if the collection is empty', () => {
			const result = new Collection().unique();
			assert.equal(result, []);
			assert.is(result instanceof Collection, true);
		});

		it('should return a new collection with duplicates removed', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 3'
			}, {
				prop: 'test 3'
			});
			const testOutput = [{
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 3'
			}];

			const result = testCollection.unique();

			assert.equal(result, testOutput);
			assert.is(result instanceof Collection, true);
		});

		it('should return a new collection with duplicates removed and counts added', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 3'
			}, {
				prop: 'test 3'
			});
			const testOutput = [{
				prop: 'test 1',
				count: 1
			}, {
				prop: 'test 2',
				count: 3
			}, {
				prop: 'test 3',
				count: 2
			}];

			const result = testCollection.unique('count');

			assert.equal(result, testOutput);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.merge', () => {
		it('should return a new collection with zipped data from two arrays', () => {
			const testCollection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 1,
				value: 'test 1'
			});
			const testCollection2 = new Collection([{
				id: 1,
				value: 'test 4'
			}, {
				id: 3,
				value: 'test 6'
			}, {
				id: 2,
				value: 'test 5'
			}]);
			const testOutput = [{
				x: 'test 2',
				y: 'test 5'
			}, {
				x: 'test 3',
				y: 'test 6'
			}, {
				x: 'test 1',
				y: 'test 4'
			}];

			const result = testCollection1.merge(testCollection2, 'id', (x, y) => ({
				x: x.value,
				y: y.value
			}));

			assert.equal(result, testOutput);
			assert.is(result instanceof Collection, true);
		});

		it('should return a new collection with zipped data from three arrays', () => {
			const testCollection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 1,
				value: 'test 1'
			});
			const testCollection2 = new Collection({
				id: 1,
				value: 'test 4'
			}, {
				id: 3,
				value: 'test 6'
			}, {
				id: 2,
				value: 'test 5'
			});
			const testCollection3 = new Collection({
				id: 3,
				value: 'test 9'
			}, {
				id: 2,
				value: 'test 8'
			}, {
				id: 1,
				value: 'test 7'
			});
			const testOutput = [{
				x: 'test 2',
				y: 'test 5',
				z: 'test 8'
			}, {
				x: 'test 3',
				y: 'test 6',
				z: 'test 9'
			}, {
				x: 'test 1',
				y: 'test 4',
				z: 'test 7'
			}];

			const result = testCollection1.merge([testCollection2,
				testCollection3], 'id', (x, y, z) => ({
				x: x.value,
				y: y.value,
				z: z.value
			}));

			assert.equal(result, testOutput);
			assert.is(result instanceof Collection, true);
		});

		it('should return a new collection with zipped data from three arrays with multiples of some ids', () => {
			const testCollection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 1,
				value: 'test 1'
			});
			const testCollection2 = new Collection({
				id: 1,
				value: 'test 4'
			}, {
				id: 3,
				value: 'test 6'
			}, {
				id: 2,
				value: 'test 5'
			}, {
				id: 2,
				value: 'test 11'
			});
			const testCollection3 = new Collection({
				id: 1,
				value: 'test 7'
			}, {
				id: 3,
				value: 'test 9'
			}, {
				id: 3,
				value: 'test 10'
			}, {
				id: 2,
				value: 'test 8'
			});
			const testOutput = [{
				x: 'test 2',
				y: 'test 11',
				z: 'test 8'
			}, {
				x: 'test 2',
				y: 'test 5',
				z: 'test 8'
			}, {
				x: 'test 3',
				y: 'test 6',
				z: 'test 10'
			}, {
				x: 'test 3',
				y: 'test 6',
				z: 'test 9'
			}, {
				x: 'test 1',
				y: 'test 4',
				z: 'test 7'
			}];

			const result = testCollection1.merge([testCollection2,
				testCollection3], 'id', (x, y, z) => ({
				x: x.value,
				y: y.value,
				z: z.value
			}));

			assert.equal(result, testOutput);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.concat', () => {
		it('should return a new collection with the items in two', () => {
			const collection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			});
			const collection2 = new Collection({
				id: 5,
				value: 'test 5'
			}, {
				id: 6,
				value: 'test 6'
			});

			const result = collection1.concat(collection2);

			assert.equal(result, [{
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			}, {
				id: 5,
				value: 'test 5'
			}, {
				id: 6,
				value: 'test 6'
			}]);
			assert.is(collection1.length, 4);
			assert.is(collection2.length, 2);
			assert.is(result instanceof Collection, true);
		});
	});

	describe('.toString', () => {
		it('should return a string', () => {
			const collection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			});

			const result = collection1.toString();

			assert.equal(result, '[object Object],[object Object],[object Object],[object Object]');
			assert.is(collection1.length, 4);
		});
	});

	describe('.toLocaleString', () => {
		it('should return a string', () => {
			const collection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			});

			const result = collection1.toLocaleString();

			assert.equal(result, '[object Object],[object Object],[object Object],[object Object]');
			assert.is(collection1.length, 4);
		});
	});

	describe('.join', () => {
		it('should return a string', () => {
			const collection1 = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			}, {
				id: 4,
				value: 'test 4'
			}, {
				id: 1,
				value: 'test 1'
			});

			const result = collection1.join(' - ');

			assert.equal(result, '[object Object] - [object Object] - [object Object] - [object Object]');
			assert.is(collection1.length, 4);
		});
	});

	describe('.entries', () => {
		it('should return an Array Iterator', () => {
			const collection = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			});

			const result = collection.entries();

			assert.equal(result.next().value, [0, collection[0]]);
			assert.equal(result.next().value, [1, collection[1]]);
			assert.is(collection.length, 2);
		});
	});

	describe('.values', () => {
		it('should return an Array Iterator', () => {
			const collection = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			});

			const result = collection.values();

			assert.equal(result.next().value, collection[0]);
			assert.equal(result.next().value, collection[1]);
			assert.is(collection.length, 2);
		});
	});

	describe('.keys', () => {
		it('should return an Array Iterator', () => {
			const collection = new Collection({
				id: 2,
				value: 'test 2'
			}, {
				id: 3,
				value: 'test 3'
			});

			const result = collection.keys();

			assert.equal(result.next().value, 0);
			assert.equal(result.next().value, 1);
			assert.is(collection.length, 2);
		});
	});

	describe('.model', () => {
		it('should accept a model', () => {
			const testCollection1 = new Collection().model(singleIndexModel);

			assert.is(testCollection1[INDEXER].builds, 1);
		});

		it('should enforce the model', () => {
			const testCollection1 = new Collection().model(singleIndexModel);

			testCollection1.push({
				first: 'John',
				last: 'Doe',
				age: '21'
			});

			testCollection1.push({
				first: 'Jane',
				last: 'Doe',
				hobby: ['programming']
			});

			assert.equal(testCollection1[0], {
				first: 'John',
				last: 'Doe'
			});
			assert.equal(testCollection1[1], {
				first: 'Jane',
				last: 'Doe'
			});
			assert.is(testCollection1[INDEXER].builds, 1);
		});

		it('should accept an object', () => {
			const testCollection1 = new Collection()
				.model({
					id: Number,
					first: {
						type: String,
						index: true
					},
					last: {
						type: String,
						index: true
					},
					age: Number
				});

			testCollection1.push({
				first: 'John',
				last: 'Doe',
				age: '21'
			});

			testCollection1.push({
				first: 'Jane',
				last: 'Doe',
				hobbies: ['programming']
			});

			assert.equal(testCollection1[0], {
				first: 'John',
				last: 'Doe'
			});
			assert.equal(testCollection1[1], {
				first: 'Jane',
				last: 'Doe'
			});
			assert.is(testCollection1[INDEXER].builds, 1);
		});

		it('should build indexes', () => {
			const testCollection1 = new Collection().model(fullIndexModel);

			assert.is(testCollection1[INDEXER].builds, 1);
			assert.is(testCollection1[INDEXER].hasIndex('id'), true);
			assert.is(testCollection1[INDEXER].hasIndex('first'), true);
			assert.is(testCollection1[INDEXER].hasIndex('last'), true);
			assert.is(testCollection1[INDEXER].hasIndex('age'), true);
			assert.is(testCollection1[INDEXER].hasIndex('hobbies.0.name'), true);
			assert.is(testCollection1[INDEXER].hasIndex('hobbies.0.start'), true);
		});
	});

	const runQueryTests = (builds, model, secondModel) => {
		const person1 = {
			id: 2,
			first: 'John',
			last: 'Doe',
			age: '21'
		};
		const person2 = {
			id: 3,
			first: 'Jane',
			last: 'Doe',
			hobbies: [{
				name: 'programming'
			}]
		};
		const person3 = {
			id: 4,
			first: 'Jane',
			last: 'Smith'
		};
		const person4 = {
			id: 5,
			first: 'Steve',
			last: 'Smith',
			hobbies: [{
				name: 'basketball'
			}]
		};
		const person5 = {
			id: 6,
			first: 'Steve',
			last: 'Smith',
			hobbies: [{
				name: 'basketball'
			}]
		};
		const extraPerson = {
			id: 7,
			first: 'Sarah',
			last: 'Jones'
		};

		let queryCollection = null;

		const reset = () => {
			queryCollection[0] = person1;
			queryCollection[1] = person2;
			queryCollection[2] = person3;
			queryCollection[3] = person4;
			queryCollection[4] = person5;
		};

		const build = () => {
			if (queryCollection) {
				queryCollection.remove();
			}
			queryCollection = new Collection(
				person1,
				person2,
				person3,
				person4,
				person5
			)
				.model(model);

			if (secondModel !== undefined) {
				queryCollection.model(secondModel ? secondModel.extend() : null);
			}
		};

		const bumpBuilds = () => {
			if (builds && secondModel !== null && secondModel !== noIndexModel) {
				builds++;
			}
		};

		build();

		if (builds !== undefined) {
			it(`should have built the indexes ${builds} time(s)`, () => {
				assert.is(queryCollection[INDEXER].builds, builds);
			});
		}

		describe('.indexOf', () => {
			it('should return the index of the item', () => {
				assert.equal(queryCollection.indexOf(queryCollection[3]), 3);
			});

			it('should return -1 for an item that is deepEqual to an item in the collection but isn\'t actually in the collection', () => {
				assert.equal(queryCollection.indexOf({
					id: 6,
					first: 'Steve',
					last: 'Smith',
					hobbies: [{
						name: 'basketball'
					}]
				}), -1);
			});

			it('should return -1 for an item that isn\'t in the collection', () => {
				assert.equal(queryCollection.indexOf({}), -1);
			});
		});

		describe('.lastIndexOf', () => {
			it('should return the last index of the item', () => {
				assert.equal(queryCollection.lastIndexOf(queryCollection[3]), 3);
			});

			it('should return -1 for an item that is deepEqual to an item in the collection but isn\'t actually in the collection', () => {
				assert.equal(queryCollection.lastIndexOf({
					id: 6,
					first: 'Steve',
					last: 'Smith',
					hobbies: [{
						name: 'basketball'
					}]
				}), -1);
			});

			it('should return -1 for an item that isnt in the collection', () => {
				assert.equal(queryCollection.lastIndexOf({}), -1);
			});
		});

		describe('.includes', () => {
			it('should return true for an item in the collection', () => {
				assert.equal(queryCollection.includes(queryCollection[3]), true);
			});

			it('should return -1 for an item that isnt in the collection', () => {
				assert.equal(queryCollection.includes({}), false);
			});
		});

		describe('.findIndex', () => {
			it('should find an item via a callback', () => {
				const result = queryCollection.findIndex((item) => item.first === 'Jane');
				assert.equal(result, 1);
			});

			it('should find an item at the beginning of the collection', () => {
				reset();
				const result = queryCollection.findIndex({ first: 'John' });
				assert.equal(result, 0);
			});

			it('should find an item in the middle of the collection', () => {
				const result = queryCollection.findIndex({ first: 'Jane' });
				assert.equal(result, 1);
			});

			it('should find an item at the end of the collection', () => {
				const result = queryCollection.findIndex({ first: 'Steve' });
				assert.equal(result, 3);
			});

			it('should find an item that matches two paths', () => {
				const result = queryCollection.findIndex({ first: 'Jane', id: 3 });
				assert.equal(result, 1);
			});

			it('should NOT find an item that doesn\'t match two paths', () => {
				const result = queryCollection.findIndex({ first: 'Jane', age: 27 });
				assert.equal(result, -1);
			});

			it('should find an item that matches in a nested Model', () => {
				const result = queryCollection.findIndex({ hobbies: [{ name: 'programming' }] });
				assert.equal(result, 1);
			});
		});

		describe('.findLastIndex', () => {
			it('should find an item via a callback', () => {
				const result = queryCollection.findLastIndex((item) => item.first === 'Jane');
				assert.equal(result, 2);
			});

			it('should find an item at the beginning of the collection', () => {
				const result = queryCollection.findLastIndex({ first: 'John' });
				assert.equal(result, 0);
			});

			it('should find an item in the middle of the collection', () => {
				const result = queryCollection.findLastIndex({ first: 'Jane' });
				assert.equal(result, 2);
			});

			it('should find an item at the end of the collection', () => {
				const result = queryCollection.findLastIndex({ first: 'Steve' });
				assert.equal(result, 4);
			});

			it('should find an item that matches two paths', () => {
				const result = queryCollection.findLastIndex({ first: 'Jane', id: 3 });
				assert.equal(result, 1);
			});

			it('should NOT find an item that doesn\'t match two paths', () => {
				const result = queryCollection.findLastIndex({ first: 'Jane', age: 27 });
				assert.equal(result, -1);
			});

			it('should find an item that matches in a nested Model', () => {
				const result = queryCollection.findLastIndex({ hobbies: [{ name: 'programming' }] });
				assert.equal(result, 1);
			});
		});

		describe('.find', () => {
			it('should find an item via a callback', () => {
				const result = queryCollection.find((item) => item.first === 'Jane');
				assert.equal(result, queryCollection[1]);
			});

			it('should find an item at the beginning of the collection', () => {
				const result = queryCollection.find({ first: 'John' });
				assert.equal(result, queryCollection[0]);
			});

			it('should find an item in the middle of the collection', () => {
				const result = queryCollection.find({ first: 'Jane' });
				assert.equal(result, queryCollection[1]);
			});

			it('should find an item at the end of the collection', () => {
				const result = queryCollection.find({ first: 'Steve' });
				assert.equal(result, queryCollection[3]);
			});

			it('should find an item that matches two paths', () => {
				const result = queryCollection.find({ first: 'Jane', id: 3 });
				assert.equal(result, queryCollection[1]);
			});

			it('should NOT find an item that doesn\'t match two paths', () => {
				const result = queryCollection.find({ first: 'Jane', age: 27 });
				assert.equal(result, undefined);
			});

			it('should find an item that matches in a nested Model', () => {
				const result = queryCollection.find({ hobbies: [{ name: 'programming' }] });
				assert.equal(result, queryCollection[1]);
			});
		});

		describe('.findLast', () => {
			it('should find an item via a callback', () => {
				const result = queryCollection.findLast((item) => item.first === 'Jane');
				assert.equal(result, queryCollection[2]);
			});

			it('should find an item at the beginning of the collection', () => {
				const result = queryCollection.findLast({ first: 'John' });
				assert.equal(result, queryCollection[0]);
			});

			it('should find an item in the middle of the collection', () => {
				const result = queryCollection.findLast({ first: 'Jane' });
				assert.equal(result, queryCollection[2]);
			});

			it('should find an item at the end of the collection', () => {
				const result = queryCollection.findLast({ first: 'Steve' });
				assert.equal(result, queryCollection[4]);
			});

			it('should find an item that matches two paths', () => {
				const result = queryCollection.findLast({ first: 'Jane', id: 3 });
				assert.equal(result, queryCollection[1]);
			});

			it('should NOT find an item that doesn\'t match two paths', () => {
				const result = queryCollection.findLast({ first: 'Jane', age: 27 });
				assert.equal(result, undefined);
			});

			it('should find an item that matches in a nested Model', () => {
				const result = queryCollection.findLast({ hobbies: [{ name: 'programming' }] });
				assert.equal(result, queryCollection[1]);
			});
		});

		describe('.filter', () => {
			it('should find an item via a callback', () => {
				const result = queryCollection.filter((item) => item.first === 'Jane');
				assert.equal(result, queryCollection.slice(1, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item at the beginning of the collection', () => {
				const result = queryCollection.filter({ first: 'John' });
				assert.equal(result, queryCollection.slice(0, 1));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item in the middle of the collection', () => {
				const result = queryCollection.filter({ first: 'Jane' });
				assert.equal(result, queryCollection.slice(1, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item at the end of the collection', () => {
				const result = queryCollection.filter({ first: 'Steve' });
				assert.equal(result, queryCollection.slice(3, 5));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches two paths', () => {
				const result = queryCollection.filter({ first: 'Jane', id: 3 });
				assert.equal(result, queryCollection.slice(1, 2));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should NOT find an item that doesn\'t match two paths', () => {
				const result = queryCollection.filter({ first: 'Jane', age: 27 });
				assert.equal(result, []);
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches in a nested Model', () => {
				const result = queryCollection.filter({ hobbies: [{ name: 'programming' }] });
				assert.equal(result, queryCollection.slice(1, 2));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $in operator', () => {
				const result = queryCollection.filter({ first: { $in: ['John', 'Steve'] } });
				assert.equal(result, [person1, person4, person5]);
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $nin operator', () => {
				const result = queryCollection.filter({ first: { $nin: ['John', 'Steve'] } });
				assert.equal(result, queryCollection.slice(1, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $gt operator', () => {
				const result = queryCollection.filter({ id: { $gt: 3 } });
				assert.equal(result, queryCollection.slice(2));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $gte operator', () => {
				const result = queryCollection.filter({ id: { $gte: 3 } });
				assert.equal(result, queryCollection.slice(1));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $lt operator', () => {
				const result = queryCollection.filter({ id: { $lt: 4 } });
				assert.equal(result, queryCollection.slice(0, 2));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $lte operator', () => {
				const result = queryCollection.filter({ id: { $lte: 4 } });
				assert.equal(result, queryCollection.slice(0, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $eq operator', () => {
				const result = queryCollection.filter({ id: { $eq: 4 } });
				assert.equal(result, queryCollection.slice(2, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches an $ne operator', () => {
				const result = queryCollection.filter({ id: { $ne: 4 } });
				assert.equal(result, [person1, person2, person4, person5]);
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should find an item that matches multiple operators', () => {
				const result = queryCollection.filter({
					id: {
						$ne: 4,
						$gt: 2,
						$lte: 5
					}
				});
				assert.equal(result, [person2, person4]);
				assert.is(result instanceof Collection, true);
				result.remove();
			});
		});

		describe('.sliceBy', () => {
			it('should return an empty collection if the collection is empty', () => {
				const result = new Collection().sliceBy();
				assert.equal(result, []);
				assert.is(result instanceof Collection, true);
			});

			it('should return an array of items from the end of the collection if no endFilter is provided', () => {
				const startFilter = {
					first: 'Jane'
				};

				const result = queryCollection.sliceBy(startFilter);

				assert.equal(result, queryCollection.slice(1));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should return an array of items from the middle of the input array if both filters are valid', () => {
				const startFilter = {
					first: 'Jane'
				};
				const endFilter = {
					first: 'Jane',
					last: 'Smith'
				};

				const result = queryCollection.sliceBy(startFilter, endFilter);

				assert.equal(result, queryCollection.slice(1, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should return an array of items from the middle of the input array if both filters are valid but the end filter matches an item before the start filter', () => {
				const startFilter = {
					first: 'Jane',
					last: 'Smith'
				};
				const endFilter = {
					first: 'Jane',
					last: 'Doe'
				};

				const result = queryCollection.sliceBy(startFilter, endFilter);

				assert.equal(result, queryCollection.slice(1, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});

			it('should return an array of items from the beginning of the collection if the first filter doesn\'t match anything', () => {
				const startFilter = {
					first: 'Roger'
				};
				const endFilter = {
					first: 'Jane'
				};

				const result = queryCollection.sliceBy(startFilter, endFilter);

				assert.equal(result, queryCollection.slice(0, 3));
				assert.is(result instanceof Collection, true);
				result.remove();
			});
		});

		describe('.push, .pop', () => {
			it('should add an item to the end of the collection', () => {
				queryCollection.push(extraPerson);

				assert.is(queryCollection.findIndex({ first: 'Sarah' }), 5);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}

				const result = queryCollection.pop();

				assert.is(queryCollection.findIndex({ first: 'Sarah' }), -1);
				assert.equal(result, extraPerson);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('.unshift, .shift', () => {
			it('should add an item to the beginning of the collection', () => {
				queryCollection.unshift(extraPerson);

				assert.is(queryCollection.findIndex({ first: 'Sarah' }), 0);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}

				const result = queryCollection.shift();

				assert.is(queryCollection.findIndex({ first: 'Sarah' }), -1);
				assert.equal(result, extraPerson);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('.copyWithin', () => {
			it('should copy an item in the collection', () => {
				reset();
				const result = queryCollection.copyWithin(1, 3, 4);

				bumpBuilds();

				assert.is(queryCollection.findIndex({ first: 'Steve' }), 1);
				assert.is(queryCollection, result);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});

			it('should copy the remainder of the collection to a destination', () => {
				reset();
				const result = queryCollection.copyWithin(1);

				bumpBuilds();

				assert.is(queryCollection.filter({ first: 'John' }).length, 2);
				assert.is(queryCollection.filter({ first: 'Steve' }).length, 1);
				assert.is(queryCollection, result);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('.fill', () => {
			it('should fill specific items in the collection', () => {
				const result = queryCollection.fill({
					first: 'Matt'
				}, 2, 4);

				bumpBuilds();

				assert.is(queryCollection.findIndex({ first: 'Matt' }), 2);
				assert.is(queryCollection.filter({ first: 'Matt' }).length, 2);
				assert.is(queryCollection, result);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('.reverse', () => {
			it('should reverse the positions of the items in the collection', () => {
				reset();
				const result = queryCollection.reverse();

				bumpBuilds();

				assert.is(queryCollection.findIndex(person5), 0);
				assert.is(queryCollection.findIndex(person4), 1);
				assert.is(queryCollection.findIndex(person3), 2);
				assert.is(queryCollection.findIndex(person2), 3);
				assert.is(queryCollection.findIndex(person1), 4);
				assert.is(queryCollection, result);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('.sort', () => {
			it('should sort the items in the collection', () => {
				reset();
				const result = queryCollection.sort(compare('first'));

				bumpBuilds();

				assert.is(queryCollection.findIndex(person1), 2);
				assert.is(queryCollection.findIndex(person2), 0);
				assert.is(queryCollection.findIndex(person3), 1);
				assert.is(queryCollection.findIndex(person4), 3);
				assert.is(queryCollection.findIndex(person5), 4);
				assert.is(queryCollection, result);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('.splice', () => {
			it('should insert an item into the collection', () => {
				reset();
				const result = queryCollection.splice(2, 0, extraPerson);

				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(extraPerson), 2);
				assert.is(queryCollection.findIndex(person3), 3);
				assert.is(queryCollection.findIndex(person4), 4);
				assert.is(queryCollection.findIndex(person5), 5);
				assert.is(result.length, 0);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
				assert.is(result instanceof Collection, true);
			});

			it('should remove an item from the collection', () => {
				reset();
				const result = queryCollection.splice(2, 1);

				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(person3), -1);
				assert.is(queryCollection.findIndex(person4), 2);
				assert.is(queryCollection.findIndex(person5), 3);
				assert.is(result.length, 1);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
				assert.is(result instanceof Collection, true);
			});

			it('should replace an item in the collection', () => {
				reset();
				const result = queryCollection.splice(2, 1, extraPerson);

				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(extraPerson), 2);
				assert.is(queryCollection.findIndex(person3), -1);
				assert.is(queryCollection.findIndex(person4), 3);
				assert.is(queryCollection.findIndex(person5), 4);
				assert.is(result.length, 1);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
				assert.is(result instanceof Collection, true);
			});
		});

		describe('.length', () => {
			it('should get the length of the collection', () => {
				reset();
				assert.is(queryCollection.length, 5);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});

			it('should add empty cells to the end of the collection', () => {
				reset();

				queryCollection.length = 7;

				assert.is(queryCollection.length, 7);
				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(person3), 2);
				assert.is(queryCollection.findIndex(person4), 3);
				assert.is(queryCollection.findIndex(person5), 4);
				assert.is(queryCollection.findIndex(extraPerson), -1);
				assert.is(queryCollection[5], undefined);
				assert.is(queryCollection[6], undefined);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});

			it('should remove cells from the end of the collection', () => {
				queryCollection.length = 4;

				assert.is(queryCollection.length, 4);
				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(person3), 2);
				assert.is(queryCollection.findIndex(person4), 3);
				assert.is(queryCollection.findIndex(person5), -1);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});

			it('should remove empty cells from the end of the collection', () => {
				queryCollection.length = 7;
				queryCollection.length = 4;

				assert.is(queryCollection.length, 4);
				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(person3), 2);
				assert.is(queryCollection.findIndex(person4), 3);
				assert.is(queryCollection.findIndex(person5), -1);
				if (builds !== undefined) {
					assert.is(queryCollection[INDEXER].builds, builds);
				}
			});
		});

		describe('(after direct change)', () => {
			it('should find an item after the item changes a value', () => {
				build();

				queryCollection[4].first = 'Joe';

				assert.is(queryCollection.findIndex({ first: 'Joe' }), 4);
			});

			it('should not find an item after it\'s changed', () => {
				build();
				const result = queryCollection.splice(2, 1);

				result[0].first = 'Sam';

				assert.is(queryCollection.findIndex(person1), 0);
				assert.is(queryCollection.findIndex(person2), 1);
				assert.is(queryCollection.findIndex(person3), -1);
				assert.is(queryCollection.findIndex(person4), 2);
				assert.is(queryCollection.findIndex(person5), 3);
				assert.is(queryCollection.findIndex({ first: 'Sam' }), -1);
				assert.is(result.length, 1);
			});
		});

		describe('.remove', () => {
			it('should set the model to null and set it\'s own length to 0', () => {
				queryCollection.remove();

				assert.equal(queryCollection[MODEL], undefined);
				assert.is(queryCollection.length, 0);
			});
		});
	};

	describe('(without model)', () => {
		runQueryTests();
	});

	describe('(model, no indexes)', () => {
		runQueryTests(undefined, noIndexModel);

		describe('(after model removal)', () => {
			runQueryTests(undefined, noIndexModel, null);
		});
	});

	describe('(model, one index)', () => {
		runQueryTests(1, singleIndexModel);

		describe('(after model change)', () => {
			runQueryTests(undefined, singleIndexModel, noIndexModel);
		});

		describe('(after model removal)', () => {
			runQueryTests(undefined, singleIndexModel, null);
		});
	});

	describe('(model, all indexes)', () => {
		runQueryTests(1, fullIndexModel);

		describe('(after model change)', () => {
			runQueryTests(1, fullIndexModel, singleIndexModel);
		});

		describe('(after model removal)', () => {
			runQueryTests(undefined, fullIndexModel, null);
		});
	});
});
