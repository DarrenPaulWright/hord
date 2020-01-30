import { benchSettings } from 'karma-webpack-bundle';
import { get } from 'object-agent';
import enforceRule from '../../src/Schema/enforceRule.js';

suite('enforceRule', () => {
	let sandbox;
	const returnTrue = () => true;
	const returnFalse = () => false;
	const returnInput = (input) => input;
	let rule = {
		isRequired: true,
		types: [{
			type: Object,
			enforce: returnInput
		}]
	};
	let item = {
		key: 'value'
	};
	let path = 'key';
	let value = 'value';
	const bench = () => {
		sandbox = enforceRule(rule, item, path, value);
	};

	benchmark('value: undefined', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: false,
				types: [{
					type: String,
					enforce: returnInput
				}]
			};
			item = {
				key: undefined
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('isRequired', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: true,
				types: [{
					type: String,
					enforce: returnInput
				}]
			};
			item = {
				key: 'value'
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('isRequired, value: undefined', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: true,
				types: [{
					type: String,
					enforce: returnInput
				}]
			};
			item = {
				key: undefined
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('isRequired, value: undefined, default', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: true,
				types: [{
					type: String,
					enforce: returnInput,
					default: 'test'
				}]
			};
			item = {
				key: undefined
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('value: {}', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: false,
				types: [{
					type: Object,
					enforce: returnInput
				}]
			};
			item = {
				key: {}
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('value: String, minLength', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: false,
				types: [{
					type: String,
					enforce: returnInput,
					length: true,
					minLength: 10,
					clamp: true
				}]
			};
			item = {
				key: '12345'
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('value: String, maxLength', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: false,
				types: [{
					type: String,
					enforce: returnInput,
					length: true,
					maxLength: 5,
					clamp: true
				}]
			};
			item = {
				key: '1234567890'
			};
			path = 'key';
			value = get(item, path);
		}
	});

	benchmark('value: String, within length', bench, {
		...benchSettings,
		onCycle() {
			rule = {
				isRequired: false,
				types: [{
					type: String,
					enforce: returnInput,
					length: true,
					minLength: 5,
					maxLength: 10,
					clamp: true
				}]
			};
			item = {
				key: '1234567'
			};
			path = 'key';
			value = get(item, path);
		}
	});

});
