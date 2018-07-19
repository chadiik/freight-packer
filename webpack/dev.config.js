const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    devtool: 'cheap-source-map',
  
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'FreightPacker.js'
    }

  });