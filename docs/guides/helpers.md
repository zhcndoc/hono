# 辅助工具

辅助工具可用于协助您开发应用程序。与中间件不同，它们不作为处理程序，而是提供有用的函数。

例如，以下是使用 [Cookie 辅助工具](/docs/helpers/cookie) 的方法：

```ts
import { getCookie, setCookie } from 'hono/cookie'

const app = new Hono()

app.get('/cookie', (c) => {
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  //
})
```

## 可用的辅助工具

- [Accepts](/docs/helpers/accepts)
- [适配器](/docs/helpers/adapter)
- [Cookie](/docs/helpers/cookie)
- [css](/docs/helpers/css)
- [开发](/docs/helpers/dev)
- [工厂](/docs/helpers/factory)
- [html](/docs/helpers/html)
- [JWT](/docs/helpers/jwt)
- [SSG](/docs/helpers/ssg)
- [流式传输](/docs/helpers/streaming)
- [测试](/docs/helpers/testing)
- [WebSocket](/docs/helpers/websocket)
