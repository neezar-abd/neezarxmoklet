import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog Neezar Abd — Next.js, React, dan Catatan DevOps',
  description: 'Artikel dan catatan teknis terkait Next.js/React, DevOps dasar, dan pelajaran dari proyek. (Segera hadir.)',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
