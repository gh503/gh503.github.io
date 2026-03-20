---
title: libreoffice告警javaldx failed to launch
toc: true
recommend: 1
uniqueId: 2024-05-14 01:46:33/libreoffice告警javaldx failed to launch.html
mathJax: false
date: 2024-05-14 09:46:33
thumbnail:
tags:
categories:
keywords:
---
> 摘要
ubuntu22.04运行libreoffice告警failed to launch javaldx处理。
<!-- more -->

## 运行环境

- `Ubuntu 22.04 LTS x64`
- `libreoffice`

## 问题现象

```txt
Warning: failed to launch javaldx - java may not function correctly
```
通过命令行打开资源管理器:`nautilus . &`后，打开`xlsx`文件，终端出现告警。

出现`javaldx`说明`Java`运行环境没有设置好，首先安装`Java`，然后再看软件的`Java`运行环境。

## 问题处理

```bash
sudo apt install openjdk-8-jre libreoffice-java-common
```

重新测试，无告警。

参考文章:
无。
