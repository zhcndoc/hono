# 代理

::: tip
**更新：** 我们新增了 Proxy Helper，以便更轻松地处理代理功能。更多细节请查看 [Proxy Helper 文档](https://hono.dev/docs/helpers/proxy)。
:::

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:filename{.+.png$}', (c) => {
  const referer = c.req.header('Referer')
  if (referer && !/^https:\/\/example.com/.test(referer)) {
    return c.text('禁止访问', 403)
  }
  return fetch(c.req.url)
})

app.get('*', (c) => {
  return fetch(c.req.url)
})

export default app
```

::: tip
如果你在类似代码中看到 `Can't modify immutable headers.` 错误，就需要克隆响应对象。

```ts
app.get('/', async (_c) => {
  const response = await fetch('https://example.com')
  // 克隆响应，以便返回一个可修改响应头的对象
  const newResponse = new Response(response.body, response)
  return newResponse
})
```

`fetch` 返回的 `Response` 头是不可变的，因此如果你修改它就会报错。
:::
