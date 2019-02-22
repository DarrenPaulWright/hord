import ERRORS from './schemaErrors';

export default checkRule = (rule, value) => {
	if (!rule.check(value, rule.enum || rule.coerce || rule.type)) {
		return rule.message || ERRORS.CHECK + rule.name;
	}
	if (rule.numericRange && !rule.numericRange(rule, value)) {
		return ERRORS.NUMERIC_RANGE;
	}
	if (rule.arrayLength && !rule.arrayLength(rule, value)) {
		return ERRORS.ARRAY_LENGTH;
	}
};
