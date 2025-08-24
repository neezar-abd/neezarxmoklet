'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    // Start loading when pathname changes
    setIsLoading(true);
    setProgress(0);

    // Simulate loading progress
    const timer1 = setTimeout(() => setProgress(30), 100);
    const timer2 = setTimeout(() => setProgress(70), 300);
    const timer3 = setTimeout(() => setProgress(100), 500);
    const timer4 = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [pathname]);

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[100] h-1">
          {/* Background */}
          <div className="h-full bg-muted/20" />
          
          {/* Progress Bar */}
          <motion.div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary/80 to-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              duration: 0.3, 
              ease: [0.25, 0.46, 0.45, 0.94] // Custom easing for smooth animation
            }}
          />
          
          {/* Glow Effect */}
          <motion.div
            className="absolute top-0 right-0 h-full w-20 bg-gradient-to-l from-transparent via-primary/30 to-primary/60 blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 10 ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          />
          
          {/* Shimmer Effect */}
          <motion.div
            className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

// Loading Bar Hook for manual control
export function useLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  
  const start = () => setIsLoading(true);
  const finish = () => setIsLoading(false);
  
  return { isLoading, start, finish };
}
