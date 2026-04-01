import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import './custom.css'
import 'virtual:group-icons.css'
import '@shikijs/vitepress-twoslash/style.css'
import ThoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import { h } from 'vue'

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => h('div', {
        'class': 'wwads-cn wwads-vertical w-full mt-0! mb-4',
        'data-id': '354',
      }),
      'doc-after': () => h('div', {
        'class': 'wwads-cn wwads-horizontal w-full mt-4',
        'data-id': '354',
      }),
    })
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(ThoslashFloatingVue)
  },
}
