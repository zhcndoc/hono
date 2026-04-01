# Hono Docs

> 根据 Hono 路由类型定义自动生成 OpenAPI 3.0 规范和 TypeScript 类型快照

[Hono Docs](https://github.com/Rcmade/hono-docs) 为 Hono 提供自动生成的 OpenAPI 文档。

## **在项目根目录创建配置文件**（`hono-docs.ts`）

```ts
import { defineConfig } from '@rcmade/hono-docs'

export default defineConfig({
  tsConfigPath: './tsconfig.json',
  openApi: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  outputs: {
    openApiJson: './openapi/openapi.json',
  },
  apis: [
    {
      name: 'Auth Routes',
      apiPrefix: '/auth', // This will be prepended to all `api` values below
      appTypePath: 'src/routes/authRoutes.ts', // Path to your AppType export

      api: [
        // ✅ Custom OpenAPI metadata for the GET /auth/u/{id} endpoint
        {
          api: '/u/{id}', // Final route = /auth/u/{id}
          method: 'get',
          summary: 'Fetch user by ID', // Optional: title shown in docs
          description:
            'Returns a user object based on the provided ID.',
          tag: ['User'],
        },

        // ✅ Another example with metadata for GET /auth
        {
          api: '/', // Final route = /auth/
          method: 'get',
          summary: 'Get current user',
          description:
            "Returns the currently authenticated user's information.",
          tag: ['User Info'],
        },
      ],
    },
  ],
})
```

### **路由定义与 AppType**

这个库仅支持通过路由文件中的单个 AppType 导出来处理“变更路由”。你**必须**导出：

```ts
export type AppType = typeof yourRoutesVariable
```

**示例：**

```ts
// src/routes/userRoutes.ts
import { Hono } from 'hono'
import * as z from 'zod'

export const userRoutes = new Hono()
  .get('/u/:id', (c) => {
    /* … */
  })
  .post('/', async (c) => {
    /* … */
  })
// Must add AppType
export type AppType = typeof userRoutes
export default userRoutes
```

挂载到你的 Hono 应用中：

```ts
// src/routes/docs.ts
import { Hono } from 'hono'
import { Scalar } from '@scalar/hono-api-reference'
import fs from 'node:fs/promises'
import path from 'node:path'

const docs = new Hono()
  .get(
    '/',
    Scalar({
      url: '/api/docs/open-api',
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: { targetKey: 'js', clientKey: 'axios' },
    })
  )
  .get('/open-api', async (c) => {
    const raw = await fs.readFile(
      path.join(process.cwd(), './openapi/openapi.json'),
      'utf-8'
    )
    return c.json(JSON.parse(raw))
  })

export type AppType = typeof docs
export default docs
```

访问 `/api/docs` 会显示 UI；`/api/docs/open-api` 会提供 JSON。

在你**创建好**配置后，可以用以下命令生成规范：

```bash
npx @rcmade/hono-docs generate --config ./hono-docs.ts
```

## CLI 用法

```text
Usage: @rcmade/hono-docs generate --config <your hono-docs.ts path (default root/hono-docs.ts)>

Options:
  -c, --config   Path to your config file (TS or JS)        [string] [required]
  -h, --help     Show help                                 [boolean]
```

## 示例

查看 [`examples/basic-app/`](https://github.com/rcmade/hono-docs/tree/main/examples/basic-app) 以了解最小配置示例。
