# Cloudflare Durable Objects

Cloudflare Durable Objects 不能直接处理 HTTP 请求，而是通过两步流程工作：

1. A Worker receives HTTP fetch requests from clients
2. Worker 向 Durable Object 发起 RPC（远程过程调用）
3. Durable Object 处理 RPC 并将结果返回给 Worker
4. Worker 再将 HTTP 响应发回客户端

你可以在 Cloudflare Worker 中将 Hono 作为路由器，并通过 RPC（远程过程调用）与 [Durable Objects](https://developers.cloudflare.com/durable-objects/) 交互。这是 Cloudflare Workers 兼容日期 `2024-04-03` 之后推荐的做法。

## 示例：Counter Durable Object

```ts
import { DurableObject } from 'cloudflare:workers'
import { Hono } from 'hono'

export class Counter extends DurableObject {
  // 内存状态
  value = 0

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env)

    // `blockConcurrencyWhile()` 可确保在初始化完成前不会接收请求。
    ctx.blockConcurrencyWhile(async () => {
      // 初始化完成后，后续读取就不需要访问存储了。
      this.value = (await ctx.storage.get('value')) || 0
    })
  }

  async getCounterValue() {
    return this.value
  }

  async increment(amount = 1): Promise<number> {
    this.value += amount
    await this.ctx.storage.put('value', this.value)
    return this.value
  }

  async decrement(amount = 1): Promise<number> {
    this.value -= amount
    await this.ctx.storage.put('value', this.value)
    return this.value
  }
}

// 创建一个新的 Hono 应用来处理进入的 HTTP 请求
type Bindings = {
  COUNTER: DurableObjectNamespace<Counter>
}

const app = new Hono<{ Bindings: Bindings }>()

// 添加与 Durable Object 交互的路由
app.get('/counter', async (c) => {
  const env = c.env
  const id = env.COUNTER.idFromName('counter')
  const stub = env.COUNTER.get(id)
  const counterValue = await stub.getCounterValue()
  return c.text(counterValue.toString())
})

app.post('/counter/increment', async (c) => {
  const env = c.env
  const id = env.COUNTER.idFromName('counter')
  const stub = env.COUNTER.get(id)
  const value = await stub.increment()
  return c.text(value.toString())
})

app.post('/counter/decrement', async (c) => {
  const env = c.env
  const id = env.COUNTER.idFromName('counter')
  const stub = env.COUNTER.get(id)
  const value = await stub.decrement()
  return c.text(value.toString())
})

// 将 Hono 应用导出为 Worker 的 fetch 处理器
export default app
```

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "durable",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-14",
  "migrations": [
    {
      "new_sqlite_classes": ["Counter"],
      "tag": "v1",
    },
  ],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "Counter",
        "name": "COUNTER",
      },
    ],
  },
  "observability": {
    "enabled": true,
  },
}
```

现在你已经拥有了一个可以与 Durable Object 交互的完整 Hono 应用了！Hono 路由器提供了简洁的 API 接口，用于访问并暴露 Durable Object 的方法。
