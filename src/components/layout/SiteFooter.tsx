'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, Github, Linkedin, Mail, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { site } from '@/config/site';
import { Logo } from '@/components/branding/Logo';

export function SiteFooter() {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const currentYear = new Date().getFullYear();

  // Monitor scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to top
  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  };

  // Social links with icons
  const socialLinks = [
    {
      name: 'GitHub',
      href: site.links.github,
      icon: Github,
      label: 'GitHub Profile'
    },
    {
      name: 'LinkedIn',
      href: site.links.linkedin,
      icon: Linkedin,
      label: 'LinkedIn Profile'
    },
    {
      name: 'Email',
      href: site.links.email,
      icon: Mail,
      label: 'Send Email'
    }
  ];

  return (
    <>
      <footer className="relative w-full border-t border-border bg-background text-foreground">
        {/* Gradient top divider */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
        
        <div className="container max-w-6xl mx-auto px-6 py-12 md:py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {/* Brand Section */}
            <div className="space-y-4">
              <Logo 
                size={32} 
                withText 
                alt="Neezar Abd - Portfolio Website"
                className="justify-start"
              />
              <p className="text-muted-foreground leading-relaxed max-w-sm">
                {site.bio}
              </p>
            </div>

            {/* Navigation Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Navigasi
              </h2>
              <nav>
                <ul className="space-y-3">
                  {site.navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-block text-muted-foreground hover:text-foreground",
                          "transition-all duration-300 relative",
                          "focus:outline-none focus:text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-sm px-1 py-0.5",
                          "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0",
                          "after:bg-gradient-to-r after:from-primary after:to-red-600",
                          "after:transition-all after:duration-300",
                          "hover:after:w-full"
                        )}
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                Sosial Media
              </h2>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  const isExternal = social.href.startsWith('http') || social.href.startsWith('mailto');
                  
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noreferrer noopener" : undefined}
                      className={cn(
                        "p-2 rounded-lg bg-muted/50 hover:bg-primary hover:text-primary-foreground",
                        "transition-all duration-300 motion-safe:hover:scale-105",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        "group"
                      )}
                      aria-label={social.label}
                    >
                      <Icon 
                        className="h-5 w-5" 
                        aria-hidden="true"
                      />
                      <span className="sr-only">{social.name}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-border pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {currentYear} {site.name}. Semua hak dilindungi.
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Dibuat dengan</span>
                <Heart 
                  className="h-4 w-4 text-primary fill-current" 
                  aria-hidden="true"
                />
                <span>menggunakan Next.js & Tailwind CSS</span>
              </div>
            </div>
          </div>

          {/* SEO JSON-LD */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": site.name,
                "url": site.url || "", // Use site config instead of window.location
                "sameAs": [
                  site.links.github,
                  site.links.linkedin
                ]
              })
            }}
          />
        </div>
      </footer>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ 
              duration: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 0.3 
            }}
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-6 right-6 z-50",
              "w-12 h-12 rounded-full",
              "bg-primary text-primary-foreground shadow-lg",
              "hover:bg-red-600 hover:shadow-xl hover:shadow-primary/25",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              "transition-all duration-300",
              "flex items-center justify-center"
            )}
            aria-label="Kembali ke atas"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
