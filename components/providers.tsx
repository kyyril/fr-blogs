'use client';

import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // ⚡ PERFORMANCE: Data stays fresh for 5 minutes
        staleTime: 1000 * 60 * 5,
        // ⚡ PERFORMANCE: Cache persists for 30 minutes
        gcTime: 1000 * 60 * 30,
        // ⚡ PERFORMANCE: Only retry once
        retry: 1,
        // ⚡ PERFORMANCE: Don't refetch when tab becomes active
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}