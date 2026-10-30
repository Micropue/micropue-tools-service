export default defineNuxtRouteMiddleware((to) => {
  // 只在无语言前缀的首页生效：有 cookie 就回到上次选的语言
  if (to.path !== '/') return

  const saved = useLocalePreference().value
  if (!saved) return

  // 中间件里不能调 useI18n（只能在 setup 里），用 i18n 的公开运行时配置判断
  const { defaultLocale, locales } = useRuntimeConfig().public.i18n as {
    defaultLocale: string
    locales: { code: string }[]
  }

  if (saved !== defaultLocale && locales.some(l => l.code === saved)) {
    return navigateTo(`/${saved}`, { redirectCode: 302, replace: true })
  }
})
