# Context Storage 中间件

Context Storage 中间件将 Hono `Context` 存储在 `AsyncLocalStorage` 中，使其全局可访问。

::: info
**注意** 此中间件使用 `AsyncLocalStorage`。运行时应该支持它。

**Cloudflare Workers**：要启用 `AsyncLocalStorage`，请将 [`nodejs_compat` 或 `nodejs_als` 标志](https://developers.cloudflare.com/workers/configuration/compatibility-dates/#nodejs-compatibility-flag) 添加到您的 `wrangler.toml` 文件中。
:::

## 导入

```ts
import { Hono } from 'hono'
import {
  contextStorage,
  getContext,
  tryGetContext,
} from 'hono/context-storage'
```

## 用法

如果将 `contextStorage()` 作为中间件应用，`getContext()` 将返回当前的 Context 对象。

```ts
type Env = {
  Variables: {
    message: string
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

app.use(async (c, next) => {
  c.set('message', 'Hello!')
  await next()
})

// 您可以在处理程序外部访问变量。
const getMessage = () => {
  return getContext<Env>().var.message
}

app.get('/', (c) => {
  return c.text(getMessage())
})
```

在 Cloudflare Workers 上，您可以在处理程序外部访问绑定。

```ts
type Env = {
  Bindings: {
    KV: KVNamespace
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

const setKV = (value: string) => {
  return getContext<Env>().env.KV.put('key', value)
}
```

## tryGetContext

`tryGetContext()` 的工作方式类似于 `getContext()`，但当上下文不可用时返回 `undefined` 而不是抛出错误：

```ts
const context = tryGetContext<Env>()
if (context) {
  // 上下文可用
  console.log(context.var.message)
}
```
