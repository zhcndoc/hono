# 在 Cloudflare Workers 上使用 Prisma

[Prisma ORM](https://www.prisma.io/docs?utm_source=hono&utm_medium=website&utm_campaign=workers) 提供了一套现代且稳定的数据库交互工具。与 Hono 和 Cloudflare Workers 结合后，你可以在边缘部署高性能的无服务器应用。

在本指南中，我们会介绍两种在 Hono 中使用 Prisma ORM 的不同方式：

- [**Prisma Postgres**](#using-prisma-postgres):
  这是 Prisma 提供的托管无服务器 PostgreSQL 数据库集成。由于 Prisma Postgres 内置连接池并且无冷启动，因此这类方案很适合生产环境，能够缓解 [无服务器和边缘环境中的扩展问题](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections?utm_source=hono&utm_medium=website&utm_campaign=workers#the-serverless-challenge)。

- [**Driver adapters**](#using-prisma-driver-adapters):
  这是另一种使用 Prisma 灵活驱动适配器的方案，允许你连接到 Prisma ORM 支持的任何数据库。

这两种方式各有优势，你可以根据项目需求选择最合适的一种。

## 使用 Prisma Postgres

[Prisma Postgres](https://www.prisma.io/postgres?utm_source=hono&utm_medium=website&utm_campaign=workers) 是一款基于 unikernel 构建的托管无服务器 PostgreSQL 数据库。它支持连接池、缓存以及查询优化建议等功能，并为初始开发、测试和个人项目提供了相当充足的免费额度。

### 1. 安装 Prisma 和所需依赖

在你的 Hono 项目中安装 Prisma：

```bash
npm i prisma --save-dev
```

安装 Prisma Postgres 所需的 [Prisma client extension](https://www.npmjs.com/package/@prisma/extension-accelerate)：

```sh
npm i @prisma/extension-accelerate
```

Initialize Prisma with an instance of Prisma Postgres:

```bash
npx prisma@latest init --db
```

如果你还没有 [Prisma Data Platform](https://console.prisma.io/?utm_source=hono&utm_medium=website&utm_campaign=workers) 账户，或者当前未登录，命令会提示你使用可用的认证方式登录。随后会打开浏览器窗口，供你登录或创建账户。完成这一步后回到 CLI。

Once logged in (or if you were already logged in), the CLI will prompt you to select a project name and a database region.

Once the command has terminated, it has created:

- A project in your [Platform Console](https://console.prisma.io/?utm_source=hono&utm_medium=website&utm_campaign=workers) containing a Prisma Postgres database instance.
- A `prisma` folder containing `schema.prisma`, where you will define your database schema.
- An `.env` file in the project root, which will contain the Prisma Postgres database url `DATABASE_URL=<your-prisma-postgres-database-url>`.

Create a `.dev.vars` file and store the `DATABASE_URL` in it:
::: code-group

```bash [.dev.vars]
DATABASE_URL="your_prisma_postgres_url"
```

:::

Keep the `.env` file so that Prisma CLI can access it later on to perform migrations, generate [Prisma Client](https://www.prisma.io/docs/orm/prisma-client?utm_source=hono&utm_medium=website&utm_campaign=workers) or to open [Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio?utm_source=hono&utm_medium=website&utm_campaign=workers).

### 2. Set up Prisma in your project

Now, open your `schema.prisma` file and define the models for your database schema. For example, you might add an `User` model:

::: code-group

```ts [schema.prisma]
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id  Int @id @default(autoincrement())
  email String
  name 	String
}
```

:::

Use [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) to apply changes to the database:

```bash
npx prisma migrate dev
```

创建一个这样的函数，后续可以在项目中直接使用：

::: code-group

```ts [prismaFunction.ts]
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate())
  return prisma
}
```

:::

下面是一个在项目中使用该函数的示例：

::: code-group

```ts [index.ts]
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getPrisma } from '../usefulFun/prismaFun'

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

app.post('/', async (c) => {
  // 现在你可以在需要的地方使用它
  const prisma = getPrisma(c.env.DATABASE_URL)
})
```

:::

如果你想**使用自己的数据库并同时享受连接池和边缘缓存**，可以启用 Prisma Accelerate。有关如何为项目配置 [Prisma Accelerate](https://www.prisma.io/docs/accelerate/getting-started?utm_source=hono&utm_medium=website&utm_campaign=workers) 的更多信息，请参阅相关文档。

## 使用 Prisma 驱动适配器

你可以通过 `driverAdapters` 将 Prisma 与 D1 Database 一起使用。前提是安装 Prisma，并集成 Wrangler 以便绑定到你的 Hono 项目。由于 Hono、Prisma 和 Cloudflare D1 的文档彼此分散，这里只提供一个示例项目，而不是精确到每一步的完整说明。

### 设置 Prisma

Prisma 和 D1 通过 Wrangler 中的绑定，借助适配器建立连接。

```bash
npm install prisma --save-dev
npx prisma init
npm install @prisma/client
npm install @prisma/adapter-d1
```

完成后，Prisma 会为你的数据库生成 schema；请在 `prisma/schema.prisma` 中定义一个简单模型。别忘了更改适配器。

```ts [prisma/schema.prisma]
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"] // change from default
}

datasource db {
  provider = "sqlite" // d1 is sql base database
  url      = env("DATABASE_URL")
}

// 创建一个简单的模型数据库
model User {
  id    String @id  @default(uuid())
  email String  @unique
  name  String?
}


```

### D1 数据库

如果你已经准备好了 D1 数据库，可以跳过这一步。否则，请先创建一个资源，可参考[这里](https://developers.cloudflare.com/d1/get-started/)。

```bash
npx wrangler d1 create __DATABASE_NAME__ // change it with yours
```

Make sure your DB is binding in `wrangler.toml`.

```toml [wrangler.toml]
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "__DATABASE_NAME__"
database_id = "DATABASE ID"

```

### Prisma Migrate

这个命令用于将 Prisma 迁移到 D1 数据库，无论是本地还是远程。

```bash
npx wrangler d1 migrations create __DATABASE_NAME__ create_user_table # will generate migration folder and sql file

// 生成 SQL 语句

npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/0001_create_user_table.sql

```

将数据库模型迁移到 D1。

```bash
npx wrangler d1 migrations apply __DATABASE_NAME__ --local
npx wrangler d1 migrations apply __DATABASE_NAME__ --remote
npx prisma generate

```

### 配置 Prisma Client

要通过 Prisma 查询 D1 数据库，你需要添加类型：

```bash
npx wrangler types
```

这会生成一个 `worker-configuration.d.ts` 文件。

#### Prisma 客户端

如果要全局使用 Prisma，可以创建一个 `lib/prismaClient.ts` 文件，内容如下。

::: code-group

```ts [lib/prisma.ts]
import { PrismaClient } from '@prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const prismaClients = {
  async fetch(db: D1Database) {
    const adapter = new PrismaD1(db)
    const prisma = new PrismaClient({ adapter })
    return prisma
  },
}

export default prismaClients
```

:::

使用 wrangler 环境变量绑定 Hono：

::: code-group

```ts [src/index.ts]
import { Hono } from 'hono'
import prismaClients from '../lib/prismaClient'

type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>() // 绑定环境变量
```

:::

在 Hono 路由中的使用示例：

::: code-group

```ts [src/index.ts]
import { Hono } from 'hono'
import prismaClients from '../lib/prismaClient'

type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
}
const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const users = await prisma.user.findMany()
  console.log('users', users)
  return c.json(users)
})

export default app
```

:::

这会在 `/` 路由返回所有用户，你可以用 Postman 或 Thunder Client 查看结果。

## 资源

你可以使用以下资源进一步增强应用：

- 为查询添加 [缓存](https://www.prisma.io/docs/postgres/caching?utm_source=hono&utm_medium=website&utm_campaign=workers)。
- 查看 [Prisma Postgres 文档](https://www.prisma.io/docs/postgres/getting-started?utm_source=hono&utm_medium=website&utm_campaign=workers)。
