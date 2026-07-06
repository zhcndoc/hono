# Cloudflare Workers + Vite

你可以使用 [Vite](https://vite.dev) 和 [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/) 在 [Cloudflare Workers](https://workers.cloudflare.com) 上构建一个全栈应用。
这种设置为你提供了快速的 Vite 开发服务器、借助 Hono 的 JSX 渲染器进行服务端渲染，以及由 Vite 打包的客户端脚本——全部运行在 Cloudflare Workers 上。

这是在 Cloudflare 上启动一个新的全栈项目的推荐方式。

## 1. 设置

可用于 Cloudflare Workers 和 Vite 的起始模板已提供。
使用 `"create-hono"` 命令启动你的项目。
在本示例中请选择 `cloudflare-workers+vite` 模板。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono my-app
```

:::

进入 `my-app` 并安装依赖。

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

下面是一个基本的目录结构。

```text
./
├── package.json
├── public // 将你的静态文件放在这里。
├── src
│   ├── index.tsx // 服务端入口点。
│   ├── renderer.tsx
│   └── style.css
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```

`vite.config.ts` 将 Cloudflare 插件与 `vite-ssr-components` 组合用于 SSR：

```ts
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin()],
})
```

## 2. Hello World

将 `src/index.tsx` 编辑为如下内容：

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Workers!</h1>)
})

export default app
```

`renderer` 在 `src/renderer.tsx` 中定义，使用了 Hono 的 [JSX 渲染中间件](/docs/middleware/builtin/jsx-renderer) 以及 `vite-ssr-components`，它会连接 Vite 的客户端和资源：

```tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Link href='/src/style.css' rel='stylesheet' />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

## 3. 运行

在本地运行开发服务器。然后，在你的网页浏览器中访问 `http://localhost:5173`。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 4. 部署

如果你有 Cloudflare 账户，可以部署到 Cloudflare。`deploy` 脚本会先使用 Vite 构建，然后通过 Wrangler 发布。

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm run deploy
```

```sh [bun]
bun run deploy
```

:::

## 绑定

你可以使用 Cloudflare Bindings，例如 Variables、KV、D1 等。
在 `wrangler.jsonc` 中进行配置。例如，要添加一个名为 `MY_NAME` 的 Variable：

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_date": "2025-08-03",
  "main": "./src/index.tsx",
  "vars": {
    "MY_NAME": "Hono",
  },
}
```

要为你的 Bindings 生成类型，请运行 `cf-typegen` 脚本：

::: code-group

```sh [npm]
npm run cf-typegen
```

```sh [yarn]
yarn cf-typegen
```

```sh [pnpm]
pnpm run cf-typegen
```

```sh [bun]
bun run cf-typegen
```

:::

这会生成一个 `CloudflareBindings` 接口。将其作为泛型传递给 `Hono`：

```ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

然后通过 `c.env` 访问 Bindings：

```tsx
app.get('/', (c) => {
  return c.render(<h1>你好！{c.env.MY_NAME}</h1>)
})
```

## 客户端

`vite-ssr-components` 允许你通过 Vite 加载客户端脚本。
添加一个指向你的客户端入口点的 `Script` 组件，Vite 会同时处理开发环境和生产环境的打包：

```tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Script src='/src/client.ts' />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

更多详情请参阅 [`@cloudflare/vite-plugin` 文档](https://developers.cloudflare.com/workers/vite-plugin/) 和 [`vite-ssr-components`](https://github.com/yusukebe/vite-ssr-components)。
