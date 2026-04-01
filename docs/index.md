---
title: Hono - 基于 Web 标准构建的 Web 框架
titleTemplate: ':title'
---

# Hono

Hono - _**在日语中意为火焰🔥**_ - 是一个小型、简单且超快的基于 Web 标准构建的 Web 框架。
它适用于任何 JavaScript 运行时：Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge 和 Node.js。

快速，但不止于快速。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## 快速开始

只需运行此命令：

::: code-group

```sh [npm]
npm create hono@latest
```

```sh [yarn]
yarn create hono
```

```sh [pnpm]
pnpm create hono@latest
```

```sh [bun]
bun create hono@latest
```

```sh [deno]
deno init --npm hono@latest
```

:::

## 特性

- **超快** 🚀 - 路由器 `RegExpRouter` 非常快。不使用线性循环。快。
- **轻量级** 🪶 - `hono/tiny` 预设小于 14kB。Hono 零依赖，仅使用 Web 标准。
- **多运行时** 🌍 - 适用于 Cloudflare Workers、Fastly Compute、Deno、Bun、AWS Lambda 或 Node.js。相同的代码可在所有平台上运行。
- **功能齐全** 🔋 - Hono 拥有内置中间件、自定义中间件、第三方中间件和辅助函数。功能齐全。
- **愉快的开发体验** 😃 - 超级清晰的 API。一流的 TypeScript 支持。现在，我们拥有了“类型”。

## 用例

Hono 是一个类似于 Express 的简单 Web 应用框架，不含前端。
但它运行在 CDN 边缘，并且结合中间件允许你构建更大的应用程序。
以下是一些用例示例。

- 构建 Web API
- 后端服务器代理
- CDN 前端
- 边缘应用
- 库的基础服务器
- 全栈应用

## 谁在使用 Hono？

| 项目                                                                             | 平台               | 用途？                                                                                                      |
| -------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| [cdnjs](https://cdnjs.com)                                                       | Cloudflare Workers | 一个免费开源的 CDN 服务。_Hono 用于 API 服务器_。                                                             |
| [Cloudflare D1](https://www.cloudflare.com/developer-platform/d1/)               | Cloudflare Workers | 无服务器 SQL 数据库。_Hono 用于内部 API 服务器_。                                                               |
| [Cloudflare Workers KV](https://www.cloudflare.com/developer-platform/workers-kv/) | Cloudflare Workers | 无服务器键值数据库。_Hono 用于内部 API 服务器_。                                                                |
| [BaseAI](https://baseai.dev)                                                     | Local AI Server    | 带有记忆的无服务器 AI 代理管道。一个用于 Web 的开源代理 AI 框架。_使用 Hono 的 API 服务器_。                     |
| [Unkey](https://unkey.dev)                                                       | Cloudflare Workers | 一个开源的 API 认证和授权平台。_Hono 用于 API 服务器_。                                                         |
| [OpenStatus](https://openstatus.dev)                                             | Bun                | 一个开源的网站和 API 监控平台。_Hono 用于 API 服务器_。                                                         |
| [Deno Benchmarks](https://deno.com/benchmarks)                                   | Deno               | 一个基于 V8 构建的安全 TypeScript 运行时。_Hono 用于基准测试_。                                                 |
| [Clerk](https://clerk.com)                                                       | Cloudflare Workers | 一个开源的用户管理平台。_Hono 用于 API 服务器_。                                                                |

以及以下项目。

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

想看更多？参见 [谁在生产环境中使用 Hono？](https://github.com/orgs/honojs/discussions/1510)。

## 1 分钟了解 Hono

使用 Hono 为 Cloudflare Workers 创建应用程序的演示。

![一个展示快速迭代创建 hono 应用的 gif。](/images/sc.gif)

## 超快

**Hono 是最快的**，相比其他 Cloudflare Workers 的路由器。

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
Fastest is Hono
✨  Done in 28.06s.
```

参见 [更多基准测试](/docs/concepts/benchmarks)。

## 轻量级

**Hono 非常小**。使用 `hono/tiny` 预设，其最小化后的大小**小于 14KB**。有许多中间件和适配器，但它们仅在使用时才会被打包。作为参考，Express 的大小为 572KB。

```
$ npx wrangler dev --minify ./src/index.ts
 ⛅️ wrangler 2.20.0
--------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.128.165:8787
Total Upload: 11.47 KiB / gzip: 4.34 KiB
```

## 多种路由器

**Hono 拥有多种路由器**。

**RegExpRouter** 是 JavaScript 世界中最快的路由器。它使用在调度前创建的单个大型正则表达式来匹配路由。配合 **SmartRouter**，它支持所有路由模式。

**LinearRouter** 注册路由非常快，因此适合每次初始化应用程序的环境。**PatternRouter** 简单地添加和匹配模式，使其小巧。

参见 [关于路由的更多信息](/docs/concepts/routers)。

## Web 标准

得益于使用 **Web 标准**，Hono 可在许多平台上运行。

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Deno
- Bun
- Vercel
- AWS Lambda
- Lambda@Edge
- 其他

并且通过使用 [Node.js 适配器](https://github.com/honojs/node-server)，Hono 可在 Node.js 上运行。

参见 [关于 Web 标准的更多信息](/docs/concepts/web-standard)。

## 中间件与辅助函数

**Hono 拥有许多中间件和辅助函数**。这使得“少写代码，多做事情”成为现实。

开箱即用，Hono 提供以下中间件和辅助函数：

- [基本认证](/docs/middleware/builtin/basic-auth)
- [Bearer 认证](/docs/middleware/builtin/bearer-auth)
- [Body 限制](/docs/middleware/builtin/body-limit)
- [缓存](/docs/middleware/builtin/cache)
- [压缩](/docs/middleware/builtin/compress)
- [上下文存储](/docs/middleware/builtin/context-storage)
- [Cookie](/docs/helpers/cookie)
- [CORS](/docs/middleware/builtin/cors)
- [ETag](/docs/middleware/builtin/etag)
- [html](/docs/helpers/html)
- [JSX](/docs/guides/jsx)
- [JWT 认证](/docs/middleware/builtin/jwt)
- [日志](/docs/middleware/builtin/logger)
- [语言](/docs/middleware/builtin/language)
- [美化 JSON](/docs/middleware/builtin/pretty-json)
- [安全 Headers](/docs/middleware/builtin/secure-headers)
- [SSG](/docs/helpers/ssg)
- [流式传输](/docs/helpers/streaming)
- [GraphQL 服务器](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Firebase 认证](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)
- 其他！

例如，使用 Hono 添加 ETag 和请求日志记录只需几行代码：

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use(etag(), logger())
```

参见 [关于中间件的更多信息](/docs/concepts/middleware)。

## 开发体验

Hono 提供愉快的"**开发体验**"。

得益于 `Context` 对象，可以轻松访问 Request/Response。
此外，Hono 是用 TypeScript 编写的。Hono 拥有"**类型**"。

例如，路径参数将是字面量类型。

![一张展示 Hono 在 URL 参数时拥有正确字面量类型的截图。URL "/entry/:date/:id" 允许请求参数为 "date" 或 "id"](/images/ss.png)

此外，Validator 和 Hono Client `hc` 启用了 RPC 模式。在 RPC 模式下，
你可以使用你喜欢的验证器（如 Zod），并轻松地将服务器端 API 规范共享给客户端，构建类型安全的应用程序。

参见 [Hono 技术栈](/docs/concepts/stacks)。
