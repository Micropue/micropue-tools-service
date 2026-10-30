// 高性能内容开关（目前控制主页照片墙背景），写入 cookie 跨刷新保持
export function usePerformanceMode() {
  return useCookie<boolean>('micropue-perf', {
    default: () => true,
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax'
  })
}
