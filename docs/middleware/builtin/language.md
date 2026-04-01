# 语言中间件

Language Detector 中间件自动从各种来源确定用户的首选语言（区域设置），并通过 `c.get('language')` 提供。检测策略包括查询参数、Cookie、Header 和 URL 路径段。非常适合国际化 (i18n) 和特定区域设置的内容。

## 导入

```ts
import { Hono } from 'hono'
import { languageDetector } from 'hono/language'
```

## 基本用法

从查询字符串、Cookie 和 Header 检测语言（默认顺序），回退到英语：

```ts
const app = new Hono()

app.use(
  languageDetector({
    supportedLanguages: ['en', 'ar', 'ja'], // 必须包含回退语言
    fallbackLanguage: 'en', // 必填
  })
)

app.get('/', (c) => {
  const lang = c.get('language')
  return c.text(`Hello! Your language is ${lang}`)
})
```

### 客户端示例

```sh
# 通过路径
curl http://localhost:8787/ar/home

# 通过查询参数
curl http://localhost:8787/?lang=ar

# 通过 Cookie
curl -H 'Cookie: language=ja' http://localhost:8787/

# 通过 Header
curl -H 'Accept-Language: ar,en;q=0.9' http://localhost:8787/
```

## 默认配置

```ts
export const DEFAULT_OPTIONS: DetectorOptions = {
  order: ['querystring', 'cookie', 'header'],
  lookupQueryString: 'lang',
  lookupCookie: 'language',
  lookupFromHeaderKey: 'accept-language',
  lookupFromPathIndex: 0,
  caches: ['cookie'],
  ignoreCase: true,
  fallbackLanguage: 'en',
  supportedLanguages: ['en'],
  cookieOptions: {
    sameSite: 'Strict',
    secure: true,
    maxAge: 365 * 24 * 60 * 60,
    httpOnly: true,
  },
  debug: false,
}
```

## 关键行为

### 检测工作流程

1. **顺序**：默认按此顺序检查来源：
   - 查询参数 (?lang=ar)
   - Cookie (language=ar)
   - Accept-Language 请求头

2. **缓存**：将检测到的语言存储在 Cookie 中（默认 1 年）

3. **回退**：如果没有有效的检测结果，则使用 `fallbackLanguage`（必须在 `supportedLanguages` 中）

## 高级配置

### 自定义检测顺序

优先检测 URL 路径（例如 /en/about）：

```ts
app.use(
  languageDetector({
    order: ['path', 'cookie', 'querystring', 'header'],
    lookupFromPathIndex: 0, // /en/profile → 索引 0 = 'en'
    supportedLanguages: ['en', 'ar'],
    fallbackLanguage: 'en',
  })
)
```

### 渐进式区域设置匹配

当检测到的区域设置代码（如 `ja-JP`）不在 `supportedLanguages` 中时，中间件会 progressively 截断子标签以找到匹配项。例如，`zh-Hant-CN` 将尝试 `zh-Hant`，然后尝试 `zh`。始终优先完全匹配。

```ts
app.use(
  languageDetector({
    supportedLanguages: ['en', 'ja', 'zh-Hant'],
    fallbackLanguage: 'en',
  })
)

// Accept-Language: ja-JP → 匹配 'ja'
// Accept-Language: zh-Hant-CN → 匹配 'zh-Hant'
```

### 语言代码转换

标准化复杂代码（例如 en-US → en）：

```ts
app.use(
  languageDetector({
    convertDetectedLanguage: (lang) => lang.split('-')[0],
    supportedLanguages: ['en', 'ja'],
    fallbackLanguage: 'en',
  })
)
```

### Cookie 配置

```ts
app.use(
  languageDetector({
    lookupCookie: 'app_lang',
    caches: ['cookie'],
    cookieOptions: {
      path: '/', // Cookie 路径
      sameSite: 'Lax', // Cookie 同站策略
      secure: true, // 仅通过 HTTPS 发送
      maxAge: 86400 * 365, // 1 年过期
      httpOnly: true, // 无法通过 JavaScript 访问
      domain: '.example.com', // 可选：特定域名
    },
  })
)
```

要禁用 Cookie 缓存：

```ts
languageDetector({
  caches: false,
})
```

### 调试

记录检测步骤：

```ts
languageDetector({
  debug: true, // 显示："从查询字符串检测到：ar"
})
```

## 选项参考

### 基本选项

| 选项                 | 类型             | 默认值                                 | 必填 | 描述             |
| :------------------- | :--------------- | :------------------------------------ | :--- | :--------------- |
| `supportedLanguages` | `string[]`       | `['en']`                              | 是   | 允许的语言代码   |
| `fallbackLanguage`   | `string`         | `'en'`                                | 是   | 默认语言         |
| `order`              | `DetectorType[]` | `['querystring', 'cookie', 'header']` | 否   | 检测顺序         |
| `debug`              | `boolean`        | `false`                               | 否   | 启用日志记录     |

### 检测选项

| 选项                  | 类型     | 默认值              | 描述           |
| :-------------------- | :------- | :------------------ | :------------- |
| `lookupQueryString`   | `string` | `'lang'`            | 查询参数名称   |
| `lookupCookie`        | `string` | `'language'`        | Cookie 名称    |
| `lookupFromHeaderKey` | `string` | `'accept-language'` | Header 名称    |
| `lookupFromPathIndex` | `number` | `0`                 | 路径段索引     |

### Cookie 选项

| 选项                       | 类型                          | 默认值       | 描述           |
| :------------------------- | :---------------------------- | :----------- | :------------- |
| `caches`                   | `CacheType[] \| false`        | `['cookie']` | 缓存设置       |
| `cookieOptions.path`       | `string`                      | `'/'`        | Cookie 路径    |
| `cookieOptions.sameSite`   | `'Strict' \| 'Lax' \| 'None'` | `'Strict'`   | 同站策略       |
| `cookieOptions.secure`     | `boolean`                     | `true`       | 仅 HTTPS       |
| `cookieOptions.maxAge`     | `number`                      | `31536000`   | 过期时间 (秒)  |
| `cookieOptions.httpOnly`   | `boolean`                     | `true`       | JS 可访问性    |
| `cookieOptions.domain`     | `string`                      | `undefined`  | Cookie 域名    |

### 高级选项

| 选项                      | 类型                       | 默认值      | 描述               |
| :------------------------ | :------------------------- | :---------- | :----------------- |
| `ignoreCase`              | `boolean`                  | `true`      | 不区分大小写匹配   |
| `convertDetectedLanguage` | `(lang: string) => string` | `undefined` | 语言代码转换器     |

## 验证与错误处理

- `fallbackLanguage` 必须在 `supportedLanguages` 中（设置期间抛出错误）
- `lookupFromPathIndex` 必须 ≥ 0
- 无效配置会在中间件初始化期间抛出错误
- 检测失败会静默使用 `fallbackLanguage`

## 常见示例

### 基于路径的路由

```ts
app.get('/:lang/home', (c) => {
  const lang = c.get('language') // 'en', 'ar' 等
  return c.json({ message: getLocalizedContent(lang) })
})
```

### 多种支持语言

```ts
languageDetector({
  supportedLanguages: ['en', 'en-GB', 'ar', 'ar-EG'],
  convertDetectedLanguage: (lang) => lang.replace('_', '-'), // 标准化
})
```
