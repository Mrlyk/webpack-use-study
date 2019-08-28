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
  // exp:path.join()则是从左到右拼接路径,而不是使用cd切换
  ```  
entry : 入口文件地址  
output: 打包后的输出地址  
mode : 开发模式 (development,production,none)
#### 4.自动构建,浏览器实时刷新,模块热更新与报错模块定位配置
(1)自动构建命令 --watch  
>在检测到入口文件的依赖发生变化后会自动构建,实现自动构建
```
"build": "webpack --watch"
```
(2)浏览器实时刷新
>配置webpack-dev-server,该插件会在本地启动一个服务器来监视我们的变动,同时默认开启watch模式
```
//安装
npm i webpack-dev-server -D
```
**配置:**[官方文档](https://www.webpackjs.com/configuration/dev-server/)
```
devServer: {
    contentBase:path.join(__dirname,"dist") //告诉服务器从哪里提供内容,只有在想要提供静态文件时才需要,比如我这里有张图片
    host:'localhost',
    post:6161
    // 还有很多其他配置,如open:true,自动打开浏览器;
    // clientLogLevel:"warning",浏览器控制台输出信息显示;
    // quiet:true,不在开发工具中打印打包信息;
    // overlay: true,在编译出现错误时,错误信息覆盖浏览器页面
    // inline: true,使用行内嵌入模式,在模块热更新时会将更新的chunk插入进去(还有iframe模式,产生一个虚拟的fram块,在其中实现热更新)
    // compress: true, webpack-dev-server服务器使用gzip方式压缩所有资源,文件体积减小,但是客户端需要解压会产生额外负载.
  },

```
(3)模块热更新  
在devServer配置选项中增加
```
hot:true
```
则会应用模块的热更新,这样在更新一些文件时就不会对整个浏览器进行刷新,而是只更新对应模块.  
**注意，必须有 webpack.HotModuleReplacementPlugin 才能完全启用 HMR。
如果 webpack 或 webpack-dev-server 是通过 --hot 选项启动的，那么这个插件会被自动添加，所以你可能不需要把它添加到 webpack.config.js 中**  

*配置端口代理*  
如果希望在本地访问后端的某个服务器 api 或者访问前端自己在本地搭建的 mock 服务，可以通过 proxy 来做代理。比如：
```
proxy: {
  "/api": "http://localhost:6161"
}
```
最终请求 /api/json 的话会代理到 http://localhost:6161/api/json  

(4)模块报错定位source-map  
>源码在经过webpack打包之后,多个文件和模块打包到了一两个总的js文件中,如果源文件中有错误,调试工具只会告诉我们打包后的文件错误,无法定位到具体的源文件.
此时可以配置source-map  

|devtool	|构建速度	|重新构建速度	  |适用环境	|精准度|
| --------- | --------: | :---------: | :-----: | :---: |
|none	    |+++	    |+++	      |生产环境	|不生成 source map。|
|source-map	|--	        |--	          |生产环境	|映射到原始源代码，source map 作为单独的文件保存。|
|inline-source-map	|--	|--	          |开发环境	|映射到原始源代码，source map 转换为 DataUrl 后添加到 bundle 中，会导致文件大小剧增。|
|eval	    |+++	    |+++	      |开发环境	|映射到转换后的代码，而不是源代码，行数映射不正确。|
|eval-source-map	|--	|+	          |开发环境	|映射到原始源代码，只映射到行。|

根据不同的需要我们可以在config中配置不同的方法,一般在开发中映射到源代码的行足够了,所以一般使用eval-source-map就行了  
```
devtool:"eval-source-map"
```

#### 初始化配置的一些问题
1.引入内部js文件放在index.html的body中,放在head中的是外部js文件.内部js文件如果放在head中当加载到的时候会直接执行,
这时document还没加载完会报错.  
2.HMR(模块热更新)的前提是模块实现了HMR的接口,如果一个模块没有 HMR 处理函数,更新就会冒泡,一个单独的模块被更新,那么整组依赖模块都会被重新加载.
诸如vue-loader,style-loader,前端三个框架的官方loader(vue-loader....等)模块内部已经实现了HMR接口.但如果我们自己写一个模块没有实现HMR接口,就会触发全局刷新.  
举例如何实现HMR接口:  
```
// 在src下新建一个print.js:
export default function(){
  console.log('hot reloat')
}

