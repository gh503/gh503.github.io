---
title: Quench3D 更新：用编辑器和 AI 搭建 3D 场景
date: 2026-11-05 18:45:00
toc: true
thumbnail: /blog/images/projects/quench3d.jpg
tags:
  - Rust
  - 3D
  - AI agent
categories:
  - 开源项目
---

Quench3D 是我正在迭代的开源 Rust 3D 引擎，包含自研物理引擎、PBR 渲染器和桌面／Web 编辑器。这次更新把使用入口整理清楚：可以手工布置场景，也可以让 AI 在当前画面里操作；批量验证和出图则交给 CLI／MCP。

[下载桌面版](https://github.com/gh503/quench3d/releases/latest) · [在线编辑器](https://gh503.github.io/quench3d/) · [源码与三分钟上手](https://github.com/gh503/quench3d#readme)

<!-- more -->

## 适合拿来做什么

- **模型和空间展示**：导入模型、创建图元、调整位姿、颜色、灯光和材质，保存 JSON 或导出模型。
- **物理演示**：播放碰撞、堆叠和关节场景，暂停、单步和重置；更完整的设置通过场景 JSON 或 Rust SDK 完成。
- **空间运动演示**：太阳、地球和月球各自公转，月球跟随移动中的地球；配上中文名称、连续轨道线和宇宙星空。
- **agent 自动化**：先校验场景，再做不需要 GPU 的物理推演，最后按需截图或输出视频。

天体公转目前使用可保存的运动学轨道动画，不是万有引力或 N 体模拟。它适合表达运动关系；需要科学或工程结论时，应针对目标问题验证算法与误差。

## 最简单的开始方式

下载对应平台的桌面归档，解压运行 `quench3d-editor`；Windows 运行 `quench3d-editor.exe`，不用安装 Rust。

先从“添加”放一个球或方块，调整位置，点击“播放”。工具栏提供标准视角、透视／正交和聚焦选中；左右栏可以拖动调宽或收起。保存 JSON 后可以重新加载，轨道、名称标签、轨道线开关和环境会随场景保留。

需要 AI 时，在右侧“AI 助手 → 本地模型配置”填写 OpenAI Chat Completions 兼容地址和密钥，获取并选择支持工具调用的模型。先试：

> 创建一个半径 0.4 米的红球，放在 [0,3,0]，聚焦它，然后播放仿真。

也可以继续要求：

> 创建太阳、地球和月球，地球绕太阳，月球绕移动的地球。显示中文名称和连续轨道线，使用宇宙星空，隐藏网格与坐标轴，然后播放。

助手会检查场景、调用工具并记录实际回执；发生错误会显示出来。支持连续追问、停止和会话历史，恢复聊天记录不会自动重放工具。AI 目前主要操作独立图元，不能任意修改模型子网格、复合体或父子层级。

## 浏览器与外部 agent

[在线编辑器](https://gh503.github.io/quench3d/)可以先体验手工操作。静态站点本身不提供 AI 请求代理；要在 Web 里使用 AI，从源码仓库根目录运行（Python 3.10+，无需额外 pip 包）：

```bash
python3 tools/agent_server.py
```

访问 `http://127.0.0.1:8765`，再配置模型。桌面与浏览器分别保存本机配置与历史；密钥不写入场景 JSON，但本地存储不是加密保险箱。

外部 agent 可以通过 `quench3d schema --json` 获取能力清单，按 `validate → simulate → render` 的顺序处理场景，也可配置 `quench3d mcp` 使用 stdio 工具。CLI／MCP 处理文件或内联 JSON，与修改当前编辑器场景的实时工具是不同入口。

## 详细文档

首页只保留能力、使用场景和最短上手路径。具体参数、工具契约、SDK、验证和性能记录分别整理在项目文档中：

- [编辑器与 Web 指南](https://github.com/gh503/quench3d/blob/main/docs/editor_guide.md)
- [AI 助手配置与工具范围](https://github.com/gh503/quench3d/blob/main/docs/ai_agent.md)
- [CLI／MCP 参考](https://github.com/gh503/quench3d/blob/main/docs/cli_agent.md)
- [SDK 开发指南](https://github.com/gh503/quench3d/blob/main/docs/getting_started.md)
- [能力边界](https://github.com/gh503/quench3d/blob/main/docs/limitations.md)

项目还在快速迭代，最新下载统一使用 [Release 入口](https://github.com/gh503/quench3d/releases/latest)，避免在介绍页固定过时版本号。
