# Cloudflare 上的 Better Auth

一个为 Cloudflare Workers 优化的、基于 TypeScript 的轻量级认证服务。

## 技术栈概览

**🔥 [Hono](https://hono.dev)**  
A fast, lightweight web framework built on web standards.

**🔒 [Better Auth](https://www.better-auth.com)**  
A comprehensive authentication framework for TypeScript.

**🧩 [Drizzle ORM](https://orm.drizzle.team)**  
A lightweight, high-performance ORM for TypeScript, built with DX in mind.

**🐘 [Postgres with Neon](https://neon.tech)**  
一个面向云端优化的无服务器 Postgres。

## 准备

### 1. 安装

::: code-group

```sh [npm]
# Hono
# > Select cloudflare-workers template
npm create hono

# Better Auth
npm install better-auth

# Drizzle ORM
npm install drizzle-orm
npm install --save-dev drizzle-kit

# Neon
npm install @neondatabase/serverless
```

```sh [pnpm]
# Hono
# > Select cloudflare-workers template
pnpm create hono

# Better Auth
pnpm add better-auth

# Drizzle ORM
pnpm add drizzle-orm
pnpm add -D drizzle-kit

# Neon
pnpm add @neondatabase/serverless
```

```sh [yarn]
# Hono
# > Select cloudflare-workers template
yarn create hono

# Better Auth
yarn add better-auth

# Drizzle ORM
yarn add drizzle-orm
yarn add --dev drizzle-kit

# Neon
yarn add @neondatabase/serverless
```

```sh [bun]
# Hono
# > Select cloudflare-workers template
bun create hono

# Better Auth
bun add better-auth

# Drizzle ORM
bun add drizzle-orm
bun add -d drizzle-kit

# Neon
bun add @neondatabase/serverless
```

:::

### 2. 环境变量

设置以下环境变量，以便让应用连接到 Better Auth 和 Neon。

请参考官方指南：

- [Better Auth – Guide](https://www.better-auth.com/docs/installation#set-environment-variables)
- [Neon – Guide](https://neon.tech/docs/connect/connect-from-any-app)

**所需文件：**

::: code-group

```Plain Text[.dev.vars]
# Wrangler 在本地开发时使用
# 在生产环境中，这些值应设置为 Cloudflare Worker Secrets。

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
DATABASE_URL=
```

```Plain Text[.env]
# 用于本地开发和以下 CLI 工具：
#
# - Drizzle CLI
# - Better Auth CLI

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
DATABASE_URL=
```

:::

### 3. Wrangler

设置好环境变量后，运行以下脚本为 Cloudflare Workers 配置生成类型：

::: code-group

```sh[npm]
npx wrangler types --env-interface CloudflareBindings
# OR
npm run cf-typegen
```

```sh[pnpm]
pnpm wrangler types --env-interface CloudflareBindings
# OR
pnpm cf-typegen

```

```sh[yarn]
yarn wrangler types --env-interface CloudflareBindings
# OR
yarn cf-typegen
```

```sh[bun]
bunx wrangler types --env-interface CloudflareBindings
# OR
bun run cf-typegen
```

:::

然后，确保你的 tsconfig.json 已包含生成的类型。

```json[tsconfig.json]
{
  "compilerOptions": {
    "types": ["worker-configuration.d.ts"]
  }
}
```

### 4. Drizzle

要使用 Drizzle Kit CLI，请在项目根目录添加以下 Drizzle 配置文件。

```ts[drizzle.config.ts]
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## 应用实现

### 1. Better Auth 实例

使用 Cloudflare Workers bindings 创建 Better Auth 实例。

可用的配置选项很多，远超这个示例所能涵盖的范围。
请参考官方文档，并根据你的项目需求进行配置：

(Docs: [Better Auth - Options](https://www.better-auth.com/docs/reference/options))

::: code-group

```ts[src/lib/better-auth/index.ts]
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { betterAuthOptions } from './options';

import * as schema from "../db/schema"; // Ensure the schema is imported

/**
 * Better Auth Instance
 */
export const auth = (env: CloudflareBindings): ReturnType<typeof betterAuth> => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: 'pg' }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    // Additional options that depend on env ...
  });
};
```

```ts[src/lib/better-auth/options.ts]
import { BetterAuthOptions } from 'better-auth';

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  /**
   * The name of the application.
   */
  appName: 'YOUR_APP_NAME',
  /**
   * Base path for Better Auth.
   * @default "/api/auth"
   */
  basePath: '/api',

  // .... More options
};
```

:::

### 2. Better Auth Schema

要为 Better Auth 创建所需的表，请先在项目根目录添加以下文件：

```ts[better-auth.config.ts]
/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { betterAuthOptions } from './src/lib/better-auth/options';

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env;

const sql = neon(DATABASE_URL!);
const db = drizzle(sql);

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(db, { provider: 'pg', schema }),  // schema is required in order for bettter-auth to recognize
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
});
```

Then, execute the following script:

::: code-group

```sh[npm]
npx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

```sh[pnpm]
pnpm dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

```sh[yarn]
yarn dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

```sh[bun]
bunx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

:::

### 3. 将 Schema 应用到数据库

生成 schema 文件后，运行以下命令以创建并应用数据库迁移：
同时检查你的 wrangler 配置，确保 `process.env` 能正确读取，这样后续 `wrangler dev` 才能正常工作。你还需要配置 [`node_compatibility`](https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive)。

::: code-group

```sh[npm]
npx drizzle-kit generate
npx drizzle-kit migrate
```

```sh[pnpm]
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

```sh[yarn]
yarn drizzle-kit generate
yarn drizzle-kit migrate
```

```sh[bun]
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

:::

### 4. 挂载处理器

将 Better Auth 处理器挂载到 Hono 端点，并确保挂载路径与 Better Auth 实例中的 `basePath` 设置一致。

```ts[src/index.ts]
import { Hono } from 'hono';
import { auth } from './lib/better-auth';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.on(['GET', 'POST'], '/api/*', (c) => {
  return auth(c.env).handler(c.req.raw);
});

export default app;
```

## 高级用法

这个示例基于 Hono、Better Auth 和 Drizzle 的官方文档整理而成。不过，它不仅仅是简单集成，还提供以下好处：

- 通过整合 Cloudflare CLI、Better Auth CLI 和 Drizzle CLI 提升开发效率。
- 在开发与生产环境之间平滑切换。
- 通过脚本一致地应用变更。

你可以根据自己的工作流，用自定义脚本扩展这套配置。例如：

```json[package.json]
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "pnpm run cf-gen-types && wrangler secret bulk .dev.vars.production && wrangler deploy --minify",
    "cf-gen-types": "wrangler types --env-interface CloudflareBindings",
    "better-auth-gen-schema": "pnpm dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts"
  },
}
```

> 注意：  
> 关于高级用法和最新选项，请参考每个工具的官方 CLI 文档：
>
> - [Cloudflare CLI](https://developers.cloudflare.com/workers/wrangler/)
> - [Better Auth CLI](https://www.better-auth.com/docs/concepts/cli)
> - [Drizzle ORM CLI](https://orm.drizzle.team/docs/kit-overview)

## 结语

现在，你已经拥有了一个运行在 Cloudflare Workers 上的轻量、快速且完整的认证服务。借助 Service Bindings，这套配置可以让你以极低延迟构建基于微服务的架构。

本指南只演示了一个**基础示例**，因此对于 OAuth、限流等高级场景，请参考官方文档并按你的服务需求定制配置。

完整示例源码请见：  
[GitHub Repository](https://github.com/bytaesu/cloudflare-auth-worker)
