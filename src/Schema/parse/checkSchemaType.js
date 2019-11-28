import { isArray, isFunction, isInstanceOf, isObject } from 'type-enforcer-ui';
import Model from '../../Model';
import Schema from '../Schema';
import { TYPE_RULES } from './schemaTypeRules';

export const isValidType = (type) => TYPE_RULES.has(type) || isFunction(type) || isInstanceOf(type, Model) || isInstanceOf(type, Schema) || type === null;

const isAllValidTypes = (value) => {
	if (isArray(value)) {
		return value.length !== 0 && value.every(isValidType);
	}
	return isValidType(value);
};

export default (value) => {
	if (isObject(value)) {
		return (value.type !== undefined) ? isAllValidTypes(value.type) : isFunction(value.enforce);
	}

	return isAllValidTypes(value);
}
