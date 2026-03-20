---
thumbnail: https://cdn.jsdelivr.net/gh/gh503/blog-images/images/1_Asleekdesktopsetupfeaturingamonitorkeybo.jpg
title: Ubuntu 22.04 LTS + Obsidian + Ollama + OpenCode 搭建指南
date: 2026-03-04
tags: 
- Ubuntu
- Obsidian
- Ollama
- OpenCode
- AI
categories: 
- 工具配置
- AI
toc: true
recommend: 1
keywords: 
uniqueId: 2026-03-04/ubuntu-22.04-obsidian-ollama-opencode.html
mathJax: false
---

> 
<!-- more -->

本文详细介绍如何在 Ubuntu 22.04 LTS 系统上搭建一套完整的本地 AI 开发环境，包括 Obsidian（知识管理）、Ollama（本地大模型运行平台）和 OpenCode（AI 编程助手）。

## 系统准备

### 1. Ubuntu 22.04 LTS 安装

从 [Ubuntu 官网](https://ubuntu.com/download/desktop) 下载 Ubuntu 22.04 LTS 镜像，使用 [Rufus](https://rufus.ie/) 或 [Ventoy](https://www.ventoy.net/) 制作启动 U 盘进行安装。

安装时建议：
- 分配至少 100GB 磁盘空间

### 2. 系统更新与基础依赖

```bash
sudo apt update && sudo apt upgrade -y

# 安装基础开发工具
sudo apt install -y curl wget git vim neovim unzip zip build-essential software-properties-common
```

### 3. NVIDIA 驱动（GPU 加速用）

Ubuntu 22.04 内置了 NVIDIA 驱动支持，安装非常简单：

```bash
# 方法一：自动安装推荐驱动（推荐）
sudo ubuntu-drivers autoinstall

# 方法二：或使用 Software & Updates → Additional Drivers 选择

# 验证安装
nvidia-smi
```

## Obsidian 安装

Obsidian 是一款强大的知识管理工具，支持双向链接和 Markdown 编辑。

### 1. 下载与安装

```bash
# 下载 Obsidian
cd ~/Downloads
wget https://github.com/obsidianmd/obsidian-releases/releases/download/v1.5.12/obsidian_1.5.12_amd64.deb

# 安装
sudo dpkg -i obsidian_1.5.12_amd64.deb
sudo apt-get install -f  # 修复依赖
```

### 2. 插件配置

安装 Local Rest API 插件，用于与 OpenCode 集成：

1. Settings → Community Plugins → 关闭安全模式
2. 浏览插件市场，搜索 "Local REST API" 并安装
3. 启用插件后配置：Settings → Local REST API → 开启服务（默认端口 27123）

## Ollama 安装

Ollama 是本地运行大语言模型的平台，支持 llama2、mistral、qwen 等多种模型。

### 1. 安装 Ollama

```bash
# 安装 Ollama
curl -fsSL https://ollama.com/install.sh | sh

# 验证安装
ollama --version
```

### 2. 模型安装位置

Ollama 模型默认存储位置：
- Linux 系统服务模式：`/usr/share/ollama/.ollama/models`
- Linux 用户模式：`~/.ollama/models/`
- macOS：`~/Library/Application Support/Ollama/models`
- Windows：`C:\Users\用户名\.ollama\models`

```bash
# 查看当前模型存储位置
echo $OLLAMA_MODELS
```

#### 分区不够？使用软链接迁移

如果系统盘空间不足，可以将模型存储迁移到其他分区：

```bash
# 1. 停止 Ollama 服务
sudo systemctl stop ollama

# 2. 创建目标目录（假设在大容量分区 /data/ollama/models）
sudo mkdir -p /data/ollama/models

# 3. 同步现有模型（如果已有）- 使用 rsync 保留权限
sudo rsync -avP /usr/share/ollama/.ollama/models/ /data/ollama/models/

# 4. 删除原目录，创建软链接
sudo rm -rf /usr/share/ollama/.ollama/models
sudo ln -s /data/ollama/models /usr/share/ollama/.ollama/models

# 5. 设置权限
sudo chown -R root:root /data/ollama/models

# 6. 重启服务
sudo systemctl start ollama
```

或者直接修改环境变量（推荐）：

```bash
# 在 ~/.bashrc 中添加
echo 'export OLLAMA_MODELS=/data/ollama/models' >> ~/.bashrc
source ~/.bashrc
```

### 3. 模型选择建议

```bash
# 列出可用模型
ollama list
```

#### 小尺寸模型（笔记本首选）

| 模型 | 参数量 | 最低显存 | 特点 |
|------|--------|----------|------|
| qwen3.5:0.8b | 8亿 | 2GB | 极致轻量，推理极快，移动设备、IoT |
| qwen3.5:2b | 20亿 | 4GB | 小巧快速，端侧首选，移动设备 |
| qwen3.5:4b | ~46.6亿 | 6GB | 性能强劲，轻量级智能体 |
| qwen3.5:9b | 90亿 | 10GB | 越级性能，笔记本理想选择 |

```bash
# 入门推荐
ollama pull qwen3.5:4b
ollama pull qwen3.5:9b
```（显存充足可玩）

| 模型 | 参数量 | 最低显存 | 特点 |
|------|--------|----------|------|
| qwen3.5:27b | 270亿 | 32GB | 首个密集模型，Agent 能力强 |
| qwen3.5:35b-a3b | 350亿 | 24GB | MoE 架构，激活仅 3B，消费级显卡可用 |
| qwen3.5:122b-a10b | 1220亿 | 80GB+ | MoE 架构，激活 10B，服务器级别 |

```bash
# 中等配置
ollama pull qwen3.5:27b
ollama pull qwen3.5:35b-a3b
```

#### 大尺寸模型（服务器/云端）

| 模型 | 参数量 | 特点 |
|------|--------|------|
| qwen3.5:397b-a17b | 3970亿（激活170亿）| MoE 架构，性能超万亿参数 |

#### 画图模型推荐

```bash
# 图像生成模型
ollama pull flux/depth
ollama pull flux/canny
```

### 4. 上下文设置

Ollama 默认上下文长度为 2048-4096，可根据需要调整：

```bash
# 设置默认上下文长度（添加到 ~/.bashrc）
export OLLAMA_NUM_CTX=8192    # 根据显存调整，建议 4096-16384

# 运行时指定上下文长度
ollama run qwen3.5:9b --verbose
ollama run qwen3.5:9b -c 16384
```

### 5. 性能调优参数

```bash
# 添加到 /etc/systemd/system/ollama.service 或 ~/.bashrc
Environment="OLLAMA_NUM_PARALLEL=2"      # 并发请求数，根据 CPU/显存调整
Environment="OLLAMA_MAX_LOADED_MODELS=1" # 同时加载的模型数量，节省显存
```

| 参数 | 说明 | 推荐值 |
|------|------|--------|
| `OLLAMA_NUM_PARALLEL` | 并发处理请求数 | 2-4，显存低则设为 1 |
| `OLLAMA_MAX_LOADED_MODELS` | 同时加载到内存的模型数 | 1-2，避免显存溢出 |
| `OLLAMA_KEEP_ALIVE` | 模型在内存中保持时间 | `24h` 或 `-1` 永久 |

### 6. 配置 GPU 加速

确保 Ollama 使用 GPU：

```bash
# 设置环境变量（添加到 ~/.bashrc）
echo 'export OLLAMA_NUM_PARALLEL=2' >> ~/.bashrc
echo 'export OLLAMA_MAX_LOADED_MODELS=1' >> ~/.bashrc
source ~/.bashrc

# 测试 GPU 是否正常工作
ollama run qwen3.5:9b "你好"
```

### 6. Ollama API 服务

Ollama 默认提供本地 API：

```bash
# 默认端口 11434
curl http://localhost:11434/api/generate -d '{
  "model": "qwen3.5:9b",
  "prompt": "用一句话介绍你自己",
  "stream": false
}'
```

## OpenCode 安装

OpenCode 是一款强大的 AI 编程助手，支持多模型集成和高级编程功能。

### 1. 安装 OpenCode

```bash
# 安装 OpenCode（Linux）
curl -fsSL https://get.opencode.ai/install.sh | sh

# 验证安装
opencode --version
```

### 2. 配置 Ollama 作为后端

OpenCode 支持连接本地 Ollama：

```bash
# 首次启动并配置
opencode

# 或指定 Ollama 地址
opencode --context-length 8192
```

### 3. 配置 OpenCode

在 `~/.config/opencode/` 目录下创建或编辑配置文件：

```yaml
# ~/.config/opencode/config.yaml
model:
  provider: ollama
  model: qwen2.5:7b
  base_url: http://localhost:11434

context:
  max_tokens: 8192

features:
  agent:
    enabled: true
  mcp:
    enabled: true
```

### 4. 常用命令

```bash
# 启动对话
opencode

# 指定模型
opencode --model llama3.2:3b

# 使用会话历史
opencode --resume

# 查看帮助
opencode --help
```

## 集成工作流

### Obsidian + OpenCode 集成

可以通过 Shell Commands 插件在 Obsidian 中调用 OpenCode：

1. 安装 Obsidian Shell Commands 插件
2. 配置自定义命令：

```bash
# 命令示例：选中内容让 AI 解释
opencode explain "{{selection}}"
```

### Ollama + OpenCode 工作示例

```bash
# 1. 确保 Ollama 正在运行
ollama serve &

# 2. 使用 OpenCode 进行代码审查
opencode --review /path/to/your/code

# 3. 或者启动交互式编程会话
opencode
```

## 性能优化建议

### 1. Ollama 模型管理

```bash
# 查看已加载模型
ollama ps

# 释放内存
ollama stop qwen2.5:7b

# 删除不用的模型
ollama delete model-name
```

### 2. 系统资源监控

```bash
# 监控 GPU 使用
watch -n 1 nvidia-smi

# 监控内存
free -h
```

### 3. 启动脚本优化

创建一键启动脚本 `~/start-dev.sh`：

```bash
#!/bin/bash
# 启动 Ollama 后台服务
ollama serve &

# 等待服务就绪
sleep 3

# 启动 OpenCode
opencode
```

## 常见问题

### Q1: Ollama 启动失败
A: 检查 NVIDIA 驱动是否正确安装，`nvidia-smi` 是否正常工作。

### Q2: OpenCode 连接不上 Ollama
A: 确认 Ollama 服务正在运行，端口 11434 未被占用。

### Q3: 模型下载速度慢
A: 可以尝试使用镜像源，或在网络较好时段下载。

### Q4: 内存不足
A: 选择参数更小的模型（如 7b 以下），或增加 Swap 空间。

## 总结

通过本文的搭建，你已经拥有了一套完整的本地 AI 开发环境：
- **Obsidian**：知识管理与笔记
- **Ollama**：本地大模型运行平台
- **OpenCode**：AI 编程助手

这套组合可以在离线环境下使用，保护隐私的同时提供强大的 AI 辅助编程能力。

---
*参考文章: []()*
