// webpack配置
const path = require("path") //引入path模块,path模块是用来处理路径的一个小工具
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/index.js", //入口文件
    output: {  //输出文件
        filename: "bundle.js",
        path: path.resolve(__dirname,"dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename:"../index.html"
        })
    ],
    module: {
        rules: [
            {
                test: /\.css/,
                use:["style-loader","css-loader"]
            }
        ]
    }
}
