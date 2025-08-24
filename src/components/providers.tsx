'use client';

import { ThemeProvider } from 'next-themes';
import { LoadingProvider } from './ui/loading-provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </ThemeProvider>
  );
}
