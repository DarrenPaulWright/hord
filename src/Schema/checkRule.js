import { appendToPath } from 'object-agent';
import ERRORS from './schemaErrors.js';

const OR_SEPARATOR = ' OR ';

const checkRule = (type, value, path, onError) => {
	if (type.schema !== undefined) {
		type.check(value, type.schema).forEach((error) => {
			onError(error.error, appendToPath(path, error.path), error.value);
		});

		return false;
	}

	if (!type.check(value, type.enum || type.coerce || type.type)) {
		return type.message || ERRORS.CHECK + type.name;
	}

	if (type.clamp !== true) {
		if (type.numericRange !== undefined && !type.numericRange(type, value, false)) {
			return ERRORS.NUMERIC_RANGE;
		}
		if (type.length !== undefined && !type.length(type, value)) {
			return ERRORS.VALUE_LENGTH;
		}
	}

	return false;
};

export default (rule, value, path, onError) => {
	if (value === undefined) {
		if (rule.isRequired === true && rule.default === undefined) {
			onError(ERRORS.REQUIRED, path, value);
		}
	}
	else {
		const errors = [];

		if (!rule.types.some((type) => errors[errors.push(checkRule(type, value, path, onError)) - 1] === false)) {
			onError(errors.join(OR_SEPARATOR), path, value);
		}
	}
};
