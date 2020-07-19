import { fill } from 'object-agent';
import { assert } from 'type-enforcer';
import { List } from '../../index.js';
import binarySearch from '../../src/utility/searchers/binarySearch.js';
import binarySearchLeft from '../../src/utility/searchers/binarySearchLeft.js';
import binarySearchRight from '../../src/utility/searchers/binarySearchRight.js';
import scanSearchLeft from '../../src/utility/searchers/scanSearchLeft.js';
import scanSearchRight from '../../src/utility/searchers/scanSearchRight.js';

const array100 = fill(100);
const comparerAsc = List.comparers.number.asc;

const testSearch = (searcher, isRight) => {
	it('should return the right index for the first item of an array', () => {
		assert.is(searcher(array100, 0, comparerAsc), 0);
	});

	it('should return the right index for the last item of an array', () => {
		assert.is(searcher(array100, 99, comparerAsc), 99);
	});

	it('should return the right index near the beginning of an array', () => {
		assert.is(searcher(array100, 9, comparerAsc), 9);
	});

	it('should return the right index near the end of an array', () => {
		assert.is(searcher(array100, 93, comparerAsc), 93);
	});

	it('should return the right index just before the middle of an array', () => {
		assert.is(searcher(array100, 48, comparerAsc), 48);
	});

	it('should return the right index just after the middle of an array', () => {
		assert.is(searcher(array100, 51, comparerAsc), 51);
	});

	it('should return -1 for a value that is less than all the values in the array', () => {
		assert.is(searcher(array100, -2, comparerAsc), -1);
	});

	it('should return -1 for a value that isn\'t in the array', () => {
		assert.is(searcher(array100, 50.5, comparerAsc), -1);
	});

	it('should return -1 for a value that is greater than all the values in the array', () => {
		assert.is(searcher(array100, 103, comparerAsc), -1);
	});

	describe('isInsert = true', () => {
		it('should return the right index for the first item of an array', () => {
			assert.is(searcher(array100, 0, comparerAsc, true), 0);
		});

		it('should return the right index for the last item of an array', () => {
			assert.is(searcher(array100, 99, comparerAsc, true), 99);
		});

		it('should return the right index near the beginning of an array', () => {
			assert.is(searcher(array100, 9, comparerAsc, true), 9);
		});

		it('should return the right index near the end of an array', () => {
			assert.is(searcher(array100, 98, comparerAsc, true), 98);
		});

		it('should return the right index just before the middle of an array', () => {
			assert.is(searcher(array100, 49, comparerAsc, true), 49);
		});

		it('should return the right index just after the middle of an array', () => {
			assert.is(searcher(array100, 51, comparerAsc, true), 51);
		});

		it('should return the last index for a value that is greater than all others in the big array', () => {
			assert.is(searcher(array100, 101, comparerAsc, true), 99);
		});

		it('should return the last index for a value that is greater than all others in the array', () => {
			assert.is(searcher([1, 2, 3, 4, 8, 9, 10, 11, 12, 13, 14, 15, 16], 5, comparerAsc, true), 3);
		});

		it('should return the index of the first (or last) of multiple items in the middle of the array', () => {
			assert.is(searcher([1, 2, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, comparerAsc, true), isRight ? 5 : 2);
		});

		it('should return 0 as the index of the first (or last) of multiple items in the beginning of the array', () => {
			assert.is(searcher([3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, comparerAsc, true), isRight ? 3 : 0);
		});

		it('should return 0 as the index of the first (or last) of multiple items in the end of the array', () => {
			assert.is(searcher([3, 4, 5, 6, 7, 8, 9, 10, 10, 10], 10, comparerAsc, true), isRight ? 9 : 7);
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
