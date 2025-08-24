'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export function SimpleLoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    
    // Start loading
    setIsLoading(true);
    setProgress(0);

    // Progressive loading simulation
    timeouts.push(setTimeout(() => setProgress(25), 100));
    timeouts.push(setTimeout(() => setProgress(50), 200));
    timeouts.push(setTimeout(() => setProgress(75), 400));
    timeouts.push(setTimeout(() => setProgress(100), 600));
    timeouts.push(setTimeout(() => setIsLoading(false), 800));

    return () => {
      timeouts.forEach(clearTimeout);
      setIsLoading(false);
      setProgress(0);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1">
      {/* Background Track */}
      <div className="h-full bg-border/20" />
      
      {/* Progress Bar with Gradient */}
      <motion.div
        className="absolute top-0 left-0 h-full"
        style={{
          background: 'linear-gradient(90deg, #e60011 0%, #ff1a33 50%, #e60011 100%)',
          boxShadow: '0 0 10px rgba(230, 0, 17, 0.5)',
        }}
        initial={{ width: '0%' }}
        animate={{ width: `${progress}%` }}
        transition={{ 
          duration: 0.4, 
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      />
      
      {/* Animated Shimmer */}
      {progress > 0 && (
        <motion.div
          className="absolute top-0 h-full w-20 opacity-60"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
            left: `${Math.max(0, progress - 10)}%`,
          }}
          animate={{
            left: [`${Math.max(0, progress - 10)}%`, `${progress}%`],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
}
