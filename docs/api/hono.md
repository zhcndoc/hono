# 应用 - Hono

`Hono` 是主要对象。
它将首先被导入并一直使用到最后。

```ts twoslash
import { Hono } from 'hono'

const app = new Hono()
//...

export default app // 用于 Cloudflare Workers 或 Bun
```

## 方法

`Hono` 的实例拥有以下方法。

- app.**HTTP_METHOD**(\[path,\]handler|middleware...)
- app.**all**(\[path,\]handler|middleware...)
- app.**on**(method|method[], path|path[], handler|middleware...)
- app.**use**(\[path,\]middleware)
- app.**route**(path, \[app\])
- app.**basePath**(path)
- app.**notFound**(handler)
- app.**onError**(err, handler)
- app.**mount**(path, anotherApp)
- app.**fire**()
- app.**fetch**(request, env, event)
- app.**request**(path, options)

其中第一部分用于路由，请参阅 [路由部分](/docs/api/routing)。

## 未找到

`app.notFound` 允许你自定义未找到响应。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.notFound((c) => {
  return c.text('Custom 404 Message', 404)
})
```

:::warning
`notFound` 方法仅从顶层应用调用。更多信息，请参阅此 [issue](https://github.com/honojs/hono/issues/3465#issuecomment-2381210165)。
:::

## 错误处理

`app.onError` 允许你处理未捕获的错误并返回自定义响应。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.onError((err, c) => {
  console.error(`${err}`)
  return c.text('Custom Error Message', 500)
})
```

::: info
如果父应用及其路由都有 `onError` 处理程序，则路由级处理程序优先。
:::

## fire()

::: warning
**`app.fire()` 已弃用**。请改用 `hono/service-worker` 中的 `fire()`。详见 [Service Worker 文档](/docs/getting-started/service-worker)。
:::

`app.fire()` 自动添加一个全局 `fetch` 事件监听器。

这对于遵循 [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) 的环境很有用，例如 [非 ES 模块 Cloudflare Workers](https://developers.cloudflare.com/workers/reference/migrate-to-module-workers/)。

`app.fire()` 为你执行以下操作：

```ts
addEventListener('fetch', (event: FetchEventLike): void => {
  event.respondWith(this.dispatch(...))
})
```

## fetch()

`app.fetch` 将成为你的应用程序入口点。

对于 Cloudflare Workers，你可以使用以下内容：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
type Env = any
type ExecutionContext = any
// ---cut---
export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx)
  },
}
```

或者直接这样做：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
export default app
```

Bun:

<!-- prettier-ignore -->
```ts
export default app // [!code --]
export default {  // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## request()

`request` 是一个用于测试的有用方法。

你可以传递 URL 或路径名来发送 GET 请求。
`app` 将返回一个 `Response` 对象。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
declare const test: (name: string, fn: () => void) => void
declare const expect: (value: any) => any
// ---cut---
test('GET /hello is ok', async () => {
  const res = await app.request('/hello')
  expect(res.status).toBe(200)
})
```

你也可以传递一个 `Request` 对象：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
declare const test: (name: string, fn: () => void) => void
declare const expect: (value: any) => any
// ---cut---
test('POST /message is ok', async () => {
  const req = new Request('Hello!', {
    method: 'POST',
  })
  const res = await app.request(req)
  expect(res.status).toBe(201)
})
```

## mount()

`mount()` 允许你将使用其他框架构建的应用挂载到你的 Hono 应用中。

```ts
import { Router as IttyRouter } from 'itty-router'
import { Hono } from 'hono'

// 创建 itty-router 应用
const ittyRouter = IttyRouter()

// 处理 `GET /itty-router/hello`
ittyRouter.get('/hello', () => new Response('Hello from itty-router'))

// Hono 应用
const app = new Hono()

// 挂载！
app.mount('/itty-router', ittyRouter.handle)
```

## 严格模式

严格模式默认为 `true` 并区分以下路由。

- `/hello`
- `/hello/`

`app.get('/hello')` 不会匹配 `GET /hello/`。

通过将严格模式设置为 `false`，两条路径将被同等对待。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const app = new Hono({ strict: false })
```

## router 选项

`router` 选项指定使用哪个路由器。默认路由器是 `SmartRouter`。如果你想使用 `RegExpRouter`，将其传递给新的 `Hono` 实例：

```ts twoslash
import { Hono } from 'hono'
// ---cut---
import { RegExpRouter } from 'hono/router/reg-exp-router'

const app = new Hono({ router: new RegExpRouter() })
```

## 泛型

你可以传递泛型来指定 `c.set`/`c.get` 中使用的 Cloudflare Workers Bindings 和变量的类型。

```ts twoslash
import { Hono } from 'hono'
type User = any
declare const user: User
// ---cut---
type Bindings = {
  TOKEN: string
}

type Variables = {
  user: User
}

const app = new Hono<{
  Bindings: Bindings
  Variables: Variables
}>()

app.use('/auth/*', async (c, next) => {
  const token = c.env.TOKEN // token 是 `string`
  // ...
  c.set('user', user) // user 应该是 `User`
  await next()
})
```
