---
title: APE/CUE 文件无损转换 FLAC 完整指南
thumbnail: https://cdn.jsdelivr.net/gh/gh503/gh503.github.io/source/images/APECUEFLAC_cover.jpg
date: 2026-03-24
tags:
- 音频
- APE
- FLAC
- CUE
- Linux
categories:
- 工具配置
- 音频处理
toc: true
recommend: 1
keywords: APE, FLAC, CUE, 音频转换, 无损音频
uniqueId: 2026-03-24/ape-cue-to-flac-guide.html
mathJax: false
---

> "无损音频是数字音乐的最高境界，而 APE 和 FLAC 是其中的佼佼者。"

<!-- more -->

本文详细介绍如何将 APE 格式音频文件无损转换为 FLAC 格式，同时保留 CUE 索引文件中的音轨信息和元数据。适合音频爱好者和 Linux 用户。

## 一、基础知识

### 1.1 音频格式对比

在开始之前，我们先了解一下这三种格式的特点：

| 格式 | 全称 | 压缩方式 | 优势 | 劣势 |
|------|------|----------|------|------|
| **APE** | Monkey's Audio | 有损压缩 | 压缩率极高（比 FLAC 小 10-30%） | 解码速度慢，硬件支持少 |
| **FLAC** | Free Lossless Audio Codec | 无损压缩 | 解码速度快，硬件支持广泛 | 压缩率较低 |
| **CUE** | Cue Sheet | - | 记录音轨信息、分割点、元数据 | 需要配合音频文件使用 |

**为什么需要转换？**

- **硬件兼容性**：FLAC 被广泛支持，而 APE 支持较少
- **解码速度**：FLAC 解码速度快，适合移动设备
- **标签支持**：FLAC 的标签系统更完善
- **生态成熟**：FLAC 的工具链更丰富

### 1.2 CUE 索引文件

CUE 文件（Cue Sheet）是音频 CD 的索引文件，包含以下信息：

- **音轨信息**：音轨名称、艺术家、专辑
- **分割点**：音轨的起始和结束时间
- **元数据**：ISRC、UPC/EAN、CD-Text
- **结构**：CUE SHEET、TRACK、INDEX

**CUE 文件结构示例**：

```
CUE SHEET
TITLE "专辑名称"
PERFORMER "艺术家"
FILE "音频文件.ape" WAVE
  TRACK 01 AUDIO
    TITLE "第一首歌"
    PERFORMER "艺术家"
    INDEX 01 00:00:00
  TRACK 02 AUDIO
    TITLE "第二首歌"
    PERFORMER "艺术家"
    INDEX 01 03:45:20
```

**常见问题**：
- **编码问题**：中文 CUE 文件可能使用 GB18030 或 BIG5 编码
- **时间戳问题**：毫秒部分可能只有一位（如 `:1` 而非 `:01`）
- **路径问题**：FILE 字段可能指向错误的文件名

### 1.3 转换流程概览

完整的转换流程如下：

```
APE 文件 + CUE 文件
    ↓
1. CUE 编码修复（GB18030/BIG5 → UTF-8）
    ↓
2. CUE 时间戳修正（补全毫秒）
    ↓
3. APE → WAV 解码（ffmpeg）
    ↓
4. WAV → FLAC 编码（shnsplit）
    ↓
5. 标签写入（cuetag）
    ↓
FLAC 文件（带完整标签）
```

## 二、工具准备

### 2.1 核心工具

| 工具 | 作用 | 安装方法 |
|------|------|----------|
| **ffmpeg** | 音频解码/编码 | `sudo apt install ffmpeg` |
| **shntool** | 音频分割 | `sudo apt install shntool` |
| **cuetag** | 标签写入 | `sudo apt install cuetools` |
| **iconv** | 编码转换 | `sudo apt install libc-bin` |
| **bc** | 数值计算 | `sudo apt install bc` |

### 2.2 安装方法

#### Ubuntu/Debian

```bash
sudo apt update
sudo apt install -y ffmpeg shntool cuetools libc-bin bc
```

#### Arch Linux

```bash
sudo pacman -S ffmpeg shntool cuetools libc-bin bc
```

#### macOS

```bash
brew install ffmpeg shntool cuetools
```

#### Windows

