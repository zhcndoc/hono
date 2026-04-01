# Create-hono

`create-hono` 支持的命令行选项 - 这是当你运行 `npm create hono@latest`、`npx create-hono@latest` 或 `pnpm create hono@latest` 时运行的项目初始化工具。

> [!NOTE]
> **为什么需要这个页面？** 安装/快速启动示例通常展示一个最小化的 `npm create hono@latest my-app` 命令。`create-hono` 支持几个有用的标志，你可以传递这些标志来自动化和自定义项目创建（选择模板、跳过提示、选择包管理器、使用本地缓存等）。

## 传递参数：

当你使用 `npm create`（或 `npx`）时，旨在传递给初始化脚本的参数必须放在 `--` **之后**。`--` 之后的任何内容都会转发给初始化程序。

::: code-group

```sh [npm]
# 将参数转发给 create-hono（npm 需要 `--`）
npm create hono@latest my-app -- --template cloudflare-workers
```

```sh [yarn]
# "--template cloudflare-workers" 选择 Cloudflare Workers 模板
yarn create hono my-app --template cloudflare-workers
```

```sh [pnpm]
# "--template cloudflare-workers" 选择 Cloudflare Workers 模板
pnpm create hono@latest my-app --template cloudflare-workers
```

```sh [bun]
# "--template cloudflare-workers" 选择 Cloudflare Workers 模板
bun create hono@latest my-app --template cloudflare-workers
```

```sh [deno]
# "--template cloudflare-workers" 选择 Cloudflare Workers 模板
deno init --npm hono@latest my-app --template cloudflare-workers
```

:::

## 常用参数

| 参数                    | 描述                                                                                                                                      | 示例                            |
| :---------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------ |
| `--template <template>` | 选择一个起始模板并跳过交互式模板提示。模板可能包含名称，如 `bun`、`cloudflare-workers`、`vercel` 等。 | `--template cloudflare-workers` |
| `--install`             | 模板创建后自动安装依赖。                                                                                | `--install`                     |
| `--pm <packageManager>` | 指定安装依赖时运行哪个包管理器。常用值：`npm`、`pnpm`、`yarn`。                                         | `--pm pnpm`                     |
| `--offline`             | 使用本地缓存/模板而不是获取最新的远程模板。适用于离线环境或确定性本地运行。      | `--offline`                     |

> [!NOTE]
> 确切的模板集和可用选项由 `create-hono` 项目维护。此文档页面总结了最常用的标志 — 请参阅下方链接的仓库以获取完整、权威的参考。

## 示例流程

### 最小化，交互式

```bash
npm create hono@latest my-app
```

这将提示你选择模板和选项。

### 非交互式，选择模板和包管理器

```bash
npm create hono@latest my-app -- --template vercel --pm npm --install
```

这将使用 `vercel` 模板创建 `my-app`，使用 `npm` 安装依赖，并跳过交互式提示。

### 使用离线缓存（无网络）

```bash
pnpm create hono@latest my-app --template deno --offline
```

## 故障排除与提示

- 如果某个选项似乎未被识别，请确保在使用 `npm create` / `npx` 时使用 `--` 转发它。
- 要查看最新的模板和标志列表，请参阅 `create-hono` 仓库或在本地运行初始化程序并遵循其帮助输出。

## 链接与参考

- `create-hono` 仓库：[create-hono](https://github.com/honojs/create-hono)
