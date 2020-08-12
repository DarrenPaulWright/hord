import { benchSettings } from 'karma-webpack-bundle';
import { fill } from 'object-agent';
import { List } from '../index.js';

suite('List', () => {
	let sandbox = {};
	let list = new List();
	let list2 = new List();
	let array = [];
	const overlap = 20;
	const smallArrayLength = 30;
	const mediumArrayLength = 500;
	const largeArrayLength = 1000;

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

	const benchIntersection = (length) => {
		benchmark(`intersection no lists, ${length}`, () => {
			sandbox = list.filter((item) => array.includes(item));
		}, {
			...benchSettings,
			onCycle() {
				array = fill(length, (x) => x + length - overlap);
				list = fill(length);
			}
		});

		benchmark(`intersection array, ${length}`, () => {
			sandbox = list.intersection(array);
		}, {
			...benchSettings,
			onStart() {
				array = fill(length, (x) => x + length - overlap);
				list = new List(fill(length));
			},
			onCycle() {
				array = fill(length, (x) => x + length - overlap);
				list = new List(fill(length));
			}
		});

		benchmark(`intersection list, ${length}`, () => {
			sandbox = list.intersection(list2);
		}, {
			...benchSettings,
			onCycle() {
				list = new List(fill(length));
				list2 = new List(fill(length, (x) => x + length - overlap));
			}
		});
	};

	benchIntersection(smallArrayLength);
	benchIntersection(mediumArrayLength);
	benchIntersection(largeArrayLength);
});
