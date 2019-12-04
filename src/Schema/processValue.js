import { appendToPath, get, repeat, set, unset } from 'object-agent';
import { isObject } from 'type-enforcer-ui';
import checkRule from './checkRule';
import enforceRule from './enforceRule';
import ERRORS from './schemaErrors';

const getKeysNotInSchema = (value, rule) => {
	return rule.keys && !rule.keys.includes('*') && Object.keys(value)
		.filter((key) => !rule.keys.includes(key));
};

const processContent = (item, rule, path, value, onError, isEnforce) => {
	if (rule.types[0].type === Array) {
		return processArray(item, rule, path, value, onError, isEnforce);
	}
	else {
		return processObject(item, rule, path, value, onError, isEnforce);
	}
};

const processArray = (item, rule, path, value, onError, isEnforce) => {
	let isChanged = false;

	repeat(value.length, (index) => {
		rule.content.forEach((rule) => {
			isChanged = processValue(item, rule, appendToPath(path, index), onError, isEnforce) || isChanged;
		});
	});

	if (isEnforce && isChanged) {
		set(item, path, value.filter((item) => item !== undefined));
	}

	return isChanged;
};

const processObject = (item, rule, path, value, onError, isEnforce) => {
	let isChanged = false;
	const keysNotInSchema = getKeysNotInSchema(value, rule);

	if (keysNotInSchema && keysNotInSchema.length !== 0) {
		keysNotInSchema.forEach((key) => {
			if (isEnforce && isObject(item)) {
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
	let isChanged = (rule.content && value && processContent(item, rule, path, value, onError, isEnforce));

	checkRule(rule, value, path, onError);

	return isEnforce && enforceRule(rule, item, path, value, replace) || isChanged;
}
