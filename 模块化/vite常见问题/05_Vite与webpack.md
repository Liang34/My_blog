## vite 对比 webpack ，优缺点在哪

`优点`：

1. **更快的冷启动** ：`Vite` 借助了浏览器对 `ESM` 规范的支持，采取了与 `Webpack` 完全不同的 `unbundle` 机制
2. **更快的热更新** ：`Vite` 采用 `unbundle` 机制，所以 `dev server` 在监听到文件发生变化以后，只需要通过 `ws` 连接通知浏览器去重新加载变化的文件，剩下的工作就交给浏览器去做了。

`缺点`：

1. **开发环境下首屏加载变慢** ：由于 `unbundle` 机制，`Vite` 首屏期间需要额外做其它工作。不过首屏性能差只发生在 `dev server` 启动以后第一次加载页面时发生。之后再 `reload` 页面时，首屏性能会好很多。原因是 `dev server` 会将之前已经完成转换的内容缓存起来
2. **开发环境下懒加载变慢** ：跟首屏加载变慢的原因一样。`Vite` 在懒加载方面的性能也比 `Webpack` 差。由于 `unbundle` 机制，动态加载的文件，需要做 `resolve`、`load`、`transform`、`parse` 操作，并且还有大量的 `http` 请求，导致懒加载性能也受到影响。
3. **webpack支持的更广** 。由于 `Vite` 基于ES Module，所以代码中不可以使用CommonJs；webpack更多的关注兼容性, 而 `Vite` 关注浏览器端的开发体验。`Vite`目前生态还不如 `Webpack`。
