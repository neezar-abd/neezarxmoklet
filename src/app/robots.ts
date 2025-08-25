import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://neezar.tech";
  return { 
    rules: [{ 
      userAgent: "*", 
      allow: "/" 
    }], 
    sitemap: `${base}/sitemap.xml` 
  };
}
