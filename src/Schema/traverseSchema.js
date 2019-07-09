import { appendToPath, lastInPath, traverse } from 'object-agent';
import { is } from 'type-enforcer';
import Model from '../Model';
import checkSchemaType, { isType } from './checkSchemaType';

export default function(item, callback) {
	const subTraverse = (basePath, item) => {
		traverse(item, (path, value) => {
			const last = lastInPath(path);

			if (is.number(last, true) && last > 0) {
				return true;
			}

			const isAnObject = is.object(value);
			const isSchemaType = checkSchemaType(value);

			if (!isSchemaType) {
				value = isAnObject ? Object : is.array(value) ? Array : value;
			}

			if (is.instanceOf(value, Model)) {
				subTraverse(appendToPath(basePath, path), value.schema);
				return true;
			}

			if (basePath === '' || path !== '') {
				callback(appendToPath(basePath, path), value, isAnObject, isSchemaType);
			}

			if (isSchemaType && isAnObject && ('content' in value)) {
				subTraverse(appendToPath(basePath, path), isType(value.content) ? [[value.content]] : [value.content]);
			}

			return isSchemaType;
		}, true);
	};

	subTraverse('', item);
}
