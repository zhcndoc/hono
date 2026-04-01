# 最佳实践

Hono 非常灵活。你可以按照自己喜欢的方式编写应用。
然而，有一些最佳实践最好遵循。

## 尽可能不要创建“控制器”

如果可能，你不应该创建“类似 Ruby on Rails 的控制器”。

```ts
// 🙁
// 一个类似 RoR 的控制器
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

问题与类型有关。例如，如果不编写复杂的泛型，无法在控制器中推断路径参数。

```ts
// 🙁
// 一个类似 RoR 的控制器
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // 无法推断路径参数
  return c.json(`get ${id}`)
}
```

因此，你不需要创建类似 RoR 的控制器，应该直接在路径定义后编写处理程序。

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // 可以推断路径参数
  return c.json(`get ${id}`)
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

app.get('/', (c) => c.json('list authors'))
app.post('/', (c) => c.json('create an author', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list books'))
app.post('/', (c) => c.json('create a book', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

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
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

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
