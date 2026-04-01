# 常见问题

本指南收集了关于 Hono 的常见问题 (FAQ) 及其解决方法。

## Hono 有官方的 Renovate 配置吗？

Hono 团队目前不维护 [Renovate](https://github.com/renovatebot/renovate) 配置。
因此，请按如下方式使用第三方 renovate-config。

在你的 `renovate.json` 中：

```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>shinGangan/renovate-config-hono" // [!code ++]
  ]
}
```

请参阅 [renovate-config-hono](https://github.com/shinGangan/renovate-config-hono) 仓库以获取更多详情。
