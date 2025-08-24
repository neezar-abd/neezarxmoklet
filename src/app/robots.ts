import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/admin/',
        '/*-test',
        '/quick-test',
        '/firebase-test',
        '/firebase-debug',
        '/moderator',
        '/bulk-moderator',
        '/security-test',
        '/rules-test',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
