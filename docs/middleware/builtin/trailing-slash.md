# 尾部斜杠中间件

此中间件处理 GET 请求 URL 中的尾部斜杠。

`appendTrailingSlash` 会在未找到内容时将 URL 重定向到添加了尾部斜杠的地址。此外，`trimTrailingSlash` 将移除尾部斜杠。

## 导入

```ts
import { Hono } from 'hono'
import {
  appendTrailingSlash,
  trimTrailingSlash,
} from 'hono/trailing-slash'
```

## 用法

将 `/about/me` 的 GET 请求重定向到 `/about/me/` 的示例。

```ts
import { Hono } from 'hono'
import { appendTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(appendTrailingSlash())
app.get('/about/me/', (c) => c.text('With Trailing Slash'))
```

将 `/about/me/` 的 GET 请求重定向到 `/about/me` 的示例。

```ts
import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(trimTrailingSlash())
app.get('/about/me', (c) => c.text('Without Trailing Slash'))
```

## 选项

### <Badge type="info" text="可选" /> alwaysRedirect: `boolean`

默认情况下，尾部斜杠中间件仅在响应状态为 `404` 时进行重定向。当 `alwaysRedirect` 设置为 `true` 时，中间件会在执行处理程序之前进行重定向。这对于默认行为不起作用的通配符路由（`*`）很有用。

```ts
const app = new Hono()

app.use(trimTrailingSlash({ alwaysRedirect: true }))
app.get('/my-path/*', (c) => c.text('Wildcard route'))
```

此选项适用于 `trimTrailingSlash` 和 `appendTrailingSlash`。

## 注意

当请求方法为 `GET` 且响应状态为 `404` 时，它将生效。
