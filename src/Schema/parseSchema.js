import { forOwn, isEmpty, traverse } from 'object-agent';
import { castArray, enforce, Enum, is } from 'type-enforcer';
import findRule from './findRule';
import ERRORS from './schemaErrors';
import { checkArrayLength, checkNumericRange, instanceRule, sameRule, TYPE_RULES } from './schemaTypeRules';
import traverseSchema from './traverseSchema';

export default function(schema) {
	const buildRule = (type, value) => {
		const isConstructor = is.function(type);
		const rule = Object.assign({}, TYPE_RULES.get(type) || (isConstructor ? instanceRule : sameRule));

		if (!TYPE_RULES.has(type)) {
			rule.name = isConstructor ? type.name : type + '';
		}
		rule.type = type;

		forOwn(enforce.object(value, {}), (subValue, subKey) => {
			if (!['content', 'type', 'name', 'isRequired', 'default'].includes(subKey)) {
				rule[subKey] = subValue;
			}
		});

		if ((type === 'integer' || type === Number) && ('min' in rule || 'max' in rule)) {
			rule.numericRange = checkNumericRange;
		}
		if ((rule.type === Array) && ('minLength' in rule || 'maxLength' in rule)) {
			rule.arrayLength = checkArrayLength;
		}

		return rule;
	};

	let schemaValues;

	traverseSchema(schema, (path, value, isAnObject, isSchemaType) => {
		const last = path[path.length - 1];
		const output = {
			types: []
		};

		if (path.length) {
			output.key = last;
		}

		const types = castArray((isAnObject && 'type' in value) ? value.type : value);
		types.forEach((type) => {
			if (isAnObject) {
				if (is.function(value.enforce) && !('type' in type)) {
					type = 'any';
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

		if (!path.length) {
			schemaValues = output;
		}
		else {
			const parent = findRule(path.slice(0, -1), schemaValues);
			if (!parent.content) {
				parent.content = [];
			}
			parent.content.push(output);
			if (parent.keys) {
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
};
