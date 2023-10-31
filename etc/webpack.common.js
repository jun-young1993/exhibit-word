const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './src/main.ts', // 실행 파일을 main.ts로 설정
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        alias: {
            three: path.resolve('./node_modules/three'),
            utills: path.resolve('./src/utills'),
            lib: path.resolve('./src/lib'),
            contents: path.resolve('./src/contents'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve('./dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: process.env.NODE_ENV === 'production' ? {
                collapseWhitespace: true,
                removeComments: true,
            } : false
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: "./src/main.css", to: "./main.css" },
                { from: "./src/assets/gltf", to: "./gltf" },
                { from: "./src/assets/image", to: "./image" },
            ],
        })
    ]
};