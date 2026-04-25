# 第三方中间件

第三方中间件指的是未捆绑在 Hono 包内的中间件。
这些中间件大多数利用外部库。

### 认证

- [Auth.js(Next Auth)](https://github.com/honojs/middleware/tree/main/packages/auth-js)
- [Casbin](https://github.com/honojs/middleware/tree/main/packages/casbin)
- [Clerk 认证](https://github.com/honojs/middleware/tree/main/packages/clerk-auth)
- [Cloudflare Access](https://github.com/honojs/middleware/tree/main/packages/cloudflare-access)
- [OAuth 提供商](https://github.com/honojs/middleware/tree/main/packages/oauth-providers)
- [OIDC 认证](https://github.com/honojs/middleware/tree/main/packages/oidc-auth)
- [Firebase 认证](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [验证 RSA JWT (JWKS)](https://github.com/wataruoguchi/verify-rsa-jwt-cloudflare-worker)
- [Stytch 认证](https://github.com/honojs/middleware/tree/main/packages/stytch-auth)

### 验证器

- [Ajv 验证器](https://github.com/honojs/middleware/tree/main/packages/ajv-validator)
- [ArkType 验证器](https://github.com/honojs/middleware/tree/main/packages/arktype-validator)
- [Class 验证器](https://github.com/honojs/middleware/tree/main/packages/class-validator)
- [Conform 验证器](https://github.com/honojs/middleware/tree/main/packages/conform-validator)
- [Effect Schema 验证器](https://github.com/honojs/middleware/tree/main/packages/effect-validator)
- [Standard Schema 验证器](https://github.com/honojs/middleware/tree/main/packages/standard-validator)
- [TypeBox 验证器](https://github.com/honojs/middleware/tree/main/packages/typebox-validator)
- [Typia 验证器](https://github.com/honojs/middleware/tree/main/packages/typia-validator)
- [unknownutil 验证器](https://github.com/ryoppippi/hono-unknownutil-validator)
- [Valibot 验证器](https://github.com/honojs/middleware/tree/main/packages/valibot-validator)
- [Zod 验证器](https://github.com/honojs/middleware/tree/main/packages/zod-validator)

### OpenAPI

- [Zod OpenAPI](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
- [Scalar](https://github.com/scalar/scalar/tree/main/integrations/hono)
- [Swagger UI](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)
- [Swagger Editor](https://github.com/honojs/middleware/tree/main/packages/swagger-editor)
- [Hono OpenAPI](https://github.com/rhinobase/hono-openapi)
- [hono-zod-openapi](https://github.com/paolostyle/hono-zod-openapi)

### 开发

- [ESLint 配置](https://github.com/honojs/middleware/tree/main/packages/eslint-config)
- [SSG 插件必备](https://github.com/honojs/middleware/tree/main/packages/ssg-plugins-essential)

### 监控 / 追踪

- [Apitally (API 监控与分析)](https://docs.apitally.io/frameworks/hono)
- [Highlight.io](https://www.highlight.io/docs/getting-started/backend-sdk/js/hono)
- [LogTape (日志记录)](https://logtape.org/manual/integrations#hono)
- [OpenTelemetry](https://github.com/honojs/middleware/tree/main/packages/otel)
- [Prometheus 指标](https://github.com/honojs/middleware/tree/main/packages/prometheus)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)
- [Pino 日志记录器](https://github.com/maou-shonen/hono-pino)

### 服务器 / 适配器

- [GraphQL 服务器](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Node WebSocket 助手](https://github.com/honojs/middleware/tree/main/packages/node-ws)
- [tRPC 服务器](https://github.com/honojs/middleware/tree/main/packages/trpc-server)

### 转译器

- [Bun 转译器](https://github.com/honojs/middleware/tree/main/packages/bun-transpiler)
- [esbuild 转译器](https://github.com/honojs/middleware/tree/main/packages/esbuild-transpiler)

### UI / 渲染器

- [Qwik City](https://github.com/honojs/middleware/tree/main/packages/qwik-city)
- [React 兼容性](https://github.com/honojs/middleware/tree/main/packages/react-compat)
- [React 渲染器](https://github.com/honojs/middleware/tree/main/packages/react-renderer)

### 队列 / 任务处理

- [GlideMQ (消息队列 REST API + SSE)](https://github.com/avifenesh/glidemq-hono)

### 国际化

- [Intlayer i18n](https://intlayer.org/doc/environment/hono)

### 工具

- [Bun 压缩](https://github.com/honojs/middleware/tree/main/packages/bun-compress)
- [Cap Checkpoint](https://capjs.js.org/guide/middleware/hono.html)
- [Event Emitter](https://github.com/honojs/middleware/tree/main/packages/event-emitter)
- [Geo](https://github.com/ktkongtong/hono-geo-middleware/tree/main/packages/middleware)
- [Hono Rate Limiter](https://github.com/rhinobase/hono-rate-limiter)
- [Hono Problem Details (RFC 9457)](https://github.com/paveg/hono-problem-details)
- [Hono Simple DI](https://github.com/maou-shonen/hono-simple-DI)
- [Idempotency (Stripe-style idempotency keys)](https://github.com/paveg/hono-idempotency)
- [idempot-js](https://js.idempot.dev) - 符合规范的中间件，支持多种存储后端（redis、postgres、mysql、sqlite）
- [jsonv-ts (Validator, OpenAPI, MCP)](https://github.com/dswbx/jsonv-ts)
- [MCP](https://github.com/honojs/middleware/tree/main/packages/mcp)
- [RONIN (数据库)](https://github.com/ronin-co/hono-client)
- [会话](https://github.com/honojs/middleware/tree/main/packages/session)
- [tsyringe](https://github.com/honojs/middleware/tree/main/packages/tsyringe)
- [基于 User Agent 的拦截器](https://github.com/honojs/middleware/tree/main/packages/ua-blocker)
