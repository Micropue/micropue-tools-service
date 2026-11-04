import { tools } from '~/data/tools'

const LOCALE_PREFIXES = ['', '/zh', '/ja', '/ru']

export default defineEventHandler(event => {
  const config = useRuntimeConfig(event)
  const site = String(config.public.siteUrl).replace(/\/+$/, '')
  const lastmod = new Date().toISOString().slice(0, 10)
  const paths = ['/', '/tools', ...tools.filter(tool => tool.component).map(tool => `/tools/${tool.slug}`)]

  const entries: string[] = []
  for (const prefix of LOCALE_PREFIXES) {
    for (const path of paths) {
      const priority = path === '/' ? '1.0' : path === '/tools' ? '0.9' : '0.7'
      entries.push(
        `  <url>\n    <loc>${site}${prefix}${path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`
      )
    }
  }

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>`
})
