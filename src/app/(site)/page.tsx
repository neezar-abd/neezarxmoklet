'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Download, Github, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollIndicator } from '@/components/ui/scroll-indicator';
import StatsCards from '@/components/sections/StatsCards';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import KpiMarquee from '@/components/sections/KpiMarquee';
import { ArticlesSection } from '@/components/sections/ArticlesSection';
import AboutTeaser from '@/components/sections/AboutTeaser';
import Hero from '@/components/sections/Hero';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <Hero />

      {/* About Teaser Section */}
      <AboutTeaser />

      {/* Stats Section */}
      <section id="stats" className="h-screen flex items-center justify-center bg-muted/50 min-h-[600px] scroll-mt-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Pencapaian & Statistik
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Beberapa pencapaian yang telah saya raih dalam perjalanan sebagai developer
            </p>
            
            {/* Helper chips */}
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                #Frontend
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                #Backend
              </span>
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                #OpenSource
              </span>
            </div>
          </motion.div>
          
          <StatsCards />
          
          {/* KPI Marquee */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <KpiMarquee />
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="h-screen flex items-center justify-center min-h-[700px] py-8 scroll-mt-24">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Proyek Unggulan
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Beberapa proyek yang telah saya kerjakan menggunakan teknologi modern
            </p>
          </motion.div>

          {/* Featured Projects Grid (limit to 3) */}
          <ProjectsGrid 
            showSearch={false}
            showFilters={false}
            limit={3}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Button variant="outline" asChild>
              <Link href="/projects">Lihat Semua Proyek</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section id="blog" className="scroll-mt-24">
        <ArticlesSection limit={4} />
      </section>
    </div>
  );
}
