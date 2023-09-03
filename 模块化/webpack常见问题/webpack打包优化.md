# 优化

## 1：优化图片

##### 使用 url-loader 优化， 将小图片转化成base64压缩,防止小图片太多请求次数太多。



```javascript
1：下载 url-loader
     npm install -D url-loader
2: 配置
   在 webpack.prod.conf.js 文件夹中配置
     module: {
      rules: [{
         test: /\.(png|svg|jpg|gif)$/,
         use: [{
           loader: 'url-loader', // 优化小图片过多造成请求数太多
           options: {
             limit: 8192, // 如果图片小于 8192 bytes 就直接 base64 内置到模板，否则才拷贝
             outputPath: 'img/'
           } 
         }]
      },
 
```

## 2：分离第三方包

##### 打包后的bundle.js文件夹较大，所以每次加载的时候，请求比较慢，所以有必要在打包时将第三方包分离出来。使用CommonsChunkPlugin 插件进行配置。



```javascript
在 webpack.prod.conf.js 文件夹中配置
 1：引入webpack
     const webpack = require('webpack')
2：将 entry  改成一个对象
       entry: {
         vendor: ['babel-polyfill', "axios", "marked", "react", "react-dom", "react-router-dom"], // 第三方文件
         app: './src/main.js'
       },
       plugins: [
         new webpack.optimize.CommonsChunkPlugin({
           name: "vendor", // 当加载 vendor 中的资源的时候，把这些资源都合并到 vendor.js 文件中
           filename: "js/vendor.js",
           minChunks: Infinity,
        })
      ],
```

## 3：分离 css 文件并压缩 css 文件

##### 使用 extract-text-webpack-plugin 插件将css文件分离出来。为了使项目加载时候尽早优先加载css样式，也为了解决js文件体积过大的问题



```javascript
1: 下载 extract-text-webpack-plugin
     npm  install  -D  extract-text-webpack-plugin
2: 配置
   在 webpack.prod.conf.js 文件夹中配置
    1> 引入 
         const ExtractTextPlugin = require("extract-text-webpack-plugin")
    2> 配置分离 css 文件
         plugins: [
               new ExtractTextPlugin("css/styles.css"), // 把抽离出来的 css 文件打包到 styles.css 文件中
         ],
        module: {
         rules: [ {
           test: /\.css$/,
           use: ExtractTextPlugin.extract({
                  fallback: "style-loader",
                  use: {
                        loader: 'css-loader',
                       options: {
                            minimize: true
                       }
                 }
          })
       },
     } ]
  3> 配置压缩css (直接配置 css-loader 属性的选项)
 module: {
    rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
               //这个地方配置一个对象，添加一个属性进行压缩css文件
               use: {
                   loader: 'css-loader',
                  options: {
                    minimize: true   // 配置minimize 值为true，压缩css 文件
                  }
              }
           })
      },
```

## 4: 压缩 js 文件

##### 使用 `uglifyjs-webpack-plugin `将`js`压缩，减少打包后的 vendor.js , bundle.js 等js的文件大小



```javascript
   1: 下载 uglifyjs-webpack-plugin
         npm install -D uglifyjs-webpack-plugin
    2: 配置
        在webpack.prod.conf.js 文件夹中配置
        1> 引入
           const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
        2> 配置
           plugins: [
                new UglifyJsPlugin(), // 压缩 JavaScript
           ],
```

## 5：压缩Html

##### 为了减少打包后的文件体积，使性能更好，效率更高，提高加载速度，打包时有必要进行压缩。

##### 使用`html-webpack-plugin `进行压缩

```javascript
1：下载 html-webpack-plugin
     npm   install  -D   html-webpack-plugin
2:   配置
     在  webpack.prod.conf.js  文件中配置
     1>  引入
       const HtmlWebpackPlugin = require('html-webpack-plugin')
     2> 配置
       plugins: [
             new HtmlWebpackPlugin({
               template: './index.html', // 把 index.html 也打包到 dist 目录中
             // 压缩 html，默认 false 不压缩
              minify: {
                  collapseWhitespace: true, // 去除回车换行符以及多余空格
                 removeComments: true, // 删除注释
             }
         }),]
```

###### minify 是一个对象，其实还可以配置压缩其它。感兴趣的小伙伴可以去官网研究下

## 6: 不打包第三方库

` webpack`可以不处理应用的某些依赖库，使用`externals`配置后，依旧可以在代码中通过CMD、AMD或者window/global全局的方式访问。

 有时我们希望我们通过`script`引入的库，如用CDN的方式引入的`vue`，我们在使用时，依旧用require的方式来使用，但是却不希望`webpack`将它又编译进文件中。 

```js
module.exports = {
  output: {
   libraryTarget: "umd"
  },
  externals: {
   vue: 'Vue',
  'vue-router': 'VueRouter',
   axios: 'axios',
  'vue-lazyload':'vue-lazyload',
  'fastclick': 'fastclick',
  },
}
```

