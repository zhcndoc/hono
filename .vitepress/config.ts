import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'

const sidebars = (): DefaultTheme.SidebarItem[] => [
  {
    text: '概念',
    collapsed: true,
    items: [
      { text: '动机', link: '/docs/concepts/motivation' },
      { text: '路由器', link: '/docs/concepts/routers' },
      { text: '基准测试', link: '/docs/concepts/benchmarks' },
      { text: 'Web 标准', link: '/docs/concepts/web-standard' },
      { text: '中间件', link: '/docs/concepts/middleware' },
      {
        text: '开发体验',
        link: '/docs/concepts/developer-experience',
      },
      { text: 'Hono 技术栈', link: '/docs/concepts/stacks' },
    ],
  },
  {
    text: '快速开始',
    collapsed: true,
    items: [
      { text: '基础', link: '/docs/getting-started/basic' },
      {
        text: 'Cloudflare Workers',
        link: '/docs/getting-started/cloudflare-workers',
      },
      {
        text: 'Cloudflare Pages',
        link: '/docs/getting-started/cloudflare-pages',
      },
      { text: 'Deno', link: '/docs/getting-started/deno' },
      { text: 'Bun', link: '/docs/getting-started/bun' },
      {
        text: 'Fastly Compute',
        link: '/docs/getting-started/fastly',
      },
      { text: 'Vercel', link: '/docs/getting-started/vercel' },
      { text: 'Next.js', link: '/docs/getting-started/nextjs' },
      { text: 'Netlify', link: '/docs/getting-started/netlify' },
      {
        text: 'AWS Lambda',
        link: '/docs/getting-started/aws-lambda',
      },
      {
        text: 'Lambda@Edge',
        link: '/docs/getting-started/lambda-edge',
      },
      {
        text: 'Azure Functions',
        link: '/docs/getting-started/azure-functions',
      },
      {
        text: 'Google Cloud Run',
        link: '/docs/getting-started/google-cloud-run',
      },
      {
        text: 'Supabase Functions',
        link: '/docs/getting-started/supabase-functions',
      },
      {
        text: '阿里云函数计算',
        link: '/docs/getting-started/ali-function-compute',
      },
      {
        text: 'WebAssembly',
        link: '/docs/getting-started/webassembly-wasi',
      },
      {
        text: 'Service Worker',
        link: '/docs/getting-started/service-worker',
      },
      { text: 'Node.js', link: '/docs/getting-started/nodejs' },
    ],
  },
  {
    text: 'API',
    collapsed: true,
    items: [
      { text: '应用', link: '/docs/api/hono' },
      { text: '路由', link: '/docs/api/routing' },
      { text: '上下文', link: '/docs/api/context' },
      { text: 'HonoRequest', link: '/docs/api/request' },
      { text: '异常', link: '/docs/api/exception' },
      { text: '预设', link: '/docs/api/presets' },
    ],
  },
  {
    text: '指南',
    collapsed: true,
    items: [
      { text: '创建 Hono', link: '/docs/guides/create-hono' },
      { text: '中间件', link: '/docs/guides/middleware' },
      { text: '辅助工具', link: '/docs/guides/helpers' },
      {
        text: 'JSX',
        link: '/docs/guides/jsx',
      },
      {
        text: '客户端组件',
        link: '/docs/guides/jsx-dom',
      },
      { text: '测试', link: '/docs/guides/testing' },
      {
        text: '验证',
        link: '/docs/guides/validation',
      },
      {
        text: 'RPC',
        link: '/docs/guides/rpc',
      },
      {
        text: '最佳实践',
        link: '/docs/guides/best-practices',
      },
      {
        text: '其他',
        link: '/docs/guides/others',
      },
      {
        text: '常见问题',
        link: '/docs/guides/faq',
      },
    ],
  },
  {
    text: '辅助工具',
    collapsed: true,
    items: [
      { text: 'Accepts', link: '/docs/helpers/accepts' },
      { text: '适配器', link: '/docs/helpers/adapter' },
      { text: 'ConnInfo', link: '/docs/helpers/conninfo' },
      { text: 'Cookie', link: '/docs/helpers/cookie' },
      { text: 'css', link: '/docs/helpers/css' },
      { text: '开发', link: '/docs/helpers/dev' },
      { text: '工厂', link: '/docs/helpers/factory' },
      { text: 'html', link: '/docs/helpers/html' },
      { text: 'JWT', link: '/docs/helpers/jwt' },
      { text: '代理', link: '/docs/helpers/proxy' },
      { text: '路由', link: '/docs/helpers/route' },
      { text: 'SSG', link: '/docs/helpers/ssg' },
      { text: '流式传输', link: '/docs/helpers/streaming' },
      { text: '测试', link: '/docs/helpers/testing' },
      { text: 'WebSocket', link: '/docs/helpers/websocket' },
    ],
  },
  {
    text: '中间件',
    collapsed: true,
    items: [
      {
        text: '基础认证',
        link: '/docs/middleware/builtin/basic-auth',
      },
      {
        text: 'Bearer 认证',
        link: '/docs/middleware/builtin/bearer-auth',
      },
      {
        text: '请求体限制',
        link: '/docs/middleware/builtin/body-limit',
      },
      { text: '缓存', link: '/docs/middleware/builtin/cache' },
      { text: '组合', link: '/docs/middleware/builtin/combine' },
      { text: '压缩', link: '/docs/middleware/builtin/compress' },
      {
        text: '上下文存储',
        link: '/docs/middleware/builtin/context-storage',
      },
      { text: 'CORS', link: '/docs/middleware/builtin/cors' },
      {
        text: 'CSRF 防护',
        link: '/docs/middleware/builtin/csrf',
      },
      { text: 'ETag', link: '/docs/middleware/builtin/etag' },
      {
        text: 'IP 限制',
        link: '/docs/middleware/builtin/ip-restriction',
      },
      {
        text: 'JSX 渲染器',
        link: '/docs/middleware/builtin/jsx-renderer',
      },
      { text: 'JWK', link: '/docs/middleware/builtin/jwk' },
      { text: 'JWT', link: '/docs/middleware/builtin/jwt' },
      { text: '日志', link: '/docs/middleware/builtin/logger' },
      { text: '语言', link: '/docs/middleware/builtin/language' },
      {
        text: '方法覆盖',
        link: '/docs/middleware/builtin/method-override',
      },
      {
        text: '格式化 JSON',
        link: '/docs/middleware/builtin/pretty-json',
      },
      {
        text: '请求 ID',
        link: '/docs/middleware/builtin/request-id',
      },
      {
        text: '安全 Headers',
        link: '/docs/middleware/builtin/secure-headers',
      },
      { text: '超时', link: '/docs/middleware/builtin/timeout' },
      { text: '计时', link: '/docs/middleware/builtin/timing' },
      {
        text: '尾部斜杠',
        link: '/docs/middleware/builtin/trailing-slash',
      },
      {
        text: '第三方中间件',
        link: '/docs/middleware/third-party',
      },
    ],
  },
  {
    text: '大语言模型',
    collapsed: true,
    items: [
      {
        text: '文档列表',
        link: '/llms.txt',
      },
      {
        text: '完整文档',
        link: '/llms-full.txt',
      },
      {
        text: '精简文档',
        link: '/llms-small.txt',
      },
    ],
  },
]

