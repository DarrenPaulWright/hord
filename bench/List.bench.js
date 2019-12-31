import { benchSettings } from 'karma-webpack-bundle';
import { fill } from 'object-agent';
import { List } from '../index';

suite('List', () => {
	let sandbox;
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

	benchmark(`intersection no lists, ${smallArrayLength}`, () => {
		sandbox = list.filter((item) => array.includes(item));
	}, {
		...benchSettings,
		onCycle() {
			array = fill(smallArrayLength, (x) => x + smallArrayLength - overlap);
			list = fill(smallArrayLength);
		}
	});

	benchmark(`intersection array, ${smallArrayLength}`, () => {
		sandbox = list.intersection(array);
	}, {
		...benchSettings,
		onStart() {
			array = fill(smallArrayLength, (x) => x + smallArrayLength - overlap);
			list = new List(fill(smallArrayLength));
		},
		onCycle() {
			array = fill(smallArrayLength, (x) => x + smallArrayLength - overlap);
			list = new List(fill(smallArrayLength));
		}
	});

	benchmark(`intersection list, ${smallArrayLength}`, () => {
		sandbox = list.intersection(list2);
	}, {
		...benchSettings,
		onCycle() {
			list = new List(fill(smallArrayLength));
			list2 = new List(fill(smallArrayLength, (x) => x + smallArrayLength - overlap));
		}
	});

	benchmark(`intersection no lists, ${mediumArrayLength}`, () => {
		sandbox = list.filter((item) => array.includes(item));
	}, {
		...benchSettings,
		onCycle() {
			array = fill(mediumArrayLength, (x) => x + mediumArrayLength - overlap);
			list = fill(mediumArrayLength);
		}
	});

	benchmark(`intersection array, ${mediumArrayLength}`, () => {
		sandbox = list.intersection(array);
	}, {
		...benchSettings,
		onStart() {
			array = fill(mediumArrayLength, (x) => x + mediumArrayLength - overlap);
			list = new List(fill(mediumArrayLength));
		},
		onCycle() {
			array = fill(mediumArrayLength, (x) => x + mediumArrayLength - overlap);
			list = new List(fill(mediumArrayLength));
		}
	});

	benchmark(`intersection list, ${mediumArrayLength}`, () => {
		sandbox = list.intersection(list2);
	}, {
		...benchSettings,
		onCycle() {
			list = new List(fill(mediumArrayLength));
			list2 = new List(fill(mediumArrayLength, (x) => x + mediumArrayLength - overlap));
		}
	});

	benchmark(`intersection no lists, ${largeArrayLength}`, () => {
		sandbox = list.filter((item) => array.includes(item));
	}, {
		...benchSettings,
		onCycle() {
			array = fill(largeArrayLength, (x) => x + largeArrayLength - overlap);
			list = fill(largeArrayLength);
		}
	});

	benchmark(`intersection array, ${largeArrayLength}`, () => {
		sandbox = list.intersection(array);
	}, {
		...benchSettings,
		onStart() {
			array = fill(largeArrayLength, (x) => x + largeArrayLength - overlap);
			list = new List(fill(largeArrayLength));
		},
		onCycle() {
			array = fill(largeArrayLength, (x) => x + largeArrayLength - overlap);
			list = new List(fill(largeArrayLength));
		}
	});

	benchmark(`intersection list, ${largeArrayLength}`, () => {
		sandbox = list.intersection(list2);
	}, {
		...benchSettings,
		onCycle() {
			list = new List(fill(largeArrayLength));
			list2 = new List(fill(largeArrayLength, (x) => x + largeArrayLength - overlap));
		}
	});

});
