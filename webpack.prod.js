const path = require('path')
const merge = require('webpack-merge')
const config = require('./webpack.config.js')

module.exports = merge(config, {
        mode: 'production',
        optimization: {
            minimize: false,
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM',
            'react-router': 'ReactRouter'
        },
        output: {
            filename: 'user.js',
            path: path.resolve(__dirname, 'dist'),
       },
    }
)