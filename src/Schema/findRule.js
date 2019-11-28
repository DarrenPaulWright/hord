import { walkPath } from 'object-agent';
import { isInteger } from 'type-enforcer-ui';

export default (path, schemaValues) => {
	walkPath(path, (key) => {
		if (schemaValues && schemaValues.content) {
			if (isInteger(key, true)) {
				schemaValues = schemaValues.content[0];
			}
			else {
				schemaValues = schemaValues.content
					.find((item) => item.key === key);
			}
		}
	});

	return schemaValues;
}
