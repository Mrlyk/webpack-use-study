// webpack配置
const path = require("path") //引入path模块,path模块是用来处理路径的一个小工具
const HtmlWebpackPlugin = require("html-webpack-plugin")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")

module.exports = {
  //开发模式
  mode:'development',
  //入口文件
  entry: {
    app: "./src/app.js"
  },
  //输出文件
  output: {
    filename: "[name].js", //[name]可以取到entry文件中路径的key;filename还可以是一个函数对象,对打包的文件进行处理
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "零开始的vue脚手架"
    }),
    new VueLoaderPlugin(),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo:{
        messages: ['Your application is running here: http://localhost:6161']
      }
    })
  ],
  devtool: "eval-source-map",
  devServer: {
    contentBase:path.join(__dirname,"dist"),
    host:'localhost',
    port:'6161',
    clientLogLevel:"warning",
    hot:true,
    quiet:true,
    compress:true,
    overlay:{warnings:false,errors:true},
    proxy:{
      "/api":"http://localhsot:9999"
    }
  },
  watchOptions: {
    ignored:"/node-modules/"
  },
  module: {
    rules: [
      {
        test: /\.js/,
        loader: "babel-loader",
        exclude: /node-modules/
      },
      {
        test: /\.scss/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              plugins: [require("postcss-preset-env")]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [{
          loader: "url-loader",
          options: {
            limit: "8192",
            name: "img/[hash:7].[ext]"
          }
        }
        ]
      },
      // {
      //     test:/\.(png|jpe?g|gif|svg)$/i,
      //     use:[{
      //         loader:"file-loader",
      //         options:{
      //             outputPath:"images"
      //         }
      //     }
      //     ]
      // },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: "8192",
              name: "media/[hash:7].[ext]"
            }
          }
        ]
      },
    ]
  }
}
