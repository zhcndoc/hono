# ETag 中间件

使用此中间件，您可以轻松添加 ETag 头。

## 导入

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
```

## 用法

```ts
const app = new Hono()

app.use('/etag/*', etag())
app.get('/etag/abc', (c) => {
  return c.text('Hono is cool')
})
```

## 保留的响应头

304 响应必须包含等同于 200 OK 响应中应发送的响应头。默认的响应头包括 Cache-Control、Content-Location、Date、ETag、Expires 和 Vary。

如果您想添加发送的响应头，可以使用 `retainedHeaders` 选项和包含默认响应头的 `RETAINED_304_HEADERS` 字符串数组变量：

```ts
import { etag, RETAINED_304_HEADERS } from 'hono/etag'

// ...

app.use(
  '/etag/*',
  etag({
    retainedHeaders: ['x-message', ...RETAINED_304_HEADERS],
  })
)
```

## 选项

### <Badge type="info" text="可选" /> weak: `boolean`

定义是否使用 [弱验证](https://developer.mozilla.org/en-US/docs/Web/HTTP/Conditional_requests#weak_validation)。如果设置为 `true`，则会在值的前缀添加 `w/`。默认为 `false`。

### <Badge type="info" text="可选" /> retainedHeaders: `string[]`

您希望在 304 响应中保留的响应头。

### <Badge type="info" text="可选" /> generateDigest: `(body: Uint8Array) => ArrayBuffer | Promise<ArrayBuffer>`

一个自定义的摘要生成函数。默认情况下，它使用 `SHA-1`。此函数以 `Uint8Array` 形式的响应体作为调用参数，并应返回一个 `ArrayBuffer` 形式的哈希或其 Promise。
