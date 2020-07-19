import { benchSettings } from 'karma-webpack-bundle';
import { fill } from 'object-agent';
import binarySearch from '../../src/utility/searchers/binarySearch.js';
import binarySearchLeft from '../../src/utility/searchers/binarySearchLeft.js';
import binarySearchRight from '../../src/utility/searchers/binarySearchRight.js';
import scanSearchLeft from '../../src/utility/searchers/scanSearchLeft.js';
import scanSearchRight from '../../src/utility/searchers/scanSearchRight.js';

const benchSearch = (searcher) => {
	let sandbox = 0;
	const comparer = (a, b) => a - b;

	[5, 10, 20, 100, 500, 1000, 10000]
		.forEach((length) => {
			const sortedArray = fill(length);
			const high = length - 1;
			const mid = high >>> 1;

			benchmark(`0 of ${high}`, () => {
				sandbox = searcher(sortedArray, 0, comparer);
			}, benchSettings);

			benchmark(`${mid} of ${high}`, () => {
				sandbox = searcher(sortedArray, mid, comparer);
			}, benchSettings);

			benchmark(`${high} of ${high}`, () => {
				sandbox = searcher(sortedArray, high, comparer);
			}, benchSettings);
		});
};

suite('binarySearch', () => {
	benchSearch(binarySearch);
});

suite('binarySearch (right)', () => {
	benchSearch((array, item, comparer) => {
		return binarySearch(array, item, comparer, false, true);
	}, true);
});

suite('binarySearchLeft', () => {
	benchSearch(binarySearchLeft);
});

suite('binarySearchRight', () => {
	benchSearch(binarySearchRight);
});

suite('scanSearchLeft', () => {
	benchSearch(scanSearchLeft);
});

suite('scanSearchRight', () => {
	benchSearch(scanSearchRight);
});
