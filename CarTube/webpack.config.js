const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
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