# css 辅助函数

CSS 辅助函数 - `hono/css` - 是 Hono 内置的 CSS in JS(X)。

你可以在 JSX 中使用名为 `css` 的 JavaScript 模板字面量编写 CSS。`css` 的返回值将作为类名，设置为 class 属性的值。随后 `<Style />` 组件将包含 CSS 内容。

## 导入

```ts
import { Hono } from 'hono'
import { css, cx, keyframes, Style } from 'hono/css'
```

## `css` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

你可以在 `css` 模板字面量中编写 CSS。在这种情况下，它使用 `headerClass` 作为 `class` 属性的值。不要忘记添加 `<Style />`，因为它包含 CSS 内容。

```ts{10,13}
app.get('/', (c) => {
  const headerClass = css`
    background-color: orange;
    color: white;
    padding: 1rem;
  `
  return c.html(
    <html>
      <head>
        <Style />
      </head>
      <body>
        <h1 class={headerClass}>Hello!</h1>
      </body>
    </html>
  )
})
```

你可以使用 [嵌套选择器](https://developer.mozilla.org/en-US/docs/Web/CSS/Nesting_selector) `&` 来样式化伪类，如 `:hover`：

```ts
const buttonClass = css`
  background-color: #fff;
  &:hover {
    background-color: red;
  }
`
```

### 扩展

你可以通过嵌入类名来扩展 CSS 定义。

```tsx
const baseClass = css`
  color: white;
  background-color: blue;
`

const header1Class = css`
  ${baseClass}
  font-size: 3rem;
`

const header2Class = css`
  ${baseClass}
  font-size: 2rem;
`
```

此外，`${baseClass} {}` 的语法支持类嵌套。

```tsx
const headerClass = css`
  color: white;
  background-color: blue;
`
const containerClass = css`
  ${headerClass} {
    h1 {
      font-size: 3rem;
    }
  }
`
return c.render(
  <div class={containerClass}>
    <header class={headerClass}>
      <h1>Hello!</h1>
    </header>
  </div>
)
```

### 全局样式

一个名为 `:-hono-global` 的伪选择器允许你定义全局样式。

```tsx
const globalClass = css`
  :-hono-global {
    html {
      font-family: Arial, Helvetica, sans-serif;
    }
  }
`

return c.render(
  <div class={globalClass}>
    <h1>Hello!</h1>
    <p>Today is a good day.</p>
  </div>
)
```

或者你可以在 `<Style />` 组件中使用 `css` 字面量编写 CSS。

```tsx
export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html>
      <head>
        <Style>{css`
          html {
            font-family: Arial, Helvetica, sans-serif;
          }
        `}</Style>
        <title>{title}</title>
      </head>
      <body>
        <div>{children}</div>
      </body>
    </html>
  )
})
```

## `keyframes` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

你可以使用 `keyframes` 来编写 `@keyframes` 的内容。在这种情况下，`fadeInAnimation` 将是动画的名称。

```tsx
const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`
const headerClass = css`
  animation-name: ${fadeInAnimation};
  animation-duration: 2s;
`
const Header = () => <a class={headerClass}>Hello!</a>
```

## `cx` <Badge style="vertical-align: middle;" type="warning" text="实验性" />

`cx` 组合两个类名。

```tsx
const buttonClass = css`
  border-radius: 10px;
`
const primaryClass = css`
  background: orange;
`
const Button = () => (
  <a class={cx(buttonClass, primaryClass)}>Click!</a>
)
```

它也可以组合简单的字符串。

```tsx
const Header = () => <a class={cx('h1', primaryClass)}>Hi</a>
```

## 与 [Secure Headers](/docs/middleware/builtin/secure-headers) 中间件结合使用

如果你想结合 [Secure Headers](/docs/middleware/builtin/secure-headers) 中间件使用 CSS 辅助函数，你可以将 [`nonce` 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce) 添加到 `<Style nonce={c.get('secureHeadersNonce')} />`，以避免 CSS 辅助函数引起的 Content-Security-Policy 问题。

```tsx{8,23}
import { secureHeaders, NONCE } from 'hono/secure-headers'

app.get(
  '*',
  secureHeaders({
    contentSecurityPolicy: {
      // 将预定义的 nonce 值设置为 `styleSrc`：
      styleSrc: [NONCE],
    },
  })
)

app.get('/', (c) => {
  const headerClass = css`
    background-color: orange;
    color: white;
    padding: 1rem;
  `
  return c.html(
    <html>
      <head>
        {/* 在 CSS 辅助函数的 `style` 和 `script` 元素上设置 `nonce` 属性 */}
        <Style nonce={c.get('secureHeadersNonce')} />
      </head>
      <body>
        <h1 class={headerClass}>Hello!</h1>
      </body>
    </html>
  )
})
```

## 提示

如果你使用 VS Code，可以使用 [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=styled-components.vscode-styled-components) 来为 CSS 标签字面量提供语法高亮和智能感知。

![](/images/css-ss.png)
