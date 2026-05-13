# 最佳实践

Hono 非常灵活。你可以按照自己喜欢的方式编写应用。
然而，有一些最佳实践最好遵循。

## 尽可能不要创建“控制器”

如果可能，你不应该创建“类似 Ruby on Rails 的控制器”。

```ts
// 🙁
// 一个类似 RoR 的控制器
const booksList = (c: Context) => {
  return c.json('列出图书')
}

app.get('/books', booksList)
```

问题与类型有关。例如，如果不编写复杂的泛型，无法在控制器中推断路径参数。

```ts
// 🙁
// 一个类似 RoR 的控制器
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // 无法推断路径参数
  return c.json(`获取 ${id}`)
}
```

因此，你不需要创建类似 RoR 的控制器，应该直接在路径定义后编写处理程序。

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // 可以推断路径参数
  return c.json(`获取 ${id}`)
})
```

## `hono/factory` 中的 `factory.createHandlers()`

如果你仍然想创建类似 RoR 的控制器，请使用 [`hono/factory`](/docs/helpers/factory) 中的 `factory.createHandlers()`。如果你使用这个，类型推断将正常工作。

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

// 😃
const factory = createFactory()

const middleware = factory.createMiddleware(async (c, next) => {
  c.set('foo', 'bar')
  await next()
})

const handlers = factory.createHandlers(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})

app.get('/api', ...handlers)
```

## 构建大型应用

使用 `app.route()` 来构建大型应用，而无需创建“类似 Ruby on Rails 的控制器”。

如果你的应用有 `/authors` 和 `/books` 端点，并且你希望将文件从 `index.ts` 分离出来，创建 `authors.ts` 和 `books.ts`。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('列出作者'))
app.post('/', (c) => c.json('创建作者', 201))
app.get('/:id', (c) => c.json(`获取 ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('列出图书'))
app.post('/', (c) => c.json('创建图书', 201))
app.get('/:id', (c) => c.json(`获取 ${c.req.param('id')}`))

export default app
```

然后，导入它们并使用 `app.route()` 挂载到路径 `/authors` 和 `/books` 上。

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

// 😃
app.route('/authors', authors)
app.route('/books', books)

export default app
```

### 如果你想使用 RPC 功能

上面的代码适用于正常用例。
但是，如果你想使用 `RPC` 功能，你可以通过如下链式调用获得正确的类型。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('列出作者'))
  .post('/', (c) => c.json('创建作者', 201))
  .get('/:id', (c) => c.json(`获取 ${c.req.param('id')}`))

export default app
export type AppType = typeof app
```

如果你将 `app` 的类型传递给 `hc`，它将获得正确的类型。

```ts
import type { AppType } from './authors'
import { hc } from 'hono/client'

// 😃
const client = hc<AppType>('http://localhost') // 类型正确
```

有关更详细的信息，请参阅 [RPC 页面](/docs/guides/rpc#using-rpc-with-larger-applications)。

## HEAD 请求最佳实践

### 理解 Hono 的 HEAD 处理方式

Hono 会自动将 HEAD 请求转换为 GET 请求，并去除响应正文。此行为内置于框架的分发层中，并且发生在路由匹配之前。

### ✅ 应当：将 GET 路由用于 HEAD 请求

```typescript
// GOOD: This GET route automatically handles HEAD requests
app.get('/api/users', async (c) => {
  const users = await getUsers()
  c.header('X-Total-Count', users.length.toString())
  return c.json(users)
})

// HEAD /api/users will return:
// - Same headers as GET (including X-Total-Count)
// - Status 200
// - No body (null)
```

### ✅ 应当：为 HEAD 特定逻辑使用中间件

```typescript
// GOOD: Use middleware when HEAD needs different behavior
app.use('/api/resource', async (c, next) => {
  await next()

  // 在处理程序之后添加 HEAD 特定的头部
  if (c.req.method === 'HEAD') {
    c.header('X-HEAD-Processed', 'true')
    // 不要为 HEAD 计算昂贵的正文内容
    c.res = new Response(null, c.res)
  }
})
```

### ❌ 不要：尝试创建专用的 HEAD 处理程序

```typescript
// BAD: This won't work as expected
app.head('/api/users', (c) => {
  // 这个处理程序永远不会被调用
  c.header('X-Custom', 'value')
  return c.text('ignored')
})

// BAD: Using on() also won't work
app.on('HEAD', '/api/users', (c) => {
  // 在路由匹配之前仍然会被转换为 GET
})
```

### 性能考虑

- **如果你预计会有很多 HEAD 请求，避免在 GET 处理程序中进行昂贵操作**：使用中间件检测 HEAD 并跳过正文生成
- **缓存头的工作方式完全相同**：HEAD 响应遵循与 GET 相同的缓存规则
- **中间件兼容性**：大多数中间件都能与 HEAD 协同工作，但正文处理型中间件（如压缩）会自动跳过 HEAD 请求

### 测试 HEAD 请求

```typescript
// 始终同时测试 GET 和 HEAD 响应
it('正确处理 HEAD 请求', async () => {
  const getRes = await app.request('/api/users')
  const headRes = await app.request('/api/users', { method: 'HEAD' })

  expect(headRes.status).toBe(getRes.status)
  expect(headRes.headers.get('X-Total-Count')).toBe(
    getRes.headers.get('X-Total-Count')
  )
  expect(headRes.body).toBe(null)
})
```

### 注意事项

- 自动的 HEAD 转换可确保 GET 和 HEAD 响应之间的头部一致
- 此行为在所有 Hono 运行时（Cloudflare Workers、Deno、Bun、Node.js）中保持一致
- 如果你需要 HEAD 与 GET 完全不同的逻辑，考虑使用不同的端点，而不是尝试覆盖框架的 HEAD 处理方式
