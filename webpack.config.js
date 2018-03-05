const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = [
  {
    name: 'build',
    context: __dirname,
    entry: path.resolve(__dirname, './src/Popover.jsx'),
    output: {
      path: path.join(__dirname, 'lib'),
      filename: 'index.js',
      publicPath: '/lib/',
      library: 'ReactPopover',
      libraryTarget: 'commonjs2',
    },
    module: {
      loaders: [
        { test: /\.jsx?$/, loader: 'babel-loader', include: path.join(__dirname, 'src') },
      ],
    },
    externals: {
      react: 'react',
      'react-dom': 'react-dom',
    },
    target: 'web',
    plugins: [
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
  },
];
