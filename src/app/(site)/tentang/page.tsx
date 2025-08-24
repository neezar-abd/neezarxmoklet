import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { aboutData } from '@/data/about';
import { CertificationsGrid } from '@/components/about/CertificationsGrid';
import { SkillsMatrix } from '@/components/about/SkillsMatrix';
import { Highlights } from '@/components/about/Highlights';
import { Timeline } from '@/components/about/Timeline';
import StatsCards from '@/components/sections/StatsCards';
import type { AboutData } from '@/types/about';

export const metadata: Metadata = {
  title: 'Tentang - Neezar Indra Rizaldi',
  description: 'Mengenal lebih dekat perjalanan karir, keahlian, dan pencapaian sebagai Senior Software Engineer dengan fokus pada Next.js, React, dan arsitektur scalable.',
  keywords: ['Neezar Indra Rizaldi', 'Senior Software Engineer', 'Next.js', 'React', 'TypeScript', 'Full Stack Developer', 'Indonesia'],
  openGraph: {
    title: 'Tentang - Neezar Indra Rizaldi',
    description: 'Senior Software Engineer dengan pengalaman 7+ tahun dalam membangun aplikasi web modern dan scalable.',
    type: 'profile',
    locale: 'id_ID',
  },
  alternates: {
    canonical: '/tentang'
  },
  robots: {
    index: true,
    follow: true
  }
};

// Define section navigation
const sections = [
  { id: 'overview', label: 'Overview', description: 'Ringkasan profil dan pencapaian' },
  { id: 'skills', label: 'Skills', description: 'Keahlian teknis dan non-teknis' },
  { id: 'highlights', label: 'Highlights', description: 'Project dan pencapaian utama' },
  { id: 'certifications', label: 'Sertifikasi', description: 'Sertifikat profesional' },
  { id: 'timeline', label: 'Timeline', description: 'Perjalanan karir dan pendidikan' },
];

export default function AboutPage() {
  const data = aboutData;
  
  if (!data) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Neezar Indra Rizaldi",
    "jobTitle": "Senior Software Engineer",
    "url": "https://neezar.id",
    "sameAs": [
      "https://linkedin.com/in/neezar",
      "https://github.com/neezar"
    ],
    "knowsAbout": data.skills.flatMap(category => category.skills.map(skill => skill.label)),
    "alumniOf": data.timeline
      .filter(item => item.type === 'education')
      .map(item => ({
        "@type": "EducationalOrganization",
        "name": item.organization,
        "location": item.location
      })),
    "worksFor": data.timeline
      .filter(item => item.type === 'work' && item.isOngoing)
      .map(item => ({
        "@type": "Organization",
        "name": item.organization,
        "location": item.location
      }))[0],
    "hasCredential": data.certifications.map(cert => ({
      "@type": "EducationalOccupationalCredential",
      "name": cert.name,
      "credentialCategory": cert.category,
      "recognizedBy": {
        "@type": "Organization",
        "name": cert.issuer
      },
      "dateCreated": cert.year
    }))
  };

  return (
    <>
      {/* JSON-LD for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
              Tentang Saya
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Senior Software Engineer dengan passion untuk membangun solusi digital yang berdampak. 
              Menggabungkan keahlian teknis dengan pendekatan user-centric untuk menciptakan pengalaman yang luar biasa.
            </p>
          </div>
        </section>

        {/* Section Navigation */}
        <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex overflow-x-auto gap-1 py-4 scrollbar-hide">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex-shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors hover:bg-muted hover:text-foreground text-muted-foreground whitespace-nowrap"
                >
                  {section.label}
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 space-y-20 py-12">
          {/* Overview Section */}
          <section id="overview" className="scroll-mt-24">
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Overview</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Ringkasan pencapaian dan kontribusi selama {new Date().getFullYear() - 2017}+ tahun berkarir di industri teknologi
                </p>
              </div>
              
              <StatsCards 
                items={[
                  { icon: 'Calendar', value: 7, suffix: '+', label: 'Tahun Pengalaman' },
                  { icon: 'CheckCircle', value: 25, suffix: '+', label: 'Project Completed' },
                  { icon: 'Users', value: 5, suffix: '', label: 'Team Led' },
                  { icon: 'TrendingUp', value: 40, suffix: '%', label: 'Performance Improvement' }
                ]}
              />
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="scroll-mt-24">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Skills & Expertise</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Keahlian teknis dan pengalaman yang telah teruji dalam berbagai project dan environment production
                </p>
              </div>
              
              <SkillsMatrix 
                categories={data.skills}
                initialLimit={15}
              />
            </div>
          </section>

          {/* Highlights Section */}
          <section id="highlights" className="scroll-mt-24">
            <Highlights highlights={data.highlights} />
          </section>

          {/* Certifications Section */}
          <section id="certifications" className="scroll-mt-24">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-foreground">Sertifikasi Profesional</h2>
                <p className="text-muted-foreground max-w-3xl mx-auto">
                  Sertifikat dan kredensial yang menunjukkan komitmen terhadap pembelajaran berkelanjutan dan standar industri
                </p>
              </div>
              
              <CertificationsGrid 
                items={data.certifications}
              />
            </div>
          </section>

          {/* Timeline Section */}
          <section id="timeline" className="scroll-mt-24">
            <Timeline events={data.timeline} />
          </section>
        </div>

        {/* Call to Action */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              Mari Berkolaborasi
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tertarik untuk berdiskusi tentang project, peluang kolaborasi, atau sekadar berbagi insights tentang teknologi? 
              Saya selalu terbuka untuk percakapan yang menarik.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Hubungi Saya
              </a>
              <a
                href="/projects"
                className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg font-medium hover:bg-muted transition-colors"
              >
                Lihat Portfolio
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
