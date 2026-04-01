# html 助手

html 助手允许你使用名为 `html` 的标签在 JavaScript 模板字面量中编写 HTML。使用 `raw()` 时，内容将原样渲染。你必须自行转义这些字符串。

## 导入

```ts
import { Hono } from 'hono'
import { html, raw } from 'hono/html'
```

## `html`

```ts
const app = new Hono()

app.get('/:username', (c) => {
  const { username } = c.req.param()
  return c.html(
    html`<!doctype html>
      <h1>Hello! ${username}!</h1>`
  )
})
```

### 将片段插入 JSX

将内联脚本插入 JSX：

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>Test Site</title>
        {html`
          <script>
            // 无需使用 dangerouslySetInnerHTML。
            // 如果写在这里，它不会被转义。
          </script>
        `}
      </head>
      <body>Hello!</body>
    </html>
  )
})
```

### 作为函数组件使用

由于 `html` 返回一个 HtmlEscapedString，它可以作为功能齐全的组件使用，而无需使用 JSX。

#### 使用 `html` 而不是 `memo` 来加速过程

```typescript
const Footer = () => html`
  <footer>
    <address>My Address...</address>
  </footer>
`
```

### 接收属性并嵌入值

```typescript
interface SiteData {
  title: string
  description: string
  image: string
  children?: any
}
const Layout = (props: SiteData) => html`
<html>
<head>
  <meta charset="UTF-8">
  <title>${props.title}</title>
  <meta name="description" content="${props.description}">
  <head prefix="og: http://ogp.me/ns#">
  <meta property="og:type" content="article">
  <!-- 更多元素会减慢 JSX 的速度，但不会减慢模板字面量。 -->
  <meta property="og:title" content="${props.title}">
  <meta property="og:image" content="${props.image}">
</head>
<body>
  ${props.children}
</body>
</html>
`

const Content = (props: { siteData: SiteData; name: string }) => (
  <Layout {...props.siteData}>
    <h1>Hello {props.name}</h1>
  </Layout>
)

app.get('/', (c) => {
  const props = {
    name: 'World',
    siteData: {
      title: 'Hello <> World',
      description: 'This is a description',
      image: 'https://example.com/image.png',
    },
  }
  return c.html(<Content {...props} />)
})
```

## `raw()`

```ts
app.get('/', (c) => {
  const name = 'John &quot;Johnny&quot; Smith'
  return c.html(html`<p>I'm ${raw(name)}.</p>`)
})
```

## 提示

得益于这些库，Visual Studio Code 和 vim 也能将模板字面量解释为 HTML，从而应用语法高亮和格式化。

- <https://marketplace.visualstudio.com/items?itemName=bierner.lit-html>
- <https://github.com/MaxMEllon/vim-jsx-pretty>
