import { benchSettings } from 'karma-webpack-bundle';
import someRight from '../../src/utility/someRight';

suite('someRight', () => {
	let sandbox;
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
	const returnFalse = (value) => value === 10;
	const returnTrueLate = (value) => value === 1;
	const returnTrueEarly = (value) => value === 9;

	benchmark('return false', () => {
		sandbox = someRight(array, returnFalse);
	}, benchSettings);

	benchmark('return true late', () => {
		sandbox = someRight(array, returnTrueLate);
	}, benchSettings);

	benchmark('return true early', () => {
		sandbox = someRight(array, returnTrueEarly);
	}, benchSettings);
});
