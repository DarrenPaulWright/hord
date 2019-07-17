import { assert } from 'chai';
import displayValue from 'display-value';
import compare from '../../src/utility/compare';

describe('compare', () => {
	const values = [NaN, null, 'string', undefined];

	values.forEach((value1, index1) => {
		values.forEach((value2, index2) => {
			const expected = index1 < index2 ? -1 : (index1 > index2 ? 1 : 0);

			it(`should return ${displayValue(expected)} for ${displayValue(value1)} and ${displayValue(value2)}`, () => {
				assert.equal(compare()(value1, value2), expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}} and {x: ${displayValue(value2)}}`, () => {
				assert.equal(compare('x')({x: value1}, {x: value2}), expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}} and {x: ${displayValue(value2)}} with the key in an array`, () => {
				assert.equal(compare(['x'])({x: value1}, {x: value2}), expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}, y: 1} and {x: ${displayValue(value2)}, y: 1} with the keys ['y', 'x']`, () => {
				assert.equal(compare(['y', 'x'])({x: value1, y: 1}, {x: value2, y: 1}), expected);
			});
		});
	});

	describe('array.sort', () => {
		it('should sort an array of simple values', () => {
			const values = [
				4, 9, 3, 8, NaN, 2, 7, 1, 6, 5, undefined, null
			];
			const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, NaN, null, undefined];

			values.sort(compare());

			assert.deepEqual(values, expected);
		});

		it('should sort an array of objects with a key', () => {
			const values = [{
				x: 4
			}, {
				x: 9
			}, {
				x: 3
			}, {
				x: 8
			}, {
				x: 2
			}, {
				x: 7
			}, {
				x: 1
			}, {
				x: 6
			}, {
				x: 5
			}];
			const expected = [{
				x: 1
			}, {
				x: 2
			}, {
				x: 3
			}, {
				x: 4
			}, {
				x: 5
			}, {
				x: 6
			}, {
				x: 7
			}, {
				x: 8
			}, {
				x: 9
			}];

			values.sort(compare('x'));

			assert.deepEqual(values, expected);
		});

		it('should sort an array of objects with a key in an array', () => {
			const values = [{
				x: 4
			}, {
				x: 9
			}, {
				x: 3
			}, {
				x: 8
			}, {
				x: 2
			}, {
				x: 7
			}, {
				x: 1
			}, {
				x: 6
			}, {
				x: 5
			}];
			const expected = [{
				x: 1
			}, {
				x: 2
			}, {
				x: 3
			}, {
				x: 4
			}, {
				x: 5
			}, {
				x: 6
			}, {
				x: 7
			}, {
				x: 8
			}, {
				x: 9
			}];

			values.sort(compare(['x']));

			assert.deepEqual(values, expected);
		});

		it('should sort an array of objects with a multiple keys', () => {
			const values = [{
				x: 4,
				y: 1
			}, {
				x: 3,
				y: 3
			}, {
				x: 9,
				y: 1
			}, {
				x: 3,
				y: 1
			}, {
				x: 8,
				y: 1
			}, {
				x: 2,
				y: 1
			}, {
				x: 3,
				y: 2
			}, {
				x: 7,
				y: 1
			}, {
				x: 1,
				y: 1
			}, {
				x: 6,
				y: 1
			}, {
				x: 5,
				y: 1
			}];
			const expected = [{
				x: 1,
				y: 1
			}, {
				x: 2,
				y: 1
			}, {
				x: 3,
				y: 1
			}, {
				x: 3,
				y: 2
			}, {
				x: 3,
				y: 3
			}, {
				x: 4,
				y: 1
			}, {
				x: 5,
				y: 1
			}, {
				x: 6,
				y: 1
			}, {
				x: 7,
				y: 1
			}, {
				x: 8,
				y: 1
			}, {
				x: 9,
				y: 1
			}];

			values.sort(compare(['x', 'y']));

			assert.deepEqual(values, expected);
		});
	});
});
