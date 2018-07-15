const path = require('path');
const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

module.exports = merge(baseConfig, {
    devtool: 'source-map',

    entry: [
        './src/templates/Editor.js',
    ],
  
    output: {
        path: path.resolve(__dirname, '../editor'),
        filename: 'FPEditor.js'
    }

});