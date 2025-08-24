'use client';

import { useEffect } from 'react';

export function StructuredData() {
  useEffect(() => {
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/#person`,
          "name": "Neezar Abdurrahman Ahnaf Abiyyi",
          "alternateName": "Neezar Abd",
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech',
          "image": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/icon.png`,
            "width": 512,
            "height": 512
          },
          "logo": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/icon.png`,
            "width": 512,
            "height": 512
          },
          "sameAs": [
            "https://github.com/neezar-abd",
            "https://www.linkedin.com/in/nizar-abdurr-4a9846365",
            "https://instagram.com/nizarxrpl1"
          ],
          "jobTitle": "Software Engineer",
          "worksFor": {
            "@type": "Organization",
            "name": "Freelancer"
          },
          "knowsAbout": [
            "Next.js",
            "React",
            "TypeScript",
            "Tailwind CSS",
            "MongoDB",
            "Firebase",
            "Web Development",
            "DevOps"
          ]
        },
        {
          "@type": "WebSite",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/#website`,
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech',
          "name": "Neezar Abd Portfolio",
          "description": "Portfolio resmi Neezar Abdurrahman Ahnaf Abiyyi (Neezar Abd). Software Engineer, DevOps, Web Developer.",
          "publisher": {
            "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/#person`
          },
          "inLanguage": "id-ID"
        },
        {
          "@type": "Organization",
          "@id": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/#organization`,
          "name": "Neezar Abd",
          "url": process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech',
          "logo": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/icon.png`,
            "width": 512,
            "height": 512,
            "caption": "Neezar Abd Logo"
          },
          "image": {
            "@type": "ImageObject",
            "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://neezar.tech'}/icon.png`,
            "width": 512,
            "height": 512
          },
          "sameAs": [
            "https://github.com/neezar-abd",
            "https://www.linkedin.com/in/nizar-abdurr-4a9846365",
            "https://instagram.com/nizarxrpl1"
          ]
        }
      ]
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return null;
}
