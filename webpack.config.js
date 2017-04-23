const webpack = require('webpack')
const isProduction = process.env.NODE_ENV === 'production'

const config = {
    devtool: 'source-map',
    entry: "./js/index.ts",
    output: {
        filename: "dist/js/index.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                enforce: 'pre',
                test: /\.tsx?$/,
                use: "source-map-loader"
            }
        ]
    },
}

if (isProduction) {
    config.devtool = false
    config.plugins = [
        new webpack.optimize.UglifyJsPlugin(),
    ]
}

module.exports = config