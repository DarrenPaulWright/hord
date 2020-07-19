import { benchSettings } from 'karma-webpack-bundle';
import findRule from '../../src/Schema/findRule.js';

suite('findRule', () => {
	let sandbox = {};
	const rules = {
		content: [{
			key: 'foo',
			content: [{
				bar: true
			}, {
				bar: false
			}]
		}]
	};

	benchmark('empty path', () => {
		sandbox = findRule('', rules);
	}, benchSettings);

	benchmark('two levels', () => {
		sandbox = findRule('foo.1', rules);
	}, benchSettings);
});
