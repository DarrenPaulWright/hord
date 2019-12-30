import { assert } from 'chai';
import { fill } from 'object-agent';
import { List } from '../../index';
import binarySearch from '../../src/utility/searchers/binarySearch';
import binarySearchLeft from '../../src/utility/searchers/binarySearchLeft';
import binarySearchRight from '../../src/utility/searchers/binarySearchRight';
import scanSearchLeft from '../../src/utility/searchers/scanSearchLeft';
import scanSearchRight from '../../src/utility/searchers/scanSearchRight';

const array = fill(100);
const comparer = List.comparers.number.asc;

const testSearch = (searcher, isRight) => {
	it('should return the right index for the first item of an array', () => {
		assert.equal(searcher(array, 0, comparer), 0);
	});

	it('should return the right index for the last item of an array', () => {
		assert.equal(searcher(array, 99, comparer), 99);
	});

	it('should return the right index near the beginning of an array', () => {
		assert.equal(searcher(array, 9, comparer), 9);
	});

	it('should return the right index near the end of an array', () => {
		assert.equal(searcher(array, 93, comparer), 93);
	});

	it('should return the right index just before the middle of an array', () => {
		assert.equal(searcher(array, 48, comparer), 48);
	});

	it('should return the right index just after the middle of an array', () => {
		assert.equal(searcher(array, 51, comparer), 51);
	});

	it('should return -1 for a value that is less than all the values in the array', () => {
		assert.equal(searcher(array, -2, comparer), -1);
	});

	it('should return -1 for a value that isn\'t in the array', () => {
		assert.equal(searcher(array, 50.5, comparer), -1);
	});

	it('should return -1 for a value that is greater than all the values in the array', () => {
		assert.equal(searcher(array, 103, comparer), -1);
	});

	describe('isInsert = true', () => {
		it('should return the right index for the first item of an array', () => {
			assert.equal(searcher(array, 0, comparer, true), 0);
		});

		it('should return the right index for the last item of an array', () => {
			assert.equal(searcher(array, 99, comparer, true), 99);
		});

		it('should return the right index near the beginning of an array', () => {
			assert.equal(searcher(array, 9, comparer, true), 9);
		});

		it('should return the right index near the end of an array', () => {
			assert.equal(searcher(array, 98, comparer, true), 98);
		});

		it('should return the right index just before the middle of an array', () => {
			assert.equal(searcher(array, 49, comparer, true), 49);
		});

		it('should return the right index just after the middle of an array', () => {
			assert.equal(searcher(array, 51, comparer, true), 51);
		});

		it('should return the last index for a value that is greater than all others in the big array', () => {
			assert.equal(searcher(array, 101, comparer, true), 99);
		});

		it('should return the last index for a value that is greater than all others in the array', () => {
			assert.equal(searcher([1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, comparer, true), 3);
		});

		it('should return the index of the first (or last) of multiple items in the middle of the array', () => {
			assert.equal(searcher([1, 2, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, comparer, true), isRight ? 5 : 2);
		});

		it('should return 0 as the index of the first (or last) of multiple items in the beginning of the array', () => {
			assert.equal(searcher([3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, comparer, true), isRight ? 3 : 0);
		});

		it('should return 0 as the index of the first (or last) of multiple items in the end of the array', () => {
			assert.equal(searcher([3, 4, 5, 6, 7, 8, 9, 10, 10, 10], 10, comparer, true), isRight ? 9 : 7);
		});
	});
};

describe('binarySearchLeft', () => {
	testSearch(binarySearchLeft);
});

describe('binarySearchRight', () => {
	testSearch(binarySearchRight, true);
});

describe('binarySearch', () => {
	testSearch(binarySearch);
});

describe('binarySearch Right', () => {
	testSearch((array, item, comparer, isInsert) => binarySearch(array, item, comparer, isInsert, true), true);
});

describe('scanSearchLeft', () => {
	testSearch(scanSearchLeft);
});

describe('scanSearchRight', () => {
	testSearch(scanSearchRight, true);
});
