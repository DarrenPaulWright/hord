import { assert } from 'chai';
import { fill } from 'object-agent';
import { List } from '../src';
import { sortedIndexOf } from '../src/List';

describe('sortedIndexOf', () => {
	const bigArrayID = fill(1000000, (index) => {
		return {id: index};
	});

	it('should return the right index for the first item of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 0}, List.sorter.id.asc), 0);
	});

	it('should return the right index for the last item of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 999999}, List.sorter.id.asc), 999999);
	});

	it('should return the right index near the beginning of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 9}, List.sorter.id.asc), 9);
	});

	it('should return the right index near the end of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 987300}, List.sorter.id.asc), 987300);
	});

	it('should return the right index just before the middle of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 499500}, List.sorter.id.asc), 499500);
	});

	it('should return the right index just after the middle of an array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 500009}, List.sorter.id.asc), 500009);
	});

	it('should return -1 for a value that isn\'t in the array', () => {
		assert.equal(sortedIndexOf(bigArrayID, {id: 1000001}, List.sorter.id.asc), -1);
	});

	describe('isLast = true', () => {
		it('should return -1 for a value that isn\'t in the array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 1000001}, List.sorter.id.asc, false, true), -1);
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
				10], 3, List.sorter.default, false, true), 5);
		});

		it('should return 9 as the index of the last of multiple items in the array', () => {
			assert.equal(sortedIndexOf([3, 4, 5, 6, 7, 8, 9, 10, 10, 10], 10, List.sorter.default, false, true), 9);
		});
	});

	describe('isInsert = true', () => {
		it('should return the right index for the first item of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 0}, List.sorter.id.asc, true), 0);
		});

		it('should return the right index for the last item of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 999999}, List.sorter.id.asc, true), 999999);
		});

		it('should return the right index near the beginning of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 9}, List.sorter.id.asc, true), 9);
		});

		it('should return the right index near the end of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 987300}, List.sorter.id.asc, true), 987300);
		});

		it('should return the right index just before the middle of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 499500}, List.sorter.id.asc, true), 499500);
		});

		it('should return the right index just after the middle of an array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 500009}, List.sorter.id.asc, true), 500009);
		});

		it('should return the last index for a value that is greater than all others in the big array', () => {
			assert.equal(sortedIndexOf(bigArrayID, {id: 1000001}, List.sorter.id.asc, true), 999999);
		});

		it('should return the last index for a value that is greater than all others in the array', () => {
			assert.equal(sortedIndexOf([1, 2, 3, 4, 8, 9], 5, List.sorter.default, true), 3);
		});

		it('should return the last index for a value that is greater than all others in the array', () => {
			assert.equal(sortedIndexOf([1, 2, 3, 4, 9], 5, List.sorter.default, true), 3);
		});

		it('should return the index of the first of multiple items in the array', () => {
			assert.equal(sortedIndexOf([1, 2, 3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, List.sorter.default, true), 2);
		});

		it('should return 0 as the index of the first of multiple items in the array', () => {
			assert.equal(sortedIndexOf([3, 3, 3, 3, 4, 5, 6, 7, 8, 9, 10], 3, List.sorter.default, true), 0);
		});
	});
});

