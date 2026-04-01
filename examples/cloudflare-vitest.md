# Cloudflare 测试

你可以借助 `@cloudflare/vitest-pool-workers` 轻松实现 Cloudflare 测试，但需要先做一些配置。更多内容可以在 [Cloudflare 测试文档](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test/) 中找到。

使用 vitest pool workers 进行 Cloudflare 测试时，运行时会提供一个 `cloudflare:test` 模块，它会暴露测试时作为第二个参数传入的 env。更多内容可参见 [Cloudflare Test APIs 部分](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/)。

下面是可采用的配置示例：

:::code-group

```ts [vitest.config.ts]
import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersProject(() => {
  return {
    test: {
      globals: true,
      poolOptions: {
        workers: { wrangler: { configPath: './wrangler.toml' } },
      },
    },
  }
})
```

```toml [wrangler.toml]
compatibility_date = "2024-09-09"
compatibility_flags = [ "nodejs_compat" ]

[vars]
MY_VAR = "my variable"
```

:::

Imagine the application like the following:

```ts
// src/index.ts
import { Hono } from 'hono'

type Bindings = {
  MY_VAR: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/hello', (c) => {
  return c.json({ hello: 'world', var: c.env.MY_VAR })
})

export default app
```

你可以通过将 `cloudflare:test` 模块导出的 `env` 传给 `app.request()`，来使用 Cloudflare Bindings 测试应用：

```ts
// src/index.test.ts
import { env } from 'cloudflare:test'
import app from './index'

describe('Example', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('/hello', {}, env)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      hello: 'world',
      var: 'my variable',
    })
  })
})
```

## 另请参阅

`@cloudflare/vitest-pool-workers` [Github Repository examples](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples)\
[Migrate from old testing system](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/migrate-from-miniflare-2/)
