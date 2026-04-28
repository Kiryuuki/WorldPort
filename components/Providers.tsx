"use client";
// components/Providers.tsx
// React Query + any future client providers
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, ReactNode } from 'react';
import { UIProvider } from './UIContext';

export function Providers({ children }: { children: ReactNode }) {
  // Each browser session gets its own QueryClient (no cross-request sharing)
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 25_000,   // consider fresh for 25s
        retry: 2,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        {children}
      </UIProvider>
    </QueryClientProvider>
  );
}
