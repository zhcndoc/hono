# 缓存中间件

缓存中间件使用 Web 标准的 [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache)。

缓存中间件目前支持使用自定义域名的 Cloudflare Workers 项目和使用 [Deno 1.26+](https://github.com/denoland/deno/releases/tag/v1.26.0) 的 Deno 项目。也可用于 Deno Deploy。

Cloudflare Workers 尊重 `Cache-Control` 头并返回缓存的响应。详细信息请参阅 [Cloudflare 文档上的缓存](https://developers.cloudflare.com/workers/runtime-apis/cache/)。Deno 不尊重头信息，因此如果您需要更新缓存，则需要实现自己的机制。

有关每个平台的说明，请参阅下面的 [用法](#usage)。

## 导入

```ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
```

## 用法

::: code-group

```ts [Cloudflare Workers]
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
  })
)
```

```ts [Deno]
// Deno 运行时必须使用 `wait: true`
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
    wait: true,
  })
)
```

:::

## 选项

### <Badge type="danger" text="必需" /> cacheName: `string` | `(c: Context) => string` | `Promise<string>`

缓存的名称。可用于存储具有不同标识符的多个缓存。

### <Badge type="info" text="可选" /> wait: `boolean`

一个布尔值，指示 Hono 是否应在继续请求之前等待 `cache.put` 函数的 Promise 解析。_在 Deno 环境中必须为 true_。默认为 `false`。

### <Badge type="info" text="可选" /> cacheControl: `string`

`Cache-Control` 头的指令字符串。有关更多信息，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control)。当未提供此选项时，不会向请求添加 `Cache-Control` 头。

### <Badge type="info" text="可选" /> vary: `string` | `string[]`

设置响应中的 `Vary` 头。如果原始响应头已包含 `Vary` 头，则合并值，移除任何重复项。将其设置为 `*` 将导致错误。有关 Vary 头及其对缓存策略影响的更多详细信息，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary)。

### <Badge type="info" text="可选" /> keyGenerator: `(c: Context) => string | Promise<string>`

为 `cacheName` 存储中的每个请求生成键。这可用于基于请求参数或上下文参数缓存数据。默认为 `c.req.url`。

### <Badge type="info" text="可选" /> cacheableStatusCodes: `number[]`

应缓存的状态码数组。默认为 `[200]`。使用此选项缓存具有特定状态码的响应。

```ts
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
    cacheableStatusCodes: [200, 404, 412],
  })
)
```
