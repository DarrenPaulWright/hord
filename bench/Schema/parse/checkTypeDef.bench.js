import { benchSettings } from 'karma-webpack-bundle';
import checkSchemaType from '../../../src/Schema/parse/checkTypeDef';

suite('checkSchemaType', () => {
	let sandbox;

	benchmark('string', () => {
		sandbox = checkSchemaType(String, false);
	}, benchSettings);

	benchmark('array empty', () => {
		sandbox = checkSchemaType([], false);
	}, benchSettings);

	benchmark('array two items', () => {
		sandbox = checkSchemaType([String, null], false);
	}, benchSettings);

	benchmark('object', () => {
		sandbox = checkSchemaType({
			type: [String, null]
		}, true);
	}, benchSettings);

	benchmark('object, enforce', () => {
		sandbox = checkSchemaType({
			enforce: () => {
			}
		}, true);
	}, benchSettings);
});
