---
title: Linux环境的几个自定义命令
toc: true
recommend: 1
uniqueId: 2024-04-26 02:40:10/Linux环境的几个自定义命令.html
mathJax: false
date: 2024-04-26 10:40:10
thumbnail: https://fastly.jsdelivr.net/gh/gh503/CDN@latest/img/hippo-515027_1920.jpg
tags:
    - 'linux'
    - '自定义命令'
categories:
    - '部署'
keywords:
    - '效率提升'
---
> 摘要
提高工作效率，对一些高频需求进行封装。
<!-- more -->
## 前言
在实际工作中，我们经常需求执行一些命令查看当前的机器或进程的状态。或者我们对一些信息特别关注的时候，希望随时能够观察到。一键获取。

这个时候，我们可以封装一些自定义命令，来提供给自己或者其他人使用。

## 自定义命令

### 1.v命令
在任意位置执行`v`，就可以查看到自己或者大家都关注的信息。取自`verbose`。这里根据自己的需要可以开放性定制。

```bash
#!/bin/bash

. tlog

os_name=$(. /etc/os-release && echo $NAME)
os_version=$(. /etc/os-release && echo $VERSION)
os_arch=$(uname -i)
os_kernel=$(uname -r)
os_ip=$(ip route get 1.2.3.4 | awk '{print $7;exit}')

os_root=($(df -hT | grep -w / | awk '{print $1,$2,$6}'))

os_mem_total=$(free -ht | grep -i total: | awk '{print $2;exit}')
os_mem_free=$(free -ht | grep -i mem: | awk '{print $NF;exit}')
os_mem_swap=$(free -ht | grep -i swap: | awk '{print $2;exit}')

# https://zhuanlan.zhihu.com/p/269782783
info=$(lscpu)
hw_arch=$(uname -m)
hw_cpu_name=$(trim $(echo "$info" | grep 'Model name' | cut -d: -f2))
hw_cpu_socket=$(trim $(echo "$info" | grep 'Socket(s)' | cut -d: -f2))
hw_cpu_per_socket=$(trim $(echo "$info" | grep 'Core(s) per socket' | cut -d: -f2))
hw_thread_per_cpu=$(trim $(echo "$info" | grep 'Thread(s) per core' | cut -d: -f2))
hw_thread_total=$((hw_cpu_socket * hw_cpu_per_socket * hw_thread_per_cpu))

shell=$(echo ${SHELL##*/})

ssh_client=$(printenv SSH_CLIENT | awk '{print $1;exit}')

trim "IP: $(printG "${os_ip}")"
trim "OS: $(printG "$os_name $os_version $os_arch")"
trim "Kernel: $(printG $os_kernel)"
trim "CPU: $(printG "${hw_cpu_name[@]} | ${hw_arch} | ${hw_thread_total}cores(${hw_cpu_socket}s*${hw_cpu_per_socket}p*${hw_thread_per_cpu}thread)")"
trim "Shell: $(printG $shell)"
trim "Ssh_client: $(printG ${ssh_client})"
trim "Username: $(printG $(whoami))"
trim "Hostname: $(printG $(hostname))"
trim "Mem: Total $(printG ${os_mem_total}) Free $(printG ${os_mem_free}) Swap $(printG ${os_mem_swap})"
trim "Root: Type $(printG ${os_root[1]}) Used $(printG ${os_root[2]}) Dev $(printG ${os_root[0]})"
```

创建文件`v`，添加执行权限`chmod 755`，自定义命令位置：
- 仅自己使用：`${HOME}/bin/v`，设置环境变量`PATH`：`export PATH=${HOME}/bin:${PATH}`，使用`bash`可以放到`${HOME}/.bashrc`。
- 提供大家使用：`/usr/local/bin/v`。

这里引用的`tlog`，本身定义了几个打印函数:
```bash
#!/bin/sh

. colors

tdate() {
    date +'%Y/%m/%d %H:%M:%S'
}

trim() {
    echo -e $(echo "$@")
}

printB() {
    echo -e "${CYAN}$@${RESET}"
}

printG() {
    echo -e "${GREEN}$@${RESET}"
}

printY() {
    echo -e "${YELLOW}$@${RESET}"
}

printR() {
    echo -e "${RED}$@${RESET}"
}

printP() {
    echo -e "${BLINK}${MAGENTA}$@${RESET}"
}

tdebug() {
    echo -e "[$(tdate)][${CYAN}DEBUG${RESET}] $@"
}

tinfo() {
    echo -e "[$(tdate)][${GREEN}INFO${RESET}] $@"
}

twarn() {
    echo -e "[$(tdate)][${YELLOW}WARN${RESET}] $@" >&2
}

terror() {
    echo -e "[$(tdate)][${RED}ERROR${RESET}] $@" >&2
}

tfatal() {
    echo -e "[$(tdate)][${BLINK}${MAGENTA}FATAL${RESET}] $@"
}

tlog() {
    local level="$1"
    local string="$2"
    local logfile="${3:-stdout}"

    usage() {
        printG "Usage: tlog <loglevel> <logstring> [logfile]"
        printG "  - loglevel: debug|info|warn|error|fatal. default info."
        printG "  - logstring: nonempty string."
        printG "  - logfile: option. file to append string. default stdout."
    }

    [ "$#" -ne 0 ] || {
        usage
        return 0
    }

    [ -n "$level" -a -n "$string" ] || {
        printR "error occurred!"
        usage
        return 1
    }

    echo 'debug|info|warn|error|fatal' | grep -wq $level || {
        printR "loglevel wrong!"
        usage
        return 2
    }

    level="t$(echo $level | tr 'A-Z' 'a-z')"

    if [ "$logfile" == 'stdout' ] ;then
        eval "$level $string"
    else
        [ -f "$logfile" ] || :> $logfile
        eval "$level $string" >> $logfile
    fi
}
```

