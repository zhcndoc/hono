# 中间件

我们将返回 `Response` 的基本单元称为 "Handler"。
"Middleware" 在 Handler 之前和之后执行，并处理 `Request` 和 `Response`。
它就像洋葱结构一样。

![](/images/onion.png)

例如，我们可以编写如下中间件来添加 "X-Response-Time" 头。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  const start = performance.now()
  await next()
  const end = performance.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})
```

通过这种简单的方法，我们可以编写自己的自定义中间件，也可以使用内置或第三方中间件。
