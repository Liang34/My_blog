# 优化前端资源加载 1 - 图片加载优化和代码压缩

我们总是希望浏览器在加载页面时用的时间越短越好，所以构建出来的文件应该越少越小越好，一来减少浏览器需要发起请求的数量，二来减少下载静态资源的时间。

## CSS Sprites

需要 CSS Sprites 的话，可以使用 [webpack-spritesmith](https://github.com/mixtur/webpack-spritesmith) 或者 [sprite-webpack-plugin](https://github.com/kezoo/sprite-webpack-plugin)。

我们以` webpack-spritesmith `为例，先安装依赖：

```shell
npm install webpack-spritesmith --save-dev
```

在` webpack` 的配置中应用该插件：

```js
module: {
  loaders: [
    // ... 这里需要有处理图片的 loader，如 file-loader
  ]
},
resolve: {
  modules: [
    'node_modules', 
    'spritesmith-generated', // webpack-spritesmith 生成所需文件的目录
  ],
},
plugins: [
  new SpritesmithPlugin({
    src: {
      cwd: path.resolve(__dirname, 'src/ico'), // 多个图片所在的目录
      glob: '*.png' // 匹配图片的路径
    },
    target: {
      // 生成最终图片的路径
      image: path.resolve(__dirname, 'src/spritesmith-generated/sprite.png'), 
      // 生成所需 SASS/LESS/Stylus mixins 代码，我们使用 Stylus 预处理器做例子
      css: path.resolve(__dirname, 'src/spritesmith-generated/sprite.styl'), 
    },
    apiOptions: {
      cssImageRef: "~sprite.png"
    },
  }),
],
```

在你需要的样式代码中引入 `sprite.styl` 后调用需要的 `mixins` 即可：

```stylus
@import '~sprite.styl'

.close-button
    sprite($close)
.open-button
    sprite($open)
```

更多的` webpack-spritesmith` 配置可以参考：[Config of webpack-spritesmith](https://github.com/mixtur/webpack-spritesmith#config)。

## 图片压缩

我们之前提及使用 file-loader 来处理图片文件，在此基础上，我们再添加一个 [image-webpack-loader](https://github.com/tcoopman/image-webpack-loader) 来压缩图片文件。简单的配置如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /.*\.(gif|png|jpe?g|svg|webp)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {}
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: { // 压缩 jpeg 的配置
                progressive: true,
                quality: 65
              },
              optipng: { // 使用 imagemin-optipng 压缩 png，enable: false 为关闭
                enabled: false,
              },
              pngquant: { // 使用 imagemin-pngquant 压缩 png
                quality: '65-90',
                speed: 4
              },
              gifsicle: { // 压缩 gif 的配置
                interlaced: false,
              },
              webp: { // 开启 webp，会把 jpg 和 png 图片压缩为 webp 格式
                quality: 75
              },
          },
        ],
      },
    ],
  },
}
```

`image-webpack-loader` 的压缩是使用 [imagemin](https://github.com/imagemin) 提供的一系列图片压缩类库来处理的，如果需要进一步了解详细的配置，可以查看对应类库的官方文档 [usage of image-webpack-loader](https://github.com/tcoopman/image-webpack-loader#usage)。

## 使用 url-loader

有的时候我们的项目中会有一些很小的图片，因为某些缘故并不想使用 CSS Sprites 的方式来处理（譬如小图片不多，因此引入 CSS Sprites 感觉麻烦），那么我们可以在 webpack 中使用 url-loader 来处理这些很小的图片。

[url-loader](https://github.com/webpack-contrib/url-loader) 和 [file-loader](https://github.com/webpack-contrib/file-loader) 的功能类似，但是在处理文件的时候，可以通过配置指定一个大小，当文件小于这个配置值时，url-loader 会将其转换为一个 base64 编码的 DataURL，配置如下：

```js
module.exports = {
  // ...
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192, // 单位是 Byte，当文件小于 8KB 时作为 DataURL 处理
            },
          },
        ],
      },
    ],
  },
}
```

更多关于` url-loader` 的配置可以参考官方文档 [url-loader](https://github.com/webpack-contrib/url-loader)，一般情况仅使用 `limit` 即可。

## 代码压缩

`webpack 4.x `版本运行时，mode 为 production 即会启动压缩 JS 代码的插件，而对于 `webpack 3.x`，使用压缩 JS 代码插件的方式也已经介绍过了。在生产环境中，压缩 JS 代码基本是一个必不可少的步骤，这样可以大大减小 JavaScript 的体积，相关内容这里不再赘述。

除了 JS 代码之外，我们一般还需要 HTML 和 CSS 文件，这两种文件也都是可以压缩的，虽然不像 JS 的压缩那么彻底（替换掉长变量等），只能移除空格换行等无用字符，但也能在一定程度上减小文件大小。在 `webpack`
中的配置使用也不是特别麻烦，所以我们通常也会使用。

对于 HTML 文件，之前介绍的 `html-webpack-plugin `插件可以帮助我们生成需要的 HTML 并对其进行压缩：

```js
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html', // 配置输出文件名和路径
      template: 'assets/index.html', // 配置文件模板
      minify: { // 压缩 HTML 的配置
        minifyCSS: true, // 压缩 HTML 中出现的 CSS 代码
        minifyJS: true // 压缩 HTML 中出现的 JS 代码
      }
    }),
  ],
}
```

如上，使用 `minify` 字段配置就可以使用 HTML 压缩，这个插件是使用 [html-minifier](https://github.com/kangax/html-minifier#options-quick-reference) 来实现 HTML 代码压缩的，`minify` 下的配置项直接透传给` html-minifier`，配置项参考 `html-minifier `文档即可。

对于 CSS 文件，我们之前介绍过用来处理 CSS 文件的` css-loader`，也提供了压缩 CSS 代码的功能：

```js
module.exports = {
  module: {
    rules: [
      // ...
      {
        test: /\.css/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              minimize: true, // 使用 css 的压缩功能
            },
          },
        ],
      },
    ],
  }
}
```

在` css-loader` 的选项中配置 `minimize` 字段为 `true` 来使用 CSS 压缩代码的功能。`css-loader` 是使用 [cssnano](http://cssnano.co/) 来压缩代码的，`minimize` 字段也可以配置为一个对象，来将相关配置传递给` cssnano`。更多详细内容请参考 [cssnano](http://cssnano.co/) 官方文档。

## Tree shaking

Tree shaking 这个术语起源于 ES2015 模块打包工具 [rollup](https://github.com/rollup/rollup)，依赖于 ES2015 模块系统中的[静态结构特性](http://exploringjs.com/es6/ch_modules.html#static-module-structure)，可以移除 JavaScript 上下文中的未引用代码，删掉用不着的代码，能够有效减少 JS 代码文件的大小。拿官方文档的例子来说明一下。

```js
// src/math.js
export function square(x) {
  return x * x;
}

