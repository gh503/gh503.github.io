---
title: Ubuntu2204安装LaTex完整版
toc: true
recommend: 1
uniqueId: 2024-04-26 07:50:13/Ubuntu2204安装LaTex完整版.html
mathJax: false
date: 2024-04-26 15:50:13
thumbnail: https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/img/iceland-2154209_1920.jpg
tags:
    - 'LaTex'
categories:
    - '部署'
keywords:
    - '效率提升'
---
> 摘要
LaTex写作是开发文档的一种，使用LaTex命令实现对文本内容完美的控制，基于不同的模板，最后编译为`pdf`格式。
<!-- more -->
以前都是用MD，今天突然想学LaTex。前两天在word上调简历模板的时候，头都大了，效率不能更低了，一晚上都在调格式！！！而且图片、表格怎么都调不理想。
而单纯MD在遇到表格和图片的时候很费力，MD工具也不是很好用。恰恰刚好发现LaTex，从word到MD，再到LaTex，希望能更进一步做到对文本的精确控制。

开发环境使用的是`Ubuntu 22.04 x86_64 桌面版`。`LaText`可以安装`texlive`，安装完整版本。同时使用编写工具`texmaker`辅助开发。

## 安装
```bash
sudo apt install -y texlive-full
```

完整版6G多，安装时间比较长。

```bash
sudo apt install -y texmaker
```

安装可视化工具。

![texmaker](https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/shotimg/LaTex-texmaker.png)

## 找手册

- [LaTeX Notes 雷太赫排版系统简介](https://github.com/huangxg/lnotes/blob/master/lnotes2.pdf)

## Hello LaTex

1.`texmaker`: `File->New`，新建，保存为`latex.tex`；
2.输入：
```tex
%latex.tex
\documentclass{article}
\begin{document}
Hello, Latex!
\end{document}
```

工具栏： `LaTex1` -> 可以选择对应的标签，快速输入。类似`Html`开发。

3.编译`pdf`

工具栏：`Tools` -> `PDFLaTex`

查看生成`latex.pdf`文件，打开显示`Hello, LaTex!`。

![latex.pdf](https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/shotimg/latex.pdf.png)

## 配置优化

![latex-settings](https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/shotimg/latex-settings.png)

设置定位：`Options` -> `Congigure Texmaker`

- `Commands`: 定义各个子功能的配置
- `Quick Build`: 快速编译，调用`Commands`中设置执行。
- `Editor`：编辑器，如字体、主题、显示相关的配置。
- `Shortcuts`：快捷键，这里看到`Quick Build`使用`F1`。

`Commands`保持默认配置。

### 1.Quick Build
左侧`Editor`中，如同`markdown`编辑文本，按`F1`后，可以在右侧直接查看到生成的`PDF`。

### 2.Editor
设置编辑器显示字体大小`14`，打开补全、行号、换行显示，个人习惯使用空格替换`TAB`。主题自行调整。

### 3.编译支持中文

实际测试过程中，如果在文本内容中增加中文，会出现问题。
- 默认`pdflatex`编译会报错
- 按官网说明，使用`xelatex`或者`lualatex`支持中文，编译成功但是pdf中没有中文。仔细查看编译输出，存在编码告警


- 默认`pdflatex`编译，文本使用`GBK`编码，需要使用`CJKutf8`宏包
- 切换`xelatex`或`lualatex`默认使用`utf8`编码解析，但是需要使用`ctex`宏包

文本统一以`utf8`编码保存，使用`xelatex`编译，在中文文档中显示引用`ctex`，代码如下：
```tex
%test.tex
\documentclass{article}
\usepackage{ctex}
\begin{document}
Hello, LaTex!\\
你好，雷泰赫！
\end{document}
```

编译成功。
![latex-zh-cn](https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/shotimg/latex-zh-cn.png)

### 4.中文界面
如果要切换中文界面：
工具栏：`Options` -> 'interface language' -> 'zh_CN'

这篇文章是用`Markdown`写的：）。


参考文章:
[1]：[经常用 LaTeX 的是些什么人？](https://www.zhihu.com/question/19847741)
[2]：[tug.org/fontinstall](https://tug.org/fonts/fontinstall.html)
[3]：[How does one type Chinese in LaTeX?](https://tex.stackexchange.com/questions/17611/how-does-one-type-chinese-in-latex)
