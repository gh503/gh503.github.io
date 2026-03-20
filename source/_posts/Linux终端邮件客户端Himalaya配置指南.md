---
thumbnail:
title: Linux 终端邮件客户端 Himalaya 配置指南
date: 2026-03-20
tags: 
- Linux
- Himalaya
- 邮件
- CLI
categories: 
- 工具配置
toc: true
recommend: 1
keywords: Himalaya, 终端邮件, Linux配置
uniqueId: 2026-03-20/himalaya-email-client-guide.html
mathJax: false
---

> 
<!-- more -->

本文介绍如何在 Linux 上安装和配置 Himalaya，一款功能强大的命令行邮件客户端，支持 Gmail、163、QQ、126 等主流邮箱。

## 什么是 Himalaya

[Himalaya](https://pimalaya.org/himalaya/) 是一款用 Rust 编写的命令行邮件客户端，具有以下特点：

- **无状态设计** - 不锁定终端，适合脚本集成
- **多账号支持** - 同时管理多个邮箱
- **PGP 加密** - 支持邮件加密
- **多种后端** - 支持 IMAP、SMTP、Maildir、Notmuch

## 安装

### 方式一：官方安装脚本

```bash
# 需要 sudo 权限
curl -sSL https://raw.githubusercontent.com/pimalaya/himalaya/master/install.sh | sudo sh
```

### 方式二：手动下载安装

1. 访问 [Himalaya Releases 页面](https://github.com/pimalaya/himalaya/releases/latest)
2. 下载对应系统的压缩包（如 `himalaya.x86_64-linux.tgz`）
3. 解压并将 `himalaya` 二进制文件移动到 PATH 中的目录：

```bash
# 解压
tar -xzf himalaya.x86_64-linux.tgz

# 移动到用户目录
mkdir -p ~/.local/bin
mv himalaya ~/.local/bin/

# 添加到 PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 方式三：包管理器

```bash
# WakeMeOps (Ubuntu/Debian)
curl -sSL https://raw.githubusercontent.com/upciti/wakemeops/main/assets/install_repository | sudo bash
sudo apt install himalaya

# Arch Linux
sudo pacman -S himalaya

# macOS
brew install himalaya

# Rust
cargo install himalaya
```

### 验证安装

```bash
himalaya --version
```

## 配置

### 1. 初始化配置目录

```bash
himalaya setup
```

### 2. 创建配置文件

```bash
mkdir -p ~/.config/himalaya
```

### 3. 编辑配置 ~/.config/himalaya/config.toml

## Gmail 配置

### 获取应用密码

1. 登录 Google 账号：https://myaccount.google.com
2. 进入 **安全** → 开启 **两步验证**
3. **应用密码** → 选择"邮件" → 生成 16 位密码

### 服务器信息

| 服务 | 服务器 | 端口 | 加密 |
|------|--------|------|------|
| IMAP | imap.gmail.com | 993 | SSL/TLS |
| SMTP | smtp.gmail.com | 587/465 | TLS/SSL |

### 配置示例

```toml
default = "gmail"

[accounts.gmail]
display_name = "My Gmail"
email = "your.email@gmail.com"

[accounts.gmail.imap]
host = "imap.gmail.com"
port = 993
username = "your.email@gmail.com"
password = "xxxx xxxx xxxx xxxx"

[accounts.gmail.smtp]
host = "smtp.gmail.com"
port = 587
username = "your.email@gmail.com"
password = "xxxx xxxx xxxx xxxx"
```

## 163 邮箱配置

### 获取授权码

1. 登录 mail.163.com → **设置**
2. **POP3/SMTP/IMAP** → 开启 IMAP/SMTP 服务
3. **客户端授权密码** → 获取授权码

### 服务器信息

| 服务 | 服务器 | 端口 | 加密 |
|------|--------|------|------|
| IMAP | imap.163.com | 993 | SSL |
| SMTP | smtp.163.com | 465 | SSL |

### 配置示例

```toml
[accounts.163]
display_name = "My 163 Mail"
email = "yourname@163.com"

[accounts.163.imap]
host = "imap.163.com"
port = 993
username = "yourname@163.com"
password = "XXXXXXXXXXXX"

[accounts.163.smtp]
host = "smtp.163.com"
port = 465
username = "yourname@163.com"
password = "XXXXXXXXXXXX"
```

## QQ 邮箱配置

### 获取授权码

1. 登录 mail.qq.com → **设置** → **账户**
2. **POP3/IMAP/SMTP 服务** → 开启
3. 生成授权码（需短信验证）

### 服务器信息

| 服务 | 服务器 | 端口 | 加密 |
|------|--------|------|------|
| IMAP | imap.qq.com | 993 | SSL |
| SMTP | smtp.qq.com | 465 | SSL |

### 配置示例

```toml
[accounts.qq]
display_name = "My QQ Mail"
email = "123456789@qq.com"

[accounts.qq.imap]
host = "imap.qq.com"
port = 993
username = "123456789@qq.com"
password = "XXXXXXXXXXXX"

[accounts.qq.smtp]
host = "smtp.qq.com"
port = 465
username = "123456789@qq.com"
password = "XXXXXXXXXXXX"
```

## 126 邮箱配置

### 获取授权码

1. 登录 mail.126.com → **设置** → **POP3/SMTP/IMAP**
2. 开启 IMAP/SMTP 服务
3. **客户端授权密码** → 获取授权码

### 服务器信息

| 服务 | 服务器 | 端口 | 加密 |
|------|--------|------|------|
| IMAP | imap.126.com | 993 | SSL |
| SMTP | smtp.126.com | 465 | SSL |

### 配置示例

```toml
[accounts.126]
display_name = "My 126 Mail"
email = "yourname@126.com"

[accounts.126.imap]
host = "imap.126.com"
port = 993
username = "yourname@126.com"
password = "XXXXXXXXXXXX"

[accounts.126.smtp]
host = "smtp.126.com"
port = 465
username = "yourname@126.com"
password = "XXXXXXXXXXXX"
```

## 多账号配置

可以同时配置多个邮箱账号：

```toml
default = "qq"

[accounts.gmail]
display_name = "Gmail"
email = "xxx@gmail.com"
# ... Gmail 配置

[accounts.qq]
display_name = "QQ Mail"
email = "xxx@qq.com"
# ... QQ 配置

[accounts.163]
display_name = "163 Mail"
email = "xxx@163.com"
# ... 163 配置
```

## 基本使用

```bash
# 查看帮助
himalaya --help

# 列出所有账号
himalaya account list

# 切换默认账号
himalaya account set default

# 列出邮件
himalaya list

# 阅读邮件
himalaya read <邮件ID>

# 搜索邮件
himalaya search "subject:报告"

# 查看文件夹
himalaya folder list
```

## 发送邮件

### 方式一：交互式编辑

```bash
himalaya compose
```

### 方式二：使用模板

创建邮件模板 `~/emails/report.mime`：

```
To: recipient@example.com
Subject: 周报
From: your.email@163.com
Content-Type: text/plain; charset=utf-8

这是一封测试邮件。
```

发送：

```bash
himalaya send ~/emails/report.mime
```

### 指定账号发送

```bash
himalaya send ~/emails/report.mime --account gmail
```

## 常见问题

### Q1: 连接失败？

检查：
- 授权码是否正确
- IMAP/SMTP 服务是否开启
- 网络连接是否正常

### Q2: Gmail 登录被阻止？

需要使用**应用密码**而非账户密码，并确保开启两步验证。

### Q3: 如何查看详细日志？

```bash
himalaya --verbose list
```

## 总结

Himalaya 是一款轻量且强大的终端邮件客户端：

- ✅ 支持 Gmail、163、QQ、126 等主流邮箱
- ✅ 多账号管理
- ✅ 适合脚本集成
- ✅ 跨平台支持 Linux/macOS/Windows

---
*参考文章: [Himalaya 官网](https://pimalaya.org/himalaya/)*
