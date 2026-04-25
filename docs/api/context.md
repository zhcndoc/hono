# 上下文

`Context` 对象为每个请求实例化，并保留直到响应返回。你可以将值放入其中，设置要返回的标头和状态码，并访问 HonoRequest 和 Response 对象。

## req

`req` 是 HonoRequest 的实例。更多详情，请参阅 [HonoRequest](/docs/api/request)。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  // ...
  // ---cut-start---
  return c.text(`你好，${userAgent}`)
  // ---cut-end---
})
```

## status()

你可以使用 `c.status()` 设置 HTTP 状态码。默认值为 `200`。如果代码是 `200`，则不必使用 `c.status()`。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/posts', (c) => {
  // 设置 HTTP 状态码
  c.status(201)
  return c.text('你的帖子已创建！')
})
```

## header()

你可以为响应设置 HTTP 标头。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  // 设置标头
  c.header('X-Message', '我的自定义消息')
  return c.text('你好！')
})
```

## body()

返回 HTTP 响应。

::: info
**注意**：当返回文本或 HTML 时，建议使用 `c.text()` 或 `c.html()`。
:::

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/welcome', (c) => {
  c.header('Content-Type', 'text/plain')
  // 返回响应体
  return c.body('感谢你的到来')
})
```

你也可以这样写。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/welcome', (c) => {
  return c.body('感谢你的到来', 201, {
    'X-Message': '你好！',
    'Content-Type': 'text/plain',
  })
})
```

响应与下面的 `Response` 对象相同。

```ts twoslash
new Response('感谢你的到来', {
  status: 201,
  headers: {
    'X-Message': '你好！',
    'Content-Type': 'text/plain',
  },
})
```

## text()

将文本渲染为 `Content-Type: text/plain`。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/say', (c) => {
  return c.text('你好！')
})
```

## json()

将 JSON 渲染为 `Content-Type: application/json`。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/api', (c) => {
  return c.json({ message: '你好！' })
})
```

## html()

将 HTML 渲染为 `Content-Type: text/html`。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  return c.html('<h1>你好！Hono！</h1>')
})
```

## notFound()

返回 `Not Found` 响应。你可以使用 [`app.notFound()`](/docs/api/hono#not-found) 自定义它。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## redirect()

重定向，默认状态码为 `302`。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

## res

你可以访问将返回的 [Response] 对象。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Response 对象
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', '调试消息')
})
```

[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response

## set() / get()

获取和设置任意键值对，生命周期为当前请求。这允许在中间件之间或从中间件到路由处理器传递特定值。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{ Variables: { message: string } }>()
// ---cut---
app.use(async (c, next) => {
  c.set('message', 'Hono 很酷！！')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`消息是 "${message}"`)
})
```

将 `Variables` 作为泛型传递给 `Hono` 的构造函数以使其类型安全。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

`c.set` / `c.get` 的值仅在同一请求内保留。它们不能在不同请求之间共享或持久化。

## var

你也可以使用 `c.var` 访问变量的值。

```ts twoslash
import type { Context } from 'hono'
declare const c: Context
// ---cut---
const result = c.var.client.oneMethod()
```

如果你想创建一个提供自定义方法的中间件，
请如下编写：

```ts twoslash
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
// ---cut---
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}

const app = new Hono()

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('你好！'))
})
```

如果你想在多个处理器中使用该中间件，可以使用 `app.use()`。
然后，你必须将 `Env` 作为泛型传递给 `Hono` 的构造函数以使其类型安全。

```ts twoslash
import { Hono } from 'hono'
import type { MiddlewareHandler } from 'hono/types'
declare const echoMiddleware: MiddlewareHandler
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}
// ---cut---
const app = new Hono<Env>()

app.use(echoMiddleware)

app.get('/echo', (c) => {
  return c.text(c.var.echo('你好！'))
})
```

## render() / setRenderer()

你可以在自定义中间件中使用 `c.setRenderer()` 设置布局。

```tsx twoslash
/** @jsx jsx */
/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <html>
        <body>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})
```

然后，你可以利用 `c.render()` 在此布局内创建响应。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  return c.render('你好！')
})
```

输出将为：

```html
<html>
  <body>
    <p>你好！</p>
  </body>
