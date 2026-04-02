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
        'class': 'wwads-cn wwads-vertical',
        'style': 'margin-top: 0; margin-bottom: 1rem; max-width:200px;',
        'data-id': '354',
      }),
      'doc-after': () => h('div', {
        'class': 'wwads-cn wwads-horizontal',
        'style': 'margin-top: 1rem; margin-bottom: 1rem; max-width:100%;',
        'data-id': '354',
      }),
    })
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(ThoslashFloatingVue)
  },
}
