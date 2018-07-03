const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');

module.exports = merge(baseConfig, {
    //devtool: 'eval-source-map',
  
    devServer: {
        inline: true,
        contentBase: 'src',
        port: '3000',
    },
  
    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'FreightPacker.js'
    }

  });