import { benchSettings } from 'karma-webpack-bundle';
import { fill } from 'object-agent';
import { compare, List } from '../index';
import { sortedIndexOf } from '../src/List';

suite('sortedIndexOf', () => {
	let sandbox;
	const sortedArray = fill(1000);
	const comparer = compare();

	benchmark('indexOf start', () => {
		sandbox = sortedArray.indexOf(0);
	}, benchSettings);

	benchmark('indexOf mid', () => {
		sandbox = sortedArray.indexOf(500);
	}, benchSettings);

	benchmark('indexOf end', () => {
		sandbox = sortedArray.indexOf(999);
	}, benchSettings);

	benchmark('start', () => {
		sandbox = sortedIndexOf(sortedArray, 0, comparer);
	}, benchSettings);

	benchmark('mid', () => {
		sandbox = sortedIndexOf(sortedArray, 500, comparer);
	}, benchSettings);

	benchmark('end', () => {
		sandbox = sortedIndexOf(sortedArray, 999, comparer);
	}, benchSettings);

});

suite('List', () => {
	let sandbox;
	let list = new List();
	let list2 = new List();
	let array = [];

	benchmark('init undefined', () => {
		sandbox = new List();
	}, benchSettings);

	benchmark('init sorted array', () => {
		sandbox = new List(array);
	}, {
		...benchSettings,
		onCycle() {
			array = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		}
	});

	benchmark('init unsorted array', () => {
		sandbox = new List(array);
	}, {
		...benchSettings,
		onCycle() {
			array = [4, 7, 5, 1, 3, 2, 9, 6, 8];
		}
	});

	benchmark('addUnique empty', () => {
		sandbox = list.addUnique(3);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([]);
		}
	});

	benchmark('addUnique false', () => {
		sandbox = list.addUnique(3);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([4, 7, 5, 1, 3, 2, 9, 6, 8, 4, 7, 5, 1, 3, 2, 9, 6, 8]);
		}
	});

	benchmark('addUnique true', () => {
		sandbox = list.addUnique(10);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([4, 7, 5, 1, 3, 2, 9, 6, 8, 4, 7, 5, 1, 3, 2, 9, 6, 8]);
		}
	});

	benchmark('unique', () => {
		sandbox = list.unique();
	}, {
		...benchSettings,
		onCycle() {
			array = [4, 7, 5, 1, 3, 2, 9, 6, 8, 4, 7, 5, 1, 3, 2, 9, 6, 8];
			list = new List(array);
		}
	});

	benchmark('indexOf', () => {
		sandbox = list.indexOf(6);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([1, 2, 3, 4, 5, 6, 7, 8, 9]);
		}
	});

	benchmark('findAll no match', () => {
		sandbox = list.findAll(10);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([1, 2, 3, 4, 5, 6, 6, 6, 6, 7, 8, 9]);
		}
	});

	benchmark('findAll single item', () => {
		sandbox = list.findAll(5);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([1, 2, 3, 4, 5, 6, 6, 6, 6, 7, 8, 9]);
		}
	});

	benchmark('findAll multi items', () => {
		sandbox = list.findAll(6);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([1, 2, 3, 4, 5, 6, 6, 6, 6, 7, 8, 9]);
		}
	});

	benchmark('someRight', () => {
		sandbox = list.someRight((value) => value === 4);
	}, {
		...benchSettings,
		onCycle() {
			list = new List([1, 2, 3, 4, 5, 6, 6, 6, 6, 7, 8, 9]);
		}
	});

	benchmark('intersection no lists, small', () => {
		sandbox = list.filter((item) => array.includes(item));
	}, {
		...benchSettings,
		onCycle() {
			array = [4, 5, 7, 8, 8654685];
			list = fill(20);
		}
	});

	benchmark('intersection array, small', () => {
		sandbox = list.intersection(array);
	}, {
		...benchSettings,
		onStart() {
			array = [4, 5, 7, 8, 8654685];
			list = new List(fill(20));
		},
		onCycle() {
			array = [4, 5, 7, 8, 8654685];
			list = new List(fill(20));
		}
	});

	benchmark('intersection list, small', () => {
		sandbox = list.intersection(list2);
	}, {
		...benchSettings,
		onCycle() {
			list = new List(fill(20));
			list2 = new List([4, 5, 7, 8, 8654685]);
		}
	});

	benchmark('intersection no lists, large', () => {
		sandbox = list.filter((item) => array.includes(item));
	}, {
		...benchSettings,
		onCycle() {
			array = [4, 5, 7, 8, 8654685];
			list = fill(1000);
		}
	});

	benchmark('intersection array, large', () => {
		sandbox = list.intersection(array);
	}, {
		...benchSettings,
		onStart() {
			array = [4, 5, 7, 8, 8654685];
			list = new List(fill(1000));
		},
		onCycle() {
			array = [4, 5, 7, 8, 8654685];
			list = new List(fill(1000));
		}
	});

	benchmark('intersection list, large', () => {
		sandbox = list.intersection(list2);
	}, {
		...benchSettings,
		onCycle() {
			list = new List(fill(1000));
			list2 = new List([4, 5, 7, 8, 8654685]);
		}
	});

});
