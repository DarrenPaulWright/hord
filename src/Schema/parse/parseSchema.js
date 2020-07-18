import { forOwn, initialInPath, isEmpty, lastInPath, traverse } from 'object-agent';
import { castArray, Enum, isFunction, isNumber } from 'type-enforcer-ui';
import Model from '../../Model.js';
import findRule from '../findRule.js';
import Schema from '../Schema.js';
import ERRORS from '../schemaErrors.js';
import traverseSchema from './traverseSchema.js';
import { checkLength, checkNumericRange, instanceRule, sameRule, TYPE_RULES } from './typeRules.js';

const EXCLUDE_KEYS = ['content', 'type', 'name', 'isRequired', 'default'];

const buildRule = (type, value, isAnObject) => {
	let rule;

	if (isAnObject) {
		if (type === Enum && value.enum === undefined) {
			throw new Error(ERRORS.MISSING_ENUM);
		}
		if (isFunction(value.enforce) && type.type === undefined) {
			type = '*';
		}
	}

	if (type instanceof Schema || type instanceof Model) {
		rule = Object.assign({}, TYPE_RULES.get('Schema'), {
			type: Schema,
			schema: type.schema || type
		});
	}
	else {
		rule = Object.assign({}, TYPE_RULES.get(type) ||
			(isFunction(type) ?
				Object.assign({}, instanceRule, {
					name: type.name
				}) :
				Object.assign({}, sameRule, {
					name: type + ''
				})), {
			type
		});
	}

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

export default (schema) => {
	let schemaValues;

	traverseSchema(schema, (path, value, isAnObject, isSchemaType) => {
		const rule = {
			types: castArray((isAnObject && value.type !== undefined) ? value.type : value)
				.map((type) => buildRule(type, value, isAnObject))
		};

		if (isAnObject) {
			if (value.isRequired !== undefined) {
				rule.isRequired = value.isRequired;
			}
			if (value.default !== undefined) {
				rule.default = value.default;
			}
			if (!isSchemaType) {
				rule.keys = [];
			}
		}

		if (path === '') {
			schemaValues = rule;
		}
		else {
			const parent = findRule(initialInPath(path), schemaValues);
			if (!parent.content) {
				parent.content = [];
			}
			parent.content.push(rule);

			const last = lastInPath(path);
			rule.key = isNumber(last, true) ? last - 0 : last;
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
};
