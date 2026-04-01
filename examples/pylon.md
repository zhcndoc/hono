# Pylon

使用 Pylon 构建 GraphQL API 简单直接。Pylon 是构建在 Hono 之上的后端框架，提供以代码为先的 GraphQL API 开发方式。

GraphQL schema 会根据你的 TypeScript 定义实时生成，让你可以专注于编写业务逻辑。这种方式显著提升开发速度、增强类型安全，并减少错误。

代码中的任何破坏性变更都会立即反映到 API 中，让你能立刻看到这些改动对功能的影响。

更多信息请查看 [Pylon](https://pylon.cronit.io)。

## 创建新的 Pylon 服务

你可以使用 `npm create pylon` 命令创建新的服务。该命令会生成一个带有基础项目结构和配置的新 Pylon 项目。
在设置过程中，你可以选择偏好的运行时，例如 Bun、Node.js 或 Cloudflare Workers。

**本指南使用 Bun 运行时。**

### 创建新项目

To create a new Pylon project, run the following command:

```bash
npm create pylon my-pylon@latest
```

这会创建一个名为 `my-pylon` 的新目录，并带有基础的 Pylon 项目结构。

### 项目结构

Pylon projects are structured as follows:

```
my-pylon/
├── .pylon/
├── src/
│   ├── index.ts
├── package.json
├── tsconfig.json
```

- `.pylon/`：包含项目的生产构建产物。
- `src/`：包含项目的源代码。
- `src/index.ts`：Pylon 服务的入口文件。
- `package.json`：npm 包配置文件。
- `tsconfig.json`：TypeScript 配置文件。

### 基本示例

下面是一个基础的 Pylon 服务示例：

```ts
import { app } from '@getcronit/pylon'

export const graphql = {
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
}

export default app
```

## 保护 API

Pylon 与云原生身份与访问管理方案 ZITADEL 集成，为你的 API 提供安全的认证与授权。你可以按照 [ZITADEL 文档](https://zitadel.com/docs/examples/secure-api/pylon) 中的步骤轻松保护你的 Pylon API。

## 创建更复杂的 API

Pylon 通过实时 schema 生成能力，让你能够创建更复杂的 API。有关支持的 TypeScript 类型以及如何定义 API 的更多信息，请参阅 [Pylon 文档](https://pylon.cronit.io/docs/core-concepts/type-safety-and-type-integration)。

这个示例演示了如何在 Pylon 中定义复杂类型和服务。通过利用 TypeScript 类和方法，你可以创建能与数据库、外部服务和其他资源交互的强大 API。

```ts
import { app } from '@getcronit/pylon'

class Post {
  id: string
  title: string

  constructor(id: string, title: string) {
    this.id = id
    this.title = title
  }
}

class User {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  static async getById(id: string): Promise<User> {
    // Fetch user data from the database
    return new User(id, 'John Doe')
  }

  async posts(): Promise<Post[]> {
    // Fetch posts for this user from the database
    return [new Post('1', 'Hello, world!')]
  }

  async $createPost(title: string, content: string): Promise<Post> {
    // Create a new post for this user in the database
    return new Post('2', title)
  }
}

export const graphql = {
  Query: {
    user: User.getById,
  },
  Mutation: {
    createPost: (userId: string, title: string, content: string) => {
      const user = User.getById(userId)
      return user.$createPost(title, content)
    },
  },
}

export default app
```

## 调用 API

Pylon API 可以使用任何 GraphQL 客户端库来调用。出于开发目的，建议使用 Pylon Playground，它是一个基于网页的 GraphQL IDE，允许你实时与 API 交互。

1. 在项目目录中运行 `bun run dev` 启动 Pylon 服务。
2. 在浏览器中访问 `http://localhost:3000/graphql` 打开 Pylon Playground。
3. 在左侧面板中编写你的 GraphQL 查询或 mutation。

![](/images/pylon-example.png)

## 获取 Hono 上下文

你可以在代码的任意位置通过 `getContext` 函数访问 Hono 上下文。该函数会返回当前上下文对象，其中包含请求、响应以及其他上下文相关数据。

```ts
import { app, getContext } from '@getcronit/pylon'

export const graphql = {
  Query: {
    hello: () => {
      const context = getContext()
      return `Hello, ${context.req.headers.get('user-agent')}`
    },
  },
}

export default app
```

关于 Hono 上下文对象及其属性的更多信息，请参阅 [Hono 文档](https://hono.dev/docs/api/context) 和 [Pylon 文档](https://pylon.cronit.io/docs/core-concepts/context-management)。

## Hono 在哪里发挥作用？

Pylon 构建在 Hono 之上，Hono 是一个用于构建 Web 应用和 API 的轻量级 Web 框架。Hono 提供处理 HTTP 请求和响应的核心能力，而 Pylon 在此基础上扩展了对 GraphQL API 开发的支持。

除了 GraphQL 之外，Pylon 还允许你访问底层的 Hono 应用实例，以添加自定义路由和中间件。这让你能够构建更复杂的 API 和服务，并充分利用 Hono 的全部能力。

```ts
import { app } from '@getcronit/pylon'

export const graphql = {
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
}

// 向 Pylon 应用添加自定义路由
app.get('/hello', (ctx, next) => {
  return new Response('Hello, world!')
})
```

## 总结

Pylon 是一个强大的 Web 框架，简化了 GraphQL API 的开发。借助 TypeScript 类型定义，Pylon 可提供实时 schema 生成，提升类型安全并减少错误。使用 Pylon，你可以快速构建安全且可扩展、满足业务需求的 API。Pylon 与 Hono 的集成让你在专注 GraphQL API 开发的同时，也能使用 Hono 的所有特性。

有关 Pylon 的更多信息，请查看 [官方文档](https://pylon.cronit.io)。

## 另请参阅

- [Pylon](https://github.com/getcronit/pylon)
- [Pylon documentation](https://pylon.cronit.io)
- [Hono documentation](https://hono.dev/docs)
- [ZITADEL documentation](https://zitadel.com/docs/examples/secure-api/pylon)
