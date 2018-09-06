const path = require('path');
const webpack = require('webpack');

module.exports = {

    entry: [
        './src/loader.js',
    ],

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.txt$/,
                use: 'raw-loader'
            },
            {
                test: /\.glsl$/,
                use: 'raw-loader'
            }
        ],
    },

    plugins: [
        new webpack.EnvironmentPlugin([
            'NODE_ENV'
        ]),
    ],

    output: {
        path: path.resolve(__dirname, '../build'),
        filename: 'FreightPacker-loader.js'
    }

};
