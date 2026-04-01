# Basic Auth 中间件

此中间件可以将基本认证应用于指定路径。
使用 Cloudflare Workers 或其他平台实现基本认证比看起来更复杂，但有了这个中间件，这就轻而易举了。

有关基本认证方案如何在底层工作的更多信息，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme)。

## 导入

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

## 用法

```ts
const app = new Hono()

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

要限制为特定路由 + 方法：

```ts
const app = new Hono()

app.get('/auth/page', (c) => {
  return c.text('Viewing page')
})

app.delete(
  '/auth/page',
  basicAuth({ username: 'hono', password: 'acoolproject' }),
  (c) => {
    return c.text('Page deleted')
  }
)
```

如果你想自行验证用户，指定 `verifyUser` 选项；返回 `true` 表示接受。

```ts
const app = new Hono()

app.use(
  basicAuth({
    verifyUser: (username, password, c) => {
      return (
        username === 'dynamic-user' && password === 'hono-password'
      )
    },
  })
)
```

## 选项

### <Badge type="danger" text="必需" /> username: `string`

正在进行认证的用户的用户名。

### <Badge type="danger" text="必需" /> password: `string`

用于针对提供的用户名进行认证的密码值。

### <Badge type="info" text="可选" /> realm: `string`

领域的域名，作为返回的 WWW-Authenticate 挑战头的一部分。默认值为 `"Secure Area"`。  
查看更多：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives

### <Badge type="info" text="可选" /> hashFunction: `Function`

一个用于处理哈希以安全比较密码的函数。

### <Badge type="info" text="可选" /> verifyUser: `(username: string, password: string, c: Context) => boolean | Promise<boolean>`

用于验证用户的函数。

### <Badge type="info" text="可选" /> invalidUserMessage: `string | object | MessageFunction`

`MessageFunction` 是 `(c: Context) => string | object | Promise<string | object>`。如果用户无效则返回自定义消息。

### <Badge type="info" text="可选" /> onAuthSuccess: `(c: Context, username: string) => void | Promise<void>`

成功认证后调用的回调函数。这允许你设置上下文变量或执行副作用，而无需重新解析 Authorization 头。

```ts
app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
    onAuthSuccess: (c, username) => {
      c.set('username', username)
    },
  })
)

app.get('/auth/page', (c) => {
  const username = c.get('username')
  return c.text(`Hello, ${username}!`)
})
```

## 更多选项

### <Badge type="info" text="可选" /> ...users: `{ username: string, password: string }[]`

## 示例

### 定义多个用户

此中间件还允许你传递包含定义更多 `username` 和 `password` 对的对象的任意参数。

```ts
app.use(
  '/auth/*',
  basicAuth(
    {
      username: 'hono',
      password: 'acoolproject',
      // 在第一个对象中定义其他参数
      realm: 'www.example.com',
    },
    {
      username: 'hono-admin',
      password: 'super-secure',
      // 不能在此处重新定义其他参数
    },
    {
      username: 'hono-user-1',
      password: 'a-secret',
      // 或此处
    }
  )
)
```

或者少硬编码一些：

```ts
import { users } from '../config/users'

app.use(
  '/auth/*',
  basicAuth(
    {
      realm: 'www.example.com',
      ...users[0],
    },
    ...users.slice(1)
  )
)
```
