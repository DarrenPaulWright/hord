import { assert } from 'chai';
import findRule from '../../src/Schema/findRule';

describe('findRule', () => {
	const schema = {
		key: '',
		content: [{
			key: 'test1'
		}, {
			key: 'test2',
			content: [{
				content: [{
					key: 'test3'
				}, {
					key: 'test4'
				}]
			}]
		}]
	};

	it('should return the full schema if an empty array is given', () => {
		assert.deepEqual(findRule('', schema), schema);
	});

	it('should return first level keys', () => {
		assert.deepEqual(findRule('test2', schema), {
			key: 'test2',
			content: [{
				content: [{
					key: 'test3'
				}, {
					key: 'test4'
				}]
			}]
		});
	});

	it('should return arrays', () => {
		assert.deepEqual(findRule('test2.0', schema), {
			content: [{
				key: 'test3'
			}, {
				key: 'test4'
			}]
		});
	});

	it('should return the array content when an index greater than 0 is given', () => {
		assert.deepEqual(findRule('test2.3', schema), {
			content: [{
				key: 'test3'
			}, {
				key: 'test4'
			}]
		});
	});

	it('should return the last leaf if a greater path is given', () => {
		assert.deepEqual(findRule('test1.test4.50', schema), {
			key: 'test1'
		});
	});

	it('should return items in arrays', () => {
		assert.deepEqual(findRule('test2.0.test4', schema), {
			key: 'test4'
		});
	});
});
