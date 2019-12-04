import { benchSettings } from 'karma-webpack-bundle';
import { enforceNumber } from 'type-enforcer-ui';
import { checkLength, checkNumericRange } from '../../../src/Schema/parse/typeRules';

suite('checkNumericRange', () => {
	let sandbox;

	benchmark('clamp false', () => {
		sandbox = checkNumericRange({
			enforce: enforceNumber
		}, 10, 1);
	}, benchSettings);

	benchmark('clamp true', () => {
		sandbox = checkNumericRange({
			clamp: true,
			coerce: false,
			enforce: enforceNumber,
			min: 5,
			max: 15
		}, 10, 1);
	}, benchSettings);

	benchmark('clamp true, outside range', () => {
		sandbox = checkNumericRange({
			clamp: true,
			coerce: false,
			enforce: enforceNumber,
			min: 5,
			max: 15
		}, 20, 1);
	}, benchSettings);
});

suite('checkLength', () => {
	let sandbox;

	benchmark('no limits', () => {
		sandbox = checkLength({}, [1, 2, 3]);
	}, benchSettings);

	benchmark('below min', () => {
		sandbox = checkLength({
			minLength: 4,
			maxLength: 6
		}, [1, 2, 3]);
	}, benchSettings);

	benchmark('above max', () => {
		sandbox = checkLength({
			minLength: 1,
			maxLength: 2
		}, [1, 2, 3]);
	}, benchSettings);
});
