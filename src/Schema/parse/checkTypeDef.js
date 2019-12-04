import Model from '../../Model';
import Schema from '../Schema';
import { TYPE_RULES } from './typeRules';

export const isValidType = (type) => TYPE_RULES.has(type) ||
	typeof type === 'function' ||
	type instanceof Model ||
	type instanceof Schema ||
	type === null;

const isAllValidTypes = (value) => Array.isArray(value) ?
	value.length !== 0 && value.every(isValidType) :
	isValidType(value);

export default (value, isObject) => isObject === true ?
	(value.type !== undefined) ? isAllValidTypes(value.type) : typeof value.enforce === 'function' :
	isAllValidTypes(value);