位置同`v`，但是不需要执行权限，提供仅读权限即可：`chmod 644`。

还需要一个`colors`文件，同样`chmod 644`，内容如下：
```bash
#!/bin/sh

# Foreground Colors
BLACK="\033[0;30m"
RED="\033[0;31m"
GREEN="\033[0;32m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
MAGENTA="\033[0;35m"
CYAN="\033[0;36m"
WHITE="\033[0;37m"

LIGHT_BLACK="\033[1;30m"
LIGHT_RED="\033[1;31m"
LIGHT_GREEN="\033[1;32m"
LIGHT_YELLOW="\033[1;33m"
LIGHT_BLUE="\033[1;34m"
LIGHT_MAGENTA="\033[1;35m"
LIGHT_CYAN="\033[1;36m"
LIGHT_WHITE="\033[1;37m"

# Background Colors
BLACK_BG="\033[0;40m"
RED_BG="\033[0;41m"
GREEN_BG="\033[0;42m"
YELLOW_BG="\033[0;43m"
BLUE_BG="\033[0;44m"
MAGENTA_BG="\033[0;45m"
CYAN_BG="\033[0;46m"
WHITE_BG="\033[0;47m"

LIGHT_BLACK_BG="\033[1;40m"
LIGHT_RED_BG="\033[1;41m"
LIGHT_GREEN_BG="\033[1;42m"
LIGHT_YELLOW_BG="\033[1;43m"
LIGHT_BLUE_BG="\033[1;44m"
LIGHT_MAGENTA_BG="\033[1;45m"
LIGHT_CYAN_BG="\033[1;46m"
LIGHT_WHITE_BG="\033[1;47m"

# Special Codes
BOLD="\033[1m"
UNDERLINE="\033[4m"
BLINK="\033[5m"
REVERSE="\033[7m"
RESET="\033[0m"
```

定义了常用的前景色和背景色环境变量。

### 2.查看目录下所有的git仓库——showgits

在工作中开发项目比较复杂的时候，会用到。

```bash
#!/bin/bash
#
# 获取指定目录所有git仓库，默认当前目录
# $1 目标路径

. tlog

target=${1:-${PWD}}

for t in $(find $target -type d -name '.git')
do
    repo=$(dirname $(realpath $t))
    repo_name=$(basename $repo)
    repo_dir=$(dirname $repo)
    if [ "$last" != "$repo_dir" ] ;then
        printG "$repo_dir:"
    fi
    printG "  $repo_name:$(cd $repo && git branch | grep '^*' | awk '{print $2;exit}')"
    last=$repo_dir
done
```

### 3.更新目录下所有的git仓库——updategits

```bash
#!/bin/bash

. tlog

target=${1:-${PWD}}

for t in $(find $target -type d -name '.git')
do
    repo=$(dirname $(realpath $t))
    repo_name=$(basename $repo)
    repo_dir=$(dirname $repo)
    if [ "$last" != "$repo_dir" ] ;then
        printG "updating $repo_dir:"
    fi
    printG "  git-pull $repo_name:$(cd $repo && git branch | grep '^*' | awk '{print $2;exit}')"
    ( cd $repo && git pull -q )
    last=$repo_dir
done
```

### 4.查看目录下所有仓库中指定用户的代码量——showloc

这里`email`根据实际情况改成自己的默认邮箱，或者传入参数覆盖。

```bash
#!/bin/bash
#
# 统计提交邮箱代码量
# $1: 代码仓所有文件夹
# $2: 提交邮箱

. tlog

target=${1:-${PWD}}
email=${2:-'xxxxx@163.com'}

total=0
for t in $(find $target -type d -name '.git')
do
    repo=$(dirname $(realpath $t))
    repo_name=$(basename $repo)
    repo_dir=$(dirname $repo)
    res=($(cd $repo && git log --author="$email" --pretty=tformat: --numstat | gawk '{add += $1; subs += $2; loc += $1 - $2} END {printf "%s +%s -%s\n",loc,add,subs}'))
    [ "${#res[@]}" -ne 0 ] || current=0
    current=$(echo ${res[@]} | awk '{print $1;exit}')
    [ "$current" -gt 0 ] 2>/dev/null || continue
    printG "$repo_name:$(cd $repo && git branch | grep '^*' | awk '{print $2;exit}') under $repo_dir: ${res[@]}"
    total=$((total + current))
done
[ "$total" -eq 0 ] || printG

printG "$email: $total"
```

参考文章:
无。
