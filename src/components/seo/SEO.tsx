import { DefaultSeo, NextSeo } from 'next-seo';
import Head from 'next/head';

const defaultSEOConfig = {
  title: 'Neezar Xmoklet - Full Stack Developer',
  description: 'Portfolio dan blog personal dari Neezar Xmoklet, seorang Full Stack Developer yang berfokus pada pengembangan web modern dengan React, Next.js, dan TypeScript.',
  canonical: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001',
    siteName: 'Neezar Xmoklet Portfolio',
    title: 'Neezar Xmoklet - Full Stack Developer',
    description: 'Portfolio dan blog personal dari Neezar Xmoklet, seorang Full Stack Developer yang berfokus pada pengembangan web modern.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Neezar Xmoklet Portfolio',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    handle: '@neezarxmoklet',
    site: '@neezarxmoklet',
    cardType: 'summary_large_image',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'application-name',
      content: 'Neezar Xmoklet Portfolio',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Neezar Xmoklet',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'theme-color',
      content: '#e60011',
    },
  ],
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/images/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Neezar Xmoklet Blog RSS Feed',
      href: '/api/rss.xml',
    },
    {
      rel: 'alternate',
      type: 'application/feed+json',
      title: 'Neezar Xmoklet Blog JSON Feed',
      href: '/api/feed.json',
    },
  ],
};

export function DefaultSEO() {
  return <DefaultSeo {...defaultSEOConfig} />;
}

interface BlogPostSEOProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  ogImage?: string;
  readingTime: string;
}

export function BlogPostSEO({ title, description, date, slug, tags, ogImage, readingTime }: BlogPostSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const url = `${siteUrl}/blog/${slug}`;
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/images/og-image.jpg`,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Person',
      name: 'Neezar Xmoklet',
      url: siteUrl,
      image: `${siteUrl}/images/profile.jpg`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Neezar Xmoklet',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/profile.jpg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    keywords: tags.join(', '),
    timeRequired: readingTime,
    url: url,
  };

  return (
    <>
      <NextSeo
        title={`${title} | Neezar Xmoklet Blog`}
        description={description}
        canonical={url}
        openGraph={{
          type: 'article',
          title: title,
          description: description,
          url: url,
          article: {
            publishedTime: date,
            modifiedTime: date,
            authors: ['Neezar Xmoklet'],
            tags: tags,
          },
          images: [
            {
              url: ogImage ? `${siteUrl}${ogImage}` : `${siteUrl}/images/og-image.jpg`,
              width: 1200,
              height: 630,
              alt: title,
              type: 'image/jpeg',
            },
          ],
        }}
        additionalMetaTags={[
          {
            name: 'keywords',
            content: tags.join(', '),
          },
          {
            property: 'article:published_time',
            content: date,
          },
          {
            property: 'article:modified_time',
            content: date,
          },
          {
            property: 'article:author',
            content: 'Neezar Xmoklet',
          },
          {
            property: 'article:tag',
            content: tags.join(', '),
          },
        ]}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
    </>
  );
}

interface PageSEOProps {
  title: string;
  description: string;
  path?: string;
}

export function PageSEO({ title, description, path = '' }: PageSEOProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001';
  const url = `${siteUrl}${path}`;

  return (
    <NextSeo
      title={`${title} | Neezar Xmoklet`}
      description={description}
      canonical={url}
      openGraph={{
        title: title,
        description: description,
        url: url,
      }}
    />
  );
}
