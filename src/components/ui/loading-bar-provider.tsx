'use client';

import { Suspense } from 'react';
import { SimpleLoadingBar } from './simple-loading-bar';

export function LoadingBarProvider() {
  return (
    <Suspense fallback={null}>
      <SimpleLoadingBar />
    </Suspense>
  );
}
