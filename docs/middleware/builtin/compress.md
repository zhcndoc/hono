# 压缩中间件

此中间件根据 `Accept-Encoding` 请求头压缩响应体。

::: info
**注意**：在 Cloudflare Workers 和 Deno Deploy 上，响应体会被自动压缩，因此无需使用此中间件。
:::

## 导入

```ts
import { Hono } from 'hono'
import { compress } from 'hono/compress'
```

## 用法

```ts
const app = new Hono()

app.use(compress())
```

## 选项

### <Badge type="info" text="可选" /> encoding: `'gzip'` | `'deflate'`

允许用于响应压缩的压缩方案。可以是 `gzip` 或 `deflate`。如果未定义，则两者都允许，并将根据 `Accept-Encoding` 头使用。如果未提供此选项且客户端在 `Accept-Encoding` 头中同时提供了两者，则优先使用 `gzip`。

### <Badge type="info" text="可选" /> threshold: `number`

压缩所需的最小字节大小。默认值为 1024 字节。

### <Badge type="info" text="可选" /> contentTypeFilter: `RegExp` | `(contentType: string) => boolean`

一个 `RegExp` 或函数，用于根据响应的 `Content-Type` 判断是否应进行压缩。默认情况下，会使用内置的可压缩 `Content-Type` 列表。

你可以传入一个 `RegExp`，只压缩匹配的 `Content-Type`：

```ts
// 仅压缩 JSON 响应
app.use(compress({ contentTypeFilter: /^application\/json/ }))
```

或者传入一个函数来实现自定义逻辑。内置的 `COMPRESSIBLE_CONTENT_TYPE_REGEX` 也会导出，因此你可以扩展默认行为：

```ts
import {
  compress,
  COMPRESSIBLE_CONTENT_TYPE_REGEX,
} from 'hono/compress'

// 在默认 Content-Type 的基础上再压缩一个自定义类型
app.use(
  compress({
    contentTypeFilter: (type) =>
      COMPRESSIBLE_CONTENT_TYPE_REGEX.test(type) ||
      type === 'application/x-myformat',
  })
)
```
