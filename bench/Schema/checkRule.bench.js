import { benchSettings } from 'karma-webpack-bundle';
import checkRule from '../../src/Schema/checkRule';

suite('checkRule', () => {
	let sandbox;
	let rule = {
		isRequired: true,
		types: []
	};
	const onError = () => {
	};
	const returnTrue = () => true;
	const returnFalse = () => false;

	benchmark('isRequired, value undefined', () => {
		sandbox = checkRule(rule, undefined, '', onError);
	}, benchSettings);

	benchmark('schema', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					schema: true,
					check() {
						return [];
					}
				}]
			};
		}
	});

	benchmark('wrong type', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					check: returnFalse
				}]
			};
		}
	});

	benchmark('valid type', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					check: returnTrue
				}]
			};
		}
	});

	benchmark('numericRange true', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					check: returnTrue,
					clamp: false,
					numericRange: returnTrue
				}]
			};
		}
	});

	benchmark('numericRange false', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					check: returnTrue,
					clamp: false,
					numericRange: returnFalse
				}]
			};
		}
	});

	benchmark('length true', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					check: returnTrue,
					clamp: false,
					length: returnTrue
				}]
			};
		}
	});

	benchmark('length false', () => {
		sandbox = checkRule(rule, 3, '', onError);
	}, {
		...benchSettings,
		onCycle() {
			rule = {
				types: [{
					check: returnTrue,
					clamp: false,
					length: returnFalse
				}]
			};
		}
	});
});
