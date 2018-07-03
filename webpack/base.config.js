const webpack = require('webpack');

module.exports = {

    entry: [
      './src/main.js',
    ],  

    module: {
      rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
        },
      ],
    },

    plugins: [
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
        ]),
    ],

};
