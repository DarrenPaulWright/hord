import { appendToPath, lastInPath, traverse } from 'object-agent';
import { isArray, isNumber, isObject } from 'type-enforcer';
import checkTypeDef, { isValidType } from './checkTypeDef.js';

const subTraverse = (basePath, item, callback) => {
	traverse(item, (path, value) => {
		const last = lastInPath(path);

		if (isNumber(last, true) && last > 0) {
			return true;
		}

		const isAnObject = isObject(value);
		const isTypeDef = checkTypeDef(value, isAnObject);

		if (!isTypeDef) {
			if (isAnObject) {
				value = Object;
			}
			else if (isArray(value)) {
				value = Array;
			}
		}

		if (basePath === '' || path !== '') {
			callback(appendToPath(basePath, path), value, isAnObject, isTypeDef);
		}

		if (isTypeDef && isAnObject && value.content !== undefined) {
			subTraverse(appendToPath(basePath, path), isValidType(value.content) ? [[value.content]] : [value.content], callback);
		}

		return isTypeDef;
	}, true);
};

export default (item, callback) => {
	subTraverse('', item, callback);
};
