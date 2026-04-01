# Zod OpenAPI

[Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) 是一个支持 OpenAPI 的扩展 Hono 类。
借助它，你可以使用 [Zod](https://zod.dev/) 校验值和类型，并生成 OpenAPI Swagger 文档。这里仅展示基础用法。

首先使用 Zod 定义你的 schema。`z` 对象应从 `@hono/zod-openapi` 中导入：

```ts
import { z } from '@hono/zod-openapi'

const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi('User')
```

接下来，创建路由：

```ts
import { createRoute } from '@hono/zod-openapi'

const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: '获取用户',
    },
  },
})
```

最后，设置应用：

```ts
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.openapi(route, (c) => {
  const { id } = c.req.valid('param')
  return c.json({
    id,
    age: 20,
    name: 'Ultra-man',
  })
})

// OpenAPI 文档将可在 /doc 访问
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})
```

你可以像普通 Hono 应用一样启动它。对于 Cloudflare Workers 和 Bun，请使用这个入口：

```ts
export default app
```

## 另请参阅

- [Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
