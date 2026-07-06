# ConnInfo 助手

ConnInfo 助手帮助您获取连接信息。例如，您可以轻松获取客户端的远程地址。

## 导入

::: code-group

```ts [Cloudflare Workers]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/cloudflare-workers'
```

```ts [Deno]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/deno'
```

```ts [Bun]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/bun'
```

```ts [Vercel]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/vercel'
```

```ts [AWS Lambda]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/aws-lambda'
```

```ts [Netlify]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/netlify'
```

```ts [Lambda@Edge]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/lambda-edge'
```

```ts [Node.js]
import { Hono } from 'hono'
import { getConnInfo } from '@hono/node-server/conninfo'
```

:::

## 用法

```ts
const app = new Hono()

app.get('/', (c) => {
  const info = getConnInfo(c) // info 是 `ConnInfo`
  return c.text(`Your remote address is ${info.remote.address}`)
})
```

## 类型定义

您可以通过 `getConnInfo()` 获取的值的类型定义如下：

```ts
type AddressType = 'IPv6' | 'IPv4' | undefined

type NetAddrInfo = {
  /**
   * Transmission protocol type
   */
  transport?: 'tcp' | 'udp'
  /**
   * Transmission port number
   */
  port?: number

  address?: string
  addressType?: AddressType
} & (
  | {
      /**
       * Hostname, such as an IP address
       */
      address: string

      /**
       * Hostname type
       */
      addressType: AddressType
    }
  | {}
)

/**
 * HTTP connection information
 */
interface ConnInfo {
  /**
   * Remote information
   */
  remote: NetAddrInfo
}
```
