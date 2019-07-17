import { appendToPath, get, isEmpty, set, unset } from 'object-agent';
import checkRule from './checkRule';
import enforceRule from './enforceRule';
import ERRORS from './schemaErrors';

const OR_SEPARATOR = ' OR ';

const getKeysNotInSchema = (value, rule) => {
	if (!rule.keys || rule.keys.includes('*')) {
		return false;
	}

	return Object.keys(value)
		.filter((key) => !rule.keys.includes(key));
};

const processArray = (item, rule, path, value, onError, isEnforce) => {
	let isChanged = false;

	for (let index = 0, length = value.length; index < length; index++) {
		rule.content.forEach((rule) => {
			isChanged = processValue(item, rule, appendToPath(path, index), onError, isEnforce) || isChanged;
		});
	}
	if (isEnforce && isChanged) {
		set(item, path, value.filter((item) => item !== undefined));
	}

	return isChanged;
};

const processObject = (item, rule, path, value, onError, isEnforce) => {
	let isChanged = false;
	const keysNotInSchema = getKeysNotInSchema(value, rule);

	if (keysNotInSchema) {
		keysNotInSchema.forEach((key) => {
			if (isEnforce) {
				unset(item, appendToPath(path, key));
				isChanged = true;
			}
			onError(ERRORS.KEY_NOT_FOUND, appendToPath(path, key), value[key]);
		});
	}

	rule.content.forEach((rule) => {
		isChanged = processValue(item, rule, appendToPath(path, rule.key), onError, isEnforce) || isChanged;
	});

	return isChanged;
};

export default function processValue(item, rule, path, onError, isEnforce, replace) {
	const value = get(item, path);
	let isChanged = false;
	const subErrors = [];

	if (rule.types.length === 1 && rule.types[0].schema) {
		if (isEnforce) {
			rule.types[0].enforce(value);
		}
		else {
			rule.types[0].check(value);
		}
		return false;
	}

	if (isEnforce) {
		isChanged = enforceRule(rule, item, path, value, replace) || isChanged;
	}

	if (value === undefined) {
		if (rule.isRequired && rule.default === undefined) {
			onError(ERRORS.REQUIRED, path, value);
		}
		return false;
	}
	else if (!rule.types.some((type) => !subErrors[subErrors.push(checkRule(type, value)) - 1])) {
		onError(subErrors.join(OR_SEPARATOR), path, value);
	}

	if (rule.content && value) {
		if (rule.types[0].type === Array) {
			isChanged = processArray(item, rule, path, value, onError, isEnforce) || isChanged;
		}
		else {
			isChanged = processObject(item, rule, path, value, onError, isEnforce) || isChanged;
		}
	}

	if (isEnforce) {
		const type = rule.types[0];

		if (type.length !== undefined) {
			if (type.minLength !== undefined && type.minLength > value.length) {
				if (type.clamp === true) {
					if (type.type === Array) {
						value.length = type.minLength;
					}
					else {
						set(item, path, value.padEnd(type.minLength));
					}
				}
				else {
					unset(item, path);
				}
				isChanged = true;
			}
			if (type.maxLength !== undefined && type.maxLength < value.length) {
				if (type.clamp === true) {
					if (type.type === Array) {
						value.length = type.maxLength;
					}
					else {
						set(item, path, value.slice(0, type.maxLength));
					}
				}
				else {
					unset(item, path);
				}
				isChanged = true;
			}
		}

		if (type.type === Array || type.type === Object) {
			if (!rule.isRequired && isEmpty(value)) {
				unset(item, path);
				isChanged = true;
			}
		}
	}

	return isChanged;
}
