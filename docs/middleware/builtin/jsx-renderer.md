# JSX 渲染器中间件

JSX 渲染器中间件允许你在使用 `c.render()` 函数渲染 JSX 时设置布局，而无需使用 `c.setRenderer()`。此外，它使得通过 `useRequestContext()` 在组件中访问 Context 实例成为可能。

## 导入

```ts
import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
```

## 用法

```jsx
const app = new Hono()

app.get(
  '/page/*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <header>Menu</header>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/page/about', (c) => {
  return c.render(<h1>About me!</h1>)
})
```

## 选项

### <Badge type="info" text="可选" /> docType: `boolean` | `string`

如果你不想在 HTML 开头添加 DOCTYPE，请将 `docType` 选项设置为 `false`。

```tsx
app.use(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    },
    { docType: false }
  )
)
```

你也可以指定 DOCTYPE。

```tsx
app.use(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    },
    {
      docType:
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    }
  )
)
```

### <Badge type="info" text="可选" /> stream: `boolean` | `Record<string, string>`

如果将其设置为 `true` 或提供 Record 值，它将作为流式响应进行渲染。

```tsx
const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // 休眠 1 秒
  return <div>Hi!</div>
}

app.get(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>
            <h1>SSR Streaming</h1>
            {children}
          </body>
        </html>
      )
    },
    { stream: true }
  )
)

app.get('/', (c) => {
  return c.render(
    <Suspense fallback={<div>loading...</div>}>
      <AsyncComponent />
    </Suspense>
  )
})
```

如果设置为 `true`，将添加以下头信息：

```ts
{
  'Transfer-Encoding': 'chunked',
  'Content-Type': 'text/html; charset=UTF-8',
  'Content-Encoding': 'Identity'
}
```

你可以通过指定 Record 值来自定义头信息的值。

### 基于函数的选项

你可以传递一个接收 `Context` 对象的函数，而不是静态选项对象。这允许你根据请求上下文（例如环境变量或请求参数）动态设置选项。

```tsx
app.use(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    },
    (c) => ({
      stream: c.req.header('X-Enable-Streaming') === 'true',
    })
  )
)
```

作为一个具体示例，当使用 `<Suspense>` 生成静态站点 (SSG) 时，你可以使用此方法禁用流式传输，通过 [`isSSGContext`](/docs/helpers/ssg#isssgcontext) 辅助函数：

```tsx
app.use(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <div>
          <Suspense fallback={'loading...'}>
            <Component />
          </Suspense>
        </div>
      )
    },
    (c) => ({
      stream: !isSSGContext(c),
    })
  )
)
```

## 嵌套布局

`Layout` 组件支持布局嵌套。

```tsx
app.use(
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>{children}</body>
      </html>
    )
  })
)

const blog = new Hono()
blog.use(
  jsxRenderer(({ children, Layout }) => {
    return (
      <Layout>
        <nav>Blog Menu</nav>
        <div>{children}</div>
      </Layout>
    )
  })
)

app.route('/blog', blog)
```

## `useRequestContext()`

`useRequestContext()` 返回 Context 实例。

```tsx
import { useRequestContext, jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()
app.use(jsxRenderer())

const RequestUrlBadge: FC = () => {
  const c = useRequestContext()
  return <b>{c.req.url}</b>
}

app.get('/page/info', (c) => {
  return c.render(
    <div>
      You are accessing: <RequestUrlBadge />
    </div>
  )
})
```

::: warning
你不能在 Deno 的 `precompile` JSX 选项下使用 `useRequestContext()`。请使用 `react-jsx`：

```json
   "compilerOptions": {
     "jsx": "precompile", // [!code --]
     "jsx": "react-jsx", // [!code ++]
     "jsxImportSource": "hono/jsx"
   }
 }
```

:::

## 扩展 `ContextRenderer`

通过如下定义 `ContextRenderer`，你可以向渲染器传递额外的内容。例如，当你想根据页面更改 head 标签的内容时，这很方便。

```tsx
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props: { title: string }
    ): Response
  }
}

const app = new Hono()

app.get(
  '/page/*',
  jsxRenderer(({ children, title }) => {
    return (
      <html>
        <head>
          <title>{title}</title>
        </head>
        <body>
          <header>Menu</header>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/page/favorites', (c) => {
  return c.render(
    <div>
      <ul>
        <li>Eating sushi</li>
        <li>Watching baseball games</li>
      </ul>
    </div>,
    {
      title: 'My favorites',
    }
  )
})
```
