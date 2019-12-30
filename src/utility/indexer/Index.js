import List, { _ as _list } from '../../List';
import compare from '../compare';
import operators from '../operators';

const compareFirst = compare('v');
const comparer = (a, b) => {
	let result = compareFirst(a, b);

	if (result === 0 && a.i !== undefined && b.i !== undefined) {
		return a.i - b.i;
	}

	return result;
};

const greaterThan = (value, list) => {
	return list.slice(list.lastIndexOf({v: value}) + 1);
};

const greaterThanOrEqual = (value, list) => {
	return list.slice(list.indexOf({v: value}));
};

const lessThan = (value, list) => {
	return list.slice(0, list.indexOf({v: value}));
};

const lessThanOrEqual = (value, list) => {
	return list.slice(0, list.lastIndexOf({v: value}) + 1);
};

const equal = (value, list) => {
	return list.findAll({v: value});
};

const notEqual = (value, list) => {
	return lessThan(value, list).concat(greaterThan(value, list));
};

export default class Index {
	constructor() {
		this.list = new List().comparer(comparer);
	}

	spawn(indexes) {
		const spawn = new Index();

		this.list.reduce((result, item) => {
			const index = indexes.indexOf(item.i);

			if (index !== -1) {
				result.push({
					v: item.v,
					i: index
				});
			}

			return result;
		}, _list(spawn.list).array);

		return spawn;
	}

	rebuild(map, getValue) {
		this.list.values(map((item, index) => {
			return {
				v: item ? getValue(item) : undefined,
				i: index
			};
		}));
	}

	add(value, index) {
		this.list.add({
			v: value,
			i: index
		});

		return this;
	}

	discard(value, index) {
		this.list.discard({
			v: value,
			i: index
		});

		return this;
	}

	query(value, operator) {
		let items;

		if (operator === operators.EQUAL) {
			items = equal(value, this.list);
		}
		else if (operator === operators.NOT_EQUAL) {
			items = notEqual(value, this.list);
		}
		else if (operator === operators.IN) {
			value.forEach((item) => {
				const result = equal(item, this.list);

				if (!items) {
					items = result;
				}
				else {
					items = items.concat(result);
				}
			});

			items = items.unique();
		}
		else if (operator === operators.NOT_IN) {
			value.forEach((item) => {
				items = notEqual(item, items || this.list);
			});
		}
		else if (operator === operators.GREATER_THAN) {
			items = greaterThan(value, this.list);
		}
		else if (operator === operators.GREATER_THAN_EQUAL) {
			items = greaterThanOrEqual(value, this.list);
		}
		else if (operator === operators.LESS_THAN) {
			items = lessThan(value, this.list);
		}
		else if (operator === operators.LESS_THAN_EQUAL) {
			items = lessThanOrEqual(value, this.list);
		}

		if (!items) {
			return new List();
		}

		return new List(items.map((item) => item.i), true);
	}

	increment(amount, start = 0) {
		this.list.forEach((item) => {
			if (item.i >= start) {
				item.i += amount;
			}
		});
	}

	length(value) {
		const remove = [];

		this.list.forEach((item) => {
			if (item.i >= value) {
				remove.push(item);
			}
		});

		remove.forEach((item) => this.list.discard(item));
	}

	clear() {
		this.list.discardAll();
	}
}
