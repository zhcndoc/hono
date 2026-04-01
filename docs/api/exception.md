# HTTPException

当发生致命错误时，Hono（以及许多生态系统中间件）可能会抛出 `HTTPException`。这是一个自定义的 Hono `Error`，简化了 [返回错误响应](#handling-httpexceptions) 的过程。

## 抛出 HTTPExceptions

你可以通过指定状态码，以及消息或自定义响应来抛出你自己的 HTTPExceptions。

### 自定义消息

对于基本的 `text` 响应，只需设置错误 `message`。

```ts twoslash
import { HTTPException } from 'hono/http-exception'

throw new HTTPException(401, { message: 'Unauthorized' })
```

### 自定义响应

对于其他响应类型，或者要设置响应头，请使用 `res` 选项。_注意，传递给构造函数的状态码是用于创建响应的状态码。_

```ts twoslash
import { HTTPException } from 'hono/http-exception'

const errorResponse = new Response('Unauthorized', {
  status: 401, // 这将被忽略
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})

throw new HTTPException(401, { res: errorResponse })
```

### 原因

在任何一种情况下，你都可以使用 [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) 选项向 HTTPException 添加任意数据。

```ts twoslash
import { Hono, Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
const app = new Hono()
declare const message: string
declare const authorize: (c: Context) => Promise<void>
// ---cut---
app.post('/login', async (c) => {
  try {
    await authorize(c)
  } catch (cause) {
    throw new HTTPException(401, { message, cause })
  }
  return c.redirect('/')
})
```

## 处理 HTTPExceptions

你可以使用 [`app.onError`](/docs/api/hono#error-handling) 处理未捕获的 HTTPExceptions。它们包含一个 `getResponse` 方法，该方法返回一个新的 `Response`，该响应是根据错误 `status` 创建的，并使用错误 `message` 或抛出错误时设置的 [自定义响应](#custom-response)。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // 返回 HTTPException 生成的错误响应
    return err.getResponse()
  }
  // 对于任何其他意外错误，记录日志并返回通用的 500 响应
  console.error(err)
  return c.text('Internal Server Error', 500)
})
```

::: warning
**`HTTPException.getResponse` 不知道 `Context`**。要包含已在 `Context` 中设置的头，你必须将它们应用到一个新的 `Response` 上。
:::
