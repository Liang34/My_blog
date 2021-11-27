## PM2

### PM2的作用：

- PM2的进程守护可以在程序崩溃后自动重启
- PM2自带日志记录的功能, 可以很方便的记录错误日志和自定义日志
- PM2能够启动多个Node进程, 充分利用服务器资源

### PM2的使用:

```cmd
npm install pm2 -g
pm2 --version
pm2 start app.js
```

### 其他常用命令：

```cmd
pm2 start app.js|config     // 启动应用程序
pm2 list                    // 列出启动的所有的应用程序
pm2 restart appName|appId   // 重启应用程序
pm2 info appName|appId      // 查看应用程序详细信息
pm2 log appName|appId       // 显示指定应用程序的日志
pm2 monit appName|appId     // 监控应用程序
pm2 stop appName|appId      // 停止应用程序
pm2 delete appName|appId    // 关闭并删除所有应用
```

### PM2常用的配置：

```json
// pm2.conf.json
{
  "apps":{
    "name":"应用程序名称",
    "script": "入口文件名称",
    "watch": true,
    "ignore_watch": [
      "node_modules",
      "logs"
    ],
    "error_file": "logs/错误日志文件名称",
    "out_file": "logs/自定义日志文件名称",
    "log_date_format": "yyyy-MM-dd HH:mm:ss"
  }
}
```

启动：pm2 start pm2.conf.json

### PM2多进程：

在配置文件中增加 instances 配置, 想启动几个Node进程就写几注意点: 不能超过服务器CPU的核数。

```json
{
  "apps":{
    "name":"test",
    "script": "app.js",
    "watch": true,
    "ignore_watch": [
      "node_modules",
      "logs"
    ],
    "error_file": "logs/error.log",
    "out_file": "logs/custom.log",
    "log_date_format": "yyyy-MM-dd HH:mm:ss",
    "instances": 4
  }
}
```

