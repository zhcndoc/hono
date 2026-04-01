# Validator 中的错误处理

借助验证器，你可以更轻松地处理无效输入。这个示例展示了如何利用回调结果来实现自定义错误处理。

尽管这个示例使用的是 [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)，但你可以在任何受支持的验证器库中采用类似的方法。

```ts
import * as z from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

app.post(
  '/users/new',
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid!', 400)
    }
  }),
  async (c) => {
    const user = c.req.valid('json')
    console.log(user.name) // string
    console.log(user.age) // number
  }
)
```

## 另请参阅

- [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)
- [Valibot Validator](https://github.com/honojs/middleware/tree/main/packages/valibot-validator)
- [Typebox Validator](https://github.com/honojs/middleware/tree/main/packages/typebox-validator)
- [Typia Validator](https://github.com/honojs/middleware/tree/main/packages/typia-validator)
