import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import '../styles/globals.css';
import { Providers } from '@/components/providers';
import { StructuredData } from '@/components/seo/StructuredData';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Neezar Abd',
    template: '%s — Neezar Abd',
  },
  description: 'Portfolio resmi Neezar Abdurrahman Ahnaf Abiyyi (Neezar Abd). Fokus pada Next.js, React, TypeScript, Tailwind CSS, dan MongoDB/Firebase. Menyediakan solusi web modern yang cepat, aman, dan mudah di-scale. Open to Internship (remote/onsite).',
  keywords: [
    'Neezar Abd',
    'Neezar Abdurrahman Ahnaf Abiyyi',
    'Software Engineer',
    'DevOps',
    'Web Developer',
    'Next.js',
    'React',
    'TypeScript',
    'Tailwind CSS',
    'MongoDB',
    'Firebase',
    'Portfolio SMK RPL'
  ],
  authors: [{ name: 'Neezar Abd' }],
  creator: 'Neezar Abd',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    title: 'Neezar Abdurrahman Ahnaf Abiyyi (Neezar Abd) — Software Engineer / DevOps / Web Developer',
    description: 'Portfolio resmi Neezar Abdurrahman Ahnaf Abiyyi (Neezar Abd). Fokus pada Next.js, React, TypeScript, Tailwind CSS, dan MongoDB/Firebase. Menyediakan solusi web modern yang cepat, aman, dan mudah di-scale. Open to Internship (remote/onsite).',
    siteName: 'Neezar Abd Portfolio',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Neezar Abd - Full Stack Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Neezar Abd - Full Stack Developer',
    description: 'Full Stack Developer dengan fokus pada React, Next.js, dan modern web technologies.',
    images: ['/images/og-image.png'],
    creator: '@neezarxmoklet',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#e60011" />
        <meta name="msapplication-TileColor" content="#e60011" />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          spaceGrotesk.variable,
          jetbrainsMono.variable
        )}
      >
        <Providers>
          <StructuredData />
          {children}
        </Providers>
      </body>
    </html>
  );
}
