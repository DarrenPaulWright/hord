import { diffUpdate, forOwn, get, intersection, mapOwn, set, unset } from 'object-agent';
import onChange from 'on-change';
import { methodKeyValue } from 'type-enforcer';
import Schema from './Schema';

export default function Model(schemaDefinition) {
	const schema = new Schema(schemaDefinition);

	class model {
		constructor(data) {
			this.set(schema.enforce(data));

			return onChange(this, () => {
				schema.enforce(this);
			});
		}

		get(path) {
			return get(this, path);
		}

		unset(path) {
			unset(this, path);
		}

		forOwn(callback) {
			return forOwn(this, callback);
		}

		mapOwn(callback) {
			return mapOwn(this, callback);
		}

		diffUpdate(item) {
			return diffUpdate(this, item);
		}

		intersection(...args) {
			return intersection(this, ...args);
		}

		toString() {
			return JSON.stringify(this);
		}
	}

	Object.assign(model.prototype, {
		set: methodKeyValue({
			set: function(path, value) {
				set(this, path, value);
			}
		})
	});

	return model;
};
