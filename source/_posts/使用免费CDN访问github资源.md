---
title: 使用免费CDN访问github资源
tags:
    - 'CDN'
    - 'linux'
    - 'windows'
categories:
    - '部署'
toc: true
recommend: 1
uniqueId: 2024-04-25 10:06:11/使用免费CDN访问github资源.html
mathJax: false
date: 2024-04-25 18:06:11
thumbnail: https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/img/iceland-1768744_1920.jpg
keywords:
    - 'jsdelivr'
    - 'github'
---
> 摘要
使用免费CDN来加速网页资源如图片的加载，增加用户体验。
<!-- more -->
## 前言
请先参考文章进行操作：[免费CDN：jsDelivr+Github 使用方法](https://zhuanlan.zhihu.com/p/76951130)，完成图片资源的CDN访问。

## 使用步骤
避免资源失效，这里简单说一下步骤：
1.创建自己的github仓库用于存放资源文件，比如`gh_username/CDN`；
2.提交图片到仓库，比如位置在`CDN/img/pic.jpg`；
3.发布版本如`Release 1.0.0`，假设 `tag v1.0.0`；
4.发布完成后，可以直接使用`jsdelivr`访问，路径为: `https://cdn.jsdelivr.net/gh/gh_username/CDN@1.0.0/img/pic.jpg`

## 网站资源说明
因为不涉及版权，网站图片资源使用的是[pixabay免版税图片](https://pixabay.com/zh/)。


参考文章:  
[免费CDN：jsDelivr+Github 使用方法](https://zhuanlan.zhihu.com/p/76951130)
