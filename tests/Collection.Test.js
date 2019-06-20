import { assert } from 'chai';
import { Collection, Model } from '../src';

describe('Collection', () => {
	describe('.value', () => {
		it('should accept an array when instantiated', () => {
			assert.equal(new Collection([{value: 1}]).length, 1);
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

			assert.deepEqual(testCollection.first(), {
				id: 2,
				two: 10,
				value: 'test 2'
			});
			assert.equal(testCollection.length, 4);
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

			assert.deepEqual(testCollection.last(), {
				id: 1,
				two: 13,
				value: 'test 1'
			});
			assert.equal(testCollection.length, 4);
		});
	});

	describe('.indexOf', () => {
		it('should return the index of the item', () => {
			const object1 = {
				id: 1
			};
			const object2 = {
				id: 2
			};
			const object3 = {
				id: 3
			};
			const testCollection = new Collection(object1, object2, object2, object3);

			assert.deepEqual(testCollection.indexOf(object2), 1);
		});

		it('should return -1 for an item that isnt in the collection', () => {
			const object1 = {
				id: 1
			};
			const object2 = {
				id: 2
			};
			const object3 = {
				id: 3
			};
			const testCollection = new Collection(object1, object2, object2, object3);

			assert.deepEqual(testCollection.indexOf({}), -1);
		});
	});

	describe('.lastIndexOf', () => {
		it('should return the last index of the item', () => {
			const object1 = {
				id: 1
			};
			const object2 = {
				id: 2
			};
			const object3 = {
				id: 3
			};
			const testCollection = new Collection(object1, object2, object2, object3);

			assert.deepEqual(testCollection.lastIndexOf(object2), 2);
		});

		it('should return -1 for an item that isnt in the collection', () => {
			const object1 = {
				id: 1
			};
			const object2 = {
				id: 2
			};
			const object3 = {
				id: 3
			};
			const testCollection = new Collection(object1, object2, object2, object3);

			assert.deepEqual(testCollection.lastIndexOf({}), -1);
		});
	});

	describe('.includes', () => {
		it('should return the last index of the item', () => {
			const object1 = {
				id: 1
			};
			const object2 = {
				id: 2
			};
			const object3 = {
				id: 3
			};
			const testCollection = new Collection(object1, object2, object2, object3);

			assert.deepEqual(testCollection.includes(object2), true);
		});

		it('should return -1 for an item that isnt in the collection', () => {
			const object1 = {
				id: 1
			};
			const object2 = {
				id: 2
			};
			const object3 = {
				id: 3
			};
			const testCollection = new Collection(object1, object2, object2, object3);

			assert.deepEqual(testCollection.includes({}), false);
		});
	});

	describe('.forEachRight', () => {
		it('should call a callback for each item in collection, starting at the right', () => {
			let total = 0;
			let testVar = 3;
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

			testCollection.forEachRight((item, index) => {
				total++;
				if (index === testVar) {
					testVar--;
				}
			});

			assert.equal(testVar, -1);
			assert.equal(total, 4);
		});
	});

	describe('.someRight', () => {
		it('should call a callback for each item in collection, starting at the right', () => {
			let total = 0;
			let testVar = 3;
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

			testCollection.someRight((item, index) => {
				total++;
				if (index === testVar) {
					testVar--;
				}
				if (index === 2) {
					return true;
				}
			});

			assert.equal(testVar, 1);
			assert.equal(total, 2);
		});
	});

	describe('.find', () => {
		it('should find an item via a callback', () => {
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
			const testOutput = {
				id: 3,
				two: 12,
				value: 'test 4'
			};

			assert.deepEqual(testCollection.find((item) => item.id === 3 && item.two === 12), testOutput);
		});

		it('should find an item that matches an object', () => {
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
			const testOutput = {
				id: 3,
				two: 12,
				value: 'test 4'
			};

			assert.deepEqual(testCollection.find({id: 3, two: 12}), testOutput);
		});
	});

	describe('.findLast', () => {
		it('should find an item via a callback', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.findLast((item) => item.id === 3 && item.two === 12), testCollection[3]);
		});

		it('should find an item that matches an object', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.findLast({id: 3, two: 12}), testCollection[3]);
		});
	});

	describe('.filter', () => {
		it('should find an item via a callback', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.filter((item) => item.id === 3 && item.two === 12), testCollection.slice(2, 4));
		});

		it('should find an item that matches an object', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.filter({id: 3, two: 12}), testCollection.slice(2, 4));
		});

		it('should find an item that matches an object', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.filter({id: 3, two: 13}), []);
		});
	});

	describe('.findIndex', () => {
		it('should find an item via a callback', () => {
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

			assert.deepEqual(testCollection.findIndex((item) => item.id === 3 && item.two === 12), 2);
		});

		it('should find an item that matches an object', () => {
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

			assert.deepEqual(testCollection.findIndex({id: 3, two: 12}), 2);
		});
	});

	describe('.findLastIndex', () => {
		it('should find an item via a callback', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.findLastIndex((item) => item.id === 3 && item.two === 12), 3);
		});

		it('should find an item that matches an object', () => {
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
				id: 3,
				two: 12,
				value: 'test 5'
			}, {
				id: 1,
				two: 13,
				value: 'test 1'
			});

			assert.deepEqual(testCollection.findLastIndex({id: 3, two: 12}), 3);
		});
	});

	describe('.slice', () => {
		it('should return an empty collection if the collection is empty', () => {
			const output = new Collection().slice();
			assert.deepEqual(output, []);
			assert.isTrue(output instanceof Collection);
		});
	});

	describe('.sliceBy', () => {
		const testCollection = new Collection({
			prop: 'test 1'
		}, {
			prop: 'test 2'
		}, {
			prop: 'test 3'
		}, {
			prop: 'test 4'
		}, {
			prop: 'test 5'
		});

		it('should return an empty collection if the collection is empty', () => {
			const output = new Collection().sliceBy();
			assert.deepEqual(output, []);
			assert.isTrue(output instanceof Collection);
		});

		it('should return an array of items from the beginning of the input array if no endFilter is provided', () => {
			const output = [{
				prop: 'test 3'
			}, {
				prop: 'test 4'
			}, {
				prop: 'test 5'
			}];
			const startFilter = {
				prop: 'test 3'
			};

			assert.deepEqual(testCollection.sliceBy(startFilter), output);
		});

		it('should return an array of items from the middle of the input array if both filters are valid', () => {
			const output = [{
				prop: 'test 2'
			}, {
				prop: 'test 3'
			}, {
				prop: 'test 4'
			}];
			const startFilter = {
				prop: 'test 2'
			};
			const endFilter = {
				prop: 'test 4'
			};

			assert.deepEqual(testCollection.sliceBy(startFilter, endFilter), output);
		});

		it('should return an array of items from the middle of the input array if both filters are valid but the end filter matches an item before the start filter', () => {
			const output = [{
				prop: 'test 2'
			}, {
				prop: 'test 3'
			}, {
				prop: 'test 4'
			}];
			const startFilter = {
				prop: 'test 4'
			};
			const endFilter = {
				prop: 'test 2'
			};

			assert.deepEqual(testCollection.sliceBy(startFilter, endFilter), output);
		});

		it('should return an array of items from the end of the input array if the first filter doesn\'t match anything', () => {
			const output = [{
				prop: 'test 1'
			}, {
				prop: 'test 2'
			}, {
				prop: 'test 3'
			}];
			const startFilter = {
				prop: 'test !'
			};
			const endFilter = {
				prop: 'test 3'
			};

			assert.deepEqual(testCollection.sliceBy(startFilter, endFilter), output);
		});
	});

	describe('.flatten', () => {
		it('should return an empty collection if the collection is empty', () => {
			const output = new Collection().flatten();
			assert.deepEqual(output, []);
			assert.isTrue(output instanceof Collection);
		});

		it('should return the input if the input is an object without children', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			});
			const output = [{
				prop: 'test 1'
			}];

			assert.deepEqual(testCollection.flatten(), output);
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

			assert.deepEqual(testCollection.flatten(), output);
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

			assert.deepEqual(testCollection.flatten(), output);
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

			assert.deepEqual(testCollection.flatten(settings), output);
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

			assert.deepEqual(testCollection.flatten(settings), output);
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
				onParent: function(item) {
					item.testProperty = item.prop;
				}
			};

			assert.deepEqual(testCollection.flatten(settings), output);
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
				onChild: function(item) {
					item.testProperty = item.prop;
				}
			};

			assert.deepEqual(testCollection.flatten(settings), output);
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
				onParent: function(item) {
					return item.ignoreChildren;
				}
			};

			assert.deepEqual(testCollection.flatten(settings), output);
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
			let parentContext;
			let childContext;
			const settings = {
				childKey: 'children2',
				saveDepth: true,
				onParent: function(item, parent) {
					parentContext = this;
					item.testProperty = 'parent ' + item.prop;
					if (parent) {
						item.parentProp = parent.prop;
					}
					return item.ignoreChildren;
				},
				onChild: function(item, parent) {
					childContext = this;
					item.testProperty = 'child ' + item.prop;
					if (parent) {
						item.parentProp = parent.prop;
					}
					return item.prop === 'test 4';
				}
			};

			assert.deepEqual(testCollection.flatten(settings), output);
			assert.equal(parentContext, testCollection);
			assert.equal(childContext, testCollection);
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
				onParent: function(item) {
					item.testProperty = 'parent ' + item.prop;
				},
				onChild: function(item) {
					item.testProperty = 'child ' + item.prop;
				}
			};

			testCollection.flatten(settings);

			assert.deepEqual(testCollection, output);
		});
	});

	describe('.nest', () => {
		it('should return an empty collection if the collection is empty', () => {
			const output = new Collection().nest();
			assert.deepEqual(output, []);
			assert.isTrue(output instanceof Collection);
		});

		it('should return the input if the input doesn\'t have parents', () => {
			const testCollection = new Collection({
				prop: 'test 1'
			});
			const output = [{
				prop: 'test 1'
			}];

			assert.deepEqual(testCollection.nest(), output);
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

			assert.deepEqual(testCollection.nest(), output);
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

			assert.deepEqual(testCollection.nest({
				deleteParentKey: true
			}), output);
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

			assert.equal(total, 6);
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

			assert.equal(total, 3);
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

			assert.equal(total, 3);
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

			assert.equal(total, 6);
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

			assert.equal(total, 4);
		});

		it('should call the onParent callback if provided', () => {
			let total = 0;
			let parentContext;
			let childContext;
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
				onParent: function(item, depth) {
					parentContext = this;
					total += depth;
				}
			});

			assert.equal(total, 1);
			assert.equal(parentContext, testCollection);
			assert.equal(childContext, testCollection);
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
				onParent: (item) => {
					return item.prop === 'test 5';
				}
			});

			assert.equal(total, 5);
		});
	});

	describe('.unique', () => {
		it('should return an empty collection if the collection is empty', () => {
			const output = new Collection().unique();
			assert.deepEqual(output, []);
			assert.isTrue(output instanceof Collection);
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

			const output = testCollection.unique();

			assert.deepEqual(output, testOutput);
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

			const output = testCollection.unique('count');

			assert.deepEqual(output, testOutput);
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

			const output = testCollection1.merge(testCollection2, 'id', (x, y) => ({
				x: x.value,
				y: y.value
			}));

			assert.deepEqual(output, testOutput);
			assert.isTrue(output instanceof Collection);
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

			const output = testCollection1.merge([testCollection2,
				testCollection3], 'id', (x, y, z) => ({
				x: x.value,
				y: y.value,
				z: z.value
			}));

			assert.deepEqual(output, testOutput);
		});

		it('should return a new collection with zipped data from three arrays with multiples of some IDs', () => {
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

			const output = testCollection1.merge([testCollection2,
				testCollection3], 'id', (x, y, z) => ({
				x: x.value,
				y: y.value,
				z: z.value
			}));

			assert.deepEqual(output, testOutput);
		});
	});

	describe('.model', () => {
		const Person = new Model({
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

		it('should enforce the model on an item that is pushed', () => {
			const testCollection1 = new Collection().model(Person);

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

			assert.deepEqual(testCollection1[0], {
				first: 'John',
				last: 'Doe'
			});
			assert.deepEqual(testCollection1[1], {
				first: 'Jane',
				last: 'Doe'
			});
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

			assert.deepEqual(testCollection1[0], {
				first: 'John',
				last: 'Doe'
			});
			assert.deepEqual(testCollection1[1], {
				first: 'Jane',
				last: 'Doe'
			});
		});
	});
});
