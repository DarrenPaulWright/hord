import { appendToPath, lastInPath, traverse } from 'object-agent';
import { isArray, isNumber, isObject } from 'type-enforcer-ui';
import checkSchemaType, { isValidType } from './checkSchemaType';

export default (item, callback) => {
	const subTraverse = (basePath, item) => {
		traverse(item, (path, value) => {
			const last = lastInPath(path);

			if (isNumber(last, true) && last > 0) {
				return true;
			}

			const isAnObject = isObject(value);
			const isSchemaType = checkSchemaType(value);

			if (!isSchemaType) {
				if (isAnObject) {
					value = Object;
				}
				else if (isArray(value)) {
					value = Array;
				}
			}

			if (basePath === '' || path !== '') {
				callback(appendToPath(basePath, path), value, isAnObject, isSchemaType);
			}

			if (isSchemaType && isAnObject && value.content !== undefined) {
				subTraverse(appendToPath(basePath, path), isValidType(value.content) ? [[value.content]] : [value.content]);
			}

			return isSchemaType;
		}, true);
	};

	subTraverse('', item);
}