// 在src/app.js中增加对HMR的接口实现:
import print from "./print.js"  // 引入print.js
print()
// 增加对HMR的实现
if(module.hot) {  // module是node暴露的一个全局接口
  module.hot.accept('./print.js',function(){
    console.log("接受热更新后的模块")
    pirnt() // 执行热更新之后的方法
  })
}
```
*注意:手写的这种热更新虽然会更新方法,但是如果绑定了元素事件,他们依然会绑定老的方法,需要手动重新渲染元素并重新挂载到新的方法上,就需要在函数中做更多.*  

3.webpack-dev-server是基于webpack-dev-middleware和express来实现的.webpack-dev-middleware 可以把 Webpack 处理后的文件传递给一个服务器(本地服务器express).
如果想要配置更多自定义选项,可以使用webpack-dev-middleware来取代webpack-dev-server.
[官方文档](https://webpack.docschina.org/guides/development/)  
*基础配置如下:*
```
// 安装express和webpack-dev-middleware
npm i express webpack-dev-middleware -D
 
// 在根目录添加server.js
const webpack = require("webpack");
const middleware = require("webpack-dev-middleware");
const config = require("./webpack.config");
const compiler = webpack(config);
const express = require("express");
const app = express();

app.use(
  middleware(compiler, {
    publicPath: config.output.publicPath  //记得在webpack.config中配置publicPath
  })
);

app.listen(6161, () => console.log("Example app listening on port 6161!"));

// 命令配置
"scripts": {
    "start": "node server.js"
  },
```
___
### 二、常用插件plugins
>插件用于扩展webpack自身的功能,使用插件让我们能够干预webpack的构建过程,达到自定义的目的
- HtmlWebpackPlugin 自动生成入口文件(html入口文件)，并将最新的资源注入到 HTML 中.
- CommonsChunkPlugin 用以创建独立文件，常用来提取多个模块中的公共模块
- DefinePlugin 用以定义在编译时使用的全局常量.
- DllPlugin 拆分 bundle 减少不必要的构建.
- ExtractTextWebpackPlugin 将文本从 bundle 中提取到单独的文件中。常见的场景是从 bundle 中将 CSS 提取到独立的 css 文件中.
- HotModuleReplacementPlugin 在运行过程中替换、添加或删除模块，而无需重新加载整个页面.
- UglifyjsWebpackPlugin 对 js 进行压缩，减小文件的体积.
- CopyWebpackPlugin 将单个文件或整个目录复制到构建目录.一个常用的场景是将项目中的静态图片不经构建直接复制到构建后的目录.
#### 1.HtmlWebpackPlugin
>介绍:上面每次我们更改输出文件的名字, 也要手动去修改index.html中引入js的名字,很不方便.
本插件可以帮助我们自动生成入口文件(生成入口index.html,所以原来手动创建的可以删除),自动将生成的的资源注入到index.html中
```
//安装:
npm install html-webpack-plugin -D
```

##### 使用:
1.在webpack配置文件中先引入
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
配置参数如果是title等可以传递的参数,可以在入口文件中使用脚本语言获取<%= htmlWebpackPlugin.options.title%>
```
// 传入一个对象来配置参数,常用的有template,filename
plugins:[
    new HtmlWebpackPlugin({
        template:'index.html', //指定一个模板来创建入口文件.会处理webpack.config.js中的参数,同时复制这个文件上的配置来生成新的入口文件
        filename:'../index.html'//指定文件名(默认index.html)和路径,默认在output的路径中
    })
    ]
```
#### 2.FriendlyErrorsWebpackPlugin  
>介绍:webpack打包后会输出很多信息,该插件可以帮助我们更好的处理编译后的信息,比如错误或警告出现的具体位置会被输出到开发工具控制台.也可以自定义编译成功的输出信息.
```
// 安装
npm i friendly-errors-webpack-plugin -D
```
##### 使用:  
1.在webpack中先引入
```
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin")
```
2.在配置插件的数组中new一个该实例并配置参数[插件官方文档](https://www.npmjs.com/package/friendly-errors-webpack-plugin)
```
new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo:{
        messages: ['Your application is running here: http://localhost:6161']
      }
    })
