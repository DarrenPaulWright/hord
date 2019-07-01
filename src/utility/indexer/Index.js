import List from '../../List';

const defaultCompare = (a, b) => {
	if (a.v === undefined) {
		return b.v === undefined ? 0 : 1;
	}
	if (b.v === undefined) {
		return -1;
	}
	return a.v < b.v ? -1 : (a.v > b.v ? 1 : 0);
};

const defaultSorter = (a, b) => {
	let result = defaultCompare(a, b);

	if (result === 0 && a.i !== undefined && b.i !== undefined) {
		return a.i - b.i;
	}

	return result;
};

export default class Index {
	constructor() {
		this.list = new List()
			.sorter(defaultSorter);
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

	query(value) {
		const start = this.list.indexOf({
			v: value
		});

		if (start === -1) {
			return [];
		}

		const end = this.list.lastIndexOf({
			v: value
		});

		if (start === end) {
			return [this.list.values()[start].i];
		}

		return this.list.values().slice(start, end + 1).map((item) => item.i);
	}

	rebuild(map, getValue) {
		this.list.values(map((item, index) => {
			return {
				v: item ? getValue(item) : undefined,
				i: index
			};
		}));
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
