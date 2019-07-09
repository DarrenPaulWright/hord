import { walkPath } from 'object-agent';
import { isInteger } from 'type-enforcer';

export default function(path, schemaValues) {
	walkPath(path, (key) => {
		if (schemaValues.content) {
			schemaValues = schemaValues.content
				.find((item) => item.key === key || isInteger(key, true));
		}
	});

	return schemaValues;
}
