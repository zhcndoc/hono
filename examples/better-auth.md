# Better Auth

将 Hono 与 [Better Auth](http://better-auth.com/) 一起用于认证。

Better Auth 是一个与框架无关的 TypeScript 认证与授权框架。它开箱即用地提供了一整套功能，并带有插件生态，可简化高级能力的接入。

## 配置

1. 安装框架：

```sh
# npm
npm install better-auth

# bun
bun add better-auth

# pnpm
pnpm add better-auth

# yarn
yarn add better-auth
```

2. 在 `.env` 文件中添加所需环境变量：

```sh
BETTER_AUTH_SECRET=<generate-a-secret-key> (e.g. D27gijdvth3Ul3DjGcexjcFfgCHc8jWd)
BETTER_AUTH_URL=<url-of-your-server> (e.g. http://localhost:1234)
```

3. 创建 Better Auth 实例

```ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import prisma from '@/db/index'
import env from '@/env'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Allow requests from the frontend development server
  trustedOrigins: ['http://localhost:5173'],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
```

上面的代码：

- 将数据库设置为使用 Prisma ORM 和 PostgreSQL
- 指定受信任来源
  - 受信任来源是允许向认证 API 发起请求的应用，通常就是你的客户端（前端）
  - 其他来源会被自动阻止
- 启用邮箱/密码认证并配置社交登录提供方

4. Generate all the required models, fields, and relationships to the Prisma schema file:

```sh
bunx @better-auth/cli generate
```

5. Create the API Handler for the auth API requests in `routes/auth.ts`

This route uses the handler provided by Better Auth to serve all `POST` and `GET` requests to the `/api/auth` endpoint.

```ts
import { Hono } from 'hono'
import { auth } from '../lib/auth'
import type { AuthType } from '../lib/auth'

const router = new Hono<{ Bindings: AuthType }>({
  strict: false,
})

router.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default router
```

6. 挂载路由

下面的代码会挂载该路由。

```ts
import { Hono } from "hono";
import type { AuthType } from "../lib/auth"
import auth from "@/routes/auth";

const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});

const routes = [auth, ...other routes] as const;

routes.forEach((route) => {
  app.basePath("/api").route("/", route);
});

export default app;
```

## 另请参阅

- [Repository with the complete code](https://github.com/catalinpit/example-app/)
- [Better Auth with Hono, Bun, TypeScript, React and Vite](https://catalins.tech/better-auth-with-hono-bun-typescript-react-vite/)
