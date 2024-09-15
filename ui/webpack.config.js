/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { HotModuleReplacementPlugin, web } = require('webpack');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    entry: './src/index.tsx',
    mode: 'development',
    output: {
        filename: 'index.js',
        publicPath: '/'
    },
    resolve: {
        extensions: [ '.js', '.ts', '.tsx' ],
        // alias: { '@material-ui/core': '@material-ui/core/es' }
    },
    devServer: {
        port: 8080,
        historyApiFallback: true
    },
    module: {
        rules: [
            {
                test: /\.(js|ts|tsx)$/,
                exclude: [ /node_modules/ ],
                use: [
                    { loader:'ts-loader' }
                ]
            },
            {
                test: /\.(svg|png|jpe?g)$/,
                use: [
                    { loader: 'url-loader' }
                ]
            },
            {
                test: /\.mp3$/,
                use: [
                    { loader: 'url-loader' }
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            inject: 'head',
            scriptLoading: 'defer'
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/style.css', to: './' },
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        }),
        new HotModuleReplacementPlugin()
    ]
};
