import { appendToPath, get, repeat, set, unset } from 'object-agent';
import { isObject } from 'type-enforcer';
import checkRule from './checkRule.js';
import enforceRule from './enforceRule.js';
import ERRORS from './schemaErrors.js';

const isDefined = (item) => item !== undefined;

const getKeysNotInSchema = (value, rule) => {
	return rule.keys && !rule.keys.includes('*') && Object.keys(value)
		.filter((key) => !rule.keys.includes(key));
};

const processContent = (item, rule, path, value, onError, isEnforce) => { // eslint-disable-line max-params
	if (rule.types[0].type === Array) {
		return processArray(item, rule, path, value, onError, isEnforce);
	}

	return processObject(item, rule, path, value, onError, isEnforce);
};

const processArray = (item, rule, path, value, onError, isEnforce) => { // eslint-disable-line max-params
	let isChanged = false;

	repeat(value.length, (index) => {
		rule.content.forEach((subRule) => {
			isChanged = processValue(item, subRule, appendToPath(path, index), onError, isEnforce) || isChanged;
		});
	});

	if (isEnforce && isChanged) {
		set(item, path, value.filter(isDefined));
	}

	return isChanged;
};

const processObject = (item, rule, path, value, onError, isEnforce) => { // eslint-disable-line max-params
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

	rule.content.forEach((subRule) => {
		isChanged = processValue(item, subRule, appendToPath(path, subRule.key), onError, isEnforce) || isChanged;
	});

	return isChanged;
};

/**
 * Validate or enforce a rule on a value.
 *
 * @function processValue
 * @private
 *
 * @param {*} item - The value to validate.
 * @param {object} rule - The rule to process.
 * @param {string} path - The path that the item is located at.
 * @param {Function} onError - Function to call if a validation error is found.
 * @param {boolean} [isEnforce=false] - Enforce the rule.
 * @param {*} replace - The value to replace item with if not valid.
 *
 * @returns {boolean}
 */
export default function processValue(item, rule, path, onError, isEnforce, replace) { // eslint-disable-line max-params
	const value = get(item, path);
	const isChanged = (rule.content && value && processContent(item, rule, path, value, onError, isEnforce));

	checkRule(rule, value, path, onError);

	return (isEnforce && enforceRule(rule, item, path, value, replace)) || isChanged;
}
