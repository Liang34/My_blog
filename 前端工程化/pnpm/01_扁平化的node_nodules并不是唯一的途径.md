## 扁平化的node_modules模块不是唯一的途径

一般来说，node_modules存在两种方式存放

1. 扁平化的结构
2. 非扁平化的结构

### 那么扁平化的结构是怎样的呢？

我们可以看下 `npm`的管理方式，下面使用 `npm install express`为例：

```bash
.bin
accepts
array-flatten
body-parser
bytes
content-disposition
cookie-signature
cookie
debug
depd
destroy
ee-first
encodeurl
escape-html
etag
express
```

你可以在 [这个链接](https://github.com/zkochan/comparing-node-modules/tree/master/npm-example/node_modules) 查看。

可以看到，npm的管理方式是将所有的依赖都放到最外层级了，这样可能会导致幽灵依赖的问题，比如我在某个文件引入了cookie，这种情况项目是可以运行的，但是却没有在package.json中声明，这样会导致项目变得难以维护。比如：

* 版本依赖问题
  比如说项目依赖了A，版本是v1， A依赖了B，版本是V1。那么你可以在项目中直接使用B，但是有一天A升到了V2，连同B一起升到了V2，可能B有些特性只在V1有，这样就会导致一些错误
* 依赖丢失问题项目使用开发依赖安装了一个 A 库，A 库又依赖 B 库，然后项目里导入了 B 库来使用。如果A 库使用的是开发依赖，而到了生产环境我们就不会安装这个 A 库了，那么 A 依赖的 B 也不会被安装，但是我们在开发的时候又去使用了这个 B，到了生产环境 B 库也没了，这就导致了依赖丢失。

### 那非扁平化的结构是怎样的呢？

我们可以以pnpm为例 ``pnpm install express``

```
.pnpm
.modules.yaml
express
```

你可以在 [这个链接](https://github.com/zkochan/comparing-node-modules/tree/master/pnpm5-example/node_modules) 查看

pnpm在项目的node_modules只安装了exprss，并不会将express中的其他一些包带到node_modules下，这样就能避免程序访问express中的其他依赖了。

接下来我们看看express中都有哪些包

```
▾ node_modules
  ▸ .pnpm
  ▾ express
    ▸ lib
      History.md
      index.js
      LICENSE
      package.json
      Readme.md
  .modules.yaml
```

令人疑惑的是express中并没有node_modules?那在程序使用express时候，需要用到的依赖又是怎么找到的呢？

实例上这是一个软链接，在vscode中有标识，实际上express的真实路径是

`~\.pnpm\express@4.18.2\node_modules\express`

那这样express就可以往node_modules中找到它所需要的依赖啦~

### 重复依赖

其实还有一个问题：

就是改成非扁平还会导致会下载重复依赖，其实一开是npm也是嵌套的，后面为了解决这个问题才改成扁平化的

其实还是通过软链来解决

举例子：在 `~\.pnpm\express@4.18.2\node_modules`文件夹中cookies实际也是一个软链接，它指向的是 `~\node_modules\\.pnpm\cookie@0.5.0`

这样就能避免重复依赖了
