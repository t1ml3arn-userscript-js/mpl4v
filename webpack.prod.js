const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.config.js')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(config, {
        mode: 'production',
        optimization: {
            minimize: true,
            minimizer: [
            new TerserPlugin({
                terserOptions: {
                    mangle: false,  // keep vars' names
                    keep_classnames: true,
                    keep_fnames: true,
                    compress: {
                        ecma: 2016,
                        evaluate: false,
                        keep_fnames: true,
                    },
                    output: {
                        beautify: true,
                        comments: false,
                        indent_level: 2,
                    }
                }
            }),
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router': 'ReactRouter',
            'mobx': 'mobx',
            'mobx-react-lite': 'mobxReactLite'
        },
        output: {
            filename: 'user.js',
            path: path.resolve(__dirname, 'dist'),
       },
    }
)