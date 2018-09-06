const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {

    entry: [
        './src/dev.js',
    ],

    devtool: ['source-map', 'eval-source-map'][0],
  
    output: {
        libraryTarget: 'var',
        path: path.resolve(__dirname, '../build'),
        filename: 'FreightPacker-dev.js'
    }

  });