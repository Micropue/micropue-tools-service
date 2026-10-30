// 语言选择写在 cookie 里，刷新/重新进入站点后沿用上次的选择
export const LOCALE_COOKIE = 'micropue-locale'

export function useLocalePreference() {
  return useCookie<string>(LOCALE_COOKIE, {
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
}
