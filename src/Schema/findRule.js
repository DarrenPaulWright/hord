import { walkPath } from 'object-agent';

const NUMBERIC_REGEX = /^\d+$/u;

export default (path, schemaValues) => {
	walkPath(path, (key) => {
		if (schemaValues !== undefined && schemaValues.content) {
			if (NUMBERIC_REGEX.test(key)) {
				schemaValues = schemaValues.content[0];
			}
			else {
				schemaValues = schemaValues.content
					.find((item) => item.key === key);
			}
		}
	});

	return schemaValues;
};
