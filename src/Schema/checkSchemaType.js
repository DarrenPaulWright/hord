import { is } from 'type-enforcer';
import Model from '../Model';
import { TYPE_RULES } from './schemaTypeRules';

export const isType = (type) => TYPE_RULES.has(type) || (is.function(type) && !is.instanceOf(type, Model)) || type === null;

export const isAllType = (value) => value.length !== 0 && value.every(isType);

export default function(value) {
	if (is.object(value)) {
		if ('type' in value) {
			return is.array(value.type) ? isAllType(value.type) : isType(value.type);
		}
		return is.function(value.enforce);
	}
	return is.array(value) ? isAllType(value) : isType(value);
};
