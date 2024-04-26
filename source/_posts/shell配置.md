---
title: shell配置
toc: true
recommend: 1
uniqueId: 2024-04-26 01:31:52/shell配置.html
mathJax: false
date: 2024-04-26 09:31:52
thumbnail:
tags:
    - 'shell'
    - 'bash'
    - 'zsh'
    - 'windows cmd'
categories:
    - '部署'
keywords:
    - '效率提升'
---
> 摘要
根据个人喜好配置命令行环境，提高工作效率。
<!-- more -->
## Linux

`Linux`的`Shell`配置可以直接在网上找到很多，配置方案也很丰富。这里只配置通用、简单且常用的`Shell`配置。
更多配置在[gh503/xdeploy](https://github.com/gh503/xdeploy/tree/master/linux/shell)。

- 若配在`/etc/skel/.bashrc`，创建新用户时会自动拷贝到`${HOME}/.bashrc`生效。其他比如`zsh`，可以使用`.zshrc`
- 若配在`${HOME}/.bashrc`或`${HOME}/.zshrc`，当前用户生效

```bash
alias ..='cd ..'
alias ...='cd ../..'
alias ....='cd ../../..'
alias .....='cd ../../../..'
alias ......='cd ../../../../..'

alias arp='arp -n'

alias ls='ls -h --quoting-style=shell --color=auto --show-control-chars'
alias sl='ls'
alias la='ls -A'
alias ll='ls   -lrt --color=auto --time-style=long-iso'
alias lla='ls -Alrt --color=auto --time-style=long-iso'

alias ssh='ssh -q -o StrictHostKeyChecking=no'
alias s=ssh
alias rsync="rsync -avzP -e 'ssh -q -o StrictHostKeyChecking=no'"

alias d='dirs -v'
alias df='df -hT'
alias du='du -h'

alias f="find"
alias ff="find . -type f -name"
alias fd="find . -type d -name"

alias free='free -h'

alias grep='grep --color'
alias g='grep -E -I'
alias gc='grep -E -I -C5'
alias gi='grep -E -Ii'
alias gr='grep -E -Ir'
alias gir='grep -E -Iir'
alias gf='find . -type f -print0 | xargs -0 grep -E'

alias make="make -j$(nproc)"
alias md='mkdir -p'

alias rd=rmdir

alias tree='tree -N'

alias u="uname -a"

alias wget='wget -c --no-check-certificate'

export HISTSIZE=51200

export LESS=-MRiqscj5
export PAGER=less
```

## Windows
配置`Windows Cmd`命令别名，打开时自动加载。

### 创建cmdAlias.bat文件
```batch
@echo off

@prompt %USERNAME%@%COMPUTERNAME% $P$_$C$T$F $$ 

@doskey rm=del $*
@doskey touch=copy /b NUL $*
@doskey e="%EDITOR%" $*
@doskey cat=type $*
@doskey ls=dir /D $*
@doskey sl=dir /D $*
@doskey ll=dir /P /O:G $*
@doskey cd-=popd
@doskey ..=cd ..
@doskey ...=cd ..\..
@doskey ....=cd ..\..\..
@doskey .....=cd ..\..\..\..
@doskey pwd=cd
@doskey mv=move $*
@doskey chen=chcp 437
@doskey chzh=chcp 936
@doskey chcn=chcp 65001
```

### 配置
1.可以将文件放到用户主目录下，如: `C:\Users\<Username>\cmdAlias.bat`
2.进入注册表，并定位到：`计算机\HKEY_CURRENT_USER\Software\Microsoft\Command Processor`

`win+R`，输入`regedit`，进入`计算机\HKEY_CURRENT_USER\Software\Microsoft\Command Processor`
右边空白处右键：新建->字符串值
![](https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/shotimg/win-reg-alias.png)

数值名称: 比如`AutoRunCmdAlias`
数值数据：这里写文件路径，`C:\Users\<Username>\cmdAlias.bat`

### 打开新的Cmd
执行`pwd`测试。

参考文章:
[window中的cmd中设置别名(alias)及设置快捷键打开cmd](https://blog.csdn.net/YiRanZhiLiPoSui/article/details/83116819)
