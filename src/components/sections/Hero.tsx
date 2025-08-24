'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Download, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Smooth scroll to projects section
  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start'
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0 : 0.6,
        ease: "easeOut"
      }
    }
  };

  // Social proof data
  const socialProof = [
    { label: "2+ Tahun", description: "Pengalaman" },
    { label: "3 Proyek", description: "Dirilis" },
    { label: "Next.js", description: "Fokus Stack" },
    { label: "Open", description: "to Internship" }
  ];

  return (
    <section 
      id="hero" 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background with spotlight gradient and noise */}
      <div className="absolute inset-0">
        {/* Spotlight gradient */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-[#e60011]/25 via-[#c10018]/15 to-transparent"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 20%, rgba(230, 0, 17, 0.25) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 70%, rgba(193, 0, 24, 0.15) 0%, transparent 50%)
            `
          }}
        />
        
        {/* Subtle noise overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-[18vh] md:py-[22vh]">
        <motion.div
          variants={prefersReducedMotion ? {} : containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center space-y-8"
        >
          {/* Main heading */}
          <motion.div variants={itemVariants}>
            <h1 className={cn(
              "text-4xl md:text-6xl xl:text-7xl font-bold leading-tight tracking-tight",
              "text-balance"
            )}>
              Halo, Saya{' '}
              <span className={cn(
                "text-transparent bg-clip-text",
                "bg-gradient-to-r from-[#e60011] to-[#c10018]",
                "drop-shadow-sm",
                !prefersReducedMotion && "animate-pulse"
              )}
              style={{
                textShadow: !prefersReducedMotion ? '0 0 24px rgba(230, 0, 17, 0.18)' : 'none'
              }}>
                Neezar Abd
              </span>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <p className={cn(
              "text-lg md:text-xl lg:text-2xl text-muted-foreground",
              "leading-relaxed text-balance"
            )}>
              Software Engineer • DevOps Engineer • Web Developer
            </p>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants} className="max-w-3xl mx-auto">
            <p className={cn(
              "text-base md:text-lg text-muted-foreground",
              "leading-relaxed text-balance"
            )}>
              Saya membantu tim dan bisnis merancang serta membangun aplikasi web modern yang cepat, aman, dan mudah di-scale, dengan alur DevOps yang terukur untuk mempercepat rilis dan mempermudah pemeliharaan.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {/* Primary CTA */}
              <Link href="/#projects">
                <Button
                  size="lg"
                  className={cn(
                    "group px-8 py-4 text-lg font-semibold",
                    "bg-gradient-to-r from-[#e60011] to-[#c10018] text-white",
                    "hover:from-[#c10018] hover:to-[#a8001a] hover:shadow-lg hover:shadow-[#e60011]/25",
                    "focus:ring-2 focus:ring-[#e60011] focus:ring-offset-2",
                    "transition-all duration-300",
                    !prefersReducedMotion && "hover:scale-105 active:scale-95"
                  )}
                  aria-label="Lihat CV dalam format PDF"
                >
                  Lihat CV
                  <ArrowRight className={cn(
                    "ml-2 h-5 w-5 transition-transform duration-300",
                    !prefersReducedMotion && "group-hover:translate-x-1"
                  )} />
                </Button>
              </Link>

              {/* Secondary CTA */}
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "group px-8 py-4 text-lg font-semibold",
                  "border-2 border-[#e60011]/20 text-[#e60011] hover:bg-[#e60011] hover:text-white",
                  "hover:border-[#e60011] hover:shadow-lg",
                  "focus:ring-2 focus:ring-[#e60011] focus:ring-offset-2",
                  "transition-all duration-300",
                  !prefersReducedMotion && "hover:scale-105 active:scale-95"
                )}
                aria-label="Hubungi melalui email atau WhatsApp"
              >
                <Download className={cn(
                  "mr-2 h-5 w-5 transition-transform duration-300",
                  !prefersReducedMotion && "group-hover:scale-110"
                )} />
                Hubungi Saya
              </Button>
            </div>
          </motion.div>

          {/* Social Proof */}
          <motion.div variants={itemVariants}>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {socialProof.map((item, index) => (
                <div
                  key={item.label}
                  className={cn(
                    "px-4 py-2 rounded-full",
                    "bg-background/50 backdrop-blur-sm border border-border/50",
                    "hover:bg-background/80 hover:border-[#e60011]/30",
                    "transition-all duration-300",
                    !prefersReducedMotion && "hover:scale-105"
                  )}
                >
                  <div className="text-center">
                    <div className="font-bold text-[#e60011] text-sm md:text-base">
                      {item.label}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            variants={itemVariants}
            className="pt-8"
          >
            <button
              onClick={scrollToProjects}
              className={cn(
                "group flex flex-col items-center gap-2 mx-auto",
                "text-muted-foreground hover:text-[#e60011]",
                "focus:outline-none focus:text-[#e60011]",
                "transition-colors duration-300"
              )}
              aria-label="Scroll ke bagian proyek"
            >
              <span className="text-sm font-medium">Lihat Proyek</span>
              <motion.div
                animate={!prefersReducedMotion ? {
                  y: [0, 8, 0],
                } : {}}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className={cn(
                  "p-2 rounded-full border border-current",
                  "group-hover:border-[#e60011] group-focus:border-[#e60011]",
                  "transition-colors duration-300"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decoration - subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03] pointer-events-none">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(230, 0, 17, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(230, 0, 17, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
      </div>
    </section>
  );
}
