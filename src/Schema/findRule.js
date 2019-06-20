import { isInteger } from 'type-enforcer';

export default function(path, schemaValues) {
	return path.reduce((result, key) => {
		if (!result.content) {
			return result;
		}
		return result.content.find((item) => item.key === key || isInteger(key, true));
	}, schemaValues);
}
