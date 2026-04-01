# Secure Headers 中间件

Secure Headers 中间件简化了安全头部的设置。部分灵感来源于 Helmet 的功能，它允许您控制特定安全头部的激活和停用。

## 导入

```ts
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
```

## 用法

默认情况下，您可以使用最佳设置。

```ts
const app = new Hono()
app.use(secureHeaders())
```

您可以通过将它们设置为 false 来抑制不必要的头部。

```ts
const app = new Hono()
app.use(
  '*',
  secureHeaders({
    xFrameOptions: false,
    xXssProtection: false,
  })
)
```

您可以使用字符串覆盖默认的头部值。

```ts
const app = new Hono()
app.use(
  '*',
  secureHeaders({
    strictTransportSecurity:
      'max-age=63072000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xXssProtection: '1',
  })
)
```

## 支持的选项

每个选项对应以下头部键值对。

| 选项                            | 头部                                                                                                                                         | 值                                                                       | 默认       |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| -                               | X-Powered-By                                                                                                                                   | (删除头部)                                                               | 启用       |
| contentSecurityPolicy           | [内容安全策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)                                                               | 用法：[设置内容安全策略](#设置内容安全策略) | 未设置     |
| contentSecurityPolicyReportOnly | [内容安全策略仅报告](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only)           | 用法：[设置内容安全策略](#设置内容安全策略) | 未设置     |
| trustedTypes                    | [可信类型](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types)                               | 用法：[设置内容安全策略](#设置内容安全策略) | 未设置     |
| requireTrustedTypesFor          | [要求可信类型用于](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/require-trusted-types-for)       | 用法：[设置内容安全策略](#设置内容安全策略) | 未设置     |
| crossOriginEmbedderPolicy       | [跨源嵌入者策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)                         | require-corp                                                               | **禁用**   |
| crossOriginResourcePolicy       | [跨源资源策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy)                         | same-origin                                                                | 启用       |
| crossOriginOpenerPolicy         | [跨源打开者策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)                             | same-origin                                                                | 启用       |
| originAgentCluster              | [源代理集群](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin-Agent-Cluster)                                         | ?1                                                                         | 启用       |
| referrerPolicy                  | [引荐来源策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)                                                   | no-referrer                                                                | 启用       |
| reportingEndpoints              | [报告端点](https://www.w3.org/TR/reporting-1/#header)                                                                               | 用法：[设置内容安全策略](#设置内容安全策略) | 未设置     |
| reportTo                        | [报告至](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)                                       | 用法：[设置内容安全策略](#设置内容安全策略) | 未设置     |
| strictTransportSecurity         | [严格传输安全](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)                               | max-age=15552000; includeSubDomains                                        | 启用       |
| xContentTypeOptions             | [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)                                     | nosniff                                                                    | 启用       |
| xDnsPrefetchControl             | [X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)                                     | off                                                                        | 启用       |
| xDownloadOptions                | [X-Download-Options](https://learn.microsoft.com/en-us/archive/blogs/ie/ie8-security-part-v-comprehensive-protection#mime-handling-force-save) | noopen                                                                     | 启用       |
| xFrameOptions                   | [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)                                                   | SAMEORIGIN                                                                 | 启用       |
| xPermittedCrossDomainPolicies   | [X-Permitted-Cross-Domain-Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Permitted-Cross-Domain-Policies)               | none                                                                       | 启用       |
| xXssProtection                  | [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)                                                 | 0                                                                          | 启用       |
| permissionPolicy                | [权限策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Permissions-Policy)                                             | 用法：[设置权限策略](#设置权限策略)             | 未设置     |

## 中间件冲突

在处理操作相同头部的中间件时，请注意指定顺序。

在这种情况下，Secure-headers 生效，`x-powered-by` 被移除：

```ts
const app = new Hono()
app.use(secureHeaders())
app.use(poweredBy())
```

在这种情况下，Powered-By 生效，`x-powered-by` 被添加：

```ts
const app = new Hono()
app.use(poweredBy())
app.use(secureHeaders())
```

## 设置内容安全策略

```ts
const app = new Hono()
app.use(
  '/test',
  secureHeaders({
    reportingEndpoints: [
      {
        name: 'endpoint-1',
        url: 'https://example.com/reports',
      },
    ],
    // -- 或者另一种方式
    // reportTo: [
    //   {
    //     group: 'endpoint-1',
    //     max_age: 10886400,
    //     endpoints: [{ url: 'https://example.com/reports' }],
    //   },
    // ],
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      childSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      frameSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      manifestSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      reportTo: 'endpoint-1',
      reportUri: '/csp-report',
      sandbox: ['allow-same-origin', 'allow-scripts'],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      scriptSrcElem: ["'self'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      styleSrcAttr: ['none'],
      styleSrcElem: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'"],
    },
  })
)
```

### `nonce` 属性

您可以通过将 `hono/secure-headers` 导出的 `NONCE` 添加到 `scriptSrc` 或 `styleSrc`，从而为 `script` 或 `style` 元素添加 [`nonce` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce)：

```tsx
import { secureHeaders, NONCE } from 'hono/secure-headers'
import type { SecureHeadersVariables } from 'hono/secure-headers'

// 指定变量类型以推断 `c.get('secureHeadersNonce')`：
type Variables = SecureHeadersVariables

const app = new Hono<{ Variables: Variables }>()

// 将预定义的 nonce 值设置到 `scriptSrc`：
app.get(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      scriptSrc: [NONCE, 'https://allowed1.example.com'],
    },
  })
)

// 从 `c.get('secureHeadersNonce')` 获取值：
app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        {/** 内容 */}
        <script
          src='/js/client.js'
          nonce={c.get('secureHeadersNonce')}
        />
      </body>
    </html>
  )
})
```

如果您想自己生成 nonce 值，也可以按以下方式指定一个函数：

```tsx
const app = new Hono<{
  Variables: { myNonce: string }
}>()

const myNonceGenerator: ContentSecurityPolicyOptionHandler = (c) => {
  // 此函数在每次请求时被调用。
  const nonce = Math.random().toString(36).slice(2)
  c.set('myNonce', nonce)
  return `'nonce-${nonce}'`
}

app.get(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      scriptSrc: [myNonceGenerator, 'https://allowed1.example.com'],
    },
  })
)

app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        {/** 内容 */}
        <script src='/js/client.js' nonce={c.get('myNonce')} />
      </body>
    </html>
  )
})
```

## 设置 Permission-Policy

Permission-Policy 标头允许您控制浏览器中可以使用哪些功能和 API。以下是如何设置它的示例：

```ts
const app = new Hono()
app.use(
  '*',
  secureHeaders({
    permissionsPolicy: {
      fullscreen: ['self'], // 全屏=(self)
      bluetooth: ['none'], // 蓝牙=(none)
      payment: ['self', 'https://example.com'], // 支付=(self "https://example.com")
      syncXhr: [], // 同步 XMLHttpRequest=()
      camera: false, // 摄像头=none
      microphone: true, // 麦克风=*
      geolocation: ['*'], // 地理位置=*
      usb: ['self', 'https://a.example.com', 'https://b.example.com'], // USB=(self "https://a.example.com" "https://b.example.com")
      accelerometer: ['https://*.example.com'], // 加速度计=("https://*.example.com")
      gyroscope: ['src'], // 陀螺仪=(src)
      magnetometer: [
        'https://a.example.com',
        'https://b.example.com',
      ], // 磁力计=("https://a.example.com" "https://b.example.com")
    },
  })
)
```
