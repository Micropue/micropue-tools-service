const OWNER = 'Micropue'
const REPO = 'micropue-tools-service'

// 缓存 1 小时：未认证的 GitHub API 每小时只有 60 次
export default defineCachedEventHandler(async () => {
  try {
    const repo = await $fetch<{ stargazers_count: number }>(`https://api.github.com/repos/${OWNER}/${REPO}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'micropue-tools'
      }
    })
    return { stars: repo.stargazers_count }
  } catch (err) {
    console.warn('[github] star 获取失败：', err instanceof Error ? err.message : err)
    return { stars: null }
  }
}, { maxAge: 60 * 60 })
