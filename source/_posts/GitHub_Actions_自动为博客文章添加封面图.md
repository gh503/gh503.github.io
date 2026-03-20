---
thumbnail:
title: GitHub Actions 自动为博客文章添加封面图
date: 2025-03-20
tags: 
- GitHub Actions
- Hexo
- Pexels
- 自动化
- 图床
categories: 
- 技术教程
- 自动化
toc: true
recommend: 1
keywords: 
uniqueId: 2025-03-20/github-actions-auto-cover-image.html
mathJax: false
---

> 
<!-- more -->

本文介绍如何利用 GitHub Actions 实现博客文章封面图的自动化获取和引用，无需手动寻找和上传图片。

## 背景

写博客时，为文章添加一张合适的封面图可以大幅提升阅读体验。但手动寻找免费图片、下载、上传到图床、获取链接、再引用到文章中，是一个繁琐的过程。

本文介绍一种全自动化的解决方案：
1. 推送博客文章 → GitHub Actions 自动触发
2. 根据文章标题和标签自动搜索 Pexels 免费图片
3. 下载图片并上传到 GitHub 图床
4. 自动更新文章的 thumbnail 和正文引用
5. 触发 Hexo 部署

## 整体架构

```
Obsidian (撰写)
    ↓ push
GitHub (Obsidian 仓库)
    ↓ Actions
同步博客文章到 hexo 仓库
    ↓
自动获取 Pexels 图片
    ↓
上传到 GitHub 图床
    ↓
更新文章封面图引用
    ↓
Hexo 部署发布
```

## 所需工具

### 1. Pexels API

