'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: number;
  withText?: boolean;
  alt?: string;
  className?: string;
}

const LogoMark = ({ width, height, className }: { width: number; height: number; className?: string }) => (
  <Image
    src="/logo-new.svg"
    alt="Neezar Abd Logo"
    width={width}
    height={height}
    className={cn("object-contain", className)}
    priority
  />
);

export function Logo({ 
  size = 32, 
  withText = false, 
  alt,
  className 
}: LogoProps) {
  const prefersReducedMotion = typeof window !== 'undefined' 
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
    : false;

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-3 group",
        "text-primary hover:text-[#c10018] transition-colors duration-300",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg",
        className
      )}
      aria-label={alt || "Neezar Abd - Beranda"}
    >
      <motion.div
        whileHover={!prefersReducedMotion ? { 
          scale: 1.03, 
          rotate: 1.5 
        } : {}}
        whileTap={!prefersReducedMotion ? { 
          scale: 0.97 
        } : {}}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 20 
        }}
        className="flex-shrink-0"
      >
        <LogoMark
          width={size}
          height={size}
          className="drop-shadow-sm"
        />
      </motion.div>

      {withText && (
        <motion.span 
          className={cn(
            "font-bold tracking-tight text-lg leading-none",
            "group-hover:text-[#c10018] transition-colors duration-300"
          )}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          Neezar Abd
        </motion.span>
      )}
    </Link>
  );
}

export default Logo;