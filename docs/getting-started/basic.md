# 快速开始

使用 Hono 非常简单。我们可以设置项目、编写代码、使用本地服务器开发并快速部署。相同的代码将在任何运行时上工作，只是入口点不同。让我们看看 Hono 的基本用法。

## 起步模板

每个平台都提供了起步模板。使用以下的 "create-hono" 命令。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono@latest my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono@latest my-app
```

:::

随后会询问你想要使用哪个模板。
本例中我们选择 Cloudflare Workers。

```
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
❯   cloudflare-workers
    deno
    fastly
    nextjs
    nodejs
    vercel
```

模板将被拉取到 `my-app`，所以进入该目录并安装依赖。

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

包安装完成后，运行以下命令启动本地服务器。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## Hello World

你可以使用 Cloudflare Workers 开发工具 "Wrangler"、Deno、Bun 或其他工具编写 TypeScript 代码，而无需关心转译。

在 `src/index.ts` 中编写你的第一个 Hono 应用。下面的示例是一个 Hono 起步应用。

`import` 和最后的 `export default` 部分可能因运行时而异，但所有应用代码在任何地方都将运行相同的代码。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
```

启动开发服务器并通过浏览器访问 `http://localhost:8787`。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 返回 JSON

返回 JSON 也很容易。以下是处理对 `/api/hello` 的 GET 请求并返回 `application/json` 响应的示例。

```ts
app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})
```

## 请求与响应

获取路径参数、URL 查询值以及添加响应头部的写法如下。

```ts
app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want to see ${page} of ${id}`)
})
```

我们可以轻松处理 POST、PUT 和 DELETE，不仅是 GET。

```ts
app.post('/posts', (c) => c.text('Created!', 201))
app.delete('/posts/:id', (c) =>
  c.text(`${c.req.param('id')} is deleted!`)
)
```

## 返回 HTML

你可以使用 [html 助手](/docs/helpers/html) 或使用 [JSX](/docs/guides/jsx) 语法编写 HTML。如果你想使用 JSX，将文件重命名为 `src/index.tsx` 并进行配置（因运行时不同请分别检查）。下面是使用 JSX 的示例。

```tsx
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  )
}

app.get('/page', (c) => {
  return c.html(<View />)
})
```

## 返回原始 Response

你也可以返回原始的 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)。

```ts
app.get('/', () => {
  return new Response('Good morning!')
})
```

## 使用中间件

中间件可以为你处理繁琐的工作。
例如，添加基本认证（Basic Authentication）。

```ts
import { basicAuth } from 'hono/basic-auth'

// ...

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => {
  return c.text('You are authorized!')
})
```

这里有有用的内置中间件，包括 Bearer 和使用 JWT 的认证、CORS 和 ETag。
Hono 还提供使用外部库的第三方中间件，例如 GraphQL Server 和 Firebase Auth。
而且，你可以制作自己的中间件。

## 适配器

针对平台依赖的功能也有适配器，例如处理静态文件或 WebSocket。
例如，要在 Cloudflare Workers 中处理 WebSocket，导入 `hono/cloudflare-workers`。

```ts
import { upgradeWebSocket } from 'hono/cloudflare-workers'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    // ...
  })
)
```

## 下一步

大多数代码可以在任何平台上工作，但每个平台都有指南。
例如，如何设置项目或如何部署。
请查看你想要用于创建应用程序的确切平台页面！
