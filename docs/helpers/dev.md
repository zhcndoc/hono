# 开发助手

开发助手提供了在开发过程中可以使用的有用方法。

```ts
import { Hono } from 'hono'
import { getRouterName, showRoutes } from 'hono/dev'
```

## `getRouterName()`

你可以使用 `getRouterName()` 获取当前使用的路由器名称。

```ts
const app = new Hono()

// ...

console.log(getRouterName(app))
```

## `showRoutes()`

`showRoutes()` 函数会在控制台中显示已注册的路由。

考虑如下所示的应用程序：

```ts
const app = new Hono().basePath('/v1')

app.get('/posts', (c) => {
  // ...
})

app.get('/posts/:id', (c) => {
  // ...
})

app.post('/posts', (c) => {
  // ...
})

showRoutes(app, {
  verbose: true,
})
```

当此应用程序开始运行时，路由将如下所示显示在控制台中：

```txt
GET   /v1/posts
GET   /v1/posts/:id
POST  /v1/posts
```

## 选项

### <Badge type="info" text="可选" /> verbose: `boolean`

当设置为 `true` 时，它会显示详细信息。

### <Badge type="info" text="可选" /> colorize: `boolean`

当设置为 `false` 时，输出将不会着色。
