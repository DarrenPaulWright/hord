const { eslintrc } = require('karma-webpack-bundle');

eslintrc.rules['jsdoc/require-jsdoc'] = 'off';
eslintrc.rules['jsdoc/no-undefined-types'] = 'off';
eslintrc.rules['mocha/no-skipped-tests'] = 'off';

module.exports = eslintrc;
