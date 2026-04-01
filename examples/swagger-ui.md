# Swagger UI

[Swagger UI Middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) 提供了一个中间件和一个组件，用于将 [Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/) 集成到 Hono 应用中。

```ts
import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'

// 一个基础的 OpenAPI 文档
const openApiDoc = {
  openapi: '3.0.0', // This is the required version field
  info: {
    title: 'API Documentation',
    version: '1.0.0',
    description: 'API documentation for your service',
  },
  paths: {
    // 在这里添加你的 API 路径
    '/health': {
      get: {
        summary: 'Health check',
        responses: {
          '200': {
            description: 'OK',
          },
        },
      },
    },
    // 按需添加更多端点
  },
}

const app = new Hono()

// 提供 OpenAPI 文档
app.get('/doc', (c) => c.json(openApiDoc))

// 使用该中间件在 /ui 提供 Swagger UI
app.get('/ui', swaggerUI({ url: '/doc' }))

app.get('/health', (c) => c.text('OK'))

export default app
```

## 另请参阅

- [Swagger UI Middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)
