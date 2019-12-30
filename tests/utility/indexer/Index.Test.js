import { assert } from 'chai';
import Index from '../../../src/utility/indexer/Index';

describe('Index', () => {
	describe('.add', () => {
		it('should sort value first then index', () => {
			const index = new Index();
			const expected = [{
				v: 'a',
				i: 3
			}, {
				v: 'b',
				i: 0
			}, {
				v: 'b',
				i: 1
			}, {
				v: 'b',
				i: 4
			}, {
				v: 'b',
				i: 5
			}, {
				v: 'c',
				i: 2
			}];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4);

			assert.deepEqual(index.list.values(), expected);
		});
	});

	describe('.discard', () => {
		it('should remove a value from the index', () => {
			const index = new Index();
			const expected = [{
				v: 'a',
				i: 3
			}, {
				v: 'b',
				i: 0
			}, {
				v: 'b',
				i: 4
			}, {
				v: 'b',
				i: 5
			}, {
				v: 'c',
				i: 2
			}];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4)
				.discard('b', 1);

			assert.deepEqual(index.list.values(), expected);
		});
	});

	describe('.query', () => {
		it('should return an array of matching indexes', () => {
			const index = new Index();

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4);

			const result = index.query('b', '$eq');

			assert.deepEqual(result.values(), [0, 1, 4, 5]);
		});

		it('should return an empty array if there\'s no match', () => {
			const index = new Index();

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4);

			const result = index.query('d');

			assert.deepEqual(result.values(), []);
		});
	});

	describe('.rebuild', () => {
		it('should build and sort new values', () => {
			const index = new Index();
			const expected = [{
				v: 'd',
				i: 2
			}, {
				v: 'e',
				i: 0
			}, {
				v: 'f',
				i: 1
			}, {
				v: undefined,
				i: 3
			}];
			const newValues = [{
				test: 'e'
			}, {
				test: 'f'
			}, {
				test: 'd'
			}, undefined];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4);

			index.rebuild((callback) => newValues.map(callback), (item) => item.test);

			assert.deepEqual(index.list.values(), expected);
		});
	});

	describe('.spawn', () => {
		it('should return a new Index with matching items', () => {
			const index = new Index();
			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4);

			const result = index.spawn([1, 3, 5]);

			assert.equal(index.list.comparer(), result.list.comparer());
			assert.deepEqual(result.list.values(), [{
				v: 'a',
				i: 1
			}, {
				v: 'b',
				i: 0
			}, {
				v: 'b',
				i: 2
			}]);
		});
	});

	describe('.increment', () => {
		it('should increment all indexes by 1', () => {
			const index = new Index();
			const expected = [{
				v: 'a',
				i: 4
			}, {
				v: 'b',
				i: 1
			}, {
				v: 'b',
				i: 2
			}, {
				v: 'b',
				i: 5
			}, {
				v: 'b',
				i: 6
			}, {
				v: 'c',
				i: 3
			}];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4)
				.increment(1);

			assert.deepEqual(index.list.values(), expected);
		});

		it('should increment all indexes starting at start by 1', () => {
			const index = new Index();
			const expected = [{
				v: 'a',
				i: 4
			}, {
				v: 'b',
				i: 0
			}, {
				v: 'b',
				i: 1
			}, {
				v: 'b',
				i: 5
			}, {
				v: 'b',
				i: 6
			}, {
				v: 'c',
				i: 2
			}];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4)
				.increment(1, 3);

			assert.deepEqual(index.list.values(), expected);
		});

		it('should increment all indexes by -1', () => {
			const index = new Index();
			const expected = [{
				v: 'a',
				i: 2
			}, {
				v: 'b',
				i: -1
			}, {
				v: 'b',
				i: 0
			}, {
				v: 'b',
				i: 3
			}, {
				v: 'b',
				i: 4
			}, {
				v: 'c',
				i: 1
			}];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4)
				.increment(-1);

			assert.deepEqual(index.list.values(), expected);
		});
	});

	describe('.length', () => {
		it('should remove items greater than or equal to value', () => {
			const index = new Index();
			const expected = [{
				v: 'a',
				i: 3
			}, {
				v: 'b',
				i: 0
			}, {
				v: 'b',
				i: 1
			}, {
				v: 'c',
				i: 2
			}];

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4)
				.length(4);

			assert.deepEqual(index.list.values(), expected);
		});
	});

	describe('.clear', () => {
		it('should remove all items from the list', () => {
			const index = new Index();

			index.add('b', 1)
				.add('a', 3)
				.add('c', 2)
				.add('b', 0)
				.add('b', 5)
				.add('b', 4);

			index.clear();

			assert.deepEqual(index.list.values(), []);
		});
	});
});
