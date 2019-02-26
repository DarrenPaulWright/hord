import { assert } from 'chai';
import { List } from '../src';
import { sortedIndexOf } from '../src/List';

const defaultSorter = (a, b) => a.id === b.id ? 0 : a.id < b.id ? -1 : 1;
const buildArray = (length) => {
	const array = [];
	for (let i = 0; i < length; i++) {
		array.push(i);
	}
	return array;
};

const bigArray = buildArray(1000000);

describe('sortedIndexOf', () => {
	const bigArrayID = bigArray.map((id) => {
		return {id: id};
	});

	it('should return the right index for the first item of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 0}, defaultSorter), 0);
	});

	it('should return the right index for the last item of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 999999}, defaultSorter), 999999);
	});

	it('should return the right index near the beginning of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 9}, defaultSorter), 9);
	});

	it('should return the right index near the end of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 987300}, defaultSorter), 987300);
	});

	it('should return the right index just before the middle of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 499500}, defaultSorter), 499500);
	});

	it('should return the right index just after the middle of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 500009}, defaultSorter), 500009);
	});

	it('should return -1 for a value that isn\'t in the array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 1000001}, defaultSorter), -1);
	});

	describe('isLast = true', () => {
		it('should return -1 for a value that isn\'t in the array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 1000001}, defaultSorter, false, true), -1);
		});

		it('should return the index of the last of multiple items in the array', () => {
			assert.equal(sortedIndexOf([1,
				2,
				3,
				3,
				3,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10], 3, null, false, true), 5);
		});

		it('should return 9 as the index of the last of multiple items in the array', () => {
			assert.equal(sortedIndexOf([3, 4, 5, 6, 7, 8, 9, 10, 10, 10], 10, null, false, true), 9);
		});
	});

	describe('isInsert = true', () => {
		it('should return the right index for the first item of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 0}, defaultSorter, true), 0);
		});

		it('should return the right index for the last item of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 999999}, defaultSorter, true), 999999);
		});

		it('should return the right index near the beginning of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 9}, defaultSorter, true), 9);
		});

		it('should return the right index near the end of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 987300}, defaultSorter, true), 987300);
		});

		it('should return the right index just before the middle of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 499500}, defaultSorter, true), 499500);
		});

		it('should return the right index just after the middle of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 500009}, defaultSorter, true), 500009);
		});

		it('should return the last index for a value that is greater than all others in the big array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 1000001}, defaultSorter, true), 999999);
		});

		it('should return the last index for a value that is greater than all others in the array', () => {
			assert.equal(sortedIndexOf([1, 2, 3, 4, 8, 9], 5, null, true), 3);
		});

		it('should return the last index for a value that is greater than all others in the array', () => {
			assert.equal(sortedIndexOf([1, 2, 3, 4, 9], 5, null, true), 3);
		});

		it('should return the index of the first of multiple items in the array', () => {
			assert.equal(sortedIndexOf([1, 2, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, null, true), 2);
		});

		it('should return 0 as the index of the first of multiple items in the array', () => {
			assert.equal(sortedIndexOf([3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, null, true), 0);
		});

		it('should return the index of the last of multiple items in the array', () => {
			assert.equal(sortedIndexOf([1,
				2,
				3,
				3,
				3,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10], 3, null, true, true), 5);
		});

		it('should return 9 as the index of the last of multiple items in the array', () => {
			assert.equal(sortedIndexOf([3, 4, 5, 6, 7, 8, 9, 10, 10, 10], 10, null, true, true), 9);
		});
	});
});

