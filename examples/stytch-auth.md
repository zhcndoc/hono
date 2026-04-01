# 使用 Hono 集成 Stytch Auth

这个示例展示了如何在 Cloudflare Workers 上，使用 `vite` 和 `react` 搭建一个由 Stytch 前端 SDK 和 Hono 后端组成的全栈应用。

基于这些原则的完整示例应用可以在[这里](https://github.com/honojs/examples/tree/main/stytch-auth)找到。

## 安装

::: code-group

```sh [npm]
# Backend
npm install @hono/stytch-auth stytch

# Frontend
npm install @stytch/react @stytch/vanilla-js
```

```sh [yarn]
# Backend
yarn add @hono/stytch-auth stytch

# Frontend
yarn add @stytch/react @stytch/vanilla-js
```

```sh [pnpm]
# Backend
pnpm add @hono/stytch-auth stytch

# Frontend
pnpm add @stytch/react @stytch/vanilla-js
```

```sh [bun]
# Backend
bun add @hono/stytch-auth stytch

# Frontend
bun add @stytch/react @stytch/vanilla-js
```

:::

## 设置

1. 创建一个 [Stytch](https://stytch.com/?utm_source=hono&utm_medium=website&utm_campaign=workers) 账号，并选择 **Consumer Authentication**。
2. 在 [Configuration](https://stytch.com/dashboard/sdk-configuration) 中启用 **Frontend SDK**。
3. 从 [Project Settings](https://stytch.com/dashboard) 获取你的凭据。

## 环境变量

后端 Workers 环境变量放在 `.dev.vars` 中。前端 Vite 环境变量放在 `.env.local` 中。

::: code-group

```Plain Text[.dev.vars]
STYTCH_PROJECT_ID=project-live-xxx
STYTCH_PROJECT_SECRET=secret-live-xxx
```

```Plain Text[.env.local]
VITE_STYTCH_PUBLIC_TOKEN=public-token-live-xxx
```

:::

## 前端

1. Wrap your application with the `<StytchProvider />` component and pass it an instance of the Stytch UI Client.
2. Use the `<StytchLogin />` component to log the user in. See
   the [Component Playground](https://stytch.com/docs/sdks/component-playground) for examples of different
   authentication methods and style customizations available.
3. After the user is logged in, the `useStytchUser()` hook can be used to retrieve the active user data.
4. The user's session information will automatically be stored as a cookie and made available to your backend.

::: code-group

```tsx[App.tsx]
import React from 'react'
import {StytchUIClient} from '@stytch/vanilla-js';
import {StytchProvider, useStytchUser} from '@stytch/react';
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'

const stytch = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN ?? '');

function AppContent() {
  const { user, isInitialized } = useStytchUser()

  if (!isInitialized) return <div>Loading...</div>
  return user ? <Dashboard /> : <LoginPage />
}

function App() {
  return (
    <StytchProvider stytch={stytch}>
      <AppContent />
    </StytchProvider>
  )
}

export default App
```

```tsx[LoginPage.tsx]
import React from 'react'
import { StytchLogin } from '@stytch/react'
import { Products, OTPMethods } from '@stytch/vanilla-js'

const loginConfig = {
  products: [Products.otp],
  otpOptions: {
    expirationMinutes: 10,
    methods: [OTPMethods.Email],
  },
}

const LoginPage = () => {
  return <StytchLogin config={loginConfig} />
}

export default LoginPage
```

```tsx[Dashboard.tsx]
import React from 'react'
import { useStytchUser, useStytch } from '@stytch/react'

const Dashboard = () => {
  const { user } = useStytchUser()
  const stytchClient = useStytch()

  const handleLogout = () => stytchClient.session.revoke()

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>Welcome, {user.emails[0]?.email}!</p>
    </div>
  )
}

export default Dashboard
```

:::

## 后端

1. Wrap protected endpoints with a `Consumer.authenticateSessionLocal()` middleware to authenticate the Stytch session
   JWT.
2. Use the `Consumer.getStytchSession(c)` method to retrieve the Stytch session information within a route.
3. Routes that require the full user object can use the `Consumer.authenticateSessionRemote()` method to perform a
   network call to Stytch servers.

```ts[src/index.ts]
import { Hono } from 'hono'
import { Consumer } from '@hono/stytch-auth'

const app = new Hono()

// Public route
app.get('/health', (c) => c.json({ status: 'ok' }))

// Protected route with local authentication (very fast)
app.get('/api/local', Consumer.authenticateSessionLocal(), (c) => {
  const session = Consumer.getStytchSession(c)
  return c.json({
    message: 'Protected data',
    sessionId: session.session_id,
  })
})

// Protected route with remote authentication & full user data
app.get('/api/remote', Consumer.authenticateSessionRemote(), (c) => {
  const session = Consumer.getStytchSession(c)
  const user = Consumer.getStytchUser(c)
  return c.json({
    message: 'Protected data',
    sessionId: session.session_id,
    firstName: user.name.first_name,
  })
})

export default app
```

## 下一步

更多文档与资源：

- Check out the [Stytch Auth Hono Example App](https://github.com/honojs/examples/tree/main/stytch-auth).
- [Stytch JS SDK](https://stytch.com/docs/sdks/installation) 的入门指南。
- Complete documentation for the [@hono/stytch-auth package](https://www.npmjs.com/package/@hono/stytch-auth).

想了解组织管理、RBAC 和 SSO 这类企业级 B2B 功能？请查看 [Stytch B2B Authentication](https://stytch.com/docs/getting-started/b2b-vs-consumer-auth) 产品线。

欢迎加入 [Stytch Slack Community](https://stytch.com/docs/resources/support/overview) 参与讨论、提问并提出新功能建议。
