### 前言：

由于国内网访问github实在太慢！虽然在公司可以连接外网访问还算可以，但是想看看博客或者分享给别人的时候经常会崩掉！于是我想可不可以把github博客迁移同步到gitee呢？我期望实现的需求是，依然用github写博客，然后push仓库后可以自动同步到gitee，结合devops流水线的工作原理，无需增加我的操作复杂度，这样国内也可以轻松的访问。完美!


Step1:

先在gitee建立一个同名的仓库，设置为公开。

Step2：

在自己的电脑生成公钥与私钥，具体步骤可以看百度。将公钥上传到gitee，将私钥传到 GitHub 仓库，通过设置中的 Secrets 创建一个  `GITEE_DEPLOY_KEY`变量，将私钥内容拷贝到值区域。

Step3：

在仓库下添加.github/workflows/sync-gitee.yml 文件

```yml
name: Mirror to gitee
# push时同步
on: [ push ]

# Ensures that only one mirror task will run at a time.
concurrency:
  group: git-mirror

jobs:
  git-mirror:
    runs-on: ubuntu-latest
    steps:
      - uses: wearerequired/git-mirror-action@v1
        env:
	# 添加的密钥
          SSH_PRIVATE_KEY: ${{ secrets.GITEE_DEPLOY_KEY }}
        with:
          source-repo: "git@github.com:Liang34/My_blog.git"
          destination-repo: "git@gitee.com:liangjianhui_ysn/My_blog.git"
```