下载并安装：
- [ffmpeg](https://ffmpeg.org/download.html)
- [shntool](https://www.etree.org/shntool/)
- [cuetools](https://cuetools.sourceforge.net/)

### 2.3 验证安装

```bash
# 检查 ffmpeg
ffmpeg -version

# 检查 shntool
shntool --version

# 检查 cuetag
cuetag --version

# 检查 iconv
iconv --version

# 检查 bc
bc --version
```

## 三、转换流程详解

### 3.1 步骤 1：CUE 编码修复

**原理**：中文 CUE 文件通常使用 GB18030 或 BIG5 编码，需要转换为 UTF-8。

**方法**：使用 `iconv` 工具进行编码转换。

**优先级**：GB18030 > BIG5 > 原样

```bash
# 尝试 GB18030 转换
iconv -f gb18030 -t utf-8 input.cue -o output.cue

# 如果失败，尝试 BIG5 转换
iconv -f big5 -t utf-8 input.cue -o output.cue

# 如果都失败，直接复制（假设已经是 UTF-8）
cp input.cue output.cue
```

**脚本实现**：

```bash
if iconv -f gb18030 -t utf-8 "$cue_file" -o "fix.cue" 2>/dev/null; then
    echo "  iconv GB18030 succ."
elif iconv -f big5 -t utf-8 "$cue_file" -o "fix.cue" 2>/dev/null; then
    echo "  iconv BIG5 succ."
else
    echo "  iconv fail, using raw copy."
    cp "$cue_file" "fix.cue"
fi
```

### 3.2 步骤 2：CUE 时间戳修正

**原理**：CUE 文件中的时间戳格式为 `MM:SS:SS:ff`，但有时毫秒部分只有一位（如 `:1` 而非 `:01`），需要补全。

**方法**：使用 `sed` 命令进行正则替换。

**正则表达式**：`/:([0-9]{2})\.([0-9])$/:\1:\20/`

**解释**：
- `:([0-9]{2})\.([0-9])$`：匹配 `:12.` 格式
- `\1:\20`：替换为 `:12:20`（补全到两位）

**脚本实现**：

```bash
sed -i -E 's/:([0-9]{2})\.([0-9])$/:\1:\20/' "fix.cue"
```

### 3.3 步骤 3：APE → WAV 解码

**原理**：使用 ffmpeg 将 APE 文件解码为 WAV 格式。

**方法**：使用 `ffmpeg` 命令行工具。

**参数说明**：
- `-nostdin`：不使用标准输入
- `-i`：输入文件
- `-loglevel quiet`：减少日志输出
- `-y`：覆盖输出文件

**脚本实现**：

```bash
ape_file=$(ls *.ape 2>/dev/null | head -n 1)
if [ -z "$ape_file" ]; then
    echo "  [ERROR] No APE file found in $(pwd)"
    exit 1
fi

echo "  Decoding APE: $ape_file ..."
ffmpeg -nostdin -i "$ape_file" "working_temp.wav" -loglevel quiet -y
```

### 3.4 步骤 4：WAV → FLAC 编码

**原理**：使用 shntool 将 WAV 文件按照 CUE 文件分割并编码为 FLAC。

**方法**：使用 `shntool split` 命令。

**参数说明**：
- `-f`：指定 CUE 文件
- `-o`：输出文件名格式
- `-t`：输出文件名模板（`%n.%t` 表示音轨号.标题）

**脚本实现**：

```bash
if shnsplit -f "fix.cue" -o flac -t "%n.%t" "working_temp.wav"; then
    echo "  shnsplit succ."
else
    echo "  [ERROR] shnsplit failed for $cue_file"
    exit 1
fi
```

### 3.5 步骤 5：标签写入

**原理**：使用 cuetag 从 CUE 文件读取标签信息并写入 FLAC 文件。

**方法**：使用 `cuetag` 命令行工具。

**参数说明**：
- `yes`：自动确认所有提示
- `2>/dev/null`：抑制错误输出

**脚本实现**：

```bash
if yes | cuetag "fix.cue" [0-9]*.flac >/dev/null 2>&1; then
    echo "  cuetag succ."
else
    echo "  cuetag fail (Normal for corrupted CUE files)"
fi
```

### 3.6 步骤 6：清理临时文件

**原理**：删除转换过程中产生的临时文件。

**方法**：使用 `rm` 命令删除。

**脚本实现**：

```bash
rm -f "working_temp.wav" "fix.cue"
```

## 四、完整脚本

### 4.1 脚本结构

```bash
#!/bin/bash
#
# ape -> flacs (with auto-install logic)

set -e
set -x # 调试时开启

# ==========================================
# 0. 自动安装依赖环境逻辑
# ==========================================
install_dependencies() {
    echo "Checking dependencies..."
    
    # 定义需要检查的二进制工具
    local deps=("ffmpeg" "shnsplit" "cuetag" "iconv" "bc")
    local missing_deps=()

    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing_deps+=("$dep")
        fi
    done

    if [ ${#missing_deps[@]} -eq 0 ]; then
        echo "All dependencies are satisfied."
    else
        echo "Missing: ${missing_deps[*]}. Attempting to install..."
        
        # 识别包管理器
        if command -v apt-get &> /dev/null; then
            # Ubuntu / Debian / FnOS
            sudo apt-get update
            sudo apt-get install -y ffmpeg shntool cuetools iconv bc
        elif command -v dnf &> /dev/null || command -v yum &>dev/null; then
            # openEuler / CentOS / Fedora
            sudo dnf install -y ffmpeg shntool cuetools libc-progs bc
        else
            echo "Error: Unknown package manager. Please install ${missing_deps[*]} manually."
            exit 1
        fi
    fi
}

# 执行安装检查
install_dependencies

# ==========================================
# 1. 核心处理逻辑
# ==========================================
find . -type f -name "*.cue" -print0 | while IFS= read -r -d '' cue_path; do
    (
        cur_ws=$(dirname "$cue_path")
        cur_fs=$(basename "$cue_path")
        cd "$cur_ws" || exit 1
        echo "------------------------------------------------"
        pwd

        # 1. 修复 CUE 编码 (增加 GB18030 优先级，这是目前对付中文乱码最稳的)
        if iconv -f gb18030 -t utf-8 "$cur_fs" -o "fix.cue" 2>/dev/null ;then
            echo "  iconv GB18030 succ."
        elif iconv -f big5 -t utf-8 "$cur_fs" -o "fix.cue" 2>/dev/null; then
            echo "  iconv BIG5 succ."
        else
            echo "  iconv fail, using raw copy."
            cp "$cur_fs" "fix.cue"
        fi

        # 2. 修正 CUE 时间戳 (补全只有一位毫秒的情况)
        sed -i -E 's/:([0-9]{2})\.([0-9])$/:\1:\20/' "fix.cue"

        # 3. 强制 CUE 指向临时 WAV 文件
        sed -i "s/FILE \".*\" WAVE/FILE \"working_temp.wav\" WAVE/g" "fix.cue"

        # 4. APE 转 WAV
        ape_file=$(ls *.ape 2>/dev/null | head -n 1)
        if [ -z "$ape_file" ]; then 
            echo "  [ERROR] No APE file found in $(pwd)"; 
            exit; 
        fi

        echo "  Decoding APE: $ape_file ..."
        ffmpeg -nostdin -i "$ape_file" "working_temp.wav" -loglevel quiet -y

        # 5. 切分
        echo "  Splitting FLAC..."
        if shnsplit -f "fix.cue" -o flac -t "%n.%t" "working_temp.wav"; then
            echo "  shnsplit succ."
            
            # 6. 写入标签
            # 使用子进程处理标签，防止因编码问题导致的脚本崩溃
            if yes | cuetag "fix.cue" [0-9]*.flac >/dev/null 2>&1; then
                echo "  cuetag succ."
            else
                echo "  cuetag fail (Normal for corrupted CUE files)"
            fi
        else
            echo "  [ERROR] shnsplit failed for $cur_fs"
        fi

        # 7. 清理临时文件 (保留原来的 .cue 和 .ape)
        rm -f "working_temp.wav" "fix.cue"
    )
done
```

### 4.2 脚本使用方法

**保存脚本**：

```bash
# 保存为 ape2flac.sh
cat > ape2flac.sh << 'EOF'
#!/bin/bash
# ape -> flacs (with auto-install logic)
...
EOF
```

**赋予执行权限**：

```bash
chmod +x ape2flac.sh
```

**运行脚本**：

```bash
# 在包含 APE 和 CUE 文件的目录中运行
./ape2flac.sh
```

### 4.3 脚本特点

- **自动安装依赖**：自动检测并安装缺失的工具
- **批量处理**：自动处理目录中的所有 CUE 文件
- **错误处理**：每个 CUE 文件在子进程中处理，互不影响
- **日志输出**：`set -x` 开启调试模式，显示详细执行过程
- **安全退出**：`set -e` 遇到错误立即退出

## 五、实践案例

### 5.1 案例 1：单文件转换

**场景**：单个 APE 文件 + CUE 文件

**目录结构**：

```
~/Music/Album/
├── Album.ape
└── Album.cue
```

**执行转换**：

```bash
cd ~/Music/Album/
./ape2flac.sh
```

**预期输出**：

```
------------------------------------------------
/home/user/Music/Album
  iconv GB18030 succ.
  Decoding APE: Album.ape ...
  Splitting FLAC...
  shnsplit succ.
  cuetag succ.
```

**结果**：

```
~/Music/Album/
├── Album.ape
├── Album.cue
├── 01.第一首歌.flac
├── 02.第二首歌.flac
└── ...
```

### 5.2 案例 2：批量转换

**场景**：多个专辑目录

**目录结构**：

```
~/Music/
├── Album1/
│   ├── Album1.ape
│   └── Album1.cue
├── Album2/
│   ├── Album2.ape
│   └── Album2.cue
└── Album3/
    ├── Album3.ape
    └── Album3.cue
```

**执行转换**：

```bash
cd ~/Music/
find . -type f -name "*.cue" -print0 | xargs -0 -I {} sh -c 'cd "$(dirname "{}")" && ~/Scripts/ape2flac.sh'
```

**预期输出**：

```
------------------------------------------------
/home/user/Music/Album1
  iconv GB18030 succ.
  Decoding APE: Album1.ape ...
  Splitting FLAC...
  shnsplit succ.
  cuetag succ.
------------------------------------------------
/home/user/Music/Album2
  iconv BIG5 succ.
  Decoding APE: Album2.ape ...
  Splitting FLAC...
  shnsplit succ.
  cuetag succ.
------------------------------------------------
/home/user/Music/Album3
  iconv fail, using raw copy.
  Decoding APE: Album3.ape ...
  Splitting FLAC...
  shnsplit succ.
  cuetag fail (Normal for corrupted CUE files)
```

### 5.3 案例 3：常见问题处理

#### 问题 1：CUE 文件乱码

**现象**：转换后的 FLAC 文件标签显示乱码。

**原因**：CUE 文件编码不是 UTF-8。

**解决方法**：脚本已自动处理，优先尝试 GB18030 和 BIG5 转换。

#### 问题 2：时间戳不正确

**现象**：音轨分割点不准确。

**原因**：CUE 文件中时间戳格式不标准。

**解决方法**：脚本已自动补全毫秒部分。

#### 问题 3：标签丢失

**现象**：转换后的 FLAC 文件没有标签信息。

**原因**：CUE 文件损坏或格式不正确。

**解决方法**：脚本会继续执行，但标签写入可能失败（这是正常的）。

#### 问题 4：转换速度慢

**现象**：APE 解码速度很慢。

**原因**：APE 格式本身解码速度慢。

**解决方法**：
- 使用更快的硬件
- 考虑使用多线程工具（如 `mac`）

## 六、进阶技巧

### 6.1 批量处理优化

**并行处理**：使用 GNU Parallel 并行处理多个专辑。

```bash
find . -type f -name "*.cue" -print0 | parallel -j 4 'cd "$(dirname "{}")" && ~/Scripts/ape2flac.sh'
```

**进度显示**：使用 `pv` 显示进度。

```bash
find . -type f -name "*.cue" -print0 | pv | parallel -j 4 'cd "$(dirname "{}")" && ~/Scripts/ape2flac.sh'
```

### 6.2 错误处理

**错误捕获**：使用 `trap` 捕获错误并记录日志。

```bash
trap 'echo "Error occurred at line $LINENO"' ERR

# 主逻辑
find . -type f -name "*.cue" -print0 | while IFS= read -r -d '' cue_path; do
    (
        # ... 转换逻辑 ...
    ) || echo "Failed to process: $cue_path" >> error.log
done
```

### 6.3 日志记录

**日志级别**：使用 `set -x` 开启调试模式。

**日志文件**：将输出重定向到日志文件。

```bash
./ape2flac.sh 2>&1 | tee conversion.log
```

## 七、常见问题

### Q1：CUE 文件乱码怎么办？

**A**：脚本已自动处理编码转换，优先尝试 GB18030 和 BIG5 转换。如果仍然乱码，可能是 CUE 文件损坏。

### Q2：时间戳不正确怎么办？

**A**：脚本已自动补全毫秒部分。如果时间戳仍然不正确，可能是 CUE 文件格式不标准，需要手动编辑。

### Q3：标签丢失怎么办？

**A：标签丢失通常是因为 CUE 文件损坏或格式不正确。脚本会继续执行转换，但标签写入可能失败。可以尝试手动修复 CUE 文件。

### Q4：转换速度慢怎么办？

**A**：APE 格式本身解码速度慢，这是格式特性。可以考虑：
- 使用更快的硬件
- 使用多线程工具（如 `mac`）
- 考虑使用其他格式（如 FLAC 直接编码）

### Q5：如何验证转换质量？

**A**：可以使用以下方法验证：

```bash
# 检查 FLAC 文件完整性
metaflac --check *.flac

# 检查标签信息
metaflac --list *.flac

# 对比原始 APE 和转换后的 FLAC
# （需要手动对比）
```

### Q6：如何保留原始 APE 文件？

**A**：脚本不会删除原始 APE 文件，只会生成新的 FLAC 文件。原始文件会保留在原位置。

### Q7：如何转换其他格式？

**A**：可以修改脚本以支持其他格式：

```bash
# APE → MP3
ffmpeg -i input.ape -q:a 0 output.mp3

# APE → OGG
ffmpeg -i input.ape -c:a libvorbis output.ogg

# APE → AAC
ffmpeg -i input.ape -c:a aac output.m4a
```

### Q8：如何处理多 CD 的 CUE 文件？

**A**：多 CD 的 CUE 文件通常包含多个 FILE 字段。脚本会自动处理第一个 FILE 字段，其他 FILE 字段会被忽略。如果需要处理多 CD，需要修改脚本。

### Q9：如何处理嵌套目录？

**A**：脚本使用 `find` 命令递归查找所有 CUE 文件，包括嵌套目录。

### Q10：如何处理没有 CUE 文件的 APE 文件？

**A**：如果没有 CUE 文件，APE 文件会被当作单个音轨处理。可以手动创建 CUE 文件，或使用其他工具（如 `mac`）自动生成 CUE 文件。

## 八、总结

本文详细介绍了 APE/CUE 文件无损转换为 FLAC 的完整流程，包括：

1. **基础知识**：APE、CUE、FLAC 格式的特点和对比
2. **工具准备**：ffmpeg、shntool、cuetag 等工具的安装和验证
3. **转换流程**：CUE 编码修复、时间戳修正、APE 解码、FLAC 编码、标签写入
4. **完整脚本**：自动安装依赖、批量处理、错误处理
5. **实践案例**：单文件转换、批量转换、常见问题处理
6. **进阶技巧**：并行处理、错误处理、日志记录
7. **常见问题**：编码问题、时间戳问题、标签丢失问题

通过本文，你应该能够：
- 理解 APE/CUE/FLAC 格式的特点和区别
- 掌握 APE/CUE 转 FLAC 的完整流程
- 使用提供的脚本进行批量转换
- 处理常见的转换问题

---

**参考资源**：
- [Himalaya 官方文档](https://pimalaya.org/himalaya/)
- [FLAC 官方文档](https://xiph.org/flac/)
- [ffmpeg 官方文档](https://ffmpeg.org/)
- [shntool 官方文档](https://www.etree.org/shntool/)
- [cuetools 官方文档](https://cuetools.sourceforge.net/)

**相关文章**：
- [Linux 终端邮件客户端 Himalaya 配置指南](https://gh503.github.io/2026/03/20/himalaya-email-client-guide.html)
- [Linux环境的几个自定义命令](https://gh503.github.io/2026/03/20/linux-custom-commands.html)
- [个人工作站部署方案](https://gh503.github.io/2026/03/20/personal-workstation-deployment.html)
