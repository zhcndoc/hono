# 文件上传

你可以使用 `multipart/form-data` 上传文件。上传的字段可通过 `c.req.parseBody()` 获取。

## 基本示例

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!(file instanceof File)) {
    return c.text('需要文件', 400)
  }

  return c.json({
    name: file.name,
    size: file.size,
    type: file.type,
  })
})
```

## 限制上传大小

```ts
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

const app = new Hono()

app.post(
  '/upload',
  bodyLimit({
    maxSize: 5 * 1024 * 1024, // 5 MiB
    onError: (c) => {
      return c.text('文件过大', 413)
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()
    const file = body['file']

    if (!(file instanceof File)) {
      return c.text('需要文件', 400)
    }

    return c.text(`已上传 ${file.name}`)
  }
)
```

## 多个文件

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody({ all: true })
  const value = body['file']

  const files = Array.isArray(value)
    ? value.filter((item): item is File => item instanceof File)
    : value instanceof File
      ? [value]
      : []

  if (files.length === 0) {
    return c.text('至少需要一个文件', 400)
  }

  return c.json({
    count: files.length,
    files: files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  })
})
```

## 先验证再持久化

在将上传的文件写入磁盘或转发到其他服务之前，请验证预期的字段是否存在，并检查文件名、MIME 类型和大小等元数据。

## 另请参阅

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)
- [Body Limit Middleware](/docs/middleware/builtin/body-limit)
- [验证](/docs/guides/validation)
