const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

var config = merge(baseConfig, {
    devtool: 'cheap-source-map',
  
    output: {
        path: path.resolve(__dirname, '../editor'),
        filename: 'FPEditor.js'
    }

});

config.entry = [
    './src/templates/Editor.js',
];

module.exports = config;