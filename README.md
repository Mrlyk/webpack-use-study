## 前端工程化项目构建-笔记  
### 一、工程目录下安装webpack 与 webpack-cli
>[webpack官方文档](https://webpack.js.org/concepts/)
- webpack 打包工具,工程化基础工具
- webpack-cli用来在命令行中执行webpack命令

#### 1.安装与初始化
```
// 初始化一个由node管理模块的项目
npm init

// 存储到本地开发依赖,只需要在开发时使用,不需要在生产时使用-D或--save-dev
npm install webpack webpack-cli -D
```
tips:如果未配置webpack入口与输出目录,则默认入口目录为src/index.js,输出为dist/main.js

#### 2.初始化目录
```
webpack-demo
├── package.json
├── dist
├── index.html
└── src
    └── index.js
```
在index.html中将打包的输出文件(main.js)引入.

#### 3.初始化webpack配置
>在根目录下添加webpack.config.js
>>path.resolve() 方法会把一个路径或路径片段的序列解析为一个绝对路径。
  path.resolve([…paths])里的每个参数都类似在当前目录执行一个cd操作，从左到右执行，返回的是最后的当前目录.
  ```
  // exp:path.resolve('/foo/bar','./baz');相当于：
   cd /foo/bar //此时当前路径为 /foo/bar
   cd ./baz //此时路径为 /foo/bar/baz
  ```
#### 初始化配置的一些问题
1. 引入内部js文件放在index.html的body中,放在head中的是外部js文件.内部js文件如果放在head中当加载到的时候会直接执行,
这时document还没加载完会报错.
2. 

___
### 二、常用插件plugins
#### 1.HtmlWebpackPlugin
>介绍:上面每次我们更改输出文件的名字, 也要手动去修改index.html中引入js的名字,很不方便.
本插件可以帮助我们自动生成入口文件(生成入口index.html,所以原来手动创建的可以删除),自动将生成的的资源注入到index.html中
```
//安装:
npm install html-webpack-plugin -D
```

##### 使用:
1.在webpack配置文件中先实例化
```
const HtmlWebpackPlugin = require("html-webpack-plugin")
```
2.在配置插件的数组中new一个该实例
```
plugins:[
    new HtmlWebpackPlugin()
    ]
```
3.配置参数  
[配置参数详见](https://segmentfault.com/a/1190000007294861)
```
// 传入一个对象来配置参数,常用的有template,filename
plugins:[
    new HtmlWebpackPlugin({
        template:'index.html', //指定一个模板来创建入口文件
        filename:'../index.html'//指定文件名和路径,默认在dist目录中
    })
    ]
```
