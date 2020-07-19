import { isFunction } from 'type-enforcer';
import Model from '../../Model.js';
import Schema from '../Schema.js';
import { TYPE_RULES } from './typeRules.js';

export const isValidType = (type) => TYPE_RULES.has(type) ||
	isFunction(type) ||
	type instanceof Model ||
	type instanceof Schema ||
	type === null;

const isAllValidTypes = (value) => Array.isArray(value) ?
	value.length !== 0 && value.every(isValidType) :
	isValidType(value);

export default (value, isObject) => {
	return isObject === true ?
		((value.type === undefined) ?
			isFunction(value.enforce) :
			isAllValidTypes(value.type)) :
		isAllValidTypes(value);
};

