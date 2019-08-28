/**
 * @name Installation
 * @summary
 *
 * ```
 * npm install hord
 * ```
 * _Requires Babel 7.2+_
 */

/**
 * @name Docs
 * @summary
 *
 * - [List](docs/List.md)
 * - [Schema](docs/Schema.md)
 * - [Model](docs/Model.md)
 * - [Collection](docs/Collection.md)
 * - [compare](docs/compare.md)
 */
export { default as List } from './List';
export { default as Schema } from './Schema/Schema';
export { default as Model, MODEL_ERROR_LEVEL } from './Model';
export { default as Collection } from './Collection';
export { default as GraphDB } from './GraphDB';

export { default as compare } from './utility/compare';
