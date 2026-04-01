# Fastly Compute

[Fastly Compute](https://www.fastly.com/products/edge-compute) 是一个先进的边缘计算系统，它可以在 Fastly 的全球边缘网络上以您喜欢的语言运行您的代码。Hono 也可以在 Fastly Compute 上运行。

您可以使用 [Fastly CLI](https://www.fastly.com/documentation/reference/tools/cli/) 在本地开发应用程序并通过几条命令发布它，该 CLI 作为模板的一部分会自动安装在本地。

## 1. 设置

Fastly Compute 的入门模板可用。
使用 "create-hono" 命令开始您的项目。
为本示例选择 `fastly` 模板。

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

进入 `my-app` 并安装依赖项。

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

## 2. 你好世界

编辑 `src/index.ts`：

```ts
// src/index.ts
import { Hono } from 'hono'
import { fire } from '@fastly/hono-fastly-compute'

const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

fire(app)
```

> [!NOTE]
> 当在应用程序的顶层使用来自 `@fastly/hono-fastly-compute'` 的 `fire`（或 `buildFire()`）时，适合使用来自 `'hono'` 的 `Hono` 而不是 `'hono/quick'`，因为 `fire` 会导致其路由器在应用程序初始化阶段构建其内部数据。

## 3. 运行

在本地运行开发服务器。然后，在您的 Web 浏览器中访问 `http://localhost:7676`。

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm run start
```

```sh [bun]
bun run start
```

:::

## 4. 部署

要构建并将应用程序部署到您的 Fastly 账户，请输入以下命令。首次部署应用程序时，系统会提示您在账户中创建新服务。

如果您还没有账户，必须 [创建您的 Fastly 账户](https://www.fastly.com/signup/)。

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

在 Fastly Compute 中，您可以绑定 Fastly 平台资源，例如 KV Stores、Config Stores、Secret Stores、Backends、Access Control Lists、Named Log Streams 和环境变量。您可以通过 `c.env` 访问它们，并将拥有它们各自的 SDK 类型。

要使用这些绑定，请从 `@fastly/hono-fastly-compute` 导入 `buildFire` 而不是 `fire`。定义您的 [绑定](https://github.com/fastly/compute-js-context?tab=readme-ov-file#typed-bindings-with-buildcontextproxy) 并将它们传递给 [`buildFire()`](https://github.com/fastly/hono-fastly-compute?tab=readme-ov-file#basic-example) 以获取 `fire`。然后在构建 `Hono` 时使用 `fire.Bindings` 来定义您的 `Env` 类型。

```ts
// src/index.ts
import { buildFire } from '@fastly/hono-fastly-compute'

const fire = buildFire({
  siteData: 'KVStore:site-data', // 我有一个名为 "site-data" 的 KV Store
})

const app = new Hono<{ Bindings: typeof fire.Bindings }>()

app.put('/upload/:key', async (c, next) => {
  // 例如，访问 KV Store
  const key = c.req.param('key')
  await c.env.siteData.put(key, c.req.body)
  return c.text(`Put ${key} successfully!`)
})

fire(app)
```