export function cube(x) {
  return x * x * x;
}

// src/index.js
import { cube } from './math.js' // 在这里只是引用了 cube 这个方法

console.log(cube(3))
```

如果整个项目代码只是上述两个文件，那么很明显，`square` 这个方法是未被引用的代码，是可以删掉的。在 webpack 中，只有启动了 JS 代码压缩功能（即使用 uglify）时，会做 Tree shaking 的优化。webpack 4.x 需要指定 mode 为 production，而 webpack 3.x 的话需要配置 UglifyJsPlugin。启动了之后，构建出来的结果就会移除 `square` 的那一部分代码了。

如果你在项目中使用了 [Babel](http://babeljs.io/) 的话，要把 Babel 解析模块语法的功能关掉，在 `.babelrc` 配置中增加 `"modules": false` 这个配置：

```json
{
  "presets": [["env", { "modules": false }]]
}
```

这样可以把 `import/export` 的这一部分模块语法交由 webpack 处理，否则没法使用 Tree shaking 的优化。

有的时候你启用了 Tree shaking 功能，但是发现好像并没有什么用，例如这样一个例子：

```js
// src/component.js
export class Person {
  constructor ({ name }) {
    this.name = name
  }

  getName () {
    return this.name
  }
}

export class Apple {
  constructor ({ model }) {
    this.model = model
  }
  getModel () {
    return this.model
  }
}

// src/index.js
import { Apple } from './components'

const appleModel = new Apple({
  model: 'X'
}).getModel()

console.log(appleModel)
```

打包压缩后还是可以发现，`Person` 这一块看起来没用到的代码出现在文件中。关于这个问题，详细讲解的话篇幅太长了，建议自行阅读这一篇文章：[你的Tree-Shaking并没什么卵用](https://zhuanlan.zhihu.com/p/32831172)。

这篇文章最近没有更新，但是 uglify 的相关 issue [Class declaration in IIFE considered as side effect](https://github.com/mishoo/UglifyJS2/issues/1261) 是有进展的，现在如果你在 Babel 配置中增加 `"loose": true` 配置的话，`Person` 这一块代码就可以在构建时移除掉了。

## sideEffects

这是 webpack 4.x 才具备的特性，暂时官方还没有比较全面的介绍文档，笔者从 webpack 的 examples 里找到一个东西：[side-effects/README.md](https://github.com/webpack/webpack/blob/master/examples/side-effects/README.md)。

我们拿 [lodash](https://github.com/lodash/lodash) 举个例子。有些同学可能对 [lodash](https://github.com/lodash/lodash) 已经蛮熟悉了，它是一个工具库，提供了大量的对字符串、数组、对象等常见数据类型的处理函数，但是有的时候我们只是使用了其中的几个函数，全部函数的实现都打包到我们的应用代码中，其实很浪费。

webpack 的 sideEffects 可以帮助解决这个问题。现在 lodash 的 [ES 版本](https://www.npmjs.com/package/lodash-es) 的 `package.json` 文件中已经有 `sideEffects: false` 这个声明了，当某个模块的 `package.json` 文件中有了这个声明之后，webpack 会认为这个模块没有任何副作用，只是单纯用来对外暴露模块使用，那么在打包的时候就会做一些额外的处理。

例如你这么使用 `lodash`：

```js
import { forEach, includes } from 'lodash-es'

forEach([1, 2], (item) => {
  console.log(item)
})

console.log(includes([1, 2, 3], 1))
```

由于 lodash-es 这个模块的 `package.json` 文件有 `sideEffects: false` 的声明，所以 webpack 会将上述的代码转换为以下的代码去处理：

```js
import { default as forEach } from 'lodash-es/forEach'
import { default as includes } from 'lodash-es/includes'

// ... 其他代码
```

最终 webpack 不会把 lodash-es 所有的代码内容打包进来，只是打包了你用到的那两个方法，这便是 sideEffects 的作用。