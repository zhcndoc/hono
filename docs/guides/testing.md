# 测试

[Vitest]: https://vitest.dev/

测试很重要。
实际上，测试 Hono 的应用程序很容易。
创建测试环境的方式因运行时而异，但基本步骤是相同的。
在本节中，让我们使用 Cloudflare Workers 和 [Vitest] 进行测试。

::: tip
Cloudflare 推荐使用 [Vitest] 配合 [@cloudflare/vitest-pool-workers](https://www.npmjs.com/package/@cloudflare/vitest-pool-workers)。有关更多详细信息，请参阅 Cloudflare Workers 文档中的 [Vitest 集成](https://developers.cloudflare.com/workers/testing/vitest-integration/)。
:::

## 请求和响应

您所需要做的就是创建一个 Request 对象并将其传递给 Hono 应用程序以验证 Response 对象。然后您可以使用有用的 `app.request` 方法。

::: tip
对于类型化的测试客户端，请参阅 [测试助手](/docs/helpers/testing)。
:::

例如，考虑一个提供以下 REST API 的应用程序。

```ts
app.get('/posts', (c) => {
  return c.text('Many posts')
})

app.post('/posts', (c) => {
  return c.json(
    {
      message: 'Created',
    },
    201,
    {
      'X-Custom': 'Thank you',
    }
  )
})
```

向 `GET /posts` 发出请求并测试响应。

```ts
describe('Example', () => {
  test('GET /posts', async () => {
    const res = await app.request('/posts')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Many posts')
  })
})
```

要向 `POST /posts` 发出请求，请执行以下操作。

```ts
test('POST /posts', async () => {
  const res = await app.request('/posts', {
    method: 'POST',
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

要使用 `JSON` 数据向 `POST /posts` 发出请求，请执行以下操作。

```ts
test('POST /posts', async () => {
  const res = await app.request('/posts', {
    method: 'POST',
    body: JSON.stringify({ message: 'hello hono' }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

要使用 `multipart/form-data` 数据向 `POST /posts` 发出请求，请执行以下操作。

```ts
test('POST /posts', async () => {
  const formData = new FormData()
  formData.append('message', 'hello')
  const res = await app.request('/posts', {
    method: 'POST',
    body: formData,
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

您也可以传递 Request 类的实例。

```ts
test('POST /posts', async () => {
  const req = new Request('http://localhost/posts', {
    method: 'POST',
  })
  const res = await app.request(req)
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

通过这种方式，您可以像进行端到端测试一样对其进行测试。

## 环境变量

为了在测试中设置 `c.env`，您可以将其作为第 3 个参数传递给 `app.request`。这对于模拟 [Cloudflare Workers 绑定](https://hono.dev/getting-started/cloudflare-workers#bindings) 之类的值很有用：

```ts
const MOCK_ENV = {
  API_HOST: 'example.com',
  DB: {
    prepare: () => {
      /* 模拟的 D1 */
    },
  },
}

test('GET /posts', async () => {
  const res = await app.request('/posts', {}, MOCK_ENV)
})
```
