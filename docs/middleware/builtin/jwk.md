# JWK 认证中间件

JWK 认证中间件通过使用 JWK (JSON Web Key) 验证令牌来认证请求。它检查 `Authorization` 头部以及其他配置的来源（如指定时的 cookies）。它使用提供的 `keys` 验证令牌，如果指定了 `jwks_uri` 则从中检索密钥，并且如果设置了 `cookie` 选项，则支持从 cookies 中提取令牌。

## 此中间件验证的内容

对于每个令牌，`jwk()`：

- 解析并验证 JWT 头部格式。
- 需要 `kid` 头部，并通过 `kid` 查找匹配密钥。
- 拒绝对称算法（`HS256`、`HS384`、`HS512`）。
- 要求头部 `alg` 包含在配置的 `alg` 允许列表中。
- 如果匹配的 JWK 具有 `alg` 字段，则要求它与 JWT 头部 `alg` 匹配。
- 使用匹配的密钥验证令牌签名。
- 默认情况下，验证基于时间的声明：`nbf`、`exp` 和 `iat`。

可选的声明验证可以通过 `verification` 选项配置：

- `iss`：提供时验证颁发者。
- `aud`：提供时验证受众。

如果您需要上述之外的额外令牌检查（例如，自定义应用程序级授权规则），请在 `jwk()` 之后的自有中间件中添加它们。

:::info
客户端发送的 Authorization 头部必须具有指定的方案。

示例：`Bearer my.token.value` 或 `Basic my.token.value`
:::

## 导入

```ts
import { Hono } from 'hono'
import { jwk } from 'hono/jwk'
import { verifyWithJwks } from 'hono/jwt'
```

## 用法

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
    alg: ['RS256'],
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

获取 payload：

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
    alg: ['RS256'],
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // 例如：{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})
```

匿名访问：

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: (c) =>
      `https://${c.env.authServer}/.well-known/jwks.json`,
    alg: ['RS256'],
    allow_anon: true,
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload ?? { message: 'hello anon' })
})
```

## 在中间件之外使用 `verifyWithJwks`

`verifyWithJwks` 实用函数可用于在 Hono 中间件上下文之外验证 JWT 令牌，例如在 SvelteKit SSR 页面或其他服务器端环境中：

```ts
const id_payload = await verifyWithJwks(
  id_token,
  {
    jwks_uri: 'https://your-auth-server/.well-known/jwks.json',
    allowedAlgorithms: ['RS256'],
  },
  {
    cf: { cacheEverything: true, cacheTtl: 3600 },
  }
)
```

## 配置 JWKS 获取请求选项

要配置如何从 `jwks_uri` 检索 JWKS，请将 fetch 请求选项作为 `jwk()` 的第二个参数传递。

此参数为 `RequestInit`，仅用于 JWKS 获取请求。

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk(
    {
      jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
      alg: ['RS256'],
    },
    {
      headers: {
        Authorization: 'Bearer TOKEN',
      },
    }
  )
)
```

## 选项

### <Badge type="danger" text="必需" /> alg: `AsymmetricAlgorithm[]`

用于令牌验证的允许非对称算法数组。

可用类型为 `RS256` | `RS384` | `RS512` | `PS256` | `PS384` | `PS512` | `ES256` | `ES384` | `ES512` | `EdDSA`。

### <Badge type="info" text="可选" /> keys: `HonoJsonWebKey[] | (c: Context) => Promise<HonoJsonWebKey[]>`

您的公钥值，或返回它们的函数。该函数接收 Context 对象。

### <Badge type="info" text="可选" /> jwks_uri: `string` | `(c: Context) => Promise<string>`

如果设置了此值，则尝试从此 URI 获取 JWK，期望响应为包含 `keys` 的 JSON，这些 keys 将添加到提供的 `keys` 选项中。您也可以传递回调函数以使用 Context 动态确定 JWKS URI。

### <Badge type="info" text="可选" /> allow_anon: `boolean`

如果将此值设置为 `true`，则没有有效令牌的请求将被允许通过中间件。使用 `c.get('jwtPayload')` 检查请求是否已认证。默认为 `false`。

### <Badge type="info" text="可选" /> cookie: `string`

如果设置了此值，则使用该值作为键从 cookie 头部检索值，然后将其作为令牌进行验证。

### <Badge type="info" text="可选" /> headerName: `string`

用于查找 JWT 令牌的头部名称。默认为 `Authorization`。

### <Badge type="info" text="可选" /> verification: `VerifyOptions`

配置除签名验证之外的声明验证行为：

- `iss`：预期的颁发者。
- `aud`：预期的受众。
- `exp`, `nbf`, `iat`：默认启用，如有需要可禁用。
