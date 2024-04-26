---
title: vim配置
toc: true
recommend: 1
uniqueId: 2024-04-25 16:58:04/vim配置.html
mathJax: false
date: 2024-04-26 00:58:04
thumbnail: https://cdn.jsdelivr.net/gh/gh503/CDN@1.0.0/img/costa-rica-8606850_1920.jpg
tags:
    - 'vim'
categories:
    - '部署'
keywords:
    - '效率提升'
---
> 摘要
编辑神器vim常用优化配置参考。
<!-- more -->
## 前言
*本文仅作为个人使用习惯配置记录，仅供参考。*

- windows系统，直接使用`notepad++`，配合丰富插件，效率非常高。
- Linux系统，使用vim并配合增强配置，如果不打算将`vim`配置成`IDE`，不需要安装插件。这里也不打算提供`IDE`配置方案。

## 增强配置

这里的`vim`配置，不需要单独安装插件。

- 若是自己的笔记本环境，可以直接配置在`/etc/vim/vimrc.local`，这样在普通用户和`root`用户同时生效
- 若是公共环境，且自己用户使用，可以配置在`${HOME}/.vimrc`或`${HOME}/.vim/vimrc`。

*`vimrc`脚本注释使用双引号。*


```vimrc
" ============================================================================================ "
"                                          VIM 基础配置
" ============================================================================================ "
" 设置编码方式
set encoding=utf-8
" 自动判断编码时，依次尝试编码
set fileencodings=utf-8,gbk
" 双宽显示
set ambiwidth=double
" 行末结束符
set binary
set noeol
" 设置文件格式unix
set ff=unix

" 开启文件类型检查，并载入该类型对应的缩进规则(如.py文件加载，$HOME/.vim/intent/python.vim)
filetype on
" 这里使用统一缩进
filetype indent on
" 允许插件
filetype plugin on
" 启动智能补全(ctrl-p)
filetype plugin indent on

" 中文帮助文档
set helplang=cn
" 不与vi兼容，使用vim自己的命令
set nocompatible
" 所有模式下支持鼠标
set mouse=a
" 命令下发后时延
set notimeout

" 语法高亮
syntax enable
syntax on

" 显示行号
set number
" 显示光标所在当前行号，其他行相对于该行的行号
set relativenumber
if has("nvim-0.5.0") || has("patch-8.1.1564")
  set signcolumn=number
else
  set signcolumn=yes
endif

" 突出显示当前行
set cursorline
" 突出显示当前列
set cursorcolumn
" 显示括号匹配
set showmatch
" 高亮显示搜索结果
set hlsearch
exec "nohlsearch"
" 总是显示状态栏
set laststatus=2
" 自动定位到上次编辑的位置
au BufReadPost * if line("'\"") > 1 && line("'\"") <= line("$") | exe "normal! g'\"" | endif

" 显示不可见字符，并定制行尾空格、tab键显示符号
set list
set listchars=tab:>-,trail:-,precedes:«,extends:»

" 设置行宽
set textwidth=132
" 设置自动换行（单行字符超过行宽）
set wrap
" 设置遇到指定字符换行
set linebreak
" 遇到指定字符不换行
set iskeyword+=_,$,@,%,#,-
" 指定折行处与编辑窗口右边缘之间空处的字符数
set wrapmargin=2
" 垂直滚动时光标距离顶/底部行数
set scrolloff=3
" 水平滚动时光标距离行首/尾字符数(不折行时使用)
set sidescrolloff=5
" 分割窗口间显示空白
set fillchars=vert:\ ,stl:\ ,stlnc:\ 

" 显示标签栏
set showtabline=2
" 同时打开的标签页
set tabpagemax=15

" 命令行高度
set cmdheight=3
" 状态栏显示正在输入的命令
set showcmd

" 状态栏显示光标行列位置
set ruler
" 底部显示当前模式
set showmode

set nospell
" 英中日韩单词拼写检查
set spelllang=en_us,cjk

" 回车自动同上行缩进
set autoindent
" Tab缩进空格数
set tabstop=4
" 文本上增加/取消一级或者取消全部缩进时，每级字符数
set shiftwidth=4
" Tab转空格
set expandtab
" Tab转空格数
set softtabstop=4
" 按退格键一次删除4个空格
set smarttab
" 设置退格键可退到上一行
set backspace=indent,eol,start

" 搜索模式时，每输入一个字符自动跳到第1个匹配结果
set incsearch
" 搜索时忽略大小写
set ignorecase
" 配合ignorecase，只对第1个字母大小写敏感。搜Test不匹配test，但搜test匹配Test
set smartcase

" 设置历史记录条数
set history=66
" 等待300ms后无输入将交换文件写入磁盘
set updatetime=300
" 取消备份
set nobackup
" 禁止临时文件生成
set noswapfile

" 自动切换到当前文件目录
set autochdir
" 出错时发出响声
set errorbells
" 出错时发出视觉提示
set visualbell
" 编辑时文件发生外部变更，给出提示
set autoread
" 命令模式下，底部操作指令按Tab补全，第1次按显示所有匹配指令清单，第2次按以次选择各指令
set wildmenu
set wildmode=longest:list,full

set nofoldenable
set foldlevel=99
set foldmethod=indent

" y,p操作与系统粘贴板共享。配合vimx使用(安装vim-gtk)
set clipboard+=unnamed

" 启用256色
set t_Co=256
let &t_ut=''

" 根据自己的喜好修改配色方案
colorscheme murphy
set background=light


" 空格键引导
let g:mapleader=" "

map E :e<CR>
map S :w<CR>
map Q :q<CR>
map R :source $MYVIMRC<CR>

map <LEADER>sl :set splitright<CR>:vsplit<CR>
map <LEADER>sh :set nosplitright<CR>:vsplit<CR>
map <LEADER>sj :set splitbelow<CR>:split<CR>
map <LEADER>sk :set nosplitbelow<CR>:split<CR>
map <LEADER>h <C-w>h
map <LEADER>l <C-w>l
map <LEADER>j <C-w>j
map <LEADER>k <C-w>k
map <up> :resize +3<CR>
map <down> :resize -3<CR>
map <left> :vertical resize -3<CR>
map <right> :vertical resize +3<CR>
" 转竖直分屏
map <LEADER>sv <C-w>t<C-w>H
" 转水平分屏
map <LEADER>sh <C-w>t<C-w>K

" 新建标签
map <LEADER>te :tabe<CR>
" 下一个标签
map <LEADER>tj :+tabnext<CR>
" 上一个标签
map <LEADER>tk :-tabnext<CR>
" Tab切换下一个文件
map <TAB> :bn<CR>
" Shift+Tab切换上一个文件
map <S-TAB> :bp<CR>

" 拼写检查
nmap <LEADER>sc :set spell!<CR>

" Tab<->空格
nmap <LEADER>rt :%retab!<CR>

" 搜索高亮
nmap <LEADER>hl :set hlsearch!<CR>
" 关闭高亮
noremap <LEADER><CR> :nohlsearch<CR>

" 全选
map <C-A> ggVG
" 选中状态下复制
vmap <C-c> "+y
" 粘贴
vmap <C-p> "+p

" 当前分屏最大化
nmap <leader>z :call Zoom()<CR>
function! Zoom ()
    " check if is the zoomed state (tabnumber > 1 && window == 1)
    if tabpagenr('$') > 1 && tabpagewinnr(tabpagenr(), '$') == 1
        let l:cur_winview = winsaveview()
        let l:cur_bufname = bufname('')
        tabclose

        " restore the view
        if l:cur_bufname == bufname('')
            call winrestview(cur_winview)
        endif
    else
        tab split
    endif
endfunction
```

## vim帮助

- 官方手册: [vimhelp.org](https://vimhelp.org/)
- 翻译中文手册: [Vim 中文文档计划](https://yianwillis.github.io/vimcdoc/doc/help.html)
- vim脚本开发: [编写vim脚本](https://yianwillis.github.io/vimcdoc/doc/usr_41.html)

参考文章:
无。
