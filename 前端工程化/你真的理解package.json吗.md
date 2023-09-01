## 前言：

在前端脚手架中 `package.json`不可或缺，但是在日常开发中比较少去关注上面的一些字段，这边笔记主要回顾下关于 `package.json`的一些字段

### name

`package.json`文件中最重要的就是 `name`和 `version`字段，这两项是必填的。名称和版本一起构成一个标识符，该标识符被认为是完全唯一的。对包的更改应该与对版本的更改一起进行。

### version

`version`一般的格式是 `x.x.x`, 并且需要遵循该规则。

### description

描述该项目

### keywords

`keywords`是一个字符串组成的数组，有助于人们在 `npm`库中搜索的时候发现你的模块。

### homepage

`homepage`项目的主页地址。

### bugs字段

`bugs`用于项目问题的反馈issue地址或者一个邮箱。

```json
"bugs": { 
  "url" : "https://github.com/owner/project/issues",
  "email" : "project@hostname.com"
}

```

### license字段

`license`是当前项目的协议，让用户知道他们有何权限来使用你的模块，以及使用该模块有哪些限制。
