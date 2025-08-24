import { Metadata } from 'next';
import { ContactHub } from '@/components/sections/ContactHub';

export const metadata: Metadata = {
  title: 'Kontak Neezar Abd — Email, WhatsApp, LinkedIn',
  description: 'Informasi kontak Neezar Abdurrahman Ahnaf Abiyyi (Neezar Abd): email, WhatsApp, Instagram, GitHub, dan LinkedIn.',
  keywords: ['kontak', 'hubungi', 'email', 'WhatsApp', 'LinkedIn', 'GitHub', 'Instagram'],
  openGraph: {
    title: 'Kontak Neezar Abd — Email, WhatsApp, LinkedIn',
    description: 'Mari berdiskusi mengenai kebutuhan Anda atau peluang magang yang tersedia.',
    type: 'website',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <ContactHub />
    </div>
  );
}
