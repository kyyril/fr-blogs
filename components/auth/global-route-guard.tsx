'use client';

import { useRouteGuard } from '@/hooks/useRouteGuard';

interface GlobalRouteGuardProps {
  children: React.ReactNode;
}

export function GlobalRouteGuard({ children }: GlobalRouteGuardProps) {
  // This will automatically handle route protection based on current path
  useRouteGuard({
    protectedRoutes: ['/profile', '/blog/create', '/blog/edit'],
    publicRoutes: ['/login', '/register'],
    redirectTo: '/login'
  });

  return <>{children}</>;
}
