import { appendToPath } from 'object-agent';
import ERRORS from './schemaErrors';

const OR_SEPARATOR = ' OR ';

const checkRule = (type, value, path, onError) => {
	if (type.schema) {
		type.check(value, type.schema).forEach((error) => {
			onError(error.error, appendToPath(path, error.path), error.value);
		});
		return false;
	}

	if (!type.check(value, type.enum || type.coerce || type.type)) {
		return type.message || ERRORS.CHECK + type.name;
	}
	
	if (type.clamp !== true) {
		if (type.numericRange && !type.numericRange(type, value, false)) {
			return ERRORS.NUMERIC_RANGE;
		}
		if (type.length && !type.length(type, value)) {
			return ERRORS.VALUE_LENGTH;
		}
	}
};

export default (rule, value, path, onError) => {
	const errors = [];

	if (value === undefined) {
		if (rule.isRequired && rule.default === undefined) {
			onError(ERRORS.REQUIRED, path, value);
		}
	}
	else if (!rule.types.some((type) => !errors[errors.push(checkRule(type, value, path, onError)) - 1])) {
		onError(errors.join(OR_SEPARATOR), path, value);
	}
};
