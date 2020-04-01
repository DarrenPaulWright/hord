import { assert } from 'type-enforcer';
import { List } from '../index.js';

describe('List', () => {
	describe('.comparer', () => {
		it('should have an initial comparer', () => {
			assert.is(new List().comparer(), List.comparers.default);
		});

		it('should sort initial values', () => {
			assert.equal(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).values(), [0,
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

		it('should sort initial values with List.comparers.number.asc', () => {
			assert.equal(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).comparer(List.comparers.number.asc)
				.values(), [0,
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

		it('should sort initial values with List.comparers.number.desc', () => {
			assert.equal(new List([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]).comparer(List.comparers.number.desc)
				.values(), [10,
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

		it('should sort initial values with List.comparers.string.asc', () => {
			assert.equal(new List(['c', 'b', 'a']).comparer(List.comparers.string.asc).values(), ['a', 'b', 'c']);
		});

		it('should sort initial values with List.comparers.string.desc', () => {
			assert.equal(new List(['b', 'a', 'c']).comparer(List.comparers.string.desc).values(), ['c', 'b', 'a']);
		});

		it('should sort initial values with List.comparers.id.asc', () => {
			assert.equal(new List([{ id: 'c' }, { id: 'b' }, { id: 'a' }]).comparer(List.comparers.id.asc)
				.values(), [{ id: 'a' }, { id: 'b' }, { id: 'c' }]);
		});

		it('should sort initial values with List.comparers.id.desc', () => {
			assert.equal(new List([{ id: 'b' }, { id: 'a' }, { id: 'c' }]).comparer(List.comparers.id.desc)
				.values(), [{ id: 'c' }, { id: 'b' }, { id: 'a' }]);
		});
	});

	describe('.add', () => {
		it('should add an item when no other values have been set', () => {
			assert.equal(new List().add(2).values(), [2]);
		});

		it('should add an item to the beginning of the array', () => {
			assert.equal(new List([3, 4, 5]).add(0).values(), [0, 3, 4, 5]);
		});

		it('should add an item in the middle of an array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).add(6).values(), [3, 4, 5, 6, 7, 8]);
		});

		it('should add an item to the end of the array', () => {
			assert.equal(new List([3, 4, 5]).add(10).values(), [3, 4, 5, 10]);
		});
	});

	describe('.addUnique', () => {
		it('should add an item when no other values have been set', () => {
			const list = new List().comparer(List.comparers.id.asc);
			const newValue = {
				id: 2
			};
			const output = [{
				id: 2
			}];

			assert.equal(list.addUnique(newValue).values(), output);
		});

		it('should add an item to the beginning of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).comparer(List.comparers.id.asc);
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

			assert.equal(list.addUnique(newValue).values(), output);
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
			}]).comparer(List.comparers.id.asc);
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

			assert.equal(list.addUnique(newValue).values(), output);
		});

		it('should add an item to the end of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).comparer(List.comparers.id.asc);
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

			assert.equal(list.addUnique(newValue).values(), output);
		});

		it('should NOT add a duplicate item to the beginning of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).comparer(List.comparers.id.asc);
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

			assert.equal(list.addUnique(newValue).values(), output);
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
			}]).comparer(List.comparers.id.asc);
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

			assert.equal(list.addUnique(newValue).values(), output);
		});

		it('should NOT add a duplicate item to the end of the array', () => {
			const list = new List([{
				id: 3
			}, {
				id: 4
			}, {
				id: 5
			}]).comparer(List.comparers.id.asc);
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

			assert.equal(list.addUnique(newValue).values(), output);
		});
	});

	describe('.unique', () => {
		it('should return a new list of unique values', () => {
			const list = new List().comparer(List.comparers.id.asc).values([{
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

			assert.equal(list.unique().values(), output);
		});
	});

	describe('.discard', () => {
		it('should remove an item from the beginning of the array', () => {
			assert.equal(new List([2, 3, 4, 5]).discard(2).values(), [3, 4, 5]);
		});

		it('should remove an item from the end of the array', () => {
			assert.equal(new List([2, 3, 4, 5]).discard(5).values(), [2, 3, 4]);
		});

		it('should remove an item from the middle of the array', () => {
			assert.equal(new List([2, 3, 4, 5]).discard(4).values(), [2, 3, 5]);
		});
	});

	describe('.discardAt', () => {
		it('should remove an item from the beginning of the array', () => {
			assert.equal(new List([2, 3, 4, 5]).discardAt(0).values(), [3, 4, 5]);
		});

		it('should remove an item from the end of the array', () => {
			assert.equal(new List([2, 3, 4, 5]).discardAt(3).values(), [2, 3, 4]);
		});

		it('should remove an item from the middle of the array', () => {
			assert.equal(new List([2, 3, 4, 5]).discardAt(2).values(), [2, 3, 5]);
		});
	});

	describe('.discardAll', () => {
		it('should do nothing to an empty list', () => {
			assert.equal(new List().discardAll().values(), []);
		});

		it('should remove all the items from a list', () => {
			assert.equal(new List([2, 3, 4, 5]).discardAll().values(), []);
		});
	});

	describe('.indexOf', () => {
		it('should return -1 for an item that isn\'t in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).indexOf(6), -1);
		});

		it('should find an item in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).indexOf(7), 3);
		});

		it('should find the first item in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).indexOf(3), 0);
		});

		it('should find the last item in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).indexOf(8), 4);
		});

		it('should find the first of multiple items in the array', () => {
			assert.equal(new List([3, 4, 5, 5, 5, 5, 7, 8]).indexOf(5), 2);
		});
	});

	describe('.lastIndexOf', () => {
		it('should return -1 for an item that isn\'t in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).lastIndexOf(6), -1);
		});

		it('should find an item in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).lastIndexOf(7), 3);
		});

		it('should find the first item in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).lastIndexOf(3), 0);
		});

		it('should find the last item in the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).lastIndexOf(8), 4);
		});

		it('should find the last of multiple items in the array', () => {
			assert.equal(new List([3, 4, 5, 5, 5, 5, 7, 8]).lastIndexOf(5), 5);
		});
	});

	describe('.includes', () => {
		it('should return false for an item that isn\'t in the array', () => {
			assert.is(new List([3, 4, 5, 7, 8]).includes(6), false);
		});

		it('should return true for an item in the array', () => {
			assert.is(new List([3, 4, 5, 7, 8]).includes(7), true);
		});

		it('should return true for the first item in the array', () => {
			assert.is(new List([3, 4, 5, 7, 8]).includes(3), true);
		});

		it('should return true for the last item in the array', () => {
			assert.is(new List([3, 4, 5, 7, 8]).includes(8), true);
		});

		it('should return true for the first of multiple items in the array', () => {
			assert.is(new List([3, 4, 5, 5, 5, 5, 7, 8]).includes(5), true);
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
				.comparer((a, b) => {
					return a.value - b.value;
				});

			assert.equal(list.find({
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
				.comparer((a, b) => {
					return a.value - b.value;
				});

			assert.equal(list.findLast({
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
				.comparer((a, b) => a.value - b.value);
			const output = [];
			const result = list.findAll({
				value: 4
			});

			assert.is(result instanceof List, true);
			assert.equal(result.values(), output);
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
				.comparer((a, b) => a.value - b.value);
			const output = [{
				value: 3,
				other: 'blah'
			}];
			const result = list.findAll({
				value: 3
			});

			assert.is(result instanceof List, true);
			assert.equal(result.values(), output);
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
				.comparer((a, b) => a.value - b.value);
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

			assert.is(result instanceof List, true);
			assert.equal(result.values(), output);
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
				.comparer((a, b) => {
					return a.value - b.value;
				});

			assert.equal(list.findIndex({
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
				.comparer((a, b) => {
					return a.value - b.value;
				});

			assert.equal(list.findLastIndex({
				value: 5
			}), 4);
		});
	});

	describe('.first', () => {
		it('should return the first item of the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).first(), 3);
		});
	});

	describe('.last', () => {
		it('should return the last item of the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).last(), 8);
		});
	});

	describe('.concat', () => {
		it('should add the content of an array', () => {
			assert.equal(new List([1, 2, 3]).concat([4, 5, 6]).values(), [1, 2, 3, 4, 5, 6]);
		});

		it('should add the content of multiple arrays', () => {
			assert.equal(new List([4, 5, 6]).comparer(List.comparers.number.asc)
				.concat([1, 2, 3], [7, 8, 9], [10, 11, 12])
				.values(), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
		});
	});

	describe('.length', () => {
		it('should return 0 for an empty array', () => {
			assert.equal(new List([]).length, 0);
		});

		it('should return the length of the array', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).length, 5);
		});

		it('should return the length of the array after add is called', () => {
			assert.equal(new List([3, 4, 5, 7, 8]).add(10).length, 6);
		});
	});

	describe('.pop', () => {
		it('should return the last element from array', () => {
			assert.equal(new List([1, 2, 3]).pop(), 3);
		});

		it('should remove the last item from array', () => {
			const list = new List([1, 2, 3]);
			list.pop();
			assert.equal(list.values(), [1, 2]);
		});
	});

	describe('.shift', () => {
		it('should return the first element from array', () => {
			assert.equal(new List([1, 2, 3]).shift(), 1);
		});

		it('should remove the first item from array', () => {
			const list = new List([1, 2, 3]);
			list.shift();
			assert.equal(list.values(), [2, 3]);
		});
	});

	describe('.intersection', () => {
		it('should get the intersection from an array', () => {
			const list = new List([1, 2, 3, 4, 5]);
			const result = list.intersection([5, 6, 7, 8, 9, 4]);

			assert.is(result instanceof List, true);
			assert.equal(result.values(), [4, 5]);
		});

		it('should get the intersection from a list', () => {
			const list = new List([1, 2, 3, 4, 5]);
			const result = list.intersection(new List([5, 6, 7, 8, 9, 4]));

			assert.is(result instanceof List, true);
			assert.equal(result.values(), [4, 5]);
		});
	});

	describe('.median', () => {
		it('should get the median from an array of length 1', () => {
			const list = new List([7]);

			assert.equal(list.median(), 7);
		});

		it('should get the median from an array of length 2', () => {
			const list = new List([7, 9]);

			assert.equal(list.median(), 8);
		});

		it('should get the median from an odd length array', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9]);

			assert.equal(list.median(), 5);
		});

		it('should get the median from an even length array', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			assert.equal(list.median(), 5.5);
		});

		it('should get the first item when 0,0 is provided', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			assert.equal(list.median(0, 0), 1);
		});

		it('should get the median of the first half when high is provided in an even length array', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			assert.equal(list.median(0, 4), 3);
		});

		it('should get the median of the second half when low is provided in an even length array', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

			assert.equal(list.median(5), 8);
		});

		it('should get the median of the first half when high is provided in an odd length array', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9]);

			assert.equal(list.median(0, 4), 3);
		});

		it('should get the median of the second half when low is provided in an odd length array', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9]);

			assert.equal(list.median(4), 7);
		});
	});

	describe('.total', () => {
		it('should get the total of all the values', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7]);

			assert.equal(list.total, 28);
		});
	});

	describe('.mean', () => {
		it('should get the mean of all the values', () => {
			const list = new List([1, 2, 3, 4, 5, 6, 7]);

			assert.equal(list.mean(), 4);
		});
	});

	describe('.quartiles', () => {
		it('should get the quartiles from an array of length 1', () => {
			const list = new List([48]);

			assert.equal(list.quartiles(), {
				min: 48,
				Q1: 48,
				median: 48,
				Q3: 48,
				max: 48,
				outliers: []
			});
		});

		it('should get the quartiles from an array of length 2', () => {
			const list = new List([48, 50]);

			assert.equal(list.quartiles(), {
				min: 48,
				Q1: 48,
				median: 49,
				Q3: 50,
				max: 50,
				outliers: []
			});
		});

		it('should get the quartiles from an array of length 3', () => {
			const list = new List([48, 50, 52]);

			assert.equal(list.quartiles(), {
				min: 48,
				Q1: 49,
				median: 50,
				Q3: 51,
				max: 52,
				outliers: []
			});
		});

		it('should get the quartiles from an odd length array', () => {
			const list = new List([1, 48, 49, 50, 51, 52, 100]);

			assert.equal(list.quartiles(), {
				min: 48,
				Q1: 48.5,
				median: 50,
				Q3: 51.5,
				max: 52,
				outliers: [1, 100]
			});
		});

		it('should get the quartiles from an even length array', () => {
			const list = new List([1, 48, 49, 50, 51, 52, 53, 100]);

			assert.equal(list.quartiles(), {
				min: 48,
				Q1: 48.5,
				median: 50.5,
				Q3: 52.5,
				max: 53,
				outliers: [1, 100]
			});
		});

		it('should get return an empty array if no outliers are provided', () => {
			const list = new List([47, 48, 49, 50, 51, 52, 53, 54]);

			assert.equal(list.quartiles(), {
				min: 47,
				Q1: 48.5,
				median: 50.5,
				Q3: 52.5,
				max: 54,
				outliers: []
			});
		});
	});

	it('.toString should return a string of the array', () => {
		assert.equal(new List([1, 2, 3]).toString(), '1,2,3');
	});

	it('.keys should return a string of the array', () => {
		let testVar = 0;
		const keys = new List([1, 2, 3]).keys();

		for (let key of keys) {
			if (key !== undefined) {
				testVar++;
			}
		}
		assert.is(testVar, 3);
	});

	it('.every should return a boolean', () => {
		assert.equal(new List([1, 2, 3]).every((item) => item > 0), true);
	});

	it('.filter should return a new array', () => {
		const output = new List([1, 2, 3]).filter((item) => item > 1);
		assert.is(output instanceof List, true);
		assert.equal(output.values(), [2, 3]);
	});

	it('.forEach should call a callback for every item in array', () => {
		let testVar = 0;
		const list = new List([1, 2, 3]);
		list.forEach((item) => {
			if (item > 0 && item < 4) {
				testVar++;
			}
		});
		assert.equal(testVar, 3);
	});

	it('.toLocaleString should return a string of the array', () => {
		assert.equal(new List([1,
			'a',
			new Date('21 Dec 1997 14:12:00 UTC')]).toLocaleString('en', { timeZone: 'UTC' }), '1,a,12/21/1997, 2:12:00 PM');
	});

	it('.join should return a string of the array', () => {
		assert.equal(new List([1, 2, 3]).join('|'), '1|2|3');
	});

	it('.map should return a mapped version of the array as a list', () => {
		const mapper = (item) => item + 'px';
		const output = new List([1, 2, 3]).map(mapper);

		assert.equal(output, ['1px', '2px', '3px']);
	});

	it('.reduce should return the result', () => {
		const mapper = (accumulator, currentValue) => accumulator + currentValue;
		assert.equal(new List([1, 2, 3]).reduce(mapper), 6);
	});

	it('.reduceRight should return the result', () => {
		const mapper = (accumulator, currentValue) => accumulator + currentValue;
		assert.equal(new List([1, 2, 3]).reduceRight(mapper), 6);
	});

	it('.slice should return a new List', () => {
		const output = new List([1, 2, 3, 4, 5, 6]).slice(2, 4);
		assert.is(output instanceof List, true);
		assert.equal(output.values(), [3, 4]);
	});

	it('.some should call a callback for every item in array until true is returned', () => {
		let testVar = 0;
		const list = new List([1, 2, 3]);
		list.some((item) => {
			testVar++;
			return item === 2;
		});
		assert.equal(testVar, 2);
	});
});
