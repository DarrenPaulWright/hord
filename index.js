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
export { default as List } from './src/List';
export { default as Schema } from './src/Schema/Schema';
export { default as Model, MODEL_ERROR_LEVEL } from './src/Model';
export { default as Collection } from './src/Collection';
export { default as GraphDB } from './src/GraphDB';

export { default as compare } from './src/utility/compare';
