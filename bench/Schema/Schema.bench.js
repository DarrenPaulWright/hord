import { benchSettings } from 'karma-webpack-bundle';
import Schema from '../../src/Schema/Schema';

suite('Schema', () => {
	let sandbox;
	const returnTrue = () => true;
	const returnFalse = () => false;
	const returnInput = (input) => input;
	const onError = () => {
	};
	let schema = new Schema({
		foo: String,
		bar: {
			type: Array,
			content: {
				type: [Number, Boolean]
			}
		}
	});
	let item = {
		foo: 'value',
		bar: [1, 2, 3],
		deleted: '!',
		done: '!'
	};

	benchmark('init', () => {
		schema = new Schema({
			foo: String,
			bar: {
				type: Array,
				content: {
					type: [Number, Boolean]
				}
			}
		});
	}, benchSettings);

	benchmark('validate', () => {
		sandbox = schema.validate(item);
	}, {
		...benchSettings,
		onCycle() {
			schema = new Schema({
				foo: String,
				bar: {
					type: Array,
					content: {
						type: [Number, Boolean]
					}
				}
			});
			item = {
				foo: 'value',
				bar: [1, 2, 3],
				deleted: '!',
				done: '!'
			};
		}
	});

	benchmark('enforce', () => {
		sandbox = schema.enforce(item);
	}, {
		...benchSettings,
		onCycle() {
			schema = new Schema({
				foo: String,
				bar: {
					type: Array,
					content: {
						type: [Number, Boolean]
					}
				}
			});
			item = {
				foo: 'value',
				bar: [1, 2, 3],
				deleted: '!',
				done: '!'
			};
		}
	});

	benchmark('eachRule', () => {
		sandbox = schema.eachRule(onError);
	}, benchSettings);
});
