# 文件上传

你可以使用 `multipart/form-data` 内容类型上传文件。上传后的文件会在 `c.req.parseBody()` 中可用。

```ts
const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
})
```

## 另请参阅

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)
