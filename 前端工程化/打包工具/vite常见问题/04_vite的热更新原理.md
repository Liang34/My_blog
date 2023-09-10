# 热更新原理解析

Vite 在启动之前会创建一个为热更新服务定制的 websocket 服务器，然后对项目文件进行监听。同时客户端的 html 里注入了 @vite/client 来与服务端进行配合实现热更新。具体流程如下图所示：

![hmr原理.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b42fca0d33e7464498ed86a5a4daf597~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)


## 详细解析

下面，我们将会对 Vite 热更新模块的启动流程和执行流程进行详细解析：

### 热更新模块启动流程解析

在 Vite dev server 启动之前，Vite 会为 HMR 做一些准备工作。
首先，Vite 会先创建一个用于 HMR 的 websocket 服务，同时也会创建一个监听对象 watcher 用于对文件修改进行监听，这里的文件监听是通过 `chokidar` 这个库来实现，具体用法可参考其[官方文档](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fpaulmillr%2Fchokidar "https://github.com/paulmillr/chokidar")，随后在相关对象初始化完毕之后，Vite 会启动文件监听，并且在监听回调中执行 HMR 相关逻辑，至此就完成了服务启动前 HMR 的全部准备工作。

具体实现代码如下：

```typescript
  // 创建websocket服务对象
  const ws = createWebSocketServer(httpServer, config, httpsOptions)
  // 根据配置初始化监听器
  const { ignored = [], ...watchOptions } = serverConfig.watch || {}
  const watcher = chokidar.watch(path.resolve(root), {
    ignored: ['**/node_modules/**', '**/.git/**', ...ignored],
    ignoreInitial: true,
    ignorePermissionErrors: true,
    disableGlobbing: true,
    ...watchOptions
  }) as FSWatcher
  // 启动文件监听
  watcher.on('change', async (file) => {
    ···
  })
  watcher.on('add', (file) => {
    ···
  })
  watcher.on('unlink', (file) => {
    ···
  })

```

这里我们详细看下 `createWebSocketServer` 这个方法，看看这个 `websocket`对象里都有什么,实现代码如下：

```typescript
function createWebSocketServer(
  server: Server | null,
  config: ResolvedConfig,
  httpsOptions?: HttpsServerOptions
): WebSocketServer {
  let wss: WebSocket.Server
  let httpsServer: Server | undefined = undefined
  // 读取热更新配置
  const hmr = typeof config.server.hmr === 'object' && config.server.hmr
  const wsServer = (hmr && hmr.server) || server

  if (wsServer) {
    // 普通模式
    wss = new WebSocket.Server({ noServer: true })
    wsServer.on('upgrade', (req, socket, head) => {
      // 监听通过vite客户端发送的websocket消息，通过HMR_HEADER区分
      if (req.headers['sec-websocket-protocol'] === HMR_HEADER) {
        wss.handleUpgrade(req, socket, head, (ws) => {
          // 发送连接消息与客户端建立连接
          wss.emit('connection', ws, req)
        })
      }
    })
  } else {
    // 中间件模式
    ···
    // vite dev server in middleware mode
    wss = new WebSocket.Server(websocketServerOptions)
  }
  // 绑定监听ws事件
  wss.on('connection', (socket) => {
    socket.send(JSON.stringify({ type: 'connected' }))
    ···
  })
  // 错误处理
  wss.on('error', (e: Error & { code: string }) => {
    ···
  })
  // 返回含有send和close方法的对象
  return {
    send(payload: HMRPayload) {
      if (payload.type === 'error' && !wss.clients.size) {
        bufferedError = payload
        return
      }

      const stringified = JSON.stringify(payload)
      // 遍历向所有建立连接的客户端发送消息
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(stringified)
        }
      })
    },

    close() {
      // 关闭服务逻辑
    }
  }
}

```

从上述代码中，不难看出，Vite 在创建 WebSocketServer 时，主要进行了一些错误的捕获处理和对 payload 的格式处理，最终返回封装好的 send 和 close 方法，用于后续服务端推送消息和关闭服务。


### 热更新执行流程解析

下面我们一起来看看 Vite 的热更新流程是怎么样的。

#### 1.生成并推送变更文件信息

我们从上述启动流程中不难发现，Vite 在文件监听中的回调方法即是热更新执行流程的第一步。下面是其回调方法内容：

