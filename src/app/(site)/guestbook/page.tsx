import { Metadata } from 'next';
import Guestbook from '@/components/sections/Guestbook';

export const metadata: Metadata = {
  title: 'Guestbook — Pesan untuk Neezar Abd',
  description: 'Ruang singkat untuk meninggalkan pesan atau umpan balik.',
  keywords: ['guestbook', 'pesan', 'feedback', 'bincang', 'komentar'],
  openGraph: {
    title: 'Guestbook — Pesan untuk Neezar Abd',
    description: 'Ruang singkat untuk meninggalkan pesan atau umpan balik.',
    type: 'website',
  },
};

export default function GuestbookPage() {
  return (
    <div className="min-h-screen bg-background">
      <Guestbook />
    </div>
  );
}
