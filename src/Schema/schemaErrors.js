import { Enum } from 'type-enforcer';

export default new Enum({
	MISSING_ENUM: 'Enum types must provide an enum',
	KEY_NOT_FOUND: 'Key found that isn\'t in the schema',
	CHECK: 'Value should be a ',
	REQUIRED: 'A value is required',
	NUMERIC_RANGE: 'Value is outside range',
	ARRAY_LENGTH: 'Array length is outside range'
});
