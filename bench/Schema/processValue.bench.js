import { benchSettings } from 'karma-webpack-bundle';
import processValue from '../../src/Schema/processValue.js';

suite('processValue', () => {
	let sandbox;
	const returnTrue = () => true;
	const returnFalse = () => false;
	const returnInput = (input) => input;
	const onError = () => {
	};
	const rule = {
		keys: ['foo', 'bar'],
		types: [{
			check: returnTrue,
			enforce: returnInput,
			name: 'Object',
			type: Object
		}],
		content: [{
			key: 'foo',
			types: [{
				name: 'String',
				check: returnTrue,
				enforce: returnInput,
				type: String
			}]
		}, {
			key: 'bar',
			types: [{
				name: 'Array',
				check: returnTrue,
				enforce: returnInput,
				type: Array
			}],
			content: [{
				key: 0,
				types: [{
					name: 'Number',
					check: returnTrue,
					enforce: returnInput,
					type: String
				}, {
					name: 'Boolean',
					check: returnTrue,
					enforce: returnInput,
					type: Boolean
				}]
			}]
		}]
	};
	let item = {
		foo: 'value',
		bar: [1, 2, 3],
		deleted: '!',
		done: '!'
	};

	benchmark('value: undefined', () => {
		sandbox = processValue(item, rule, '', onError, true);
	}, {
		...benchSettings,
		onCycle() {
			item = {
				foo: 'value',
				bar: [1, 2, 3],
				deleted: '!',
				done: '!'
			};
		}
	});
});
