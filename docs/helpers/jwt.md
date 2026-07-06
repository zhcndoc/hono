# JWT 认证助手

此助手提供用于编码、解码、签名和验证 JSON Web Tokens (JWT) 的函数。JWT 通常用于 Web 应用程序中的认证和授权目的。此助手提供强大的 JWT 功能，支持各种加密算法。

## Importing

To use this helper, you can import it as follows:

```ts
import { decode, sign, verify } from 'hono/jwt'
```

::: info
[JWT middleware](/docs/middleware/builtin/jwt) also imports the `jwt` function from `hono/jwt`.
:::

## `sign()`

此函数通过编码 payload 并使用指定的算法和密钥对其进行签名来生成 JWT 令牌。

```ts
sign(
  payload: unknown,
  secret: string,
  alg?: 'HS256';

): Promise<string>;
```

### 示例

```ts
import { sign } from 'hono/jwt'

const payload = {
  sub: 'user123',
  role: 'admin',
  exp: Math.floor(Date.now() / 1000) + 60 * 5, // 令牌在 5 分钟后过期
}
const secret = 'mySecretKey'
const token = await sign(payload, secret)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> payload: `unknown`

要签名的 JWT payload。你可以包含其他 claims，如 [Payload 验证](#payload-validation) 中所示。

#### <Badge type="danger" text="必需" /> secret: `string`

用于 JWT 验证或签名的密钥。

#### <Badge type="info" text="可选" /> alg: [AlgorithmTypes](#supported-algorithmtypes)

用于 JWT 签名或验证的算法。默认是 HS256。

## `verify()`

此函数检查 JWT 令牌是否真实且仍然有效。它确保令牌未被篡改，并且仅当你添加了 [Payload 验证](#payload-validation) 时才检查有效性。

```ts
verify(
  token: string,
  secret: string,
  alg: 'HS256';
  issuer?: string | RegExp;
  aud?: string | string[] | RegExp;
): Promise<any>;

```

### 示例

```ts
import { verify } from 'hono/jwt'

const tokenToVerify = 'token'
const secretKey = 'mySecretKey'

const decodedPayload = await verify(tokenToVerify, secretKey, 'HS256')
console.log(decodedPayload)
```

### 选项

<br/>

#### <Badge type="danger" text="必需" /> token: `string`

要验证的 JWT 令牌。

#### <Badge type="danger" text="必需" /> secret: `string`

用于 JWT 验证或签名的密钥。

#### <Badge type="danger" text="必需" /> alg: [AlgorithmTypes](#supported-algorithmtypes)

用于 JWT 签名或验证的算法。

#### <Badge type="info" text="可选" /> issuer: `string | RegExp`

用于 JWT 验证的预期发行者。

#### <Badge type="info" text="可选" /> aud: `string | string[] | RegExp`

用于 JWT 验证的预期受众。如果设置了此项，令牌必须包含 `aud` 声明，并且至少一个受众值必须匹配。

## `decode()`

This function decodes a JWT token without performing signature verification. It extracts and returns the header and payload from the token.

```ts
decode(token: string): { header: any; payload: any };
```

### Example

```ts
import { decode } from 'hono/jwt'

// Decode JWT token
const tokenToDecode =
  'eyJhbGciOiAiSFMyNTYiLCAidHlwIjogIkpXVCJ9.eyJzdWIiOiAidXNlcjEyMyIsICJyb2xlIjogImFkbWluIn0.JxUwx6Ua1B0D1B0FtCrj72ok5cm1Pkmr_hL82sd7ELA'

const { header, payload } = decode(tokenToDecode)

console.log('Decoded Header:', header)
console.log('Decoded Payload:', payload)
```

### Options

<br/>

#### <Badge type="danger" text="Required" /> token: `string`

The JWT token to decode.

> The `decode` function allows you to inspect the header and payload of a JWT token _**without**_ verification. This can be useful for debugging or extracting information from JWT tokens.

## Payload 验证

验证 JWT 令牌时，会执行以下 payload 验证：

- `exp`: 检查令牌是否尚未过期。
- `nbf`: 检查令牌是否未在指定时间之前使用。
- `iat`: 检查令牌是否未在未来签发。
- `iss`: 检查令牌是否由受信任的签发者签发。
- `aud`: 当设置了 `aud` 验证参数时，检查令牌是否旨在用于可接受的受众。

如果你打算在验证期间执行这些检查，请确保你的 JWT payload 包含这些字段（作为对象）。

## 自定义错误类型

该模块还定义了用于处理 JWT 相关错误的自定义错误类型。

- `JwtAlgorithmNotImplemented`：表示请求的 JWT 算法未实现。
- `JwtTokenInvalid`：表示 JWT 令牌无效。
- `JwtTokenNotBefore`：表示令牌在其有效日期之前被使用。
- `JwtTokenExpired`：表示令牌已过期。
- `JwtTokenIssuedAt`：表示令牌中的 "iat" 声明不正确。
- `JwtTokenIssuer`：表示令牌中的 "iss" 声明不正确。
- `JwtPayloadRequiresAud`：表示在配置了 `aud` 验证时，需要提供 `aud` 声明。
- `JwtTokenAudience`：表示令牌的 `aud` 声明与期望的受众不匹配。
- `JwtTokenSignatureMismatched`：表示令牌中的签名不匹配。

## 支持的算法类型

该模块支持以下 JWT 加密算法：

- `HS256`: 使用 SHA-256 的 HMAC
- `HS384`: 使用 SHA-384 的 HMAC
- `HS512`: 使用 SHA-512 的 HMAC
- `RS256`: 使用 SHA-256 的 RSASSA-PKCS1-v1_5
- `RS384`: 使用 SHA-384 的 RSASSA-PKCS1-v1_5
- `RS512`: 使用 SHA-512 的 RSASSA-PKCS1-v1_5
- `PS256`: 使用 SHA-256 以及带 SHA-256 的 MGF1 的 RSASSA-PSS
- `PS384`: 使用 SHA-386 以及带 SHA-386 的 MGF1 的 RSASSA-PSS
- `PS512`: 使用 SHA-512 以及带 SHA-512 的 MGF1 的 RSASSA-PSS
- `ES256`: 使用 P-256 和 SHA-256 的 ECDSA
- `ES384`: 使用 P-384 和 SHA-384 的 ECDSA
- `ES512`: 使用 P-521 和 SHA-512 的 ECDSA
- `EdDSA`: 使用 Ed25519 的 EdDSA
