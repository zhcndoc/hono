# Hono OpenAPI

[hono-openapi](https://github.com/rhinobase/hono-openapi) 是一个 _中间件_，它通过集成 Zod、Valibot、ArkType、TypeBox 以及所有支持 [Standard Schema](https://standardschema.dev/) 的库，为你的 Hono API 自动生成 OpenAPI 文档。

## 🛠️ 安装

将该包与您偏好的验证库及其依赖一起安装：

```bash
npm install hono-openapi @hono/standard-validator
```

在本指南中，我们将使用 `valibot`

```bash
npm install valibot @valibot/to-json-schema
```

你可以在这里了解更多安装信息 - <https://honohub.dev/docs/openapi#installation>

---

## 🚀 快速开始

### 1. 定义你的 Schema

使用你偏好的验证库定义请求和响应的 schema。下面以 Valibot 为例：

```ts
import * as v from 'valibot'

const querySchema = v.object({
  name: v.optional(v.string()),
})

const responseSchema = v.string()
```

---

### 2. 创建路由

使用 `describeRoute` 为路由添加文档和校验：

```ts
import { Hono } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'

const app = new Hono()

app.get(
  '/',
  describeRoute({
    description: 'Say hello to the user',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'text/plain': { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  validator('query', querySchema),
  (c) => {
    const query = c.req.valid('query')
    return c.text(`Hello ${query?.name ?? 'Hono'}!`)
  }
)
```

> **注意：**  
> 当使用 `hono-openapi` 中的 `validator()` 时，添加到 `query`、`json`、`param` 或 `form` 的任何校验都会自动包含在 OpenAPI 请求 schema 中。  
> 无需在 `describeRoute()` 中手动定义请求参数。

---

### 3. 生成 OpenAPI 规范

为你的 OpenAPI 文档添加一个端点：

```ts
import { openAPIRouteHandler } from 'hono-openapi'

app.get(
  '/openapi',
  openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Greeting API',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
      ],
    },
  })
)
```

---

想了解更多，请查看文档 - <https://honohub.dev/docs/openapi>
