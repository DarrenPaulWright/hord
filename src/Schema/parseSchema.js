import { forOwn, initialInPath, isEmpty, lastInPath, traverse } from 'object-agent';
import { castArray, Enum, is, isObject } from 'type-enforcer';
import findRule from './findRule';
import ERRORS from './schemaErrors';
import { checkLength, checkNumericRange, instanceRule, sameRule, TYPE_RULES } from './schemaTypeRules';
import traverseSchema from './traverseSchema';

export default function(schema) {
	const buildRule = (type, value) => {
		const isConstructor = is.function(type);
		const rule = {
			...TYPE_RULES.get(type) || (isConstructor ? instanceRule : sameRule)
		};

		if (!TYPE_RULES.has(type)) {
			rule.name = isConstructor ? type.name : type + '';
		}
		rule.type = type;

		if (isObject(value)) {
			forOwn(value, (subValue, subKey) => {
				if (!['content', 'type', 'name', 'isRequired', 'default'].includes(subKey)) {
					rule[subKey] = subValue;
				}
			});
		}

		if ((type === 'integer' || type === Number) && ('min' in rule || 'max' in rule)) {
			rule.numericRange = checkNumericRange;
		}
		if (('minLength' in rule || 'maxLength' in rule) && ('length' in rule.type)) {
			rule.length = checkLength;
		}

		return rule;
	};

	let schemaValues;

	traverseSchema(schema, (path, value, isAnObject, isSchemaType) => {
		const last = lastInPath(path);
		const output = {
			types: []
		};

		if (path !== '') {
			output.key = is.number(last, true) ? last - 0 : last;
		}

		const types = castArray((isAnObject && 'type' in value) ? value.type : value);
		types.forEach((type) => {
			if (isAnObject) {
				if (is.function(value.enforce) && !('type' in type)) {
					type = '*';
				}
				if (type === Enum && !('enum' in value)) {
					throw new Error(ERRORS.MISSING_ENUM);
				}
			}
			output.types.push(buildRule(type, value, isAnObject));
		});

		if (isAnObject) {
			if ('isRequired' in value) {
				output.isRequired = value.isRequired;
			}
			if ('default' in value) {
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
			if ('keys' in parent) {
				parent.keys.push(last);
			}
		}
	});

	if (isEmpty(schemaValues.content)) {
		throw new Error('Schema must contain a value');
	}

	traverse(schemaValues, (path, value) => {
		Object.freeze(value);
	});

	return schemaValues;
}
