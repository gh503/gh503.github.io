---
title: 项目
date: 2026-10-25 00:30:00
comments: false
---

<p class="subtitle is-6 has-text-grey">
三个长期在做的开源项目：3D 引擎、模块化机器人，以及本地优先的个人助理。<br>
Quench3D 和 modkit M1 提供在线演示；Jarvis 在自己的机器上运行，通过浏览器或 PWA 使用。
</p>

<div class="card mb-5" id="quench3d" style="scroll-margin-top:80px">
  <div class="card-image">
    <img src="/blog/images/projects/quench3d.jpg" alt="Quench3D 编辑器：工具栏、场景树与渲染视口" style="width:100%;height:auto;display:block">
  </div>
  <div class="card-content">
    <p class="title is-3 is-size-4-mobile">Quench3D</p>
    <p class="subtitle is-6 has-text-grey">用编辑器和 AI 搭建 3D 场景 · 自研物理 · 桌面 / Web / CLI / MCP</p>
    <div class="content">
      <p>面向模型展示、空间搭建、物理演示和交互原型。手工操作与 AI 助手修改同一个可见场景，也能保存为 JSON，交给命令行或外部 agent 继续验证与输出。</p>
      <ul>
        <li><strong>场景与外观</strong>：导入模型、创建图元、调整位姿／颜色／灯光／材质，使用标准视角与聚焦，保存场景或导出模型。</li>
        <li><strong>AI 助手</strong>：自然语言创建和修改独立图元，配置刚体与轨道、控制播放；支持连续追问、本地聊天历史和实际工具回执。</li>
        <li><strong>空间演示</strong>：宇宙星空、中文名称、连续轨道线，以及“月球绕移动地球”的嵌套轨道。公转是运动学动画，不是万有引力／N 体模拟。</li>
        <li><strong>自动化</strong>：CLI／MCP 提供场景诊断、物理推演、截图与视频输出。纯物理仿真无需 GPU，出图需要可用渲染后端。</li>
      </ul>
      <p><strong>开始使用：</strong>下载桌面包，解压运行 <code>quench3d-editor</code>；在右侧 AI 助手配置支持工具调用的 OpenAI Chat Completions 兼容模型。Web AI 从源码根目录运行 <code>python3 tools/agent_server.py</code>，访问 <code>http://127.0.0.1:8765</code>；静态在线编辑器不提供 AI 请求代理。</p>
      <p>AI 工具暂不支持任意修改模型子网格、复合体和父子层级；SDK 的能力范围大于实时助手。参数、工具契约和限制统一见项目文档。</p>
    </div>
    <div class="tags mb-2">
      <span class="tag is-light">Rust</span>
      <span class="tag is-light">wgpu</span>
      <span class="tag is-light">自研物理</span>
      <span class="tag is-light">egui</span>
      <span class="tag is-light">WASM</span>
    </div>
    <p class="is-size-7 has-text-grey mb-3">状态：桌面端与编辑器可用，Web 端已部署；还在快速迭代。</p>
    <div class="buttons">
      <a class="button is-small is-primary" href="https://gh503.github.io/quench3d/" target="_blank" rel="noopener">在线 Demo</a>
      <a class="button is-small" href="https://github.com/gh503/quench3d/releases/latest" target="_blank" rel="noopener">下载桌面版</a>
      <a class="button is-small" href="https://github.com/gh503/quench3d#readme" target="_blank" rel="noopener">源码与三分钟上手</a>
      <a class="button is-small" href="https://github.com/gh503/quench3d/blob/main/docs/ai_agent.md" target="_blank" rel="noopener">AI 配置与工具</a>
    </div>
  </div>
</div>