[Pexels](https://www.pexels.com/) 提供超过 300 万张高质量免费商用图片，通过 API 可以程序化搜索和下载。

注册获取 API Key：
1. 访问 [Pexels API](https://www.pexels.com/api/)
2. 注册账号并申请 API Key
3. 免费版每天可下载 200 张图片

### 2. GitHub 图床

利用 GitHub 仓库存储图片，配合 jsDelivr CDN 加速访问：

```yaml
# 图片 URL 格式
https://cdn.jsdelivr.net/gh/{username}/{repo}/{path}/image.jpg
```

### 3. GitHub Actions

CI/CD 平台，用于自动化工作流程。

## 配置步骤

### 1. 添加 GitHub Secrets

在 Obsidian 仓库的 Settings → Secrets and variables → Actions 中添加：

| Secret 名称 | 说明 |
|-------------|------|
| `PAT_TOKEN` | Personal Access Token（需 repo 权限）|
| `PEXELS_API_KEY` | Pexels API Key |

### 2. 创建 Workflow

在 `.github/workflows/sync-to-blog.yml` 中定义工作流程：

```yaml
name: Sync Obsidian Blog Posts to Hexo

on:
  push:
    branches:
      - master
    paths:
      - 'blog/**'

concurrency:
  group: sync-blog-${{ github.ref }}
  cancel-in-progress: true

env:
  BLOG_REPO: yourname/your-blog-repo
  SOURCE_DIR: blog
  TARGET_DIR: source/_posts
  IMAGES_DIR: source/images

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout knowledge base
        uses: actions/checkout@v4
        with:
          path: obsidian-repo
          fetch-depth: 1
          ref: master

      - name: Checkout blog repository
        uses: actions/checkout@v4
        with:
          repository: ${{ env.BLOG_REPO }}
          token: ${{ secrets.PAT_TOKEN }}
          path: blog-repo
          fetch-depth: 1
          ref: main

      - name: Sync blog posts
        run: |
          # 同步文章逻辑...

  fetch-images:
    needs: sync
    runs-on: ubuntu-latest
    steps:
      - name: Fetch images from Pexels
        env:
          PEXELS_API_KEY: ${{ secrets.PEXELS_API_KEY }}
        run: |
          # 1. 遍历文章
          for md_file in ${{ env.TARGET_DIR }}/*.md; do
            # 2. 提取标题作为搜索关键词
            title=$(grep -m1 "^title:" "$md_file" | sed 's/title: *//')
            
            # 3. 搜索 Pexels
            response=$(curl -s -H "Authorization: $PEXELS_API_KEY" \
              "https://api.pexels.com/v1/search?query=$title&per_page=1")
            
            # 4. 下载图片
            img_url=$(echo "$response" | jq -r '.photos[0].src.large2x')
            curl -s -L "$img_url" -o "${{ env.IMAGES_DIR }}/cover.jpg"
            
            # 5. 更新文章
            cdn_url="https://cdn.jsdelivr.net/gh/${{ env.BLOG_REPO }}/..."
            sed -i "/^title:/a thumbnail: $cdn_url" "$md_file"
          done
```

### 3. 图片搜索策略

根据文章内容自动选择搜索关键词，支持中文标题和英文标签：

```bash
# 1. 提取文章标题
title=$(grep -m1 "^title:" "$md_file" | sed 's/title: *//')

# 2. 提取英文标签（最多3个组合）
tags_line=$(grep -A 10 "^tags:" "$md_file" | grep -E "^\s+-\s+" | sed 's/^\s*-\s*//')
for tag in $tags_line; do
  # 找第一个英文标签
  if echo "$tag" | grep -qE '^[a-zA-Z]'; then
    search_keyword="$tag"
    break
  fi
done

# 3. 如果没有英文标签，从标题提取英文单词
if [ -z "$search_keyword" ]; then
  search_keyword=$(echo "$title" | grep -oE '[a-zA-Z][a-zA-Z0-9]*' | head -5 | tr '\n' ' ')
fi

# 4. 使用分页获取不同图片
response=$(curl -s -H "Authorization: $PEXELS_API_KEY" \
  "https://api.pexels.com/v1/search?query=$search_keyword&per_page=1&page=$page_index")
```

**搜索优先级：**
1. 英文标签（如 Ubuntu、Git、Linux）
2. 标题中的英文单词（如 "Ubuntu Obsidian Ollama"）
3. 通用关键词（technology computer）

## 工作流程详解

### 第一阶段：同步文章

```bash
# 1. 克隆两个仓库
- 源：Obsidian 知识库
- 目标：Hexo 博客仓库

# 2. 复制文章
for file in blog/*.md; do
  cp "$file" hexo/source/_posts/
done
```

### 第二阶段：获取封面图

```bash
# 1. 遍历所有文章
page_index=1
for md_file in source/_posts/*.md; do
  
  # 2. 检查是否已有封面图
  current_thumbnail=$(grep "^thumbnail:" "$md_file" | head -1 | sed 's/thumbnail: *//')
  if [ -n "$current_thumbnail" ]; then
    continue  # 跳过已有封面的文章
  fi
  
  # 3. 提取英文标签作为搜索关键词
  tags_line=$(grep -A 10 "^tags:" "$md_file" | grep -E "^\s+-\s+" | sed 's/^\s*-\s*//')
  search_keyword=""
  for tag in $tags_line; do
    if echo "$tag" | grep -qE '^[a-zA-Z]'; then
      search_keyword="$tag"
      break
    fi
  done
  
  # 4. 如果没有英文标签，从标题提取英文单词
  if [ -z "$search_keyword" ]; then
    title=$(grep "^title:" "$md_file" | head -1)
    search_keyword=$(echo "$title" | grep -oE '[a-zA-Z][a-zA-Z0-9]*' | head -5 | tr '\n' ' ')
  fi
  
  # 5. 调用 Pexels API（使用分页获取不同图片）
  response=$(curl -s -H "Authorization: $PEXELS_API_KEY" \
    "https://api.pexels.com/v1/search?query=$search_keyword&per_page=1&page=$page_index")
  
  # 6. 解析响应
  img_url=$(echo "$response" | jq -r '.photos[0].src.large2x')
  photographer=$(echo "$response" | jq -r '.photos[0].photographer')
  
  # 7. 下载图片
  filename=$(basename "$md_file" .md | tr -cd 'a-zA-Z0-9' | cut -c1-30)_cover.jpg
  curl -s -L "$img_url" -o "source/images/$filename"
  
  # 8. 更新文章 frontmatter
  cdn_url="https://cdn.jsdelivr.net/gh/user/repo/images/$filename"
  sed -i '/^thumbnail:/d' "$md_file"
  sed -i "/^title:/a thumbnail: $cdn_url" "$md_file"
  
  ((page_index++))
done
```

### 第三阶段：部署发布

```bash
# 提交图片和更新的文章
git add images/ _posts/
git commit -m "📷 Auto-add cover images"
git push

# 触发 Hexo 部署
bash deploy.sh
```

## 效果展示

运行 workflow 后，在 Step Summary 中会生成图片报告：

| Post | Cover | Photographer |
|------|-------|-------------|
| Ubuntu搭建指南.md | ![](https://cdn.jsdelivr.net/gh/.../Ubuntu搭建指南_cover.jpg) | Skylar Kang |
| Vim配置教程.md | ![](https://cdn.jsdelivr.net/gh/.../Vim配置教程_cover.jpg) | RealToughCandy.com |

## 本地开发工具

除了 GitHub Actions，还提供了本地脚本方便开发和调试：

```bash
# 安装
git clone https://github.com/yourname/scripts
chmod +x img-fetch.sh

# 使用
./img-fetch.sh "ubuntu desktop" -n 5
```

本地脚本功能：
- Pexels 图片搜索
- 批量下载
- 自动上传到图床
- 输出 Markdown 引用

## 常见问题

### Q1: 图片下载失败怎么办？

检查：
1. PEXELS_API_KEY 是否正确配置
2. API 配额是否用完（免费版每天 200 次）
3. 网络连接是否正常

### Q2: 封面图不理想？

解决方案：
1. 使用 `workflow_dispatch` 手动触发，指定关键词
2. 手动设置 `thumbnail:` 字段，workflow 会跳过已有封面的文章
3. 设置 `force_refresh: true` 强制重新获取

### Q3: 图片搜索失败？

如果看到 `❌ No images found`，可能原因：
1. **中文关键词** - Pexels 不支持中文搜索，workflow 会自动提取英文标签或单词
2. **文章已有封面** - workflow 会跳过已有 thumbnail 的文章

### Q4: 如何更换图床？

修改 workflow 中的 CDN 地址：
```bash
# GitHub + jsDelivr
cdn_url="https://cdn.jsdelivr.net/gh/${{ env.BLOG_REPO }}/..."

# 替换为其他图床
cdn_url="https://your-cdn.com/images/$filename"
```

## 总结

通过 GitHub Actions 实现的自动化流程：
- ✅ 推送文章自动获取封面图
- ✅ 智能识别英文标签和关键词
- ✅ 分页获取确保图片不重复
- ✅ 自动引用到文章中
- ✅ 支持 Pexels 百万级免费图片库
- ✅ 利用 GitHub 免费图床 + jsDelivr CDN

整个流程零人工干预，让创作者专注于内容本身。

---
*参考文章: [Pexels API](https://www.pexels.com/api/)*
