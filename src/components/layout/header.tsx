'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Logo } from '@/components/branding/Logo';

const navigation = [
  { name: 'Beranda', href: '/' },
  { name: 'Tentang', href: '/about' },
  { name: 'Proyek', href: '/projects' },
  { name: 'Blog', href: '/blog' },
  { name: 'Guestbook', href: '/guestbook' },
  { name: 'Kontak', href: '/contact' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string, e: React.MouseEvent) => {
    // Don't trigger loading for current page
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    
    // Close mobile menu
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          {/* Logo */}
          <Logo 
            size={28} 
            withText 
            alt="Neezar — Full Stack Developer"
          />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(item.href, e)}
                className={cn(
                  'text-sm font-medium transition-all duration-200 hover:text-primary relative',
                  isActive(item.href)
                    ? 'text-primary'
                    : 'text-muted-foreground'
                )}
              >
                {item.name}
                {/* Active indicator */}
                {isActive(item.href) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-6 left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/resume" className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>CV</span>
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t bg-background"
            >
              <div className="container py-4">
                <nav className="flex flex-col space-y-4">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavClick(item.href, e)}
                      className={cn(
                        'text-sm font-medium transition-colors hover:text-primary',
                        isActive(item.href)
                          ? 'text-primary'
                          : 'text-muted-foreground'
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Button variant="outline" size="sm" asChild className="w-fit">
                    <Link href="/resume" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download CV</span>
                    </Link>
                  </Button>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
