# 挂载到反向代理后面

假设你希望将 Hono 应用运行在反向代理后面。在这种情况下，你可能需要读取 `x-forwarded-proto` 头的值。例如，你需要能够在 `c.req.url` 中获取由 `x-forwarded-proto` 指定的 URL 协议。

处理这种情况的最佳实践，是在 Hono 的 `app.fetch` 之前创建一个新的 `Request` 对象，并将其传给 `app.fetch`。

## Cloudflare Workers / Deno / Bun

```ts
import { Hono } from 'hono'

const app = new Hono()

//...

export default {
  fetch: (req: Request) => {
    const url = new URL(req.url)
    url.protocol =
      req.headers.get('x-forwarded-proto') ?? url.protocol
    return app.fetch(new Request(url, req))
  },
}
```

## Node.js

```ts
import { Hono } from 'hono'
import { serve } from '@hono/node-server'

const app = new Hono()

serve({
  fetch: (req) => {
    const url = new URL(req.url)
    url.protocol =
      req.headers.get('x-forwarded-proto') ?? url.protocol
    return app.fetch(new Request(url, req))
  },
})
```
