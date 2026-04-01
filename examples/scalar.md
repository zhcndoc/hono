# Scalar

[Scalar](https://guides.scalar.com/scalar/scalar-api-references/integrations/hono) 提供了一种简单方式，帮助你基于 OpenAPI/Swagger 文档在 Hono 中渲染精美的 API 参考页。

## 安装

```bash
npm install @scalar/hono-api-reference
```

## 用法

先配置 [Zod OpenAPI Hono](/examples/zod-openapi) 或 [Hono OpenAPI](/examples/hono-openapi)，然后把配置好的 URL 传给 `Scalar` 中间件：

```ts
import { Hono } from 'hono'
import { Scalar } from '@scalar/hono-api-reference'

const app = new Hono()

// Use the middleware to serve the Scalar API Reference at /scalar
app.get('/scalar', Scalar({ url: '/doc' }))

// Or with dynamic configuration
app.get(
  '/scalar',
  Scalar((c) => {
    return {
      url: '/doc',
      proxyUrl:
        c.env.ENVIRONMENT === 'development'
          ? 'https://proxy.scalar.com'
          : undefined,
    }
  })
)

export default app
```

### 主题

该中间件为 Hono 提供了自定义主题。你可以使用[其他预定义主题](https://github.com/scalar/scalar/blob/main/packages/themes/src/index.ts#L15) 之一（`alternate`、`default`、`moon`、`purple`、`solarized`），或者将其覆盖为 `none`。所有主题都同时提供浅色和深色配色方案。

```ts
import { Scalar } from '@scalar/hono-api-reference'

// Switch the theme (or pass other options)
app.get(
  '/scalar',
  Scalar({
    url: '/doc',
    theme: 'purple',
  })
)
```

### 自定义页面标题

还有一个额外选项可以设置页面标题：

```ts
import { Scalar } from '@scalar/hono-api-reference'

// Set a page title
app.get(
  '/scalar',
  Scalar({
    url: '/doc',
    pageTitle: 'Awesome API',
  })
)
```

### 自定义 CDN

你可以使用自定义 CDN，默认值为 `https://cdn.jsdelivr.net/npm/@scalar/api-reference`。

你也可以通过在 CDN 字符串中指定版本来固定到某个特定版本，例如 `https://cdn.jsdelivr.net/npm/@scalar/api-reference@1.25.28`。

你可以在[这里](https://www.jsdelivr.com/package/npm/@scalar/api-reference?tab=files)找到所有可用的 CDN 版本。

```ts
import { Scalar } from '@scalar/hono-api-reference'

app.get('/scalar', Scalar({ url: '/doc', pageTitle: 'Awesome API' }))

app.get(
  '/scalar',
  Scalar({
    url: '/doc',
    cdn: 'https://cdn.jsdelivr.net/npm/@scalar/api-reference@latest',
  })
)
```

### 面向 LLM 的 Markdown

如果你想为 API 参考生成一个 Markdown 版本（供 LLM 使用），请安装 `@scalar/openapi-to-markdown`：

```bash
npm install @scalar/openapi-to-markdown
```

并为它添加一个额外路由：

```ts
import { Hono } from 'hono'
import { createMarkdownFromOpenApi } from '@scalar/openapi-to-markdown'

const app = new Hono()

// 从 OpenAPI 文档生成 Markdown
const markdown = await createMarkdownFromOpenApi(content)

/**
 * 注册一个用于向 LLM 提供 Markdown 的路由
 *
 * 问：为什么是 /llms.txt？
 * 答：这是一个提议，用于统一使用 /llms.txt 文件。
 *
 * @see https://llmstxt.org/
 */
app.get('/llms.txt', (c) => c.text(markdown))

export default app
```

或者，如果你正在使用 Zod OpenAPI Hono：

```ts
// Get the OpenAPI document
const content = app.getOpenAPI31Document({
  openapi: '3.1.0',
  info: { title: 'Example', version: 'v1' },
})

const markdown = await createMarkdownFromOpenApi(
  JSON.stringify(content)
)

app.get('/llms.txt', async (c) => {
  return c.text(markdown)
})
```
