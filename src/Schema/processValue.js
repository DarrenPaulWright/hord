import { get, isEmpty, set, unset } from 'object-agent';
import checkRule from './checkRule';
import enforceRule from './enforceRule';
import ERRORS from './schemaErrors';

const OR_SEPARATOR = ' OR ';

const processArray = (item, rule, path, value, onError, isEnforce) => {
	for (let index = 0, length = value.length; index < length; index++) {
		rule.content.forEach((rule) => {
			processValue(item, rule, path.concat(index), onError, isEnforce);
		});
	}
	set(item, path, value.filter((item) => item !== undefined));
};

const processObject = (item, rule, path, value, onError, isEnforce) => {
	const keys = Object.keys(value).filter((key) => !rule.keys.includes(key));

	if (keys.length !== 0) {
		keys.forEach((key) => {
			if (isEnforce) {
				unset(item, path.concat(key));
			}
			else {
				onError(ERRORS.KEY_NOT_FOUND, path.concat(key), value[key]);
			}
		});
	}

	rule.content.forEach((rule) => {
		processValue(item, rule, path.concat(rule.key), onError, isEnforce);
	});
};

export default processValue = (item, rule, path, onError, isEnforce) => {
	const value = get(item, path);

	if (value === undefined) {
		if (isEnforce) {
			enforceRule(rule, item, path, value);
		}
		else {
			if (rule.isRequired && rule.default === undefined) {
				onError(ERRORS.REQUIRED, path, value);
			}
		}
	}
	else {
		const subErrors = [];

		if (isEnforce) {
			enforceRule(rule, item, path, value);
		}
		else {
			if (!rule.types.some((type) => !subErrors[subErrors.push(checkRule(type, value)) - 1])) {
				onError(subErrors.join(OR_SEPARATOR), path, value);
			}
		}

		if (rule.content) {
			if (rule.types[0].type === Array) {
				processArray(item, rule, path, value, onError, isEnforce);
			}
			else {
				processObject(item, rule, path, value, onError, isEnforce);
			}
		}

		if (isEnforce) {
			if ('arrayLength' in rule.types[0]) {
				if ('minLength' in rule.types[0] && rule.types[0].minLength > value.length) {
					value.length = 0;
				}
				if ('maxLength' in rule.types[0] && rule.types[0].maxLength < value.length) {
					set(item, path, value.slice(0, rule.types[0].maxLength));
				}
			}

			if ((rule.types[0].type === Array || rule.types[0].type === Object) && !rule.isRequired && isEmpty(value)) {
				unset(item, path);
			}
		}
	}
};
