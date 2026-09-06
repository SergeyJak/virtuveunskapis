import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://virtuveunskapis.lv/sitemap.xml',
    host: 'https://virtuveunskapis.lv',
  }
}
