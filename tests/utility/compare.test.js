import displayValue from 'display-value';
import { assert } from 'type-enforcer';
import { compare } from '../../index.js';

describe('compare', () => {
	const values = [1, 2, 'string', 'string2', NaN, null, undefined];

	values.forEach((value1, index1) => {
		values.forEach((value2, index2) => {
			const expected = index1 < index2 ? -1 : (index1 > index2 ? 1 : 0);

			it(`should return ${displayValue(expected)} for ${displayValue(value1)} and ${displayValue(value2)}`, () => {
				assert.is(compare()(value1, value2), expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}} and {x: ${displayValue(value2)}}`, () => {
				assert.is(compare('x')({ x: value1 }, { x: value2 }), expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}} and {x: ${displayValue(value2)}} with the key in an array`, () => {
				assert.is(compare(['x'])({ x: value1 }, { x: value2 }), expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}, y: 1} and {x: ${displayValue(value2)}, y: 1} with the keys ['y', 'x']`, () => {
				assert.is(compare(['y', 'x'])({ x: value1, y: 1 }, { x: value2, y: 1 }), expected);
			});

			it(`should return ${displayValue(expected)} for ${displayValue(value1)} and ${displayValue(value2)} when desc: true`, () => {
				assert.is(compare(undefined, true)(value1, value2) === -expected, true);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}} and {x: ${displayValue(value2)}} when desc: true`, () => {
				assert.is(compare('x', true)({ x: value1 }, { x: value2 }) === -expected, true);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}} and {x: ${displayValue(value2)}} with the key in an array when desc: true`, () => {
				assert.is(compare(['x'], true)({ x: value1 }, { x: value2 }), -expected);
			});

			it(`should return ${displayValue(expected)} for {x: ${displayValue(value1)}, y: 1} and {x: ${displayValue(value2)}, y: 1} with the keys ['y', 'x'] when desc: true`, () => {
				assert.is(compare(['y', 'x'], true)({ x: value1, y: 1 }, { x: value2, y: 1 }), -expected);
			});
		});
	});

	describe('array.sort', () => {
		it('should sort an array of simple values', () => {
			const values = [4, 9, 3, 8, NaN, 2, 7, 1, 6, 5, undefined, null];

			values.sort(compare());

			assert.is(values[0], 1);
			assert.is(values[1], 2);
			assert.is(values[2], 3);
			assert.is(values[3], 4);
			assert.is(values[4], 5);
			assert.is(values[5], 6);
			assert.is(values[6], 7);
			assert.is(values[7], 8);
			assert.is(values[8], 9);
			assert.is(Object.is(values[9], NaN), true);
			assert.is(values[10], null);
			assert.is(values[11], undefined);

			values.sort(compare(undefined, true));

			assert.is(values[10], 1);
			assert.is(values[9], 2);
			assert.is(values[8], 3);
			assert.is(values[7], 4);
			assert.is(values[6], 5);
			assert.is(values[5], 6);
			assert.is(values[4], 7);
			assert.is(values[3], 8);
			assert.is(values[2], 9);
			assert.is(Object.is(values[1], NaN), true);
			assert.is(values[0], null);
			assert.is(values[11], undefined);
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
			const expectedDesc = [{
				x: 9
			}, {
				x: 8
			}, {
				x: 7
			}, {
				x: 6
			}, {
				x: 5
			}, {
				x: 4
			}, {
				x: 3
			}, {
				x: 2
			}, {
				x: 1
			}];

			values.sort(compare('x'));

			assert.equal(values, expected);

			values.sort(compare('x', true));

			assert.equal(values, expectedDesc);
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

			assert.equal(values, expected);
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
			const expectedDesc = [{
				x: 9,
				y: 1
			}, {
				x: 8,
				y: 1
			}, {
				x: 7,
				y: 1
			}, {
				x: 6,
				y: 1
			}, {
				x: 5,
				y: 1
			}, {
				x: 4,
				y: 1
			}, {
				x: 3,
				y: 3
			}, {
				x: 3,
				y: 2
			}, {
				x: 3,
				y: 1
			}, {
				x: 2,
				y: 1
			}, {
				x: 1,
				y: 1
			}];

			values.sort(compare(['x', 'y']));

			assert.equal(values, expected);

			values.sort(compare(['x', 'y'], true));

			assert.equal(values, expectedDesc);
		});
	});
});
