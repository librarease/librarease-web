import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/borrowings/*',
        '/subscriptions/*',
        '/notifications/*',
        '/users/*',
      ],
    },
    sitemap: 'https://librarease.org/sitemap.xml',
  }
}
