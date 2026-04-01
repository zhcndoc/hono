# 理念

在本节中，我们将讨论 Hono 的概念，或者说理念。

## 动机

起初，我只是想在 Cloudflare Workers 上创建一个 Web 应用程序。
但是，并没有能在 Cloudflare Workers 上运行的好框架。
所以，我开始构建 Hono。

我认为这是一个学习如何使用 Trie 树构建路由器的好机会。
然后一位朋友带来了名为 "RegExpRouter" 的极速路由器。
我还有一位朋友创建了基本认证中间件。

仅使用 Web 标准 API，我们就可以让它在 Deno 和 Bun 上运行。当人们问“有适用于 Bun 的 Express 吗？”，我们可以回答，“没有，但有 Hono"。
（虽然 Express 现在也可以在 Bun 上运行了。）

我们还有朋友制作了 GraphQL 服务器、Firebase 认证和 Sentry 中间件。
而且，我们还有一个 Node.js 适配器。
一个生态系统已经涌现。

换句话说，Hono 超快，能实现很多东西，并且无处不在。
我们可以设想，Hono 可能会成为 **Web 标准的标准**。
