import { isArray, isNumber, isObject } from 'type-enforcer';

const kindOf = (value) => {
	if (value === void 0) {
		return 3;
	}
	if (value === null) {
		return 2;
	}
	if (value !== value) {
		return 1;
	}
	if (isNumber(value)) {
		return -1;
	}
	return 0;
};

const compare = (a, b) => {
	const kindA = kindOf(a);
	const kindB = kindOf(b);

	if (kindA > 0 || kindB > 0) {
		return (kindA < kindB) ? -1 : (kindA > kindB ? 1 : 0);
	}

	if (kindA !== kindB) {
		return (kindA < kindB) ? -1 : (kindA > kindB ? 1 : 0);
	}

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
