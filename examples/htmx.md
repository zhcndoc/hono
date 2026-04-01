# htmx

将 Hono 与 [htmx](https://htmx.org/) 一起使用。

## typed-htmx

借助 [typed-htmx](https://github.com/Desdaemon/typed-htmx)，你可以使用带有 htmx 属性 TypeScript 类型定义的 JSX。
We can follow the same pattern found on the [typed-htmx Example Project](https://github.com/Desdaemon/typed-htmx/blob/main/example/src/types.d.ts) to use it with `hono/jsx`.

安装该包：

```sh
npm i -D typed-htmx
```

在 `src/global.d.ts` 中（如果你使用 HonoX，则是 `app/global.d.ts`），引入 `typed-htmx` 的类型：

```ts
import 'typed-htmx'
```

使用 typed-htmx 的定义扩展 Hono 的 JSX 类型：

```ts
// A demo of how to augment foreign types with htmx attributes.
// In this case, Hono sources its types from its own namespace, so we do the same
// and directly extend its namespace.
declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}
```

## 另请参阅

- [htmx](https://htmx.org/)
- [typed-htmx](https://github.com/Desdaemon/typed-htmx)
