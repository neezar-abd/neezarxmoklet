'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Award, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Certification {
  name: string;
  issuer: string;
  year: string;
  category: string;
  skills: string[];
  credentialId?: string;
  verifyUrl: string;
  badgeUrl?: string;
}

interface CertificationsGridProps {
  items: Certification[];
  limit?: number;
  className?: string;
}

export function CertificationsGrid({ items, limit = 6, className }: CertificationsGridProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Sort by date (newest first) then by relevance
  const sortedItems = [...items].sort((a, b) => 
    new Date(b.year).getTime() - new Date(a.year).getTime()
  );
  
  const displayItems = showAll ? sortedItems : sortedItems.slice(0, limit);
  const remainingCount = sortedItems.length - limit;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short'
    });
  };

  // Generate JSON-LD structured data
  const generateJsonLd = (cert: Certification) => ({
    "@type": "EducationalOccupationalCredential",
    "@context": "https://schema.org",
    "name": cert.name,
    "description": `Professional certification in ${cert.skills.join(', ')}`,
    "credentialCategory": cert.category,
    "dateCreated": cert.year,
    "recognizedBy": {
      "@type": "Organization",
      "name": cert.issuer
    },
    "about": cert.skills.map(skill => ({
      "@type": "DefinedTerm",
      "name": skill
    })),
    ...(cert.credentialId && { "identifier": cert.credentialId }),
    ...(cert.verifyUrl && { "url": cert.verifyUrl })
  });

  return (
    <section className={cn("space-y-6", className)}>
      {/* JSON-LD Structured Data */}
      {displayItems.map((cert, index) => (
        <script
          key={`cert-jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateJsonLd(cert))
          }}
        />
      ))}

      {/* Mobile: Horizontal Scroll Carousel */}
      <div className="md:hidden">
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide">
          {displayItems.map((cert, index) => (
            <CertificationCard
              key={`mobile-cert-${index}`}
              cert={cert}
              index={index}
              className="min-w-[280px] snap-start"
            />
          ))}
        </div>
      </div>

      {/* Desktop: Grid Layout */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((cert, index) => (
          <CertificationCard
            key={`desktop-cert-${index}`}
            cert={cert}
            index={index}
          />
        ))}
      </div>

      {/* Show More/Less Button */}
      {remainingCount > 0 && (
        <div className="text-center pt-4">
          <Button
            variant="outline"
            onClick={() => setShowAll(!showAll)}
            className="group"
            aria-label={showAll ? "Tampilkan lebih sedikit sertifikat" : `Lihat semua sertifikat (+${remainingCount})`}
          >
            {showAll ? (
              "Tampilkan Lebih Sedikit"
            ) : (
              <>
                Lihat Semua Sertifikat
                <span className="ml-1 text-muted-foreground">(+{remainingCount})</span>
              </>
            )}
          </Button>
        </div>
      )}
    </section>
  );
}

interface CertificationCardProps {
  cert: Certification;
  index: number;
  className?: string;
}

function CertificationCard({ cert, index, className }: CertificationCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short'
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        "group relative h-full rounded-2xl border bg-card p-6 transition-all duration-300",
        "hover:shadow-lg hover:shadow-primary/10 hover:border-primary/30",
        "motion-reduce:transition-none",
        className
      )}
    >
      {/* Header with Badge/Issuer */}
      <div className="flex items-start gap-4 mb-4">
        {/* Badge or Fallback Icon */}
        <div className="flex-shrink-0">
          {cert.badgeUrl ? (
            <img
              src={cert.badgeUrl}
              alt={`${cert.issuer} badge`}
              className="w-12 h-12 rounded-lg object-contain"
              loading="lazy"
            />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" aria-hidden="true" />
            </div>
          )}
        </div>

        {/* Title and Issuer */}
        <div className="flex-grow min-w-0">
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {cert.name}
          </h3>
          <p className="text-sm text-muted-foreground font-medium mt-1">
            {cert.issuer}
          </p>
        </div>
      </div>

      {/* Meta Information */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1">
          <Calendar className="w-3 h-3" aria-hidden="true" />
          <time dateTime={cert.year}>
            {cert.year}
          </time>
        </div>
        <div className="flex items-center gap-1">
          <Award className="w-3 h-3" aria-hidden="true" />
          <span>{cert.category}</span>
        </div>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {cert.skills.slice(0, 4).map((skill) => (
          <Badge
            key={skill}
            variant="secondary"
            className="text-xs font-medium"
          >
            {skill}
          </Badge>
        ))}
        {cert.skills.length > 4 && (
          <Badge variant="outline" className="text-xs">
            +{cert.skills.length - 4}
          </Badge>
        )}
      </div>

      {/* Verify Button */}
      <div className="mt-auto">
        <a
          href={cert.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center gap-2 text-sm font-medium",
            "text-primary hover:text-primary/80 transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
          )}
          aria-label={`Verify ${cert.name} certification (opens in new tab)`}
        >
          Verify Certificate
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
        </a>
      </div>

      {/* Credential ID if available */}
      {cert.credentialId && (
        <div className="mt-2 text-xs text-muted-foreground">
          ID: {cert.credentialId}
        </div>
      )}
    </motion.article>
  );
}
