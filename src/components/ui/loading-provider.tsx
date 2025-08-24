'use client';

import { createContext, useContext, useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingContextType {
  isLoading: boolean;
  progress: number;
  startLoading: () => void;
  finishLoading: () => void;
  setProgress: (progress: number) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

function LoadingProviderInner({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const startLoading = () => {
    setIsLoading(true);
    setProgress(0);
  };

  const finishLoading = () => {
    setProgress(100);
    setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
    }, 200);
  };

  // Auto-loading on route change
  useEffect(() => {
    startLoading();

    // Simulate realistic loading progress
    const intervals = [
      { time: 100, progress: 20 },
      { time: 200, progress: 40 },
      { time: 400, progress: 70 },
      { time: 600, progress: 90 },
      { time: 800, progress: 100 },
    ];

    const timers = intervals.map(({ time, progress: targetProgress }) =>
      setTimeout(() => setProgress(targetProgress), time)
    );

    const finishTimer = setTimeout(() => {
      finishLoading();
    }, 1000);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finishTimer);
    };
  }, [pathname, searchParams]);

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        progress,
        startLoading,
        finishLoading,
        setProgress,
      }}
    >
      {children}
      <TopLoadingBar />
    </LoadingContext.Provider>
  );
}

function TopLoadingBar() {
  const context = useContext(LoadingContext);
  if (!context) return null;

  const { isLoading, progress } = context;

  return (
    <AnimatePresence>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 z-[100]">
          {/* Main Loading Bar */}
          <div className="relative h-1 bg-gradient-to-r from-muted/20 via-muted/10 to-muted/20">
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary/90 to-primary"
              initial={{ width: '0%', opacity: 0 }}
              animate={{ 
                width: `${progress}%`,
                opacity: 1
              }}
              exit={{ opacity: 0 }}
              transition={{ 
                width: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
                opacity: { duration: 0.1 }
              }}
            />
            
            {/* Glow Effect */}
            <motion.div
              className="absolute top-0 h-full bg-primary/30 blur-[2px]"
              initial={{ width: '0%', left: '0%' }}
              animate={{ 
                width: progress > 10 ? '40px' : '0px',
                left: `${Math.max(0, progress - 5)}%`
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
          
          {/* Pulse Effect */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-primary/50 via-primary/80 to-primary/50"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ 
              scaleX: 1, 
              opacity: [0, 0.8, 0],
            }}
            transition={{
              scaleX: { duration: 0.3 },
              opacity: { duration: 1.5, repeat: Infinity }
            }}
            style={{ transformOrigin: 'left' }}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}
