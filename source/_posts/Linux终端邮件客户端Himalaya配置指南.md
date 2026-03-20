---
title: Linux 终端邮件客户端 Himalaya 配置指南
thumbnail: https://cdn.jsdelivr.net/gh/gh503/gh503.github.io/source/images/LinuxHimalaya_cover.jpg
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

### 方式一：官方安装脚本（推荐）

```bash
# 需要 sudo 权限，系统级安装
curl -sSL https://raw.githubusercontent.com/pimalaya/himalaya/master/install.sh | sudo sh

# 或者用户级安装（不需要 sudo）
curl -sSL https://raw.githubusercontent.com/pimalaya/himalaya/master/install.sh | sh -s -- --prefix ~/.local
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

### 方式一：交互式向导（推荐）

交互式向导需要 TTY 环境运行。在终端中直接执行：

```bash
# 如果没有配置文件，向导会提示创建
himalaya

# 或者为指定账号配置
himalaya account configure <账号名>
```

向导会依次询问：
1. **邮箱地址** - 如 `yourname@163.com`
2. **IMAP 主机** - 如 `imap.163.com`
3. **IMAP 端口** - 默认 `993`
4. **IMAP 用户名** - 通常与邮箱地址相同
5. **IMAP 密码** - 使用**授权码**而非登录密码
6. **SMTP 配置** - 类似 IMAP 的设置
7. **默认账号** - 是否设为默认账号

### 方式二：手动配置

1. 创建配置目录：

```bash
mkdir -p ~/.config/himalaya
```

2. 使用 `secret-tool` 存储密码（需要安装 `libsecret-1-0-bin`）：

```bash
# 安装 secret-tool
sudo apt install libsecret-1-0-bin

# 存储 IMAP 密码
secret-tool store --label="Himalaya IMAP" account <账号名> service himalaya-imap
# 输入你的授权码

# 存储 SMTP 密码
secret-tool store --label="Himalaya SMTP" account <账号名> service himalaya-smtp
# 输入你的授权码
```

3. 创建配置文件 `~/.config/himalaya/config.toml`：

```toml
[accounts.<账号名>]
default = true
email = "your@email.com"
display-name = "Your Name"
downloads-dir = "~/Emails/Inbox"

backend.type = "imap"
backend.host = "imap.163.com"  # 或 imap.gmail.com, imap.qq.com 等
backend.port = 993
backend.login = "your@email.com"
backend.encryption.type = "tls"
backend.auth.type = "password"
backend.auth.cmd = "secret-tool lookup account <账号名> service himalaya-imap"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.163.com"  # 或 smtp.gmail.com 等
message.send.backend.port = 465
message.send.backend.login = "your@email.com"
message.send.backend.encryption.type = "tls"
message.send.backend.auth.type = "password"
message.send.backend.auth.cmd = "secret-tool lookup account <账号名> service himalaya-smtp"
```

4. 参考完整示例：`~/.config/himalaya/config.sample.toml`

## Gmail 配置

### 获取应用密码

1. 登录 Google 账号：https://myaccount.google.com
2. 进入 **安全** → 开启 **两步验证**
3. **应用密码** → 选择"邮件" → 生成 16 位密码

### 配置示例

```toml
[accounts.gmail]
email = "your.email@gmail.com"

backend.type = "imap"
backend.host = "imap.gmail.com"
backend.port = 993
backend.login = "your.email@gmail.com"
backend.auth.type = "password"
backend.auth.raw = "xxxx xxxx xxxx xxxx"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.gmail.com"
message.send.backend.port = 465
message.send.backend.login = "your.email@gmail.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.cmd = "xxxx xxxx xxxx xxxx"
```

## 163 邮箱配置

### 获取授权码

1. 登录 mail.163.com → **设置**
2. **POP3/SMTP/IMAP** → 开启 IMAP/SMTP 服务
3. **客户端授权密码** → 获取授权码

### 配置示例

```toml
[accounts.163]
email = "yourname@163.com"

backend.type = "imap"
backend.host = "imap.163.com"
backend.port = 993
backend.login = "yourname@163.com"
backend.auth.type = "password"
backend.auth.raw = "XXXXXXXXXXXX"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.163.com"
message.send.backend.port = 465
message.send.backend.login = "yourname@163.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.raw = "XXXXXXXXXXXX"
```

## QQ 邮箱配置

### 获取授权码

1. 登录 mail.qq.com → **设置** → **账户**
2. **POP3/IMAP/SMTP 服务** → 开启
3. 生成授权码（需短信验证）

### 配置示例

```toml
[accounts.qq]
email = "123456789@qq.com"

backend.type = "imap"
backend.host = "imap.qq.com"
backend.port = 993
backend.login = "123456789@qq.com"
backend.auth.type = "password"
backend.auth.raw = "XXXXXXXXXXXX"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.qq.com"
message.send.backend.port = 465
message.send.backend.login = "123456789@qq.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.raw = "XXXXXXXXXXXX"
```

## 126 邮箱配置

### 获取授权码

1. 登录 mail.126.com → **设置** → **POP3/SMTP/IMAP**
2. 开启 IMAP/SMTP 服务
3. **客户端授权密码** → 获取授权码

### 配置示例

```toml
[accounts.126]
email = "yourname@126.com"

backend.type = "imap"
backend.host = "imap.126.com"
backend.port = 993
backend.login = "yourname@126.com"
backend.auth.type = "password"
backend.auth.raw = "XXXXXXXXXXXX"

message.send.backend.type = "smtp"
message.send.backend.host = "smtp.126.com"
message.send.backend.port = 465
message.send.backend.login = "yourname@126.com"
message.send.backend.auth.type = "password"
message.send.backend.auth.raw = "XXXXXXXXXXXX"
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

### Q4: 163/126 邮箱提示 "Unsafe Login"？

这是 163/126 邮箱的安全限制，需要客户端发送 IMAP ID 命令。

**问题已修复！** 

官方已接受修复方案，新版本会自动发送 IMAP ID 命令：

- [pimalaya/core#51](https://github.com/pimalaya/core/pull/51) - 核心修复
- [pimalaya/himalaya#653](https://github.com/pimalaya/himalaya/pull/653) - 使用修复版本

更新到最新版本后即可正常使用 163/126 邮箱。

**临时解决方法：** 访问安全设置页面验证白名单：
```
http://config.mail.163.com/settings/imap/index.jsp?uid=你的邮箱
```

## 总结

Himalaya 是一款轻量且强大的终端邮件客户端：

- ✅ 支持 Gmail、163、QQ、126 等主流邮箱
- ✅ 多账号管理
- ✅ 适合脚本集成
- ✅ 跨平台支持 Linux/macOS/Windows

---
*参考文章: [Himalaya 官网](https://pimalaya.org/himalaya/)*
