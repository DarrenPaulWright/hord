import { assert } from 'chai';
import { forOwn, get } from 'object-agent';
import { isObject } from 'type-enforcer';

export const eachPair = (array1, array2, callback, isUnique = false) => {
	let i;
	let j;
	const length1 = array1.length;
	const length2 = array2.length;
	let doBreak = false;

	isUnique = array1 === array2 && isUnique;

	for (i = 0; i < length1; i++) {
		for (j = isUnique ? i + 1 : 0; j < length2; j++) {
			if (callback(array1[i], array2[j])) {
				doBreak = true;
				break;
			}
		}

		if (doBreak) {
			break;
		}
	}
};

/**
 * @function multiTest
 *
 * @arg {Object}       settings
 * @arg {Object|Array} settings.values
 * @arg {Object|Array} [settings.values2] - Only for eachPair. If not provided, pairs are made within the values array. If provided, pairs are only made with one from each array.
 * @arg {Function}     settings.test
 * @arg {Function}     [settings.filter]
 * @arg {Function}     [settings.message=`should return ${output} when set to ${input}`]
 * @arg {String}       [settings.inputKey]
 * @arg {String}       [settings.outputKey]
 * @arg {*}            [settings.output]
 * @arg {Boolean}      [settings.eachPair=false] - values must be an array, runs tests on every combination of two items from values
 * @arg {Boolean}      [settings.eachUniquePair=false] - like eachPair, but runs unique pairs
 * @arg {String}       [settings.assertion='equal']
 */
export const multiTest = (settings) => {
	const assertion = settings.assertion || 'equal';

	let buildSingleMessage;
	if (settings.message) {
		buildSingleMessage = settings.message;
	}
	else if (settings.assertion === 'isTrue') {
		buildSingleMessage = (input) => `should return true for ${input}`;
	}
	else if (settings.assertion === 'isFalse') {
		buildSingleMessage = (input) => `should return false for ${input}`;
	}
	else {
		buildSingleMessage = (input, output) => `should return ${output} when set to ${input}`;
	}

	const buildDoubleMessage = settings.message || ((input1, input2, output) => {
		return `should return ${output} when ${input1} and ${input2} are provided`;
	});

	const testSingleValue = (input, output, value) => {
		if ((!settings.filter) || settings.filter(value)) {
			it(buildSingleMessage(input, output), () => {
				assert[assertion](settings.test(input), output);
			});
		}
	};

	const testDoubleValue = (input1, input2, output, value1, value2) => {
		if ((!settings.filter) || settings.filter(value1, value2)) {
			it(buildDoubleMessage(input1, input2, output), () => {
				assert[assertion](settings.test(input1, input2), output);
			});
		}
	};

	const testSingleArrayValue = (value) => {
		if (settings.output) {
			if (settings.inputKey) {
				testSingleValue(get(value, settings.inputKey), settings.output, value);
			}
			else {
				testSingleValue(value, settings.output, value);
			}
		}
		else if (settings.outputKey) {
			if (settings.inputKey) {
				testSingleValue(get(value, settings.inputKey), get(value, settings.outputKey), value);
			}
			else {
				testSingleValue(value, get(value, settings.outputKey), value);
			}
		}
		else {
			if (settings.inputKey) {
				testSingleValue(get(value, settings.inputKey), undefined, value);
			}
			else {
				testSingleValue(value, undefined, value);
			}
		}
	};

	const testDoubleArrayValue = (value1, value2) => {
		if (settings.output) {
			if (settings.inputKey) {
				testDoubleValue(value1[settings.inputKey], value2[settings.inputKey], settings.output, value1, value2);
			}
			else {
				testDoubleValue(value1, value2, settings.output, value1, value2);
			}
		}
		else {
			if (settings.inputKey) {
				testDoubleValue(value1[settings.inputKey], value2[settings.inputKey], undefined, value1, value2);
			}
			else {
				testDoubleValue(value1, value2, undefined, value1, value2);
			}
		}
	};

	if (isObject(settings.values)) {
		forOwn(settings.values, (value, key) => {
			testSingleValue(key, value, value);
		});
	}
	else if (settings.eachPair) {
		eachPair(settings.values, settings.values2 || settings.values, testDoubleArrayValue);
	}
	else if (settings.eachUniquePair) {
		eachPair(settings.values, settings.values2 || settings.values, testDoubleArrayValue, true);
	}
	else {
		settings.values.forEach(testSingleArrayValue);
	}
};