```typescript
  watcher.on('change', async (file) => {
    file = normalizePath(file)
    // invalidate module graph cache on file change
    moduleGraph.onFileChange(file)
    // 是否启用热更新
    if (serverConfig.hmr !== false) {
      try {
        await handleHMRUpdate(file, server)
      } catch (err) {
        ws.send({
          type: 'error',
          err: prepareError(err)
        })
      }
    }
  })

```

这里进行了两个核心操作，一个是更新 `moduleGraph`，使修改文件的缓存失效 ,一个是执行热更新方法 `handleHMRUpdate`。

##### moduleGraph

首先我们分析下 Vite 中的 `moduleGraph`的含义及其具体作用：

在启动阶段，我们将 `moduleGraph`console处理，可以看到它的结构如下：

```typescript
ModuleGraph {
  urlToModuleMap: Map {},
  idToModuleMap: Map {},
  fileToModulesMap: Map {},
  safeModulesPath: Set {},
  container: {
    options: { acorn: [Object], acornInjectPlugins: [] },
    buildStart: [AsyncFunction: buildStart],
    resolveId: [AsyncFunction: resolveId],
    load: [AsyncFunction: load],
    transform: [AsyncFunction: transform],
    watchChange: [Function: watchChange],
    close: [AsyncFunction: close]
  }
}

```

它核心是由一系列 map 组成，而这些map分别是url、id、file等与ModuleNode的映射，ModuleNode 是 Vite中定义的最小模块单位，它的组成如下：

```typescript
export class ModuleNode {
  /**
   * Public served url path, starts with /
   */
  url: string
  /**
   * Resolved file system path + query
   */
  id: string | null = null
  file: string | null = null
  type: 'js' | 'css'
  importers = new Set<ModuleNode>()
  importedModules = new Set<ModuleNode>()
  acceptedHmrDeps = new Set<ModuleNode>()
  isSelfAccepting = false
  transformResult: TransformResult | null = null
  ssrTransformResult: TransformResult | null = null
  ssrModule: Record<string, any> | null = null
  lastHMRTimestamp = 0

  constructor(url: string) {
    this.url = url
    this.type = isDirectCSSRequest(url) ? 'css' : 'js'
  }
}

```

最后我们看看 `moduleGraph.onFileChange()`方法干了啥：

```typescript
onFileChange(file: string): void {
    // 通过文件地址搜索模块
    const mods = this.getModulesByFile(file)
    if (mods) {
      const seen = new Set<ModuleNode>()
      // 遍历找出的模块，清除其转换后的结果
      mods.forEach((mod) => {
        this.invalidateModule(mod, seen)
      })
    }
  }

  invalidateModule(mod: ModuleNode, seen: Set<ModuleNode> = new Set()): void {
    mod.transformResult = null
    mod.ssrTransformResult = null
    invalidateSSRModule(mod, seen)
  }

```

