'use client';

import { motion } from 'framer-motion';
import { Trophy, Briefcase, FileText, Star, Rocket, Target, Lightbulb, Sparkles, TrendingUp, Palette, Zap, Wrench } from 'lucide-react';

const kpiItems = [
  { icon: Trophy, text: 'Finalis Hackathon 2024' },
  { icon: Briefcase, text: '10+ Client Puas' },
  { icon: FileText, text: '20k+ Blog Reads' },
  { icon: Star, text: '4.9/5 Rating' },
  { icon: Rocket, text: '99% Uptime' },
  { icon: Target, text: '15+ Projects' },
  { icon: Lightbulb, text: '10+ Technologies' },
  { icon: Sparkles, text: '5+ Open Source' },
  { icon: TrendingUp, text: '3+ Years Experience' },
  { icon: Palette, text: 'UI/UX Focused' },
  { icon: Zap, text: 'Fast Loading' },
  { icon: Wrench, text: 'Clean Code' },
];

// Duplicate items for seamless loop
const doubledItems = [...kpiItems, ...kpiItems];

export default function KpiMarquee() {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-r from-background via-muted/20 to-background">
      {/* Gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      
      <div className="py-6">
        <motion.div
          animate={{ x: '-50%' }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-6 will-change-transform hover:pause"
          style={{
            width: 'fit-content',
          }}
        >
          {doubledItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <div
                key={`${item.text}-${index}`}
                className="flex items-center gap-2 whitespace-nowrap rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-sm"
              >
                <IconComponent className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{item.text}</span>
              </div>
            );
          })}
        </motion.div>
      </div>
      
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
