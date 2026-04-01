# Hono Auth.js 集成

本指南展示如何使用 **Auth.js**（原 NextAuth.js）为 Hono 应用添加认证。

> [!IMPORTANT]
> `@hono/auth-js` 包目前在客户端集成方面 **仅支持 React**。

## 快速开始

5 分钟内让认证跑起来：

1. **安装** → `npm install @hono/auth-js @auth/core`
2. **设置环境变量** → 复制下面的 `.env` 示例
3. **创建数据库表** → 运行 schema 迁移
4. **添加认证路由** → 复制 Hono 设置
5. **测试** → 使用客户端示例

## 安装

```bash
npm install hono @hono/auth-js @auth/core
```

## 设置

### 第 1 步：环境变量

在项目根目录创建 `.env` 文件：

```properties
AUTH_SECRET=your-auth-secret-here
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

> [!TIP]
> 你可以通过以下方式生成强随机的 `AUTH_SECRET`：
> `openssl rand -base64 32`
> 或者使用：`npx auth secret`

### 第 2 步：数据库设置

> [!NOTE]
> 请从 [Auth.js Drizzle 适配器文档](https://authjs.dev/getting-started/adapters/drizzle) 复制最新的 schema。

下面是一个使用 **Drizzle ORM 的 SQLite** schema：

::: code-group

```ts [db.ts]
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const client = createClient({
  url: 'DATABASE_URL',
  authToken: 'DATABASE_AUTH_TOKEN',
})
export const db = drizzle(client)
```

```ts [schema.ts]
import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
})

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [
        verificationToken.identifier,
        verificationToken.token,
      ],
    }),
  })
)

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)
```

:::

## 基本用法

### 路由设置

在 Hono 应用中创建一个 API 路由：

```ts
import { Hono } from 'hono'
import {
  initAuthConfig,
  verifyAuth,
  authHandler,
  DrizzleAdapter,
} from '@hono/auth-js'
import { GitHub, Google } from '@auth/core/providers'
import { db } from './db'
import {
  users,
  accounts,
  authenticators,
  sessions,
  verificationTokens,
} from './schema'

const v1Router = new Hono()
  .use(
    '*',
    initAuthConfig((c) => ({
      adapter: DrizzleAdapter(c.get('db'), {
        usersTable: users,
        accountsTable: accounts,
        authenticatorsTable: authenticators,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      }),
      secret: c.env.AUTH_SECRET,
      providers: [
        GitHub({
          clientId: c.env.GITHUB_ID,
          clientSecret: c.env.GITHUB_SECRET,
        }),
        Google({
          clientId: c.env.GOOGLE_ID,
          clientSecret: c.env.GOOGLE_SECRET,
        }),
      ],
      session: { strategy: 'jwt' },
    }))
  )
  .use('*', verifyAuth())
  .use('/auth/*', authHandler())

const app = new Hono().route('/api/v1', v1Router)
export default app
```

## 使用示例

### 保护路由

```ts
app.get('/protected', (c) => {
  const auth = c.get('authUser')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)
  return c.json(auth)
})
```

### 客户端集成（React）

```tsx
import {
  SessionProvider,
  useSession,
  signIn,
} from '@hono/auth-js/react'

function App() {
  const { data: session } = useSession()
  return session ? (
    <p>Hello {session.user?.name}</p>
  ) : (
    <button onClick={() => signIn('github')}>
      Sign in with GitHub
    </button>
  )
}

export default function Root() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  )
}
```

## 配置参考

在你的 Hono 应用中通过以下项来自定义 Auth.js：

- **Adapter** → 连接到你的数据库（上面示例使用 Drizzle）
- **Providers** → GitHub、Google 或任何 Auth.js 提供方
- **Session** → `"jwt"`（无状态）或 `"database"`（持久化）
- **Callbacks** → 订阅登录或会话事件

示例：

```ts
initAuthConfig((c) => ({
  adapter: DrizzleAdapter(c.get('db'), {
    /* tables */
  }),
  secret: c.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: c.env.GITHUB_ID,
      clientSecret: c.env.GITHUB_SECRET,
    }),
    Google({
      clientId: c.env.GOOGLE_ID,
      clientSecret: c.env.GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session }) {
      return session
    },
  },
}))
```

## 了解更多

- [Auth.js 文档](https://authjs.dev/) – 提供方与 schema 参考
- [Hono 文档](https://hono.dev/) – 路由与中间件模式
- 进阶方案：基于角色的访问、密码重置、邮箱验证