</html>
```

此外，此功能提供了自定义参数的灵活性。
为了确保类型安全，类型可以定义为：

```ts
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head: { title: string }
    ): Response | Promise<Response>
  }
}
```

以下是如何使用此功能的示例：

```ts
app.use('/pages/*', async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <title>{head.title}</title>
        </head>
        <body>
          <header>{head.title}</header>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})

app.get('/pages/my-favorite', (c) => {
  return c.render(<p>拉面和寿司</p>, {
    title: '我的最爱',
  })
})

app.get('/pages/my-hobbies', (c) => {
  return c.render(<p>看棒球</p>, {
    title: '我的爱好',
  })
})
```

## executionCtx

你可以访问 Cloudflare Workers 特定的 [ExecutionContext](https://developers.cloudflare.com/workers/runtime-apis/context/)。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{
  Bindings: {
    KV: any
  }
}>()
declare const key: string
declare const data: string
// ---cut---
// ExecutionContext 对象
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(c.env.KV.put(key, data))
  // ...
})
```

`ExecutionContext` 还有一个 [`exports`](https://developers.cloudflare.com/workers/runtime-apis/context/#exports) 字段。要使用 Wrangler 生成的类型获得自动补全，你可以使用模块 augmentation：

```ts
import 'hono'

declare module 'hono' {
  interface ExecutionContext {
    readonly exports: Cloudflare.Exports
  }
}
```

## event

你可以访问 Cloudflare Workers 特定的 `FetchEvent`。这在 "Service Worker" 语法中使用过。但现在不推荐使用。

```ts twoslash
import { Hono } from 'hono'
declare const key: string
declare const data: string
type KVNamespace = any
// ---cut---
// 用于类型推断的类型定义
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// FetchEvent 对象（仅在使用 Service Worker 语法时设置）
app.get('/foo', async (c) => {
  c.event.waitUntil(c.env.MY_KV.put(key, data))
  // ...
})
```

## env

在 Cloudflare Workers 环境变量中，绑定到 worker 的 secrets、KV 命名空间、D1 数据库、R2 存储桶等被称为 bindings。
无论类型如何，bindings 始终可作为全局变量使用，并可通过上下文 `c.env.BINDING_KEY` 访问。

```ts twoslash
import { Hono } from 'hono'
type KVNamespace = any
// ---cut---
// 用于类型推断的类型定义
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Cloudflare Workers 的环境对象
app.get('/', async (c) => {
  c.env.MY_KV.get('my-key')
  // ...
})
```

## error

如果 Handler 抛出错误，错误对象将放置在 `c.error` 中。
你可以在中间件中访问它。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  await next()
  if (c.error) {
    // 做一些事情...
  }
})
```

## ContextVariableMap

::: warning
`ContextVariableMap` 会**全局**将类型添加到所有上下文中，而不管设置该变量的中间件是否 वास्तव际运行过。这意味着即使在从未注册该中间件的处理器中，`c.get('result')` 也会表现为类型安全，从而可能在运行时掩盖 `undefined` 错误。

请看下面的示例：

```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}

const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values')
  await next()
})

const app = new Hono()

// handler uses the middleware
app.get('/foo', mw, (c) => {
  const val = c.get('result') // ✅ val 是一个字符串，并且如预期那样被类型标注为字符串
})

// handler doesn't use the middleware
app.get('/bar', (c) => {
  const val = c.get('result') // ❌ val 实际上是 undefined，但被类型标注为字符串，这可能导致运行时错误
})
```

:::

你可以扩展 `ContextVariableMap` 接口，为整个应用中的上下文变量全局定义类型。当变量由应用范围内应用的中间件设置，并且保证在上下文中存在时，这样做是合适的。

例如：

```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}
```

然后你可以在中间件中使用它：

```ts twoslash
import { createMiddleware } from 'hono/factory'
// ---cut---
const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values') // result 是一个字符串
  await next()
})
```

在处理器中，变量被推断为正确的类型：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{ Variables: { result: string } }>()
// ---cut---
app.get('/', (c) => {
  const val = c.get('result') // val 是一个字符串
  // ...
  return c.json({ result: val })
})
```
