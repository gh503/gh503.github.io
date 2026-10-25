#!/usr/bin/env node
/**
 * 构建后处理（在 `hexo generate` 之后跑）：
 *
 * 1. 把 landing/index.html 放到站点根：https://gh503.github.io/ 是个人主页
 * 2. 博客整体搬到 /blog 下，为了不让老链接 404，为每个页面在旧路径
 *    （如 /2026/03/23/9ef23a8df771/）写一个跳转页
 *
 * 用法：npm run build（= hexo clean && hexo generate && node scripts/postbuild.js）
 */
'use strict';

const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const blogDir = path.join(publicDir, 'blog');

/** 站点根的个人主页 */
function copyLanding() {
    const src = path.join(rootDir, 'landing', 'index.html');
    if (!fs.existsSync(src)) {
        throw new Error(`找不到主页文件：${src}`);
    }
    fs.mkdirSync(publicDir, { recursive: true });
    fs.copyFileSync(src, path.join(publicDir, 'index.html'));
    console.log('[postbuild] 个人主页 -> public/index.html');
}

/**
 * 递归找出博客下所有的 index.html，返回相对 public/blog 的目录路径。
 * 例：public/blog/2026/03/23/abc/index.html -> "2026/03/23/abc"
 */
function findPages(dir, rel = '') {
    const out = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const childRel = rel ? `${rel}/${entry.name}` : entry.name;
        const childAbs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            out.push(...findPages(childAbs, childRel));
        } else if (entry.name === 'index.html' && rel) {
            out.push(rel);
        }
    }
    return out;
}

function redirectHtml(target) {
    const href = target.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<title>页面已迁移</title>
<link rel="canonical" href="${href}">
<meta name="robots" content="noindex">
<meta http-equiv="refresh" content="0; url=${href}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
</head>
<body>
<p>这个页面已经搬到 <a href="${href}">${href}</a>，正在跳转……</p>
</body>
</html>
`;
}

/** 老路径 -> /blog/... 的跳转页（不含博客首页，根路径留给个人主页） */
function writeRedirects() {
    if (!fs.existsSync(blogDir)) {
        throw new Error(`找不到博客产物：${blogDir}（hexo generate 没跑？）`);
    }
    const pages = findPages(blogDir);
    let count = 0;
    for (const rel of pages) {
        const target = encodeURI(`/blog/${rel}/`);
        const outDir = path.join(publicDir, rel);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(path.join(outDir, 'index.html'), redirectHtml(target), 'utf8');
        count += 1;
    }
    console.log(`[postbuild] 旧链接跳转页 ${count} 个`);
}

copyLanding();
writeRedirects();