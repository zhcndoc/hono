# Factory 助手

Factory 助手提供了用于创建 Hono 组件（例如中间件）的实用函数。有时设置正确的 TypeScript 类型很困难，但这个助手让这一切变得更容易。

## 导入

```ts
import { Hono } from 'hono'
import { createFactory, createMiddleware } from 'hono/factory'
```

## `createFactory()`

`createFactory()` 将创建 Factory 类的一个实例。

```ts
import { createFactory } from 'hono/factory'

const factory = createFactory()
```

你可以将 Env 类型作为泛型传递：

```ts
type Env = {
  Variables: {
    foo: string
  }
}

const factory = createFactory<Env>()
```

### 选项

### <Badge type="info" text="可选" /> defaultAppOptions: `HonoOptions`

传递给由 `createApp()` 创建的 Hono 应用程序的默认选项。

```ts
const factory = createFactory({
  defaultAppOptions: { strict: false },
})

const app = factory.createApp() // `strict: false` is applied
```

## `createMiddleware()`

`createMiddleware()` 是 `factory.createMiddleware()` 的快捷方式。
此函数将创建你的自定义中间件。

```ts
const messageMiddleware = createMiddleware(async (c, next) => {
  await next()
  c.res.headers.set('X-Message', 'Good morning!')
})
```

提示：如果你想获取像 `message` 这样的参数，你可以像下面这样将其创建为一个函数。

```ts
const messageMiddleware = (message: string) => {
  return createMiddleware(async (c, next) => {
    await next()
    c.res.headers.set('X-Message', message)
  })
}

app.use(messageMiddleware('Good evening!'))
```

## `factory.createHandlers()`

`createHandlers()` 有助于在与 `app.get('/')` 不同的地方定义处理程序。

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

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

## `factory.createApp()`

`createApp()` 有助于创建具有正确类型的 Hono 实例。如果你将此方法与 `createFactory()` 一起使用，可以避免在 `Env` 类型定义中的冗余。

如果你的应用程序是这样的，你必须在两个地方设置 `Env`：

```ts
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    myVar: string
  }
}

// 1. 将 `Env` 设置给 `new Hono()`
const app = new Hono<Env>()

// 2. 将 `Env` 设置给 `createMiddleware()`
const mw = createMiddleware<Env>(async (c, next) => {
  await next()
})

app.use(mw)
```

通过使用 `createFactory()` 和 `createApp()`，你只需在一个地方设置 `Env`。

```ts
import { createFactory } from 'hono/factory'

// ...

// 将 `Env` 设置给 `createFactory()`
const factory = createFactory<Env>()

const app = factory.createApp()

// factory 也有 `createMiddleware()`
const mw = factory.createMiddleware(async (c, next) => {
  await next()
})
```

`createFactory()` 可以接收 `initApp` 选项来初始化由 `createApp()` 创建的 `app`。以下是使用该选项的示例。

```ts
// factory-with-db.ts
type Env = {
  Bindings: {
    MY_DB: D1Database
  }
  Variables: {
    db: DrizzleD1Database
  }
}

export default createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = drizzle(c.env.MY_DB)
      c.set('db', db)
      await next()
    })
  },
})
```

```ts
// crud.ts
import factoryWithDB from './factory-with-db'

const app = factoryWithDB.createApp()

app.post('/posts', (c) => {
  c.var.db.insert()
  // ...
})
```
