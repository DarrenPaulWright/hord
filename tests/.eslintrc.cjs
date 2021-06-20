const { eslintrc } = require('karma-webpack-bundle');

Object.assign(eslintrc.rules, {
	'consistent-this': 0,
	'init-declarations': 0,
	'no-new': 0,
	'import/no-extraneous-dependencies': 0,
	'unicorn/prevent-abbreviations': 0
});

module.exports = eslintrc;
