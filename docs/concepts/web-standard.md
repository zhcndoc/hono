# Web 标准

Hono 仅使用像 Fetch 这样的 **Web 标准**。
它们最初用于 `fetch` 函数，由处理 HTTP 请求和响应的基本对象组成。
除了 `Requests` 和 `Responses` 之外，还有 `URL`、`URLSearchParam`、`Headers` 等。

Cloudflare Workers、Deno 和 Bun 也是基于 Web 标准构建的。
例如，一个返回 "Hello World" 的服务器可以写成下面这样。这可以在 Cloudflare Workers 和 Bun 上运行。

```ts twoslash
export default {
  async fetch() {
    return new Response('Hello World')
  },
}
```

Hono 仅使用 Web 标准，这意味着 Hono 可以在任何支持它们的运行时上运行。
此外，我们有一个 Node.js 适配器。Hono 可以在这些运行时上运行：

- Cloudflare Workers (`workerd`)
- Deno
- Bun
- Fastly Compute
- AWS Lambda
- Node.js
- Vercel (edge-light)
- WebAssembly（通过 [`wasi:http`][wasi-http] 使用 [WebAssembly 系统接口 (WASI)][wasi]）

它也适用于 Netlify 和其他平台。
相同的代码可以在所有平台上运行。

Cloudflare Workers、Deno、Shopify 等发起了 [WinterCG](https://wintercg.org)，以讨论使用 Web 标准实现"Web 互操作性"的可能性。
Hono 将追随他们的脚步，致力于 **Web 标准的标准**。

[wasi]: https://github.com/WebAssembly/wasi
[wasi-http]: https://github.com/WebAssembly/wasi-http
