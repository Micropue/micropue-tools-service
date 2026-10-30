// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@primevue/nuxt-module', '@nuxtjs/i18n'],

  i18n: {
    defaultLocale: 'en',
    strategy: 'prefix_except_default',
    // 不在首次访问时按浏览器语言跳转：/ 固定英文，选择结果改由 cookie 记住
    detectBrowserLanguage: false,
    locales: [
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
      { code: 'zh', language: 'zh-CN', name: '中文', file: 'zh.json' },
      { code: 'ja', language: 'ja-JP', name: '日本語', file: 'ja.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' }
    ]
  },

  css: ['primeicons/primeicons.css', '~/assets/css/main.scss'],

  primevue: {
    options: { ripple: false },
    // 黑白主题：app/assets/themes/noir.ts
    importTheme: { from: '~/assets/themes/noir', as: 'NoirTheme' }
  },
  devServer:{
    port: 3501
  }
})
