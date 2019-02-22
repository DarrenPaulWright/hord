import { traverse } from 'object-agent';
import { is } from 'type-enforcer';
import checkSchemaType, { isType } from './checkSchemaType';

export default function(item, callback) {
	const subTraverse = (basePath, item) => {
		traverse(item, (path, value) => {
			const last = path[path.length - 1];

			if (is.number(last) && last > 0) {
				return true;
			}

			const isAnObject = is.object(value);
			const isSchemaType = checkSchemaType(value);

			if (!isSchemaType) {
				value = isAnObject ? Object : is.array(value) ? Array : value;
			}

			if (!basePath.length || path.length) {
				callback(basePath.concat(path), value, isAnObject, isSchemaType);
			}

			if (isSchemaType && isAnObject && ('content' in value)) {
				subTraverse(basePath.concat(path), isType(value.content) ? [[value.content]] : [value.content]);
			}

			return isSchemaType;
		}, true);
	};

	subTraverse([], item);
};
