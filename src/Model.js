import onChange from 'on-change';
import { Enum, isInstanceOf, methodEnum, methodQueue, PrivateVars, Queue } from 'type-enforcer';
import Schema from './Schema/Schema.js';

const _ = new PrivateVars();

export const processErrors = Symbol();

/**
 * How to handle Schema validation errors in models.
 *
 * @typedef MODEL_ERROR_LEVEL
 * @type {Enum}
 *
 * @property {} UNSET - Errors are ignored.
 * @property {} WARN - Console.warn
 * @property {} ERROR - Console.error
 * @property {} THROW - Throw an exception
 */
export const MODEL_ERROR_LEVEL = new Enum({
	UNSET: null,
	WARN: 'warn',
	ERROR: 'error',
	THROW: 'throw'
});

/**
 * Once the Model is instantiated the schema can't be changed.
 *
 * The Model class uses the [on-change](https://github.com/sindresorhus/on-change) library (uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) to detect changes and enforce the schema.
 *
 * @example
 * ``` javascript
 * import { Model } from 'hord';
 *
 * const Person = new Model({
 *  first: String,
 *  last: String,
 *  age: 'integer',
 *  hobbies: {
 *      type: Array,
 *      content: String
 *  }
 * });
 *
 * const johnDoe = Person.apply({
 *  first: 'John',
 *  last: 'Doe',
 *  age: 21
 * });
 *
 * johnDoe.hobbies = ['programming', 10];
 *
 * console.log(johnDoe);
 * // => { first: 'John', last: 'Doe', age: 21, hobbies: ['programming'] }
 * ```
 *
 * @class Model
 * @classdesc Data models with automatic schema enforcement.
 *
 * @param {Schema} schema
 */
export default class Model {
	constructor(schema) {
		_.set(this, {
			schema: isInstanceOf(schema, Schema) ? schema : new Schema(schema),
			applied: new WeakMap()
		});
	}

	[processErrors](errors) {
		const self = this;

		if (errors.length !== 0) {
			self.onError().trigger(null, [errors], errors[0].item);

			errors.forEach((error) => {
				switch (self.errorLevel() || Model.defaultErrorLevel()) {
					case MODEL_ERROR_LEVEL.WARN:
						console.warn(error.error, error);
						break;
					case MODEL_ERROR_LEVEL.ERROR:
						console.error(error.error, error);
						break;
					case MODEL_ERROR_LEVEL.THROW:
						throw error;
				}
			});
		}
	}

	/**
	 * Apply this model to an object.
	 *
	 * @memberof Model
	 * @instance
	 *
	 * @param {object} object - The object to apply this model to.
	 *
	 * @returns {object}
	 */
	apply(object) {
		const self = this;
		const _self = _(self);
		let isEnforcing = false;

		if (object === undefined || object === null) {
			return object;
		}

		const applied = _self.applied.get(object);
		if (applied !== undefined) {
			return applied;
		}

		if (_self.applied.has(onChange.target(object))) {
			return object;
		}

		self[processErrors](self.schema.enforce(object));

		const proxy = onChange(object, function(path, value, previous, name) {
			if (!isEnforcing) {
				isEnforcing = true;

				self[processErrors](self.schema.enforce(this, path, previous));

				if (self.onChange()) {
					self.onChange().trigger(null, [path, value, previous, name], this);
				}

				isEnforcing = false;
			}
		});

		_self.applied.set(object, proxy);

		return proxy;
	}

	/**
	 * Returns a new Model with a new [extended](docs/Schema.md#Schema+extend) Schema. Retains the errorLevel from the calling Model.
	 *
	 * @memberof Model
	 * @instance
	 *
	 * @param {Model|Schema|Schema.SchemaDefinition} model - The model to superimpose on this one.
	 *
	 * @returns {Model}
	 */
	extend(model) {
		return new Model(this.schema.extend(model ? (model.schema || model) : model))
			.errorLevel(this.errorLevel());
	}

	/**
	 * Get the schema for this model.
	 *
	 * @memberof Model
	 * @instance
	 * @readonly
	 *
	 * @returns {Schema}
	 */
	get schema() {
		return _(this).schema;
	}
}

/**
 * How to handle errors on all models
 *
 * @memberof Model
 * @method defaultErrorLevel
 * @static
 * @default MODEL_ERROR_LEVEL.WARN
 *
 * @param {MODEL_ERROR_LEVEL} errorLevel
 *
 * @returns {MODEL_ERROR_LEVEL}
 */
Model.defaultErrorLevel = methodEnum({
	init: MODEL_ERROR_LEVEL.WARN,
	enum: MODEL_ERROR_LEVEL
});

Object.assign(Model.prototype, {
	/**
	 * How to handle errors on this model. Overrides Model.defaultErrorLevel()
	 *
	 * @memberof Model
	 * @method errorLevel
	 * @instance
	 * @chainable
	 * @default MODEL_ERROR_LEVEL.UNSET
	 *
	 * @param {MODEL_ERROR_LEVEL} errorLevel
	 *
	 * @returns {MODEL_ERROR_LEVEL}
	 */
	errorLevel: methodEnum({
		init: MODEL_ERROR_LEVEL.UNSET,
		enum: MODEL_ERROR_LEVEL
	}),
	/**
	 * Called when a change is observed on an object applied to this model
	 *
	 * @see [Queue](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/Queue.md)
	 *
	 * @memberof Model
	 * @method onChange
	 * @instance
	 * @chainable
	 *
	 * @param {Function} callback - Provides four args: path, value, previous value, and the name of the method that produced the change. Context is the model that changed.
	 *
	 * @returns {Queue}
	 */
	onChange: methodQueue({
		bind: false
	}),
	/**
	 * Called when an error is returned from Schema validation
	 *
	 * @see [Queue](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/Queue.md)
	 *
	 * @memberof Model
	 * @method onError
	 * @instance
	 * @chainable
	 *
	 * @param {Function} callback - Provides one arg: an array of errors. Context is the model that changed.
	 *
	 * @returns {Queue}
	 */
	onError: methodQueue({
		bind: false
	})
});
