// webpack配置
const path = require("path")
const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: "./src/index.js", //入口文件
    output: {  //输出文件
        filename: "bundle.js",
        path: path.resolve(__dirname,'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename:'../index.html'
        })
    ]
}
