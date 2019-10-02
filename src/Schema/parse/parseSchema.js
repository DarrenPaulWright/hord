import { forOwn, initialInPath, isEmpty, lastInPath, traverse } from 'object-agent';
import { castArray, Enum, isFunction, isInstanceOf, isNumber } from 'type-enforcer';
import Model from '../../Model';
import findRule from '../findRule';
import Schema from '../Schema';
import ERRORS from '../schemaErrors';
import { checkLength, checkNumericRange, instanceRule, sameRule, TYPE_RULES } from './schemaTypeRules';
import traverseSchema from './traverseSchema';

const EXCLUDE_KEYS = ['content', 'type', 'name', 'isRequired', 'default'];

const buildRule = (type, value, isAnObject) => {
	type = parseType(type, value, isAnObject);

	if (isInstanceOf(value, Schema)) {
		return {
			name: 'Schema',
			check(item) {
				return value.validate(item);
			},
			enforce(item) {
				return value.enforce(item);
			},
			type: Schema,
			schema: value
		};
	}
	if (isInstanceOf(value, Model)) {
		return {
			name: 'Model',
			check(item) {
				return value.schema.validate(item);
			},
			enforce(item) {
				return value.apply(item);
			},
			type: Model,
			model: value
		};
	}

	const isConstructor = isFunction(type);

	const rule = {
		...(TYPE_RULES.get(type) || (isConstructor ? {
			...instanceRule,
			name: type.name
		} : {
			...sameRule,
			name: type + ''
		})),
		type
	};

	if (isAnObject) {
		forOwn(value, (subValue, subKey) => {
			if (!EXCLUDE_KEYS.includes(subKey)) {
				rule[subKey] = subValue;
			}
		});
	}

	if ((type === 'integer' || type === Number) && (rule.min !== undefined || rule.max !== undefined)) {
		rule.numericRange = checkNumericRange;
	}
	if ((rule.minLength !== undefined || rule.maxLength !== undefined) && rule.type.length !== undefined) {
		rule.length = checkLength;
	}

	return rule;
};

const parseType = (type, value, isAnObject) => {
	if (isAnObject) {
		if (type === Enum && value.enum === undefined) {
			throw new Error(ERRORS.MISSING_ENUM);
		}
		if (isFunction(value.enforce) && type.type === undefined) {
			type = '*';
		}
	}

	return type;
};

const parseTypes = (isAnObject, value) => {
	return castArray((isAnObject && value.type !== undefined) ? value.type : value)
		.map((type) => buildRule(type, value, isAnObject));
};

export default (schema) => {
	let schemaValues;

	traverseSchema(schema, (path, value, isAnObject, isSchemaType) => {
		const output = {
			types: parseTypes(isAnObject, value)
		};

		if (isAnObject) {
			if (value.isRequired !== undefined) {
				output.isRequired = value.isRequired;
			}
			if (value.default !== undefined) {
				output.default = value.default;
			}
			if (!isSchemaType) {
				output.keys = [];
			}
		}

		if (path === '') {
			schemaValues = output;
		}
		else {
			const parent = findRule(initialInPath(path), schemaValues);
			if (!parent.content) {
				parent.content = [];
			}
			parent.content.push(output);

			const last = lastInPath(path);
			output.key = isNumber(last, true) ? last - 0 : last;
			if (parent.keys) {
				parent.keys.push(last);
			}
		}
		return false;
	});

	if (isEmpty(schemaValues.content)) {
		throw new Error('Schema must contain a value');
	}

	traverse(schemaValues, (path, value) => {
		Object.freeze(value);
	});

	return schemaValues;
}
