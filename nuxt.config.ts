// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@primevue/nuxt-module'],

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