describe('List', () => {
	describe('.sorter', () => {
		it('should have an initial sorter', () => {
			assert.equal(new List().sorter(), List.sorter.default);
		});

		it('should sort initial values', () => {
			assert.deepEqual(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).values(), [0,
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

		it('should sort initial values with List.sorter.id.asc', () => {
			assert.deepEqual(new List([{id: 'c'}, {id: 'b'}, {id: 'a'}]).sorter(List.sorter.id.asc)
				.values(), [{id: 'a'}, {id: 'b'}, {id: 'c'}]);
		});

		it('should sort initial values with List.sorter.id.desc', () => {
			assert.deepEqual(new List([{id: 'b'}, {id: 'a'}, {id: 'c'}]).sorter(List.sorter.id.desc)
				.values(), [{id: 'c'}, {id: 'b'}, {id: 'a'}]);
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
	});

	describe('.addUnique', () => {
		it('should add an item when no other values have been set', () => {
			const list = new List().sorter(List.sorter.id.asc);
			const newValue = {
				id: 2
			};
			const output = [{
				id: 2
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});

		it('should add an item to the beginning of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).sorter(List.sorter.id.asc);
			const newValue = {
				id: 0
			};
			const output = [{
				id: 0
			}, {
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});

		it('should add an item in the middle of an array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 7
			}, {
				id: 8
			}]).sorter(List.sorter.id.asc);
			const newValue = {
				id: 6
			};
			const output = [{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 6
			}, {
				id: 7
			}, {
				id: 8
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});

		it('should add an item to the end of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).sorter(List.sorter.id.asc);
			const newValue = {
				id: 10
			};
			const output = [{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 10
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});

		it('should NOT add a duplicate item to the beginning of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).sorter(List.sorter.id.asc);
			const newValue = {
				id: 3
			};
			const output = [{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});

		it('should NOT add a duplicate item in the middle of an array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 7
			}, {
				id: 8
			}]).sorter(List.sorter.id.asc);
			const newValue = {
				id: 5
			};
			const output = [{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 7
			}, {
				id: 8
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});

		it('should NOT add a duplicate item to the end of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).sorter(List.sorter.id.asc);
			const newValue = {
				id: 5
			};
			const output = [{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}];

			assert.deepEqual(list.addUnique(newValue).values(), output);
		});
	});

	describe('.unique', () => {
		it('should return a new list of unique values', () => {
			const list = new List().sorter(List.sorter.id.asc).values([{
				id: 1
			}, {
				id: 1
			}, {
				id: 2
			}, {
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 5
			}, {
				id: 5
			}, {
				id: 6
			}, {
				id: 7
			}, {
				id: 8
			}, {
				id: 8
			}, {
				id: 8
			}]);
			const output = [{
				id: 1
			}, {
				id: 2
			}, {
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}, {
				id: 6
			}, {
				id: 7
			}, {
				id: 8
			}];

			assert.deepEqual(list.unique().values(), output);
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

	describe('.discardAll', () => {
		it('should do nothing to an empty list', () => {
			assert.deepEqual(new List().discardAll().values(), []);
		});

		it('should remove all the items from a list', () => {
			assert.deepEqual(new List([2, 3, 4, 5]).discardAll().values(), []);
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
		it('should return an empty list if no items are found', () => {
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
				.sorter((a, b) => a.value - b.value);
			const output = [];
			const result = list.findAll({
				value: 4
			});

			assert.isTrue(result instanceof List);
			assert.deepEqual(result.values(), output);
		});

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
				.sorter((a, b) => a.value - b.value);
			const output = [{
				value: 3,
				other: 'blah'
			}];
			const result = list.findAll({
				value: 3
			});

			assert.isTrue(result instanceof List);
			assert.deepEqual(result.values(), output);
		});

		it('should find mulitple items in the array', () => {
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
				.sorter((a, b) => a.value - b.value);
			const output = [{
				value: 5,
				other: 'ok'
			}, {
				value: 5,
				other: 'blegh'
			}, {
				value: 5,
				other: 'eh'
			}];
			const result = list.findAll({
				value: 5
			});

			assert.isTrue(result instanceof List);
			assert.deepEqual(result.values(), output);
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
		const output = new List([1, 2, 3]).filter((item) => item > 1);
		assert.isTrue(output instanceof List);
		assert.deepEqual(output.values(), [2, 3]);
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
			new Date('21 Dec 1997 14:12:00 UTC')]).toLocaleString('en', {timeZone: 'UTC'}), '1,a,12/21/1997, 2:12:00 PM');
	});

	it('.join should return a string of the array', () => {
		assert.deepEqual(new List([1, 2, 3]).join('|'), '1|2|3');
	});

	it('.map should return a mapped version of the array as a list', () => {
		const mapper = (item) => item + 'px';
		const output = new List([1, 2, 3]).map(mapper);

		assert.deepEqual(output, ['1px', '2px', '3px']);
	});

	it('.reduce should return the result', () => {
		const mapper = (accumulator, currentValue) => accumulator + currentValue;
		assert.deepEqual(new List([1, 2, 3]).reduce(mapper), 6);
	});

	it('.reduceRight should return the result', () => {
		const mapper = (accumulator, currentValue) => accumulator + currentValue;
		assert.deepEqual(new List([1, 2, 3]).reduceRight(mapper), 6);
	});

	it('.slice should return a new List', () => {
		const output = new List([1, 2, 3, 4, 5, 6]).slice(2, 4);
		assert.isTrue(output instanceof List);
		assert.deepEqual(output.values(), [3, 4]);
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
