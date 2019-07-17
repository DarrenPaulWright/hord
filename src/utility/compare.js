import { isArray, isObject } from 'type-enforcer';

const baseValue = (value) => {
	if (value === null) {
		return 'null';
	}
	if (value !== value) {
		return 'NaN';
	}
	return value;
};

const compare = (a, b) => {
	if (a === undefined) {
		return b === undefined ? 0 : 1;
	}
	if (b === undefined) {
		return -1;
	}

	a = baseValue(a);
	b = baseValue(b);

	return (a < b) ? -1 : (a > b ? 1 : 0);
};

const compareKey = (a, b, key) => {
	return compare(isObject(a) ? a[key] : a, isObject(b) ? b[key] : b);
};

export default (keys) => {
	if (keys) {
		if (isArray(keys)) {
			return (a, b) => {
				let output;

				keys.some((key) => output = compareKey(a, b, key));

				return output;
			};
		}

		return (a, b) => compareKey(a, b, keys);
	}

	return compare;
}