很明显，这个方法是用来清除模块里的 `transformResult`字段的，使之前的模块已有的转换缓存失效。关于 Vite 的缓存机制这块，Vite会对依赖进行强缓存，对项目逻辑代码进行协商缓存，可以看看官网的[介绍](https://link.juejin.cn/?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fdep-pre-bundling.html%23caching "https://cn.vitejs.dev/guide/dep-pre-bundling.html#caching")对此有一个了解，这里就不详细赘述了。

#### handleHMRUpdate

下面，我们看看 Vite 热更新的一个关键的方法 `handleHMRUpdate`:

```typescript
export async function handleHMRUpdate(
  file: string,
  server: ViteDevServer
): Promise<any> {
  ···
  // 如果是配置文件更新，则重启服务
  if (isConfig || isConfigDependency || isEnv) {
    // auto restart server
    debugHmr(`[config change] ${chalk.dim(shortFile)}`)
    config.logger.info(
      chalk.green(
        `${path.relative(process.cwd(), file)} changed, restarting server...`
      ),
      { clear: true, timestamp: true }
    )
    await restartServer(server)
    return
  }

  debugHmr(`[file change] ${chalk.dim(shortFile)}`)

  // (dev only) the client itself cannot be hot updated.
  if (file.startsWith(normalizedClientDir)) {
    ws.send({
      type: 'full-reload',
      path: '*'
    })
    return
  }
  // 从moduleGraph中获取与本次变更文件有关的模块
  const mods = moduleGraph.getModulesByFile(file)

  // check if any plugin wants to perform custom HMR handling
  const timestamp = Date.now()
  // 声明热更新上下文
  const hmrContext: HmrContext = {
    file,
    timestamp,
    modules: mods ? [...mods] : [],
    read: () => readModifiedFile(file),
    server
  }
  // 遍历插件，执行插件的handleHotUpdate钩子
  for (const plugin of config.plugins) {
    if (plugin.handleHotUpdate) {
      const filteredModules = await plugin.handleHotUpdate(hmrContext)
      if (filteredModules) {
        hmrContext.modules = filteredModules
      }
    }
  }
  // 如果没有模块变更，则直接返回
  if (!hmrContext.modules.length) {
    // html file cannot be hot updated
    if (file.endsWith('.html')) {
      config.logger.info(chalk.green(`page reload `) + chalk.dim(shortFile), {
        clear: true,
        timestamp: true
      })
      ws.send({
        type: 'full-reload',
        path: config.server.middlewareMode
          ? '*'
          : '/' + normalizePath(path.relative(config.root, file))
      })
    } else {
      // loaded but not in the module graph, probably not js
      debugHmr(`[no modules matched] ${chalk.dim(shortFile)}`)
    }
    return
  }
  // 向客户端推送热更新变更模块信息
  updateModules(shortFile, hmrContext.modules, timestamp, server)
}

```


从上面的代码可以看出，这个方法对一些特定类型的文件变更进行了相应的处理，比如html文件变更和config变更，这块两块变更分别是通过直接刷新页面和重启服务来处理，然后去执行插件的特定钩子 `handleHotUpdate` ，关于这个钩子的作用，可以参考此[文档](https://link.juejin.cn?target=https%3A%2F%2Fcn.vitejs.dev%2Fguide%2Fapi-plugin.html%23handlehotupdate "https://cn.vitejs.dev/guide/api-plugin.html#handlehotupdate")。经过上述处理后，会声明一个 `hmrContext`，从 `moduleGraph`中去找涉及这次文件变更的模块，最终调用 `updateModules`方法向客户端推送本次热更新的模块信息。


#### 2.客户端解析热更新信息，发送请求获取最新模块并渲染。

在上一步操作的最后，服务端会给客户端推送一个信息，如下所示：

```typescript
{
    "type": "update",
    "updates": [
        {
            "type": "js-update", // 热更新类型
            "timestamp": 1626850668126, // 本次热更新时间戳
            "path": "/src/pages/Home/index.tsx",
            "acceptedPath": "/src/pages/Home/index.tsx"
        }
    ]
}

```

客户端获取到上述信息后，就会根据其type执行相应的操作，例如当type 为 `js-update` 时，执行如下操作：

```typescript
async function fetchUpdate({ path, acceptedPath, timestamp }: Update) {
  const mod = hotModulesMap.get(path)
  if (!mod) {
    // In a code-splitting project,
    // it is common that the hot-updating module is not loaded yet.
    // https://github.com/vitejs/vite/issues/721
    return
  }
  // ···
  await Promise.all(
    Array.from(modulesToUpdate).map(async (dep) => {
      const disposer = disposeMap.get(dep)
      if (disposer) await disposer(dataMap.get(dep))
      const [path, query] = dep.split(`?`)
      try {
        // 请求新的模块
        const newMod = await import(
          /* @vite-ignore */
          base +
            path.slice(1) +
            `?import&t=${timestamp}${query ? `&${query}` : ''}`
        )
        moduleMap.set(dep, newMod)
      } catch (e) {
        warnFailedFetch(e, dep)
      }
    })
  )

  return () => {
    // ···
  }
}

```


从上面的代码中不难发现，Vite 通过动态import的方式，去发起请求获取更新后的新模块，同时在这个过程中对新模块进行重新缓存。最终，Vite 拿个新模块之后，将其放入moduleMap，然后通过 `plugin-react-refresh`这个插件实现 react 模块的重新渲染，至此一次热更新流程就结束了。


# 总结

从上述热更新的流程中，可以很清晰的看出：Vite 的整个热更新并不涉及任何打包的操作，而是直接去请求获取了需要更新的模块的的内容，并完成模块的替换。这便是 Vite 项目中无论应用程序大小如何，都能够始终保持极快的模块热重载的秘诀，真正的实现了按需加载。
