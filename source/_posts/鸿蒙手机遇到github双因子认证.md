---
title: 鸿蒙手机遇到github双因子认证
toc: true
recommend: 1
uniqueId: 2024-04-30 07:39:03/鸿蒙手机遇到github双因子认证.html
mathJax: false
date: 2024-04-30 15:39:03
thumbnail: https://cdn.jsdelivr.net/gh/gh503/CDN@latest/img/pug-8632718_1920.jpg
tags:
    - '2FA'
categories:
    - '工具'
keywords:
    - '双因子认证'
    - '鸿蒙'
    - 'github'
---
> 摘要
解决鸿蒙手机使用密钥管理`APP`双因子认证`Github`问题。
<!-- more -->
## 引言
`Github`要求用户双因子认证，按官方引导需要使用类似`1Password`、`Authy`、`Google Authenticator`等`app`扫描二维码或者手机短信验证完成认证。但是`app`有的收费，有的需要`GMS`服务框架，而手机号不支持中国大陆区。

## 出境易 App
鸿蒙手机可以安装`出境易App`支持使用`Google系`、`X`等境外运用，提供了这些应用的运行环境。可以直接安装`Microsoft Authenticator`或者`Google Authenticator`（科学上网）。

## 完成认证

安装完成后，注意先刷新二维码页面后再扫描，防止过期

![github-auth-2](https://cdn.jsdelivr.net/gh/gh503/CDN@latest/shotimg/2fa-auth-2.png)

按官方引导，一步步完成2FA认证。第2步的恢复码`download`到本地保存。

![github-auth-3](https://cdn.jsdelivr.net/gh/gh503/CDN@latest/shotimg/2fa-auth-3.png)

参考文章:
无。
