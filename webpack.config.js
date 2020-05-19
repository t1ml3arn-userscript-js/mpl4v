const path = require("path");

module.exports = {
    entry: './src/index.jsx',
    mode: "development",
    module: {
        rules: [
            {
                test: /\.css$/i,
                include: [
                    path.resolve(__dirname, "src/")
                ],
                use: ['css-loader'],
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'eslint-loader']
                // TODO use options and move presets and plugins here ?
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer : {
        contentBase: path.join(__dirname, 'public/'),
        port: 3000,
        watchOptions: { poll: 2000 }
    }
}