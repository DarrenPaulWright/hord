const { eslintrc } = require('karma-webpack-bundle');

eslintrc.rules['no-unused-vars'] = 0;
eslintrc.rules['mocha/max-top-level-suites'] = 0;

module.exports = eslintrc;
