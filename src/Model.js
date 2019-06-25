import onChange from 'on-change';
import { Enum, isInstanceOf, methodEnum, methodQueue } from 'type-enforcer';
import Schema from './Schema/Schema';

export const SCHEMA = Symbol();
export const APPLIED = Symbol();

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
 * Models with automatic schema enforcement. Once the Model is instantiated the schema can't be changed.
 *
 * The Model class uses the [on-change](https://github.com/sindresorhus/on-change) library (uses the [`Proxy` API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)) to detect changes and enforce the schema.
 *
 * @example
 * ``` javascript
 * import { Model } from 'type-enforcer';
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
 *
 * @arg {Schema} schema
 */
export default class Model {
	constructor(schema) {
		this[SCHEMA] = isInstanceOf(schema, Schema) ? schema : new Schema(schema);
		this[APPLIED] = new WeakSet();
	}

	/**
	 * Apply this model to an object
	 *
	 * @memberOf Model
	 * @instance
	 *
	 * @arg {Object} object
	 *
	 * @returns {Object}
	 */
	apply(object) {
		const self = this;
		let isEnforcing = false;

		if (this[APPLIED].has(object)) {
			return object;
		}

		object = onChange(object, function(path, value, previous) {
			if (!isEnforcing) {
				isEnforcing = true;

				const errors = self[SCHEMA].enforce(this, path.split('.'), previous);

				self.onChange().trigger(null, [path, value, previous], this);

				if (errors.length) {
					self.onError().trigger(null, [errors], this);

					const errorLevel = self.errorLevel() || Model.defaultErrorLevel();

					errors.forEach((error) => {
						switch (errorLevel) {
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

				isEnforcing = false;
			}
		});

		this[APPLIED].add(object);
		isEnforcing = true;
		this[SCHEMA].enforce(object);
		isEnforcing = false;

		return object;
	}

	/**
	 * Get the schema for this model
	 *
	 * @memberOf Model
	 * @instance
	 * @readonly
	 *
	 * @returns {Schema}
	 */
	get schema() {
		return this[SCHEMA];
	}
}

/**
 * How to handle errors on all models
 *
 * @memberOf Model
 * @method defaultErrorLevel
 * @static
 * @default MODEL_ERROR_LEVEL.WARN
 *
 * @arg {MODEL_ERROR_LEVEL} errorLevel
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
	 * @memberOf Model
	 * @method errorLevel
	 * @instance
	 * @chainable
	 * @default MODEL_ERROR_LEVEL.UNSET
	 *
	 * @arg {MODEL_ERROR_LEVEL} errorLevel
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
	 * @memberOf Model
	 * @method onChange
	 * @instance
	 * @chainable
	 *
	 * @arg {function} callback - Provides three args: path, value, and previous value. Context is the model that changed.
	 *
	 * @returns {Queue}
	 */
	onChange: methodQueue(),
	/**
	 * Called when an error is returned from Schema validation
	 *
	 * @see [Queue](https://github.com/DarrenPaulWright/type-enforcer/blob/HEAD/docs/Queue.md)
	 *
	 * @memberOf Model
	 * @method onError
	 * @instance
	 * @chainable
	 *
	 * @arg {function} callback - Provides one arg: an array of errors. Context is the model that changed.
	 *
	 * @returns {Queue}
	 */
	onError: methodQueue()
});
