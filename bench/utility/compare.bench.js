import displayValue from 'display-value';
import { benchSettings } from 'karma-webpack-bundle';
import { combo } from 'object-agent';
import { isDate } from 'type-enforcer-ui';
import { compare } from '../../index';

const values = ['test', 'test2', undefined, 3, 4, new Date('1/2/2000')];

const parseDisplay = (value) => {
	return isDate(value) ? value.toDateString() : displayValue(value);
};

suite('compare', () => {
	let sandbox;
	const simpleCompare = compare();
	const pathCompare = compare('key');
	const pathsCompare = compare(['key', 'key2']);
	let object1 = {};
	let object2 = {};

	benchmark('init undefined', () => {
		sandbox = compare();
	}, benchSettings);

	benchmark('init single path', () => {
		sandbox = compare('key');
	}, benchSettings);

	benchmark('init multi path', () => {
		sandbox = compare(['key', 'key2']);
	}, benchSettings);

	values.forEach((value) => {
		benchmark('simple ' + parseDisplay(value) + ', ' + parseDisplay(value), () => {
			sandbox = simpleCompare(value, value);
		}, benchSettings);
	});

	combo(values).forEach((value) => {
		benchmark('simple ' + parseDisplay(value[0]) + ', ' + parseDisplay(value[1]), () => {
			sandbox = simpleCompare(value[0], value[1]);
		}, benchSettings);

		benchmark('simple ' + parseDisplay(value[1]) + ', ' + parseDisplay(value[0]), () => {
			sandbox = simpleCompare(value[1], value[0]);
		}, benchSettings);
	});

	values.forEach((value) => {
		benchmark('path ' + parseDisplay(value) + ', ' + parseDisplay(value), () => {
			sandbox = pathCompare(object1, object2);
		}, {
			...benchSettings,
			onCycle() {
				object1 = {
					key: value
				};
				object2 = {
					key: value
				};
			}
		});
	});

	values.forEach((value) => {
		benchmark('paths ' + parseDisplay(value) + ', ' + parseDisplay(value), () => {
			sandbox = pathsCompare(object1, object2);
		}, {
			...benchSettings,
			onCycle() {
				object1 = {
					key: value,
					key2: value
				};
				object2 = {
					key: value,
					key2: value
				};
			}
		});
	});
});
