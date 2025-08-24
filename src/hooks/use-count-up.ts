'use client';

import { useEffect, useState, useRef } from 'react';

interface UseCountUpOptions {
  end: number;
  duration?: number;
  suffix?: string;
}

export function useCountUp({ end, duration = 900, suffix = '' }: UseCountUpOptions) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.4 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!isVisible) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      setCount(end);
      return;
    }

    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Cubic bezier easing (.2,.8,.2,1)
      const easeProgress = progress < 0.5 
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const currentCount = Math.floor(startValue + (end - startValue) * easeProgress);
      setCount(currentCount);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, end, duration]);

  // Generate a11y label
  const generateA11yLabel = (value: number, suffix: string) => {
    const numberWords = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan', 'sepuluh'];
    const baseLabel = value <= 10 ? numberWords[value] : value.toString();
    return `${baseLabel}${suffix ? ` ${suffix}` : ''}`;
  };

  return { 
    count, 
    ref, 
    displayValue: `${count}${suffix}`,
    a11yLabel: generateA11yLabel(count, suffix)
  };
}
