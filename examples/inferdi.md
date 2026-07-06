# InferDI

[InferDI](https://github.com/inferdi/inferdi) 是一个适用于 TypeScript 的零依赖、无装饰器、强类型依赖注入容器。[`@inferdi/hono`](https://www.npmjs.com/package/@inferdi/hono) 中间件将其接入 Hono 的请求管线：它为每个请求创建一个 DI 作用域，将其暴露在上下文中的 `c.var.di` 上，并在响应完成后将其释放——无需装饰器、反射或路由扫描。

图 _就是_ 类型：依赖顺序错误、键缺失，或请求作用域的值泄漏到单例中，都会在编译期报错，而不是在运行时才出人意料。

## 🛠️ 安装

```bash
npm install @inferdi/inferdi @inferdi/hono
```

> [!NOTE]
> InferDI 同时发布在 npm 和 JSR 上。在 Deno 中，请使用 `deno add jsr:@inferdi/inferdi jsr:@inferdi/hono npm:hono` 进行安装。

## 🚀 快速开始

### 1. 构建容器

在根 `Container` 上注册你的服务。依赖项以键的元组形式传入，并会根据构造函数按位置进行类型检查——顺序错误或类型不匹配都会导致编译错误。每次注册都会声明一个生命周期：`singleton`（默认，每个容器一个实例）、`scoped`（每个请求一个实例）或 `transient`（每次解析时都会创建新实例）。

```ts
// container.ts
import { Container } from '@inferdi/inferdi'

export function buildRootContainer() {
  return (
    new Container()
      .registerClass('logger', Logger, [])
      // `request` 是 scoped：每个请求作用域都会有一个新的实例。
      .registerClass('request', RequestContext, [], 'scoped')
      // `users` 也是 scoped —— 它依赖于 scoped 的 `request`。
      .registerClass(
        'users',
        UserService,
        ['logger', 'request'],
        'scoped'
      )
  )
}
```

> [!NOTE]
> `singleton` 不能依赖 `scoped` 或 `transient` 服务——那会把短生命周期的值泄漏到长生命周期对象中，InferDI 会在编译时拒绝这种情况。请将绑定到请求的服务保持为 `scoped`。

### 2. 添加中间件

`inferdiHono` 会在你的处理器运行前创建一个请求作用域，并在之后将其销毁。`InferdiHonoEnv<typeof root>` 会将 `c.var.di` 类型化为你的具体作用域，因此 `.get(key)` 始终具有完整类型推导。

```ts
import { Hono } from 'hono'
import { inferdiHono, type InferdiHonoEnv } from '@inferdi/hono'
import { buildRootContainer } from './container'

const root = buildRootContainer()
const app = new Hono<InferdiHonoEnv<typeof root>>()

app.use('*', inferdiHono({ container: root }))

export default app
```

### 3. 填充请求作用域

在任何处理器看到该作用域之前，使用 `setupScope` 为请求作用域服务填充每个请求的数据（请求 id、已认证用户，等等）。它会在每个请求中执行一次，并且可以是异步的。

```ts
app.use(
  '*',
  inferdiHono({
    container: root,
    setupScope: (scope, c) => {
      const request = scope.get('request')
      request.requestId = crypto.randomUUID()
      request.userId = c.req.header('x-user-id')
    },
  })
)
```

### 4. 在处理器中解析服务

使用 `c.var.di.get(key)` 从请求作用域中解析任何已注册的服务。返回值具有完整类型推导，而 scoped 服务在整个请求期间共享同一个实例。

```ts
app.get('/users/:id', async (c) => {
  const user = await c.var.di.get('users').profile(c.req.param('id'))
  return c.json(user)
})
```

`c.get('di')` 等同于 `c.var.di`。如果要使用不同的上下文键，请传入 `key` 并在 env 类型中体现出来：

```ts
type AppEnv = InferdiHonoEnv<typeof root, 'container'>

const app = new Hono<AppEnv>()
app.use('*', inferdiHono({ container: root, key: 'container' }))

app.get('/users/:id', (c) =>
  c.json(c.var.container.get('users').profile(c.req.param('id')))
)
```

## ⚙️ 选项

`inferdiHono` 接受以下选项：

| 选项              | 默认值               | 描述                                                               |
| ----------------- | -------------------- | ------------------------------------------------------------------ |
| `container`      | —                    | **必需。** 根容器。中间件从不释放根容器。 |
| `key`            | `'di'`               | 用于 `c.var[key]` / `c.get(key)` 的上下文变量键。                |
| `createScope`    | `root.createScope()` | 覆盖请求作用域的创建方式。可以是异步的。                 |
| `setupScope`      | —                    | 在处理器运行前填充作用域。可以是异步的。                     |
| `disposeScope`    | `scope.dispose()`    | 覆盖请求作用域的释放方式。可以是异步的。                           |
| `autoDispose`     | `true`               | 当应用代码负责释放时，设为 `false`（或返回 `false`）。   |
| `onDisposeError`  | `console.error`      | 用于响应后释放失败的输出接收器。                                 |

## 🌊 流式传输

流式响应会在流回调完成之前返回，因此请使用 `skipInferdiDispose(c)` 禁用自动释放，并在流结束时自行释放作用域。

```ts
import { stream } from 'hono/streaming'
import { skipInferdiDispose } from '@inferdi/hono'

app.get('/events', (c) => {
  skipInferdiDispose(c)
  const scope = c.var.di
  const events = scope.get('events')

  return stream(c, async (s) => {
    try {
      for await (const event of events.subscribe()) {
        await s.write(`data: ${JSON.stringify(event)}\n\n`)
      }
    } finally {
      await scope.dispose()
    }
  })
})
```

## 另请参阅

- [InferDI Hono 适配器文档](https://inferdi.com/adapters/hono)
- [`@inferdi/hono` 在 GitHub 上](https://github.com/inferdi/inferdi/tree/main/packages/hono)
