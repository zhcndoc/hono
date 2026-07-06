# Adapter 助手

Adapter 助手提供了一种通过统一接口与各种平台交互的无缝方式。

## 导入

```ts
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
```

## `env()`

`env()` 函数用于跨不同运行时获取环境变量，不仅限于 Cloudflare Workers 的 Bindings。通过 `env(c)` 能获取到的值，可能会因运行时不同而不同。

```ts
import { env } from 'hono/adapter'

app.get('/env', (c) => {
  // 在 Node.js 或 Bun 上，NAME 是 process.env.NAME
  // 在 Cloudflare 上，NAME 是写在 `wrangler.toml` 中的值
  const { NAME } = env<{ NAME: string }>(c)
  return c.text(NAME)
})
```

支持的运行时、无服务器平台和云服务：

- Cloudflare Workers
  - `wrangler.toml`
  - `wrangler.jsonc`
- Deno
  - [`Deno.env`](https://docs.deno.com/runtime/manual/basics/env_variables)
  - `.env` 文件
- Bun
  - [`Bun.env`](https://bun.com/guides/runtime/set-env)
  - `process.env`
- Node.js
  - `process.env`
- Vercel
  - [Vercel 上的环境变量](https://vercel.com/docs/projects/environment-variables)
- AWS Lambda
  - [AWS Lambda 上的环境变量](https://docs.aws.amazon.com/lambda/latest/dg/samples-blank.html#samples-blank-architecture)
- Lambda@Edge\
  Lambda@Edge 不支持 Lambda 上的环境变量，你需要改用 [Lambda@Edge event](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html)。
- Fastly Compute\
  在 Fastly Compute 上，你可以使用 ConfigStore 来管理用户定义的数据。
- Netlify\
  在 Netlify 上，你可以使用 [Netlify Contexts](https://docs.netlify.com/site-deploys/overview/#deploy-contexts) 来管理用户定义的数据。

### 指定运行时

你可以通过将运行时键作为第二个参数传递来指定要获取环境变量的运行时。

```ts
app.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c, 'workerd')
  return c.text(NAME)
})
```

## `getRuntimeKey()`

`getRuntimeKey()` 函数返回当前运行时的标识符。

```ts
app.get('/', (c) => {
  if (getRuntimeKey() === 'workerd') {
    return c.text('你正在使用 Cloudflare')
  } else if (getRuntimeKey() === 'bun') {
    return c.text('你正在使用 Bun')
  }
  ...
})
```

### 可用的运行时键

以下是可用的运行时键，不可用的运行时键所对应的运行时可能会被支持并标记为 `other`，其中一些灵感来自 [WinterCG 的运行时键](https://runtime-keys.proposal.wintercg.org/)：

- `workerd` - Cloudflare Workers
- `deno`
- `bun`
- `node`
- `edge-light` - Vercel Edge Functions
- `fastly` - Fastly Compute
- `other` - 其他未知的运行时键
