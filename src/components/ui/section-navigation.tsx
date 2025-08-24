'use client';

import { useSectionObserver } from '@/hooks/use-section-observer';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'home', label: 'Home' },
  { id: 'stats', label: 'Stats' },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blog' },
];

export function SectionNavigation() {
  const activeSection = useSectionObserver(sections.map(s => s.id), 0.4);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
      <ul className="space-y-4">
        {sections.map((section) => (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={cn(
                'group relative block w-3 h-3 rounded-full border-2 transition-all duration-300',
                activeSection === section.id
                  ? 'bg-primary border-primary scale-125'
                  : 'border-muted-foreground/50 hover:border-primary hover:scale-110'
              )}
              aria-label={`Go to ${section.label} section`}
              aria-current={activeSection === section.id ? 'true' : 'false'}
            >
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-background px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border shadow-sm">
                {section.label}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
