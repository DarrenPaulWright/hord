import ERRORS from './schemaErrors';

export default (rule, value) => {
	if (!rule.check(value, rule.enum || rule.coerce || rule.type)) {
		return rule.message || ERRORS.CHECK + rule.name;
	}
	if (rule.clamp !== true) {
		if ('numericRange' in rule && !rule.numericRange(rule, value, false)) {
			return ERRORS.NUMERIC_RANGE;
		}
		if ('length' in rule && !rule.length(rule, value)) {
			return ERRORS.VALUE_LENGTH;
		}
	}
};