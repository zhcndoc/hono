# CORS 中间件

Cloudflare Workers 作为 Web API 有很多用例，并且需要从外部前端应用程序调用它们。
为此我们必须实现 CORS，让我们也用中间件来实现它。

## 导入

```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
```

## 用法

```ts
const app = new Hono()

// CORS 应该在路由之前调用
app.use('/api/*', cors())
app.use(
  '/api2/*',
  cors({
    origin: 'http://example.com',
    allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests'],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    exposeHeaders: ['Content-Length', 'X-Kuma-Revision'],
    maxAge: 600,
    credentials: true,
  })
)

app.all('/api/abc', (c) => {
  return c.json({ success: true })
})
app.all('/api2/abc', (c) => {
  return c.json({ success: true })
})
```

多个源：

```ts
app.use(
  '/api3/*',
  cors({
    origin: ['https://example.com', 'https://example.org'],
  })
)

// 或者你可以使用“函数”
app.use(
  '/api4/*',
  cors({
    // `c` 是一个 `Context` 对象
    origin: (origin, c) => {
      return origin.endsWith('.example.com')
        ? origin
        : 'http://example.com'
    },
  })
)
```

基于源的动态允许方法：

```ts
app.use(
  '/api5/*',
  cors({
    origin: (origin) =>
      origin === 'https://example.com' ? origin : '*',
    // `c` 是一个 `Context` 对象
    allowMethods: (origin, c) =>
      origin === 'https://example.com'
        ? ['GET', 'HEAD', 'POST', 'PATCH', 'DELETE']
        : ['GET', 'HEAD'],
  })
)
```

## 选项

### <Badge type="info" text="可选" /> origin: `string` | `string[]` | `(origin:string, c:Context) => string`

"_Access-Control-Allow-Origin_" CORS 头部的值。你也可以传递回调函数，例如 `origin: (origin) => (origin.endsWith('.example.com') ? origin : 'http://example.com')`。默认值是 `*`。

### <Badge type="info" text="可选" /> allowMethods: `string[]` | `(origin:string, c:Context) => string[]`

"_Access-Control-Allow-Methods_" CORS 头部的值。你也可以传递回调函数来根据源动态确定允许的方法。默认值是 `['GET', 'HEAD', 'PUT', 'POST', 'DELETE', 'PATCH']`。

### <Badge type="info" text="可选" /> allowHeaders: `string[]`

"_Access-Control-Allow-Headers_" CORS 头部的值。默认值是 `[]`。

### <Badge type="info" text="可选" /> maxAge: `number`

"_Access-Control-Max-Age_" CORS 头部的值。

### <Badge type="info" text="可选" /> credentials: `boolean`

"_Access-Control-Allow-Credentials_" CORS 头部的值。

### <Badge type="info" text="可选" /> exposeHeaders: `string[]`

"_Access-Control-Expose-Headers_" CORS 头部的值。默认值是 `[]`。

## 依赖环境的 CORS 配置

如果你想根据执行环境（如开发或生产）调整 CORS 配置，从环境变量注入值很方便，因为它消除了应用程序感知自身执行环境的需要。请参阅下面的示例以作说明。

```ts
app.use('*', async (c, next) => {
  const corsMiddlewareHandler = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return corsMiddlewareHandler(c, next)
})
```

## 与 Vite 一起使用

当与 Vite 一起使用 Hono 时，你应该在 `vite.config.ts` 中将 `server.cors` 设置为 `false` 以禁用 Vite 的内置 CORS 功能。这可以防止与 Hono 的 CORS 中间件发生冲突。

```ts
// vite.config.ts
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    cors: false, // 禁用 Vite 的内置 CORS 设置
  },
  plugins: [cloudflare()],
})
```
