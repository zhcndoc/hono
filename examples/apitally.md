# 使用 Apitally 监控 Hono API

[Apitally](https://apitally.io/hono) 是一个面向 REST API 的简单监控与分析工具。它通过轻量级中间件与 Hono 集成，并开箱即用地提供简洁直观的仪表盘，包含指标、日志和告警。

使用 Apitally，你可以：

- 监控 API 的使用量、性能和错误
- 跟踪单个调用方的 API 使用情况
- 记录并检查 API 请求和响应
- 捕获与请求关联的应用日志和调用链
- 配置可用性监控和自定义告警

## 安装

在项目中安装 [Apitally SDK](https://www.npmjs.com/package/apitally)：

```bash
# npm
npm install apitally

# yarn
yarn add apitally

# pnpm
pnpm add apitally

# bun
bun add apitally
```

## 设置

首先，在 [Apitally 控制台](https://app.apitally.io) 中创建一个应用以获取你的 client ID。然后使用 `useApitally` 函数把中间件添加到你的 Hono 应用中：

```ts
import { Hono } from 'hono'
import { useApitally } from 'apitally/hono'

const app = new Hono()

useApitally(app, {
  clientId: 'your-client-id', // 从 Apitally 控制台获取
  env: 'dev', // or "prod", etc.

  // 可选：启用并配置请求日志
  requestLogging: {
    enabled: true,
    logRequestHeaders: true,
    logRequestBody: true,
    logResponseBody: true,
    captureLogs: true,
  },
})

// 在中间件之后添加路由
app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

请将 Apitally 中间件放在其他所有中间件之前，以确保它包裹整个应用栈。

## 识别调用方

如果要按单个调用方跟踪 API 使用情况，可以使用 `setConsumer` 函数将请求与调用方标识关联起来。这通常会在认证后的中间件中完成。你还可以提供可选的显示名称和调用方分组。

```ts
import { setConsumer } from 'apitally/hono'

app.use(async (c, next) => {
  const payload = c.get('jwtPayload')
  if (payload) {
    setConsumer(c, {
      identifier: payload.sub,
      name: payload.name, // optional
      group: payload.group, // optional
    })
  }
  await next()
})
```

现在，Apitally 的 Consumers 仪表盘会显示所有调用方，你可以按调用方筛选日志和指标。

## 另请参阅

- [Apitally](https://apitally.io/hono) - Official website
- [Apitally SDK](https://github.com/apitally/apitally-js) - GitHub repository
- [官方设置指南](https://docs.apitally.io/setup-guides/hono)
- [Cloudflare Workers 官方设置指南](https://docs.apitally.io/setup-guides/hono-cloudflare-workers)
