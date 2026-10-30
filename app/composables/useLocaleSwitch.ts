// 切换语言：先写 cookie，再交给 Nuxt i18n 跳转到对应语言前缀
export function useLocaleSwitch() {
  const { setLocale } = useI18n()
  const cookie = useLocalePreference()

  return async (code: string) => {
    cookie.value = code
    await setLocale(code)
  }
}
