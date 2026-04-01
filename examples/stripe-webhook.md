# Stripe Webhook

本文介绍如何使用 Hono 创建一个接收 Stripe Webhook 事件的 API。

## 准备

请先安装官方的 Stripe SDK：

```bash
npm install stripe
```

然后在 `.dev.vars` 文件中填写以下值，以配置 Stripe API 密钥：

```
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

你可以通过以下文档了解 Stripe API 密钥：

- Secret Key: https://docs.stripe.com/keys
- Webhook secret: https://docs.stripe.com/webhooks

## 如何保护用于接收 Stripe Webhook 事件的 API

处理 webhook 事件的 API 是公开可访问的。因此，需要一种机制来防止恶意第三方伪造 Stripe 的 webhook 事件对象并发送请求。对于 Stripe，你可以通过分发 webhook secret 并校验每个请求来保护 API。

了解更多： https://docs.stripe.com/webhooks?lang=node#verify-official-libraries

## 按托管环境或框架实现 Webhook API

为了与 Stripe 做签名校验，需要原始请求体。
在使用框架时，你需要确保原始请求体没有被修改。如果原始请求体发生了任何变化，校验就会失败。

在 Hono 中，我们可以通过 `context.req.text()` 方法获取原始请求体。因此可以像下面这样创建 webhook API：

```ts
import Stripe from 'stripe'
import { Hono } from 'hono'
import { env } from 'hono/adapter'

const app = new Hono()

app.post('/webhook', async (context) => {
  const { STRIPE_SECRET_API_KEY, STRIPE_WEBHOOK_SECRET } =
    env(context)
  const stripe = new Stripe(STRIPE_SECRET_API_KEY)
  const signature = context.req.header('stripe-signature')
  try {
    if (!signature) {
      return context.text('', 400)
    }
    const body = await context.req.text()
    const event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET
    )
    switch (event.type) {
      case 'payment_intent.created': {
        console.log(event.data.object)
        break
      }
      default:
        break
    }
    return context.text('', 200)
  } catch (err) {
    const errorMessage = `⚠️  Webhook signature verification failed. ${
      err instanceof Error ? err.message : 'Internal server error'
    }`
    console.log(errorMessage)
    return context.text(errorMessage, 400)
  }
})

export default app
```

## 另请参阅

- Details on Stripe Webhooks:
  https://docs.stripe.com/webhooks
- Implementing for payment processing:
  https://docs.stripe.com/payments/handling-payment-events
- Implementing for subscriptions:
  https://docs.stripe.com/billing/subscriptions/webhooks
- List of webhook events sent by Stripe:
  https://docs.stripe.com/api/events
- Sample template for Cloudflare:
  https://github.com/stripe-samples/stripe-node-cloudflare-worker-template/