```

---
### 三、loader及常用的一些loader
>webpack本身只能对js和json文件进行处理,为了对css,静态资源等文件进行处理,需要使用loader
对非js文件进行预处理.loader与plugins有些相似,但是loader只专注于对文件的transform,plugin的则不止于此.
- babel-loader 将 ES2015+ 代码转译为 ES5.
- ts-loader 将 TypeScript 代码转译为 ES5.
- css-loader 解析 @import 和 url()，并对引用的依赖进行解析.
- style-loader 在 HTML 中注入\<style>标签将 css 添加到 DOM 中。通常与 css-loader 结合使用.
- sass-loader 加载 sass/scss 文件并编译成 css.
- postcss-loader 使用 PostCSS 加载和转译 css 文件.
- html-loader 将 HTML 导出为字符串.
- vue-loader 加载和转译 Vue 组件.
- url-loader 和 file-loader 一样，但如果文件小于配置的限制值，可以返回 data URL.
- file-loader 将文件提取到输出目录，并返回相对路径
#### 1.style-loader/css-loader
>介绍:css-loader将css代码抽出import或require的模块代码交给下一个loader,这里即style-loader处理.
style-loader则将css代码直接使用\<style>标签插入入口文件的head中
```
//安装
npm i style-loader css-loader -D
```
##### 使用:
1.在webpack.config.js中新增module对象,表示要对模块进行配置处理  
2.在module中配置处理规则rules,规则中包含不同类来处理不同的模块  
3.一类模块配置多个loader时是从右往左,单个loader时可以直接用
```
loader: "css-loader"
```
4.include和exclude,一个是包含一个是不包含且exclude的优先级最高
```
module: {
        rules: [
            {
                test: /\.css/,   //test匹配:匹配所有含有.css的文件
                use:["style-loader","css-loader"] //使用这两个loader进行处理,从右到左
                include:[        //和test相同,但使用绝对路径直接进行匹配
                    path.resolve(__dirname, "app")
                ],
                exclude:[       //表示绝对不匹配的选项
                    path.resolve(__dirname, "app/demo")
                ]
            }
        ]
    }
```

#### 2.url-loader/file-loader
>介绍:将文件提取到输出目录，并返回相对路径,用url-loader可以配置尺寸限制,小于该尺寸会被转换成base64编码的url,大于该尺寸的则交给file-loader处理.
file-loader会返回文件的相对路径
```
//安装
npm i url-loader file-loader -D
```
##### 使用:
1.在webpack.config.js中新增module对象,表示要对模块进行配置处理  
2.在module中配置处理规则rules,规则中使用test匹配不同的模块  
3.对参数进行配置,超过options中limit大小的文件将会交给file-loader来处理  
**4.url-loader是对file-loader的封装(增加了limit参数,其他file-loader的配置参数也可使用),所以不需要再额外配置file-loader,但是仍然需要安装file-loader依赖**
```
module: {
        rules: [
            {
              test:/\.(png|jpe?g|gif|svg)(\?.*)?$/,
                use:[{
                  loader:"url-loader",
                  options:{
                    limit:"8092",
                    name:"img/[hash:7].[ext]" // 通过name属性可以配置超出limit时的路径,相对于输出目录(dist)
                    }
                  }
                ]
            }
        ]
    }
```
**注意:url-loader 和 file-loader处理的是url(...)或者require(...)或者import...引入的图片,src属性的地址图片不会进行处理**
#### 3.Babel
>介绍:babel是一个转码器,将ES2015+代码转为ES5代码,来实现更好的兼容性.babel6.0版本之后拆分了几个独立的包.具体如下安装.
```
//babel/core:babel的核心;babel/preset-env:让babel能根据当前的运行环境，自动确定需要的 plugins 和 polyfill,主要负责将代码转成 ES5 语法规则.
//babel 编译时只编译语法，并不会编译 API 和实例方法，如：async/await、Promise 等，babel-polyfill 会把这些没有的 API 全部挂载到全局对象，也就是所谓的“垫片”(polyfill库手动实现的高阶方法).
npm i @babel/core @babel/preset-env babel-loader -D
npm i @babel/polyfill -S
```
##### 使用:
1.在webpack.config.js中新增module对象,表示要对模块进行配置处理  
2.匹配js文件,通常不要对node-modules中的文件进行处理  
3.在根目录使用.babelrc(rc:run command)文件配置babel(官方推荐的方式)  
具体配置参数可看[此文](https://juejin.im/post/5a79adeef265da4e93116430)

```
module: {
        rules: [
            {
               test: /\.js/,
               loader: "babel-loader",
               exclude: /node-modules/
            },
        ]
    }
    
