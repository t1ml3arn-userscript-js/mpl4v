const ESLintWebpackPlugin = require("eslint-webpack-plugin");
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
                test: /\.(ts|tsx|js|jsx)$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            }
        ]
    },
    resolve: {
        extensions: ['*', '.js', '.jsx', '.ts', '.tsx', ],
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public/'),
            watch: {
                usePolling: true,
                interval: 3000
            }
        },
        port: 3000,
        client: {
            overlay: false,
        }
    },
    plugins: [new ESLintWebpackPlugin()]
}