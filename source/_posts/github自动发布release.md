---
title: github自动发布release
toc: true
recommend: 1
uniqueId: 2024-05-06 03:22:57/github自动发布release.html
mathJax: false
date: 2024-05-06 11:22:57
thumbnail: https://fastly.jsdelivr.net/gh/gh503/CDN@latest/img/ai-generated-8703394_1920.png
tags:
    - 'CDN'
    - 'Github Actions'
categories:
    - '工具'
keywords:
    - 'CI/CD'
    - 'github'
---
> 摘要
使用`Github Action`自动发布`Release`，并通过`CDN`访问。
<!-- more -->
## 引言
希望在完成代码提交后，`Github`能自动创建并发布`Release`包。例如在博客网站引用静态资源时，能够自动获取。并通过`CDN`访问最新发布的资源包。

## 教程
### 1.创建workflow的配置文件
`Github Action`使用`yaml`格式的配置文件，定义工作流程。首先在资源仓库创建`.github/workflow/main.yml`文件，然后添加如下内容：
```yaml
name: Releases

on:
  push:
    tags:
      - "*"

jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: ncipollo/release-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

表示在`push tag`时触发，先`checkout`代码，再创建`release`。

### 2.推送tag
完成代码提交后，需要创建并推送`tag`。假设`tag`为`v0.0.1`：
```bash
git tag -a v0.0.1 -m 'release 0.0.1'
git push origin v0.0.1
```

执行完成后，查看`Github`远程仓库存在`tag v0.0.1`。等待稍许，发现`Actions`触发构建任务，任务完成后，出现`Release v0.0.1`。

### FAQ

#### 1.执行失败
如果失败，检查是否给资源仓库`Actions`写权限，定位 `资源仓库 -> Settings -> Actions -> General -> Workflow permissions -> Allow
Github Actions to create and approve pull requests 勾选`：

![workflow-actions](https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/shotimg/workflow-actions.png)

#### 2.资源无法访问
如果出现`CDN`资源无法访问的情况，尝试通过不同的`CDN`域名访问：
```txt
cdn.jsdelivr.net
fastly.jsdelivr.net
gcore.jsdelivr.net
```


参考文章:
无。
