'use strict'

const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const autoprefixer = require('autoprefixer')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
module.exports = {
    entry: "./src/app.js",
    output:{
        filename: 'bundle.[chunkhash].js',
        path: path.resolve(__dirname,'public')
    },
    devServer:{
        port:3000
    },
    plugins:[
        new HTMLPlugin({
            template: "./index.html"
        }),
        new CleanWebpackPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(scss)$/i,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer
                                ]
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg|webp)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]', // Формат на имената на файловете
                            outputPath: 'images', // Изходна директория за медийните файлове
                        },
                    },
                ],
            }
        ],
    }
}