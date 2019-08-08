// webpack配置
const path = require("path") //引入path模块,path模块是用来处理路径的一个小工具
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")

module.exports = {
    //入口文件
    entry: {
        app: "./src/app.js"
    },
    //输出文件
    output: {
        filename: "[name].js", //[name]可以取到entry文件中路径的key;filename还可以是一个函数对象,对打包的文件进行处理
        path: path.resolve(__dirname,"dist")
    },
    plugins: [
        new HtmlWebpackPlugin({
            template:"./public/index.html",
            title:"零开始的vue脚手架"
        }),
        new VueLoaderPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.scss/,
                use:["style-loader","css-loader","sass-loader"]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
        ]
    }
}
