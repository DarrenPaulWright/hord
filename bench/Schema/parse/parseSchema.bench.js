import { benchSettings } from 'karma-webpack-bundle';
import parseSchema from '../../../src/Schema/parse/parseSchema.js';

suite('parseSchema', () => {
	let sandbox = {};
	let schema = {
		key1: String
	};

	benchmark('single key, single value', () => {
		sandbox = parseSchema(schema);
	}, {
		...benchSettings,
		onCycle() {
			schema = {
				key1: String
			};
		}
	});

	benchmark('complex', () => {
		sandbox = parseSchema(schema);
	}, {
		...benchSettings,
		onCycle() {
			schema = {
				key1: String,
				key2: [Number, null],
				key3: {
					type: Date,
					isRequired: true
				},
				key4: [{
					type: RegExp
				}]
			};
		}
	});
});
