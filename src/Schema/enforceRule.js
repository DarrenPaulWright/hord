import { set, unset } from 'object-agent';
import { enforce } from 'type-enforcer';

export default (rule, item, path, value, replace) => {
	const defaultValue = (rule.default !== undefined) ? rule.default : rule.isRequired ? replace || null : undefined;
	let newValue = null;

	rule.types.some((type) => {
		if (type.enforce === enforce.enum) {
			newValue = type.enforce(value, type.enum, defaultValue, type.coerce);
		}
		else if (type.enforce === enforce.instance) {
			newValue = type.enforce(value, type.type, defaultValue, type.coerce);
		}
		else {
			newValue = type.enforce(value, defaultValue, type.coerce);
		}
		if (type.numericRange) {
			newValue = type.numericRange(type, value, defaultValue);
		}

		return newValue !== null && newValue !== undefined;
	});

	if (newValue === undefined && !rule.isRequired) {
		unset(item, path);
		return true;
	}
	else if (newValue !== value) {
		set(item, path, newValue);
		return true;
	}
	return false;
};