export const sidebarsExamples = (): DefaultTheme.SidebarItem[] => [
  {
    text: '应用',
    items: [
      {
        text: 'Web API',
        link: '/examples/web-api',
      },
      {
        text: '代理',
        link: '/examples/proxy',
      },
      {
        text: '文件上传',
        link: '/examples/file-upload',
      },
      {
        text: '挂载到反向代理后面',
        link: '/examples/behind-reverse-proxy',
      },
      {
        text: 'Validator 中的错误处理',
        link: '/examples/validator-error-handling',
      },
      {
        text: '为 RPC 分组路由',
        link: '/examples/grouping-routes-rpc',
      },
      {
        text: 'CBOR',
        link: '/examples/cbor',
      },
    ],
  },
  {
    text: '第三方中间件',
    items: [
      {
        text: 'Zod OpenAPI',
        link: '/examples/zod-openapi',
      },
      {
        text: 'Hono OpenAPI',
        link: '/examples/hono-openapi',
      },
      {
        text: 'Swagger UI',
        link: '/examples/swagger-ui',
      },
      {
        text: 'Scalar',
        link: '/examples/scalar',
      },
      {
        text: 'Hono Docs Generator',
        link: '/examples/hono-docs',
      },
    ],
  },
  {
    text: '集成',
    items: [
      {
        text: 'Cloudflare Durable Objects',
        link: '/examples/cloudflare-durable-objects',
      },
      {
        text: 'Cloudflare 队列',
        link: '/examples/cloudflare-queue',
      },
      {
        text: 'Cloudflare 测试',
        link: '/examples/cloudflare-vitest',
      },
      {
        text: 'Remix',
        link: '/examples/with-remix',
      },
      {
        text: 'htmx',
        link: '/examples/htmx',
      },
      {
        text: 'Stripe Webhook',
        link: '/examples/stripe-webhook',
      },
      {
        text: 'Cloudflare 上的 Prisma',
        link: '/examples/prisma',
      },
      {
        text: 'Better Auth',
        link: '/examples/better-auth',
      },
      {
        text: 'Cloudflare 上的 Better Auth',
        link: '/examples/better-auth-on-cloudflare',
      },
      {
        text: 'Pylon (GraphQL)',
        link: '/examples/pylon',
      },
      {
        text: 'Stytch 认证',
        link: '/examples/stytch-auth',
      },
      {
        text: 'Auth.js',
        link: '/examples/hono-authjs',
      },
      {
        text: 'Apitally（监控）',
        link: '/examples/apitally',
      },
    ],
  },
]

