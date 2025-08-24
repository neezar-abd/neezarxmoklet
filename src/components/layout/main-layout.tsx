import { Header } from './header';
import { SiteFooter } from './SiteFooter';
import { LoadingBarProvider } from '../ui/loading-bar-provider';
import { SectionNavigation } from '../ui/section-navigation';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <LoadingBarProvider />
      <Header />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <SectionNavigation />
    </div>
  );
}
