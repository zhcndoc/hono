# Request ID 中间件

Request ID 中间件为每个请求生成一个唯一的 ID，你可以在处理程序中使用它。

::: info
**Node.js**: 此中间件使用 `crypto.randomUUID()` 生成 ID。全局 `crypto` 是在 Node.js 版本 20 或更高版本中引入的。因此，在早于该版本的版本中可能会发生错误。在这种情况下，请指定 `generator`。但是，如果你正在使用 [Node.js 适配器](https://github.com/honojs/node-server)，它会自动全局设置 `crypto`，因此这不是必须的。
:::

## 导入

```ts
import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
```

## 用法

你可以在应用了 Request ID 中间件的处理程序和中间件中通过 `requestId` 变量访问 Request ID。

```ts
const app = new Hono()

app.use('*', requestId())

app.get('/', (c) => {
  return c.text(`Your request id is ${c.get('requestId')}`)
})
```

如果你想显式指定类型，导入 `RequestIdVariables` 并将其传递给 `new Hono()` 的泛型。

```ts
import type { RequestIdVariables } from 'hono/request-id'

const app = new Hono<{
  Variables: RequestIdVariables
}>()
```

### 设置 Request ID

如果你在请求头中设置了一个自定义的 request ID（默认：`X-Request-Id`），中间件将使用该值而不是生成一个新的：

```ts
const app = new Hono()

app.use('*', requestId())

app.get('/', (c) => {
  return c.text(`${c.get('requestId')}`)
})

const res = await app.request('/', {
  headers: {
    'X-Request-Id': 'your-custom-id',
  },
})
console.log(await res.text()) // 你的自定义 id
```

如果你想禁用此功能，将 [`headerName` 选项](#headername-string) 设置为空字符串。

## 选项

### <Badge type="info" text="可选" /> limitLength: `number`

Request ID 的最大长度。默认值是 `255`。

### <Badge type="info" text="可选" /> headerName: `string`

用于 Request ID 的请求头名称。默认值是 `X-Request-Id`。

### <Badge type="info" text="可选" /> generator: `(c: Context) => string`

Request ID 生成函数。默认情况下，它使用 `crypto.randomUUID()`。

## 平台特定的 Request IDs

某些平台（例如 AWS Lambda）已经为每个请求生成自己的 Request IDs。
没有任何额外配置的情况下，此中间件不知道这些特定的 Request IDs 并生成一个新的 Request ID。
这在查看应用程序日志时可能会导致混淆。

为了统一这些 ID，使用 `generator` 函数捕获平台特定的 Request ID 并在此中间件中使用它。

### 平台特定链接

- AWS Lambda
  - [AWS 文档：Context 对象](https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html)
  - [Hono：访问 AWS Lambda 对象](/docs/getting-started/aws-lambda#access-aws-lambda-object)
- Cloudflare
  - [Cloudflare Ray ID
    ](https://developers.cloudflare.com/fundamentals/reference/cloudflare-ray-id/)
- Deno
  - [Deno 博客上的 Request ID](https://deno.com/blog/zero-config-debugging-deno-opentelemetry#:~:text=s%20automatically%20have-,unique%20request%20IDs,-associated%20with%20them)
- Fastly
  - [Fastly 文档：req.xid](https://www.fastly.com/documentation/reference/vcl/variables/client-request/req-xid/)
