// lib/analytics.ts
export const track = (name: string, data?: Record<string, any>) => {
  // @ts-ignore
  if (typeof window !== 'undefined' && window?.umami) {
    // @ts-ignore
    window.umami(name, data);
  }
  
  // Fallback console log for development
  if (process.env.NODE_ENV === 'development') {
    console.log('📊 Analytics Track:', name, data);
  }
};