<div class="card mb-5">
  <div class="card-image">
    <img src="/blog/images/projects/modkit.jpg" alt="modkit M1 的在线 3D 查看器" style="width:100%;height:auto;display:block">
  </div>
  <div class="card-content">
    <p class="title is-3 is-size-4-mobile">modkit M1</p>
    <p class="subtitle is-6 has-text-grey">可拆装的模块化机器人 · 差速底盘 + 4 自由度机械臂 + 夹爪</p>
    <div class="content">
      <p>
        先定接口、再长形态：关节做成可拆装的模块，整机由底盘、机械臂、夹爪拼起来。
        目标不是拍一段演示视频，而是<strong>能独立完成一件物理任务</strong>——导航到指定位置 → 识别目标 → 抓取 → 放到另一处。
      </p>
      <ul>
        <li><strong>机械</strong>：M0 关节模块 5 个零件、M1 新增 7 个零件，干涉 / 间隙 / 壁厚 / 水密等 76 项几何自检全 PASS。</li>
        <li><strong>固件</strong>：总线舵机协议 + 底盘闭环，65 项 C++ 测试；ESP32-S3 交叉编译通过，但还没上真实硬件。</li>
        <li><strong>上位机</strong>：协议、运动学、仿真、CLI，23 项 pytest —— 没有硬件也能跑完整流程。</li>
        <li><strong>看得到</strong>：浏览器里拖动滑杆改关节角、播放抓取动画；Chrome / Edge 还能用 Web Serial 直连总线舵机。</li>
      </ul>
      <p>
        新手向：配套一份从零基础到能自己改图纸、改固件、加传感器的手册。
      </p>
    </div>
    <div class="tags mb-2">
      <span class="tag is-light">机械设计</span>
      <span class="tag is-light">ESP32</span>
      <span class="tag is-light">运动学</span>
      <span class="tag is-light">仿真</span>
      <span class="tag is-light">Web Serial</span>
    </div>
    <p class="is-size-7 has-text-grey mb-3">状态：机械出图、固件与仿真可用；整机实测与自主任务（M3–M5）还没开始。</p>
    <div class="buttons">
      <a class="button is-small is-primary" href="https://gh503.github.io/robot-modkit/" target="_blank" rel="noopener">在线 3D 查看器</a>
      <a class="button is-small" href="https://github.com/gh503/robot-modkit" target="_blank" rel="noopener">源码</a>
      <a class="button is-small" href="https://github.com/gh503/robot-modkit/blob/main/docs/07-%E5%B0%8F%E7%99%BD%E6%93%8D%E4%BD%9C%E6%89%8B%E5%86%8C.md" target="_blank" rel="noopener">小白操作手册</a>
    </div>
  </div>
</div>

<div class="card mb-5" id="jarvis" style="scroll-margin-top:80px">
  <div class="card-image">
    <img src="/blog/images/projects/jarvis.jpg" alt="Jarvis 浅色主题下的 Studio 记忆星座与记忆关联" loading="lazy" style="width:100%;height:auto;display:block">
  </div>
  <div class="card-content">
    <p class="title is-3 is-size-4-mobile">Jarvis</p>
    <p class="subtitle is-6 has-text-grey">本地优先的个人助理 · 文本与语音对话 · 记忆与提醒</p>
    <div class="content">
      <p>跑在自己机器上的个人助理，通过浏览器或 PWA 使用。把对话、按需感知、记忆和提醒放在一起，并用 Studio 观察台查看运行状态。</p>
      <ul>
        <li><strong>交互</strong>：文本与语音对话，支持打断；按需读取屏幕 OCR 或摄像头单帧。</li>
        <li><strong>记忆</strong>：基于 SQLite 保存与整合记忆，支持提醒、晨报和记忆关联展示。</li>
        <li><strong>模型</strong>：支持 OpenAI 与 Anthropic 多套协议，以及按优先级切换的模型来源池。</li>
        <li><strong>界面</strong>：内置深色、浅色和跟随系统三档主题，记住浏览器中的选择。</li>
      </ul>
    </div>
    <div class="tags mb-2">
      <span class="tag is-light">TypeScript</span>
      <span class="tag is-light">Node.js</span>
      <span class="tag is-light">SQLite</span>
      <span class="tag is-light">PWA</span>
      <span class="tag is-light">本地优先</span>
    </div>
    <p class="is-size-7 has-text-grey mb-3">使用方式：在本机部署后访问浏览器界面；安装与配置见仓库说明。</p>
    <div class="buttons">
      <a class="button is-small is-primary" href="https://github.com/gh503/jarvis" target="_blank" rel="noopener">源码与安装说明</a>
    </div>
  </div>
</div>

<p class="title is-5 mt-5">还有</p>

日常代码在 [GitHub](https://github.com/gh503)，国内镜像在 [Gitee](https://gitee.com/angusrobot)。
这些项目都按「先写清楚它现在到哪一步，再谈它将来能做什么」的方式维护 —— 状态表里能跑的就是能跑，跑不了的就标未开始。