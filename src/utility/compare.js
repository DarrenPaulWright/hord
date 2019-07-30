import { get } from 'object-agent';
import { isArray, isNumber } from 'type-enforcer';

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

	if (kindA !== kindB || kindA > 0) {
		a = kindA;
		b = kindB;
	}

	return (a < b) ? -1 : (a > b ? 1 : 0);
};

export default (keys) => {
	if (keys) {
		if (isArray(keys)) {
			return (a, b) => {
				let output;

				keys.some((key) => output = compare(get(a, key), get(b, key)));

				return output;
			};
		}

		return (a, b) => compare(get(a, keys), get(b, keys));
	}

	return compare;
}
