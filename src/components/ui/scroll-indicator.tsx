'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface ScrollIndicatorProps {
  targetId?: string;
}

export function ScrollIndicator({ targetId = "stats" }: ScrollIndicatorProps) {
  const scrollToSection = () => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
      onClick={scrollToSection}
      className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-muted-foreground hover:text-primary transition-colors group"
      aria-label="Scroll to next section"
    >
      <span className="text-sm mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        Scroll down
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="p-2 rounded-full border border-current"
      >
        <ChevronDown className="h-4 w-4" />
      </motion.div>
    </motion.button>
  );
}
