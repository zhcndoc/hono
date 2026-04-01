# Vercel

Vercel 是 AI 云，提供开发者工具和云基础设施，以构建、扩展和保护更快、更个性化的 Web。

Hono 可以零配置部署到 Vercel。

## 1. 设置

提供了一个 Vercel 的 starter 模板。
使用 "create-hono" 命令开始你的项目。
为本示例选择 `vercel` 模板。

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

下一步我们将使用 Vercel CLI 在本地开发应用。如果尚未安装，请按照 [Vercel CLI 文档](https://vercel.com/docs/cli) 全局安装它。

## 2. 你好世界

在项目的 `index.ts` 或 `src/index.ts` 中，将 Hono 应用作为默认导出。

```ts
import { Hono } from 'hono'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/backend/hono',
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app
```

如果你使用 `vercel` 模板开始项目，这已经为你设置好了。

## 3. 运行

要在本地运行开发服务器：

```sh
vercel dev
```

访问 `localhost:3000` 将返回文本响应。

## 4. 部署

使用 `vc deploy` 部署到 Vercel。

```sh
vercel deploy
```

## 进一步阅读

[在 Vercel 文档中了解更多关于 Hono 的信息](https://vercel.com/docs/frameworks/backend/hono)。
