module.exports = [{
	type: 'helper',
	files: [
		'tests/testValues.js',
		'tests/TestUtil.js'
	]
}, {
	type: 'src',
	files: [
		'index.js',
		'src/**/*.js'
	]
}, {
	type: 'specs',
	files: [
		'tests/**/*.Test.js'
	]
}];
