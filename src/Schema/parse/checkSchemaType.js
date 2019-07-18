import { isArray, isFunction, isInstanceOf, isObject } from 'type-enforcer';
import Model from '../../Model';
import { TYPE_RULES } from './schemaTypeRules';

export const isType = (type) => TYPE_RULES.has(type) || (isFunction(type) && !isInstanceOf(type, Model)) || type === null;

const isAllType = (value) => {
	if (isArray(value)) {
		return value.length !== 0 && value.every(isType);
	}
	return isType(value);
};

export default (value) => {
	if (isObject(value)) {
		if (value.type !== undefined) {
			return isAllType(value.type);
		}

		return isFunction(value.enforce);
	}

	return isAllType(value);
}