/* .babelrc */
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false,
        "targets": {
          "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
        },
        "corejs": "2.6.9",
        "useBuiltIns": "usage"
      }
    ]
  ]
}
```
---
### 四、搭建一个基于vue框架的脚手架

>搭建一个单文件的vue项目,需要使用vue-loader和vue-template-compiler

[vue-loader官方文档](https://vue-loader.vuejs.org/zh/)
- vue-loader 会解析 .vue 文件，提取每个语言块，如有必要会通过其它 loader 处理，
最后将他们组装成一个 ES Module，它默认导出一个 Vue.js 组件选项的对象。
- vue-template-compiler 会接解析 template 标签中的内容，预处理为 JS 渲染函数，并最终注入到从 \<script> 导出的组件中。
```
// 安装
npm i vue-loader vue-template-compiler -D
```
__注意__:在vue-loader v15版本更新后,不仅需要配置loader还需要引入一个VueLoaderPlugin,他在vue-loader的lib文件夹中.
这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 .vue 文件里相应语言的块。例如，如果你有一条匹配 /\.js$/ 的规则，那么它会应用到 .vue 文件里的 \<script> 块。

>创建根目录文件

1. 创建一个src/app.vue作为项目的根目录
2. 创建一个src/app.js作为应用的入口，它会把 src/app.vue 作为模板进行渲染(使用vue渲染函数)。同时 webpack 会将 src/app.js 作为入口进行打包。

>css使用scss语法,安装sass-loader node-sass
```
npm i sass-loader node-sass -D
```
node-sass是一套在 node.js 用 LibSass(C语言实现的sass解析器) 编译 scss 的工具,可以在本地自动编译scss.

>使用postcss  

**什么是postcss?**  
开发中有的css属性并没有在所有浏览器中得到共同的规范,属于实验中的功能,这类css在不同浏览器上通常需要加上不同的前缀,比如-webkit,-moz.
通过webpack的插件系统如 autoprefixer 插件,提供了自动帮我们加上这些前缀的功能(postcss-preset-env包含autoprefixer插件),同时插件会帮我们把高级的css语法转成兼容式的.类似于Babel将es6+转换成es5.  
安装:
```
npm install postcss-loader postcss-preset-env -D
```
使用:  
*1.在webpack.config.jsz中进行配置*  
首先要使用sass-loader解析sass文件,之后使用postcss-loader进行处理,配置文件使用postcss-preset-env.
```
{
test: /\.scss/,
use:[
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
```
*2.根目录配置单独的postcss.config.js(名称自定)文件*
```
// postcss.config.js
module.exports = {
  plugins: {
    "postcss-preset-env": {}
  }
};
```
postcss-preset-env 是否自动给 css 添加前缀以及添加什么前缀，依赖于要支持的浏览器列表。浏览器列表有以下几种配置方式：
1. package.json 中的 browserslist 字段中配置，也是官方推荐的方式。
2. 在 .browserslistrc 或者 browserslist 配置文件中配置
3. 在 BROWSERSLIST 环境变量中配置  

*在package.json的browserslist字段中配置*
```
"browserslist": [
    "> 1%",   // 市场份额大于1%的浏览器(注意package.json中不能有注释)
    "last 2 versions",  // 更新的最新两个版本的浏览器
    "not ie <= 8"  // ie8以上的浏览器
    "Firefox ESR // Firefox ESR浏览器
    "not dead" // 两年以内有更新的浏览器
  ]
```
>配置vue-router  

vue单页应用需要借助官方的vue-router来实现页面的加载和跳转  
安装:
```
npm i vue-router
```
在src目录新建router/index.js来对router进行配置,再在入口文件中进行引人
```
import router from "./router/index.js"

new Vue({
    el:'#app',
    router,
    render: h => h(App) //vue的render函数,该渲染函数接收一个 createElement(h) 方法作为第一个参数用来创建 VNode
})

```
---
### 五、搭建一个mock-server服务器来mock数据  
>实现大致分为三步:Node服务,路由,数据模拟.
#### 1.搭建mock服务器,使用node.js + express框架来编写
在根目录新建mock文件夹,配置server.js
```
// 安装express框架
npm i express -D

// 安装处理上传文件的模块
npm i connect-multiparty -D
```
配置详情查看/mock/server.js文件
```
// 启动命令
"mock": "node ./mock/server.js"
```
