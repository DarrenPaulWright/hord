import { assert } from 'type-enforcer';
import Index from '../../../src/utility/indexer/Index.js';
import Indexer from '../../../src/utility/indexer/Indexer.js';

describe('Indexer', () => {
	describe('.addIndex', () => {
		it('should add an index for a path', () => {
			const indexer = new Indexer();
			indexer.addIndex('path');

			assert.is(indexer.indexes.path instanceof Index, true);
		});
	});

	describe('.hasIndex', () => {
		it('should return true for a path that is added', () => {
			const indexer = new Indexer();
			indexer.addIndex('path');

			assert.is(indexer.hasIndex('path'), true);
		});

		it('should return false for a path that is not added', () => {
			const indexer = new Indexer();
			indexer.addIndex('path');

			assert.is(indexer.hasIndex('path2'), false);
		});
	});

	describe('.add', () => {
		it('should add an item to all indexes', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 1, i: 3 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 2, i: 3 }]);
		});
	});

	describe('.discard', () => {
		it('should remove an item from all indexes', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);

			indexer.add({
				path1: 3,
				path2: 4
			}, 4);

			indexer.discard({
				path1: 1,
				path2: 2
			}, 3);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 3, i: 4 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 4, i: 4 }]);
		});
	});

	describe('.query', () => {
		const indexer = new Indexer();
		indexer.addIndex('path1');
		indexer.addIndex('path2.x');

		indexer.add({
			path1: 'b',
			path2: {
				x: 5
			}
		}, 0);
		indexer.add({
			path1: 'b',
			path2: {
				x: 12
			}
		}, 1);
		indexer.add({
			path1: 'b',
			path2: {
				x: 20
			}
		}, 2);
		indexer.add({
			path1: 'c',
			path2: {
				x: 11
			}
		}, 3);
		indexer.add({
			path1: 'b',
			path2: {
				x: 12
			}
		}, 4);
		indexer.add({
			path1: 'a',
			path2: {
				x: 10
			}
		}, 5);

		it('should handle not finding anything on a non indexed path', () => {
			const result = indexer.query({
				path3: 'd'
			});

			assert.equal(result.matches.values(), []);
			assert.equal(result.nonIndexedSearches, { path3: { $eq: 'd' } });
			assert.is(result.usedIndexes, false);
		});

		it('should handle not finding anything on an indexed path', () => {
			const result = indexer.query({
				path1: 'd'
			});

			assert.equal(result.matches.values(), []);
			assert.equal(result.nonIndexedSearches, {});
			assert.is(result.usedIndexes, true);
		});

		it('should find a range of matching items on one shallow index', () => {
			const result = indexer.query({
				path1: 'b'
			});

			assert.equal(result.matches.values(), [0, 1, 2, 4]);
			assert.equal(result.nonIndexedSearches, {});
			assert.is(result.usedIndexes, true);
		});

		it('should find a range of matching items on nested indexer', () => {
			const result = indexer.query({
				path1: 'b',
				path2: {
					x: 12
				},
				path3: {
					x: 'x'
				}
			});

			assert.equal(result.matches.values(), [1, 4]);
			assert.equal(result.nonIndexedSearches, { path3: { x: { $eq: 'x' } } });
			assert.is(result.usedIndexes, true);
		});
	});

	describe('.update', () => {
		it('should update an items value', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);

			indexer.add({
				path1: 3,
				path2: 4
			}, 4);

			indexer.update('path1', 3, 7, 1);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 3, i: 4 }, { v: 7, i: 3 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 2, i: 3 }, { v: 4, i: 4 }]);
		});
	});

	describe('.rebuild', () => {
		it('should rebuild all indexes', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');
			const newValues = [{
				path1: 7,
				path2: 12
			}, {
				path1: 9,
				path2: 10
			}, {
				path1: 11,
				path2: 8
			}];

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);
			indexer.add({
				path1: 3,
				path2: 4
			}, 4);
			indexer.add({
				path1: 5,
				path2: 6
			}, 5);

			indexer.rebuild((callback) => newValues.map(callback));

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 7, i: 0 }, { v: 9, i: 1 }, { v: 11, i: 2 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 8, i: 2 }, { v: 10, i: 1 }, { v: 12, i: 0 }]);
		});
	});

	describe('.increment', () => {
		it('should increment all indexes by 1', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);
			indexer.add({
				path1: 3,
				path2: 4
			}, 4);
			indexer.add({
				path1: 5,
				path2: 6
			}, 5);

			indexer.increment(1);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 1, i: 4 }, { v: 3, i: 5 }, { v: 5, i: 6 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 2, i: 4 }, { v: 4, i: 5 }, { v: 6, i: 6 }]);
		});

		it('should increment all indexes starting at start by 1', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);
			indexer.add({
				path1: 3,
				path2: 4
			}, 4);
			indexer.add({
				path1: 5,
				path2: 6
			}, 5);

			indexer.increment(1, 4);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 1, i: 3 }, { v: 3, i: 5 }, { v: 5, i: 6 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 2, i: 3 }, { v: 4, i: 5 }, { v: 6, i: 6 }]);
		});

		it('should increment all indexes by -1', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);
			indexer.add({
				path1: 3,
				path2: 4
			}, 4);
			indexer.add({
				path1: 5,
				path2: 6
			}, 5);

			indexer.increment(-1);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 1, i: 2 }, { v: 3, i: 3 }, { v: 5, i: 4 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 2, i: 2 }, { v: 4, i: 3 }, { v: 6, i: 4 }]);
		});
	});

	describe('.length', () => {
		it('should remove items from all indexes', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);
			indexer.add({
				path1: 3,
				path2: 4
			}, 4);
			indexer.add({
				path1: 5,
				path2: 6
			}, 5);

			indexer.length(4);

			assert.equal(indexer.indexes.path1.list.values(), [{ v: 1, i: 3 }]);
			assert.equal(indexer.indexes.path2.list.values(), [{ v: 2, i: 3 }]);
		});
	});

	describe('.clear', () => {
		it('should clear all indexes', () => {
			const indexer = new Indexer();
			indexer.addIndex('path1');
			indexer.addIndex('path2');

			indexer.add({
				path1: 1,
				path2: 2
			}, 3);
			indexer.add({
				path1: 3,
				path2: 4
			}, 4);
			indexer.add({
				path1: 5,
				path2: 6
			}, 5);

			indexer.clear();

			assert.equal(indexer.indexes, {});
		});
	});
});
