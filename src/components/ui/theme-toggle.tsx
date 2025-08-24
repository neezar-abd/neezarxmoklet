'use client';

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  
  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-grid h-9 w-9 place-items-center rounded-lg border bg-white/60 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/15"
      >
        <Sun className="h-4.5 w-4.5" />
      </button>
    );
  }

  const toggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const x = e.clientX;
    const y = e.clientY;
    const isDark = (resolvedTheme ?? theme) === "dark";
    const next = isDark ? "light" : "dark";

    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // @ts-ignore experimental check
    const canVT = "startViewTransition" in document && !prefersReduced;

    const fallback = (mutate: () => void) => {
      document.documentElement.classList.add("theme-fade", "theme-switching");
      mutate();
      setTimeout(() => {
        document.documentElement.classList.remove("theme-fade", "theme-switching");
      }, 250);
    };

    if (!canVT) return fallback(() => setTheme(next));

    document.documentElement.classList.add("theme-switching");
    // @ts-ignore experimental API
    const vt = document.startViewTransition(() => {
      // Mutasi DOM sinkron: hanya ganti theme
      setTheme(next);
    });

    vt.ready.then(() => {
      const mobile = window.innerWidth <= 768;
      const opts: KeyframeAnimationOptions = { duration: mobile ? 320 : 420, easing: "ease-in-out" };
      const clip = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];
      document.documentElement.animate(
        { clipPath: clip },
        { ...opts, pseudoElement: "::view-transition-new(root)" }
      );
      document.documentElement.animate(
        { clipPath: clip.slice().reverse() },
        { ...opts, pseudoElement: "::view-transition-old(root)" }
      );
    }).finally(() => {
      vt.finished.finally(() => {
        document.documentElement.classList.remove("theme-switching");
      });
    });
  };

  const isDark = (resolvedTheme ?? theme) === "dark";
  return (
    <motion.button
      onClick={toggle}
      aria-label="Toggle theme"
      className="inline-grid h-9 w-9 place-items-center rounded-lg border bg-white/60 backdrop-blur hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/15 transition-colors"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        key={isDark ? "sun" : "moon"}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {isDark ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
      </motion.div>
    </motion.button>
  );
}