export default defineConfig({
  lang: 'zh-CN',
  title: 'Hono 中文文档',
  description:
    '基于 Web 标准构建的 Web 框架，面向 Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Node.js 等运行时。快，但不只是快。',
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      md.use(groupIconMdPlugin)
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
      }),
    ],
  },
  themeConfig: {
    logo: '/images/logo.svg',
    siteTitle: 'Hono 中文文档',
    algolia: {
      appId: '04WSDC4498',
      apiKey: '0f50800a0259ea0c643adab3e4fbca66',
      indexName: 'hono',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'x', link: 'https://x.com/honojs' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/hono.dev' },
    ],
    editLink: {
      pattern: 'https://github.com/zhcndoc/hono/edit/main/:path',
      text: '在 GitHub 上编辑此页',
    },
    footer: {
      message: `<a style="text-decoration: none;" target="_blank" href="https://www.zhcndoc.com">简中文档</a> | <a style="text-decoration: none;" rel="nofollow" target="_blank" href="https://beian.miit.gov.cn">沪ICP备2024070610号-3</a>`,
      copyright:
        'Copyright © 2022-present Yusuke Wada & Hono contributors. "kawaii" logo is created by SAWARATSUKI.',
    },
    nav: [
      { text: '文档', link: '/docs/' },
      { text: '示例', link: '/examples/' },
      {
        text: '简中文档',
        link: 'https://www.zhcndoc.com',
      },
    ],
    sidebar: {
      '/': sidebars(),
      '/examples/': sidebarsExamples(),
    },
  },
  head: [
    ['script', { async: '', src: 'https://www.zhcndoc.com/js/common.js' }],
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://hono.zhcndoc.com/images/hono-title.png',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'twitter:domain', content: 'hono.zhcndoc.com' }],
    [
      'meta',
      {
        property: 'twitter:image',
        content: 'https://hono.zhcndoc.com/images/hono-title.png',
      },
    ],
    [
      'meta',
      { property: 'twitter:card', content: 'summary_large_image' },
    ],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  transformHead(context) {
    const relativePath = context.pageData.relativePath
    const head: Array<[string, Record<string, string>]> = []
    if (relativePath === 'index.md') {
      head.push([
        'link',
        {
          rel: 'alternate',
          type: 'text/plain',
          title: 'LLM docs',
          href: 'https://hono.zhcndoc.com/llms.txt',
        },
      ])
    }
    if (relativePath.startsWith('docs/') || relativePath.startsWith('examples/')) {
      head.push([
        'link',
        {
          rel: 'alternate',
          type: 'text/markdown',
          title: 'Markdown source',
          href: `https://raw.githubusercontent.com/honojs/website/refs/heads/main/${relativePath}`,
        },
      ])
    }
    return head
  },
  titleTemplate: ':title - Hono 中文文档',
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cloudflare: 'logos:cloudflare-workers-icon',
        },
      }),
    ],
    server: {
      allowedHosts: true,
    },
  },
})