describe('List', () => {
	describe('.sorter', () => {
		it('should sort initial values', () => {
			assert.deepEqual(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).values(), [0,
				1,
				10,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9]);
		});

		it('should sort initial values with List.sorter.number.asc', () => {
			assert.deepEqual(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).sorter(List.sorter.number.asc).values(), [0,
				1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10]);
		});

		it('should sort initial values with List.sorter.number.desc', () => {
			assert.deepEqual(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).sorter(List.sorter.number.desc).values(), [10,
				9,
				8,
				7,
				6,
				5,
				4,
				3,
				2,
				1,
				0]);
		});

		it('should sort initial values with List.sorter.string.asc', () => {
			assert.deepEqual(new List(['c', 'b', 'a']).sorter(List.sorter.string.asc).values(), ['a', 'b', 'c']);
		});

		it('should sort initial values with List.sorter.string.desc', () => {
			assert.deepEqual(new List(['b', 'a', 'c']).sorter(List.sorter.string.desc).values(), ['c', 'b', 'a']);
		});

		it('should sort initial values with a big array', () => {
			assert.deepEqual(new List(bigArray).values(), bigArray);
		});

	});

	describe('.add', () => {
		it('should add an item when no other values have been set', () => {
			assert.deepEqual(new List().add(2).values(), [2]);
		});

		it('should add an item to the beginning of the array', () => {
			assert.deepEqual(new List([3, 4, 5]).add(0).values(), [0, 3, 4, 5]);
		});

		it('should add an item in the middle of an array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).add(6).values(), [3, 4, 5, 6, 7, 8]);
		});

		it('should add an item to the end of the array', () => {
			assert.deepEqual(new List([3, 4, 5]).add(10).values(), [3, 4, 5, 10]);
		});

		const biggishArray = buildArray(100000);
		const biggishArrayOutput = buildArray(100000);
		biggishArrayOutput.unshift(-1);
		it('should add the content of an array to a big array', () => {
			const list = new List();
			list.sorter(List.sorter.number.asc)
				.values(biggishArray)
				.add(-1);
			assert.deepEqual(list.values(), biggishArrayOutput);
		});
	});

	describe('.discard', () => {
		it('should remove an item from the beginning of the array', () => {
			assert.deepEqual(new List([2, 3, 4, 5]).discard(2).values(), [3, 4, 5]);
		});

		it('should remove an item from the end of the array', () => {
			assert.deepEqual(new List([2, 3, 4, 5]).discard(5).values(), [2, 3, 4]);
		});

		it('should remove an item from the middle of the array', () => {
			assert.deepEqual(new List([2, 3, 4, 5]).discard(4).values(), [2, 3, 5]);
		});
	});

	describe('.indexOf', () => {
		it('should return -1 for an item that isn\'t in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).indexOf(6), -1);
		});

		it('should find an item in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).indexOf(7), 3);
		});

		it('should find the first item in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).indexOf(3), 0);
		});

		it('should find the last item in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).indexOf(8), 4);
		});

		it('should find the first of multiple items in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 5, 5, 5, 7, 8]).indexOf(5), 2);
		});
	});

	describe('.lastIndexOf', () => {
		it('should return -1 for an item that isn\'t in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).lastIndexOf(6), -1);
		});

		it('should find an item in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).lastIndexOf(7), 3);
		});

		it('should find the first item in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).lastIndexOf(3), 0);
		});

		it('should find the last item in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).lastIndexOf(8), 4);
		});

		it('should find the last of multiple items in the array', () => {
			assert.deepEqual(new List([3, 4, 5, 5, 5, 5, 7, 8]).lastIndexOf(5), 5);
		});
	});

	describe('.includes', () => {
		it('should return false for an item that isn\'t in the array', () => {
			assert.isFalse(new List([3, 4, 5, 7, 8]).includes(6));
		});

		it('should return true for an item in the array', () => {
			assert.isTrue(new List([3, 4, 5, 7, 8]).includes(7));
		});

		it('should return true for the first item in the array', () => {
			assert.isTrue(new List([3, 4, 5, 7, 8]).includes(3));
		});

		it('should return true for the last item in the array', () => {
			assert.isTrue(new List([3, 4, 5, 7, 8]).includes(8));
		});

		it('should return true for the first of multiple items in the array', () => {
			assert.isTrue(new List([3, 4, 5, 5, 5, 5, 7, 8]).includes(5));
		});
	});

	describe('.find', () => {
		it('should find an item in the array', () => {
			const list = new List([{
				value: 2,
				other: 'meh'
			}, {
				value: 3,
				other: 'blah'
			}, {
				value: 4,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 6,
				other: 'aaarrr'
			}])
				.sorter((a, b) => {
					return a.value - b.value;
				});

			assert.deepEqual(list.find({
				value: 5
			}), {
				value: 5,
				other: 'blegh'
			});
		});
	});

	describe('.findLast', () => {
		it('should find an item in the array', () => {
			const list = new List([{
				value: 2,
				other: 'meh'
			}, {
				value: 3,
				other: 'blah'
			}, {
				value: 4,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 5,
				other: 'eh'
			}, {
				value: 6,
				other: 'aaarrr'
			}])
				.sorter((a, b) => {
					return a.value - b.value;
				});

			assert.deepEqual(list.findLast({
				value: 5
			}), {
				value: 5,
				other: 'eh'
			});
		});
	});

	describe('.findAll', () => {
		it('should find an item in the array', () => {
			const list = new List([{
				value: 2,
				other: 'meh'
			}, {
				value: 3,
				other: 'blah'
			}, {
				value: 5,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 5,
				other: 'eh'
			}, {
				value: 6,
				other: 'aaarrr'
			}])
				.sorter((a, b) => {
					return a.value - b.value;
				});

			assert.deepEqual(list.findAll({
				value: 5
			}), [{
				value: 5,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 5,
				other: 'eh'
			}]);
		});
	});

	describe('.findIndex', () => {
		it('should find the index of an item in the array', () => {
			const list = new List([{
				value: 2,
				other: 'meh'
			}, {
				value: 3,
				other: 'blah'
			}, {
				value: 4,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 6,
				other: 'aaarrr'
			}])
				.sorter((a, b) => {
					return a.value - b.value;
				});

			assert.deepEqual(list.findIndex({
				value: 5
			}), 3);
		});
	});

	describe('.findLastIndex', () => {
		it('should find the index of an item in the array', () => {
			const list = new List([{
				value: 2,
				other: 'meh'
			}, {
				value: 3,
				other: 'blah'
			}, {
				value: 4,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 5,
				other: 'eh'
			}, {
				value: 6,
				other: 'aaarrr'
			}])
				.sorter((a, b) => {
					return a.value - b.value;
				});

			assert.deepEqual(list.findLastIndex({
				value: 5
			}), 4);
		});
	});

	describe('.first', () => {
		it('should return the first item of the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).first(), 3);
		});
	});

	describe('.last', () => {
		it('should return the last item of the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).last(), 8);
		});
	});

	describe('.concat', () => {
		it('should add the content of an array', () => {
			assert.deepEqual(new List([1, 2, 3]).concat([4, 5, 6]).values(), [1, 2, 3, 4, 5, 6]);
		});

		it('should add the content of multiple arrays', () => {
			assert.deepEqual(new List([4, 5, 6]).sorter(List.sorter.number.asc)
				.concat([1, 2, 3], [7, 8, 9], [10, 11, 12])
				.values(), [1,
				2,
				3,
				4,
				5,
				6,
				7,
				8,
				9,
				10,
				11,
				12]);
		});

		const biggishArray = buildArray(100000);
		const biggishArrayOutput = buildArray(100000);
		biggishArrayOutput.unshift(-1);
		biggishArrayOutput.unshift(-2);
		biggishArrayOutput.unshift(-3);
		it('should add the content of an array to a big array', () => {
			const list = new List();
			list.sorter(List.sorter.number.asc)
				.values(biggishArray)
				.concat([-2, -1, -3]);
			assert.deepEqual(list.map((item) => item), biggishArrayOutput);
		});
	});

	describe('.length', () => {
		it('should return 0 for an empty array', () => {
			assert.deepEqual(new List([]).length, 0);
		});

		it('should return the length of the array', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).length, 5);
		});

		it('should return the length of the array after add is called', () => {
			assert.deepEqual(new List([3, 4, 5, 7, 8]).add(10).length, 6);
		});
	});

	describe('.pop', () => {
		it('should return the last element from array', () => {
			assert.deepEqual(new List([1, 2, 3]).pop(), 3);
		});

		it('should remove the last item from array', () => {
			const list = new List([1, 2, 3]);
			list.pop();
			assert.deepEqual(list.values(), [1, 2]);
		});
	});

	describe('.shift', () => {
		it('should return the first element from array', () => {
			assert.deepEqual(new List([1, 2, 3]).shift(), 1);
		});

		it('should remove the first item from array', () => {
			const list = new List([1, 2, 3]);
			list.shift();
			assert.deepEqual(list.values(), [2, 3]);
		});
	});

	it('.toString should return a string of the array', () => {
		assert.deepEqual(new List([1, 2, 3]).toString(), '1,2,3');
	});

	it('.keys should return a string of the array', () => {
		let testVar = 0;
		const keys = new List([1, 2, 3]).keys();

		for (let key of keys) {
			if (key !== undefined) {
				testVar++;
			}
		}
		assert.equal(testVar, 3);
	});

	it('.every should return a boolean', () => {
		assert.deepEqual(new List([1, 2, 3]).every((item) => item > 0), true);
	});

	it('.filter should return a new array', () => {
		assert.deepEqual(new List([1, 2, 3]).filter((item) => item > 1), [2, 3]);
	});

	it('.forEach should call a callback for every item in array', () => {
		let testVar = 0;
		const list = new List([1, 2, 3]);
		list.forEach((item) => {
			if (item > 0 && item < 4) {
				testVar++;
			}
		});
		assert.deepEqual(testVar, 3);
	});

	it('.toLocaleString should return a string of the array', () => {
		assert.deepEqual(new List([1,
			'a',
			new Date('21 Dec 1997 14:12:00 UTC')]).toLocaleString('en', {timeZone: 'UTC'}), '1,12/21/1997, 2:12:00 PM,a');
	});

	it('.join should return a string of the array', () => {
		assert.deepEqual(new List([1, 2, 3]).join('|'), '1|2|3');
	});

	it('.map should return a mapped version of the array', () => {
		const mapper = (item) => item + 'px';
		assert.deepEqual(new List([1, 2, 3]).map(mapper), ['1px', '2px', '3px']);
	});

	it('.reduce should return the result', () => {
		const mapper = (accumulator, currentValue) => accumulator + currentValue;
		assert.deepEqual(new List([1, 2, 3]).reduce(mapper), 6);
	});

	it('.reduceRight should return the result', () => {
		const mapper = (accumulator, currentValue) => accumulator + currentValue;
		assert.deepEqual(new List([1, 2, 3]).reduceRight(mapper), 6);
	});

	it('.slice should return a new array', () => {
		assert.deepEqual(new List([1, 2, 3, 4, 5, 6]).slice(2, 4), [3, 4]);
	});

	it('.some should call a callback for every item in array until true is returned', () => {
		let testVar = 0;
		const list = new List([1, 2, 3]);
		list.some((item) => {
			testVar++;
			return item === 2;
		});
		assert.deepEqual(testVar, 2);
	});
});
