import { benchSettings } from 'karma-webpack-bundle';
import traverseSchema from '../../../src/Schema/parse/traverseSchema';

suite('traverseSchema', () => {
	let sandbox;

	benchmark('empty', () => {
		sandbox = traverseSchema({}, () => {
		});
	}, benchSettings);

	benchmark('single key, single value', () => {
		sandbox = traverseSchema({
			key: String
		}, () => {
		});
	}, benchSettings);

	benchmark('single key, object value', () => {
		sandbox = traverseSchema({
			key: {
				type: String
			}
		}, () => {
		});
	}, benchSettings);
});
