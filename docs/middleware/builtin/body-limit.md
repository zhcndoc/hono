# Body Limit 中间件

Body Limit 中间件可以限制请求体的文件大小。

如果存在，此中间件首先使用请求中 `Content-Length` 头部的值。
如果未设置，它会在流中读取主体，如果大于指定的文件大小，则执行错误处理程序。

## 导入

```ts
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
```

## 用法

```ts
const app = new Hono()

app.post(
  '/upload',
  bodyLimit({
    maxSize: 50 * 1024, // 50kb
    onError: (c) => {
      return c.text('overflow :(', 413)
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()
    if (body['file'] instanceof File) {
      console.log(`Got file sized: ${body['file'].size}`)
    }
    return c.text('pass :)')
  }
)
```

## 选项

### <Badge type="danger" text="必需" /> maxSize: `number`

想要限制的文件的最大文件大小。默认值是 `100 * 1024` - `100kb`。

### <Badge type="info" text="可选" /> onError: `OnError`

如果超过指定的文件大小，将调用的错误处理程序。

## 在 Bun 中用于大请求的用法

如果显式使用 Body Limit 中间件来允许大于默认值的请求体，则可能需要相应地更改 `Bun.serve` 配置。[撰写本文时](https://github.com/oven-sh/bun/blob/f2cfa15e4ef9d730fc6842ad8b79fb7ab4c71cb9/packages/bun-types/bun.d.ts#L2191)，`Bun.serve` 的默认请求体限制为 128MiB。如果将 Hono 的 Body Limit 中间件设置为比该值更大的值，请求仍然会失败，此外，中间件中指定的 `onError` 处理程序不会被调用。这是因为 `Bun.serve()` 会在将请求传递给 Hono 之前将状态代码设置为 `413` 并终止连接。

如果想在 Hono 和 Bun 中接受大于 128MiB 的请求，也需要为 Bun 设置限制：

```ts
export default {
  port: process.env['PORT'] || 3000,
  fetch: app.fetch,
  maxRequestBodySize: 1024 * 1024 * 200, // 此处填写你的值
}
```

或者，根据你的设置：

```ts
Bun.serve({
  fetch(req, server) {
    return app.fetch(req, { ip: server.requestIP(req) })
  },
  maxRequestBodySize: 1024 * 1024 * 200, // 此处填写你的值
})
```
