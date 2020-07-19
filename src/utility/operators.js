import { Enum } from 'type-enforcer';

export default new Enum({
	EQUAL: '$eq',
	NOT_EQUAL: '$ne',
	IN: '$in',
	NOT_IN: '$nin',
	GREATER_THAN: '$gt',
	GREATER_THAN_EQUAL: '$gte',
	LESS_THAN: '$lt',
	LESS_THAN_EQUAL: '$lte'
});
