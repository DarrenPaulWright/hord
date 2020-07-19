import { benchSettings } from 'karma-webpack-bundle';
import findLastIndex from '../../src/utility/findLastIndex.js';

suite('findLastIndex', () => {
	let sandbox = 0;
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const returnFalse = (value) => value === 10;
	const returnTrueLate = (value) => value === 1;
	const returnTrueEarly = (value) => value === 9;

	benchmark('return false', () => {
		sandbox = findLastIndex(array, returnFalse);
	}, benchSettings);

	benchmark('return true late', () => {
		sandbox = findLastIndex(array, returnTrueLate);
	}, benchSettings);

	benchmark('return true early', () => {
		sandbox = findLastIndex(array, returnTrueEarly);
	}, benchSettings);
});
