# 测试助手

测试助手提供了函数，使测试 Hono 应用程序变得更加容易。

## 导入

```ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
```

## `testClient()`

`testClient()` 函数将 Hono 实例作为其第一个参数，并返回一个根据 Hono 应用程序路由类型化的对象，类似于 [Hono 客户端](/docs/guides/rpc#client)。这允许你在测试中以类型安全的方式调用定义的路由，并享有编辑器自动补全功能。

**关于类型推断的重要说明：**

为了让 `testClient` 正确推断你的路由类型并提供自动补全，**你必须直接在 `Hono` 实例上使用链式方法定义路由**。

类型推断依赖于类型通过链式的 `.get()`、`.post()` 等调用进行流动。如果在创建 Hono 实例后单独定义路由（如 "Hello World" 示例中显示的常见模式：`const app = new Hono(); app.get(...)`），`testClient` 将没有特定路由所需的类型信息，你也无法获得类型安全的客户端功能。

**示例：**

此示例之所以有效，是因为 `.get()` 方法直接链式调用在 `new Hono()` 上：

```ts
// index.ts
const app = new Hono().get('/search', (c) => {
  const query = c.req.query('q')
  return c.json({ query: query, results: ['result1', 'result2'] })
})

export default app
```

```ts
// index.test.ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { describe, it, expect } from 'vitest' // 或者你首选的测试运行器
import app from './app'

describe('Search Endpoint', () => {
  // 从 app 实例创建测试客户端
  const client = testClient(app)

  it('should return search results', async () => {
    // 使用类型化客户端调用端点
    // 注意查询参数的类型安全性（如果在路由中定义）
    // 以及通过 .$get() 直接访问
    const res = await client.search.$get({
      query: { q: 'hono' },
    })

    // 断言
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      query: 'hono',
      results: ['result1', 'result2'],
    })
  })
})
```

要在测试中包含头信息，请将它们作为调用中的第二个参数传递。第二个参数还可以接受一个 `init` 属性作为 `RequestInit` 对象，允许你设置头信息、方法、请求体等。有关 `init` 属性的更多信息，请参见 [此处](/docs/guides/rpc#init-option)。

```ts
// index.test.ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { describe, it, expect } from 'vitest' // 或者你首选的测试运行器
import app from './app'

describe('Search Endpoint', () => {
  // 从 app 实例创建测试客户端
  const client = testClient(app)

  it('should return search results', async () => {
    // 在头信息中包含 token 并设置内容类型
    const token = 'this-is-a-very-clean-token'
    const res = await client.search.$get(
      {
        query: { q: 'hono' },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `application/json`,
        },
      }
    )

    // 断言
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      query: 'hono',
      results: ['result1', 'result2'],
    })
  })
})
```
