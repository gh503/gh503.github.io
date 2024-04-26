---
title: git配置
toc: true
recommend: 1
uniqueId: 2024-04-26 01:08:16/git配置.html
mathJax: false
date: 2024-04-26 09:08:16
thumbnail: https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/img/flowers-3028429_1920.jpg
tags:
    - 'git'
categories:
    - '部署'
keywords:
    - '效率提升'
---
> 摘要
根据个人习惯优化`git`配置。
<!-- more -->

## 配置

### 必配
配置自己的`git`认证信息，`git_username`、`git_useremail`替换成自己的用户名和提交邮件地址。方便协同开发。

```bash
git config --global user.name <git_username>
git config --global user.email <git_useremail>
```
### 选配

```bash
# 编辑
git config --global core.editor vim             # 使用vim编辑，默认Emacs
git config --global core.ignorecase false       # 区分文件名大小写
git config --global core.autocrlf false         # 换行模式为 input，即提交时转换为LF，检出时不转换
git config --global core.safecrlf true          # 拒绝提交包含混合换行符的文件
git config --global core.fileMode false         # 忽略文件mode变化，只要代码可以clone，mode就可以修改
git config --global core.longpaths true         # 支持超长路径
git config --global core.quotepath false        # 支持中文路径
git config --global gui.encoding utf-8          # utf-8编码
git config --global i18n.commitEncoding utf-8
git config --global i18n.logOutputEncoding utf-8
git config --global svn.pathnameencoding utf-8
git config --global merge.tool vimdiff
git config --global mergetool.keepBackup true
git config --global commit.template $HOME/.git_github  # git commit提交模板，可以在 ~/.git_github 中添加自定义内容
:> $HOME/.git_github

# 配色
git config --global color.status auto
git config --global color.branch auto
git config --global color.ui auto
git config --global color.diff auto
git config --global color.interactive auto

# 安全认证
git config --global http.sslVerify false
git config --global http.postBuffer 1073741824  # 1GB
git config --global credential.helper store     # 缓存认证信息

# 别名
# alias: git st
git config --global alias.st status
# alias: git cm
git config --global alias.cm 'commit -s'
# alias: git lg
git config --global alias.lg "log --color --graph --pretty=format:'%C(bold red)%h%C(reset) - %C(bold green)(%cr)%C(bold blue)<%an>%C(reset) -%C(bold yellow)%d%C(reset) %s'"
```

## 手册

- [Git手册](https://git-scm.com/docs)


参考文章:
无。
