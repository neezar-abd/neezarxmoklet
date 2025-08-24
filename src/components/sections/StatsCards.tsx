'use client';

import { createElement, Suspense } from 'react';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useCountUp } from '@/hooks/use-count-up';
import { stats as defaultStats } from '@/data/stats';

interface StatItem {
  icon: string;
  value: number;
  suffix?: string;
  label: string;
}

interface StatsCardsProps {
  items?: StatItem[];
  loading?: boolean;
}

function StatCard({ item, index }: { item: StatItem; index: number }) {
  const { count, ref, displayValue, a11yLabel } = useCountUp({ 
    end: item.value, 
    suffix: item.suffix || '',
    duration: 900 + index * 100 // Stagger animation
  });

  // Dynamically get icon component
  const IconComponent = (LucideIcons as any)[item.icon] || LucideIcons.Star;

  // A11y label for screen readers
  const ariaLabel = `${a11yLabel} ${item.label}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        y: -2,
        scale: 1.01,
        transition: { duration: 0.2 }
      }}
      className="group"
    >
      <Card className="relative overflow-hidden rounded-2xl border-0 bg-white/5 backdrop-blur-md dark:bg-white/[0.02] shadow-inner transition-all duration-300 hover:shadow-[0_0_24px_rgba(230,0,17,.15)]">
        {/* Gradient border using pseudo ::before */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#e60011] via-[#c10018] to-[#e60011] p-[1px] before:absolute before:inset-[1px] before:rounded-2xl before:bg-background/90 before:backdrop-blur-md" />
        
        {/* Spotlight effect using pseudo ::after */}
        <div className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute top-4 left-4 h-16 w-16 rounded-full bg-gradient-radial from-[#e60011]/18 via-[#c10018]/10 to-transparent blur-sm" />
        </div>
        
        {/* Inner shadow for glass effect */}
        <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-white/[0.08] via-transparent to-black/[0.02] dark:from-white/[0.03] dark:to-black/[0.05]" />
        
        <CardContent className="relative flex flex-col items-center justify-center p-6 text-center z-10">
          {/* Icon */}
          <motion.div
            whileHover={{ 
              rotate: 3,
              scale: 1.03,
              transition: { duration: 0.2 }
            }}
            animate={{
              opacity: [0.85, 1, 0.85],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 text-primary transition-all duration-300 group-hover:from-primary/30 group-hover:to-primary/20 group-hover:shadow-lg group-hover:shadow-primary/25"
          >
            <IconComponent className="h-6 w-6" strokeWidth={2} />
          </motion.div>

          {/* Count */}
          <div 
            ref={ref}
            role="status"
            aria-label={ariaLabel}
            aria-live="polite"
            className="mb-2"
            style={{ minWidth: `${String(item.value + (item.suffix || '')).length}ch` }}
          >
            <span 
              className="font-mono text-3xl font-bold text-foreground md:text-4xl transition-colors"
              style={{ 
                fontVariantNumeric: 'tabular-nums',
                fontFeatureSettings: '"tnum"'
              }}
            >
              {displayValue}
            </span>
            <span className="sr-only" aria-live="polite">
              {item.value} {item.suffix || ''} {item.label}
            </span>
          </div>

          {/* Label */}
          <p className="text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground">
            {item.label}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatCardSkeleton({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl dark:from-white/5 dark:via-white/[0.02] dark:to-transparent">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-[1px]">
          <div className="h-full w-full rounded-2xl bg-background/80 backdrop-blur-xl" />
        </div>
        
        <CardContent className="relative flex flex-col items-center justify-center p-6 text-center">
          {/* Icon skeleton */}
          <div className="mb-4 h-12 w-12 animate-pulse rounded-xl bg-gradient-to-br from-primary/10 to-primary/5" />
          
          {/* Count skeleton */}
          <div className="mb-2 h-10 w-16 animate-pulse rounded-lg bg-gradient-to-r from-muted/50 to-muted/30 md:h-12 md:w-20" />
          
          {/* Label skeleton */}
          <div className="h-4 w-24 animate-pulse rounded bg-gradient-to-r from-muted/40 to-muted/20" />
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StatsCards({ items = defaultStats, loading = false }: StatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} index={index} />
        ))}
      </div>
    );
  }

  return (
    <Suspense fallback={
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} index={index} />
        ))}
      </div>
    }>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-8 lg:gap-10">
        {items.map((item, index) => (
          <StatCard key={`${item.icon}-${item.label}`} item={item} index={index} />
        ))}
      </div>
    </Suspense>
  );
}
