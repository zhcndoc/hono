# Adapter 助手

Adapter 助手提供了一种通过统一接口与各种平台交互的无缝方式。

## 导入

```ts
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
```

## `env()`

`env()` 函数有助于在不同的运行时中检索环境变量，不仅仅局限于 Cloudflare Workers 的 Bindings。通过 `env(c)` 检索到的值对于每个运行时可能不同。

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
  Lambda 上的环境变量不被 Lambda@Edge [支持](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/add-origin-custom-headers.html)，你需要使用 [Lambda@Edge 事件](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-event-structure.html) 作为替代。
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
    return c.text('You are on Cloudflare')
  } else if (getRuntimeKey() === 'bun') {
    return c.text('You are on Bun')
  }
  ...
})
```

### 可用的运行时键

以下是可用的运行时键，不可用的运行时键所对应的运行时可能会被支持并标记为 `other`，其中一些灵感来自 [WinterCG 的 Runtime Keys](https://runtime-keys.proposal.wintercg.org/)：

- `workerd` - Cloudflare Workers
- `deno`
- `bun`
- `node`
- `edge-light` - Vercel Edge Functions
- `fastly` - Fastly Compute
- `other` - 其他未知的运行时键
