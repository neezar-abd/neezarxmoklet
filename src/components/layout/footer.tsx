import Link from 'next/link';
import { Github, Linkedin, Mail, Instagram, MessageCircle } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  // Debug: log untuk memastikan komponen ter-render
  console.log('Footer component rendering with social icons:', { Github, Linkedin, Mail, Instagram, MessageCircle });

  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Brand Section */}
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                N
              </div>
              <span className="font-display font-bold text-xl">Neezar Abd</span>
            </Link>
            <p className="text-muted-foreground max-w-md">
              Software Engineer • DevOps Engineer • Web Developer. Fokus pada Next.js, React, TypeScript, dan teknologi modern untuk solusi web yang cepat dan terukur.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigasi</h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Tentang
              </Link>
              <Link
                href="/projects"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Proyek
              </Link>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Blog
              </Link>
              <Link
                href="/guestbook"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Guestbook
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Kontak
              </Link>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h3 className="font-semibold mb-4">Kontak & Social Media</h3>
            
            {/* Icon Grid */}
            <div className="grid grid-cols-5 gap-3 mb-4">
              <Link
                href="https://github.com/neezar-abd"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/nizar-abdurr-4a9846365"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://instagram.com/nizarxrpl1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:nizarabdurr@gmail.com"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
              <Link
                href="https://wa.me/6283899200333"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-5 w-5" />
              </Link>
            </div>
            
            {/* Kontak Text */}
            <div className="space-y-1 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Email:</span>{" "}
                <a href="mailto:nizarabdurr@gmail.com" className="underline underline-offset-2 hover:text-foreground">
                  nizarabdurr@gmail.com
                </a>
              </div>
              <div>
                <span className="font-medium text-foreground">WhatsApp:</span>{" "}
                <a href="https://wa.me/6283899200333" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  0838-9920-0333
                </a>
              </div>
              <div>
                <span className="font-medium text-foreground">Instagram:</span>{" "}
                <a href="https://instagram.com/nizarxrpl1" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                  @nizarxrpl1
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} Neezar Abd. Dibangun dengan Next.js dan Tailwind CSS.
          </p>
          <p className="text-muted-foreground text-sm flex items-center space-x-1 mt-4 md:mt-0">
            <span>Build fast. Ship clean. Measure impact.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
