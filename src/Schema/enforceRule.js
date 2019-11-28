import { clone, isEmpty, set, unset } from 'object-agent';
import { enforceEnum, enforceInstanceOf } from 'type-enforcer-ui';

export default (rule, item, path, value, replace) => {
	const defaultValue = (rule.default !== undefined) ? rule.default : rule.isRequired ? replace || null : undefined;
	let newValue = null;
	let isChanged = false;

	rule.types.some((type) => {
		if (type.schema) {
			newValue = type.enforce(clone(value), type.schema);
			if (isEmpty(newValue)) {
				newValue = rule.isRequired ? defaultValue : undefined;
				isChanged = true;
			}
		}
		else if (type.enforce === enforceEnum) {
			newValue = type.enforce(value, type.enum, defaultValue, type.coerce);
		}
		else if (type.enforce === enforceInstanceOf) {
			newValue = type.enforce(value, type.type, defaultValue, type.coerce);
		}
		else {
			newValue = type.enforce(value, defaultValue, type.coerce);
		}

		if (type.numericRange) {
			newValue = type.numericRange(type, value, defaultValue);
		}

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

		return newValue !== null && newValue !== undefined;
	});

	if (newValue === undefined && !rule.isRequired) {
		unset(item, path);
		isChanged = true;
	}
	else if (newValue !== value) {
		set(item, path, newValue);
		isChanged = true;
	}

	const type = rule.types[0].type;

	if (type === Array || type === Object || type === 'Schema') {
		if (!rule.isRequired && isEmpty(value)) {
			unset(item, path);
			isChanged = true;
		}
	}

	return isChanged;
};
