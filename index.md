---
title: Hono 中文文档 - 基于 Web 标准构建的 Web 框架
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono 是一个小巧、简单、极速的基于 Web 标准构建的 Web 框架。它可运行在 Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge 和 Node.js 上。快，但不只是快。',
      },
    ]
layout: home
hero:
  name: Hono
  text: Web 应用框架
  tagline: 快速、轻量、基于 Web 标准。支持任何 JavaScript 运行时。
  image:
    src: /images/code.webp
    alt: "Hono 代码示例。 \
      import { Hono } from 'hono' \
      const app = new Hono() \
      app.get('/', (c) => c.text('Hello Hono!')) \

      export default app"
  actions:
    - theme: brand
      text: 开始使用
      link: /docs/
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/honojs/hono
features:
  - icon: 🚀
    title: 极速且轻量
    details: 路由 RegExpRouter 非常快。hono/tiny 预设不到 14kB。仅使用 Web 标准 API。
  - icon: 🌍
    title: 多运行时
    details: 可运行于 Cloudflare、Fastly、Deno、Bun、AWS 或 Node.js。相同的代码可在所有平台上运行。
  - icon: 🔋
    title: 开箱即用
    details: Hono 内置中间件、自定义中间件、第三方中间件和辅助工具。开箱即用。
  - icon: 😃
    title: 令人愉悦的 DX
    details: 极其简洁的 API。一流的 TypeScript 支持。现在，我们还有“Types”。
---

<script setup>
// 深受 React 启发
// https://github.com/reactjs/react.dev/pull/6817
import { onMounted } from 'vue'
onMounted(() => {
  var preferredKawaii
  try {
    preferredKawaii = localStorage.getItem('kawaii')
  } catch (err) {}
  const urlParams = new URLSearchParams(window.location.search)
  const kawaii = urlParams.get('kawaii')
  const setKawaii = () => {
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/images/hono-kawaii.png'
      img.alt = 'Hono 标志的萌系版本。第一个 "o" 被火焰替代，右下角有日文字符，火焰上方有一个 JSX 片段闭合标签。'
      img.classList.add("kawaii")
    })
  }
  if (kawaii === 'true') {
    try {
      localStorage.setItem('kawaii', true)
    } catch (err) {}
    console.log('已启用 kawaii 模式。logo 归功于 @sawaratsuki1004，来源：https://github.com/SAWARATSUKI/KawaiiLogos');
    setKawaii()
  } else if (kawaii === 'false') {
    try {
      localStorage.removeItem('kawaii', false)
    } catch (err) {}
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/images/code.webp'
      img.classList.remove("kawaii")
    })
  } else if (preferredKawaii) {
    setKawaii()
  }
})
</script>
