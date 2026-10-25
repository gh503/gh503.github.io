---
title: 项目
date: 2026-10-25 00:30:00
comments: false
---

<p class="subtitle is-6 has-text-grey">
两个从零开始、长期在做的项目：一个把 3D 引擎和物理引擎自己写一遍，一个把机器人从图纸做到能抓东西。<br>
都开源，都能在浏览器里直接玩 —— 不用装任何东西。
</p>

<div class="card mb-5">
  <div class="card-image">
    <img src="/blog/images/projects/quench3d.jpg" alt="Quench3D 编辑器：工具栏、场景树与渲染视口" style="width:100%;height:auto;display:block">
  </div>
  <div class="card-content">
    <p class="title is-3 is-size-4-mobile">Quench3D</p>
    <p class="subtitle is-6 has-text-grey">纯 Rust 的 3D 引擎 · 物理引擎从零实现 · 桌面端与 Web 端同一套代码</p>
    <div class="content">
      <p>
        面向「模型展示 / 场景搭建 / 物理仿真 / 小游戏原型」四类事情。
        渲染基于 <code>wgpu</code>，物理是自己写的，不引第三方物理库。
      </p>
      <ul>
        <li><strong>渲染</strong>：wgpu 前向 PBR，Vulkan / Metal / DX12 / WebGPU / WebGL2 同一份着色器，带阴影、天空、实例化、离屏截图。</li>
        <li><strong>物理</strong>：自研刚体，宽相 / 窄相 + 顺序冲量求解器，5 种关节与角色控制器；热路径零分配。</li>
        <li><strong>编辑器</strong>：egui 的工具栏 / 场景树 / 属性面板，桌面端与 Web 端是同一份界面代码。</li>
        <li><strong>体量</strong>：约 3.7 万行 Rust + 0.65 千行 WGSL，引擎本体 <code>#![forbid(unsafe_code)]</code>。</li>
      </ul>
      <p>
        名字也有来历：原来的 <code>forge3d</code> 在 Rust、PyPI、Unity 素材领域都已经被占，
        于是改叫 Quench3D（淬火——锻造之后的下一道工序）。
      </p>
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
      <a class="button is-small" href="https://github.com/gh503/quench3d" target="_blank" rel="noopener">源码</a>
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

<p class="title is-5 mt-5">还有</p>

日常代码在 [GitHub](https://github.com/gh503)，国内镜像在 [Gitee](https://gitee.com/angusrobot)。
两个项目都按「先写清楚它现在到哪一步，再谈它将来能做什么」的方式维护 —— 状态表里能跑的就是能跑，跑不了的就标未开始。