# Pretty JSON 中间件

Pretty JSON 中间件为 JSON 响应体启用"_JSON 美化打印_"。
在 URL 查询参数中添加 `?pretty`，JSON 字符串将被美化。

```js
// GET /
{"project":{"name":"Hono","repository":"https://github.com/honojs/hono"}}
```

将会变成：

```js
// GET /?pretty
{
  "project": {
    "name": "Hono",
    "repository": "https://github.com/honojs/hono"
  }
}
```

## 导入

```ts
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
```

## 用法

```ts
const app = new Hono()

app.use(prettyJSON()) // 带选项：prettyJSON({ space: 4 })
app.get('/', (c) => {
  return c.json({ message: 'Hono!' })
})
```

## 选项

### <Badge type="info" text="可选" /> space: `number`

缩进的空格数。默认为 `2`。

### <Badge type="info" text="可选" /> query: `string`

用于应用的查询字符串名称。默认为 `pretty`。

### <Badge type="info" text="可选" /> force: `boolean`

当设置为 `true` 时，无论查询参数如何，JSON 响应始终会被美化。默认为 `false`。
