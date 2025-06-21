'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from './useAuth';

interface UseRouteGuardOptions {
  redirectTo?: string;
  protectedRoutes?: string[];
  publicRoutes?: string[];
}

export function useRouteGuard(options: UseRouteGuardOptions = {}) {
  const {
    redirectTo = '/login',
    protectedRoutes = ['/profile', '/blog/create', '/blog/edit'],
    publicRoutes = ['/login', '/register']
  } = options;

  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Don't do anything while auth is loading
    if (isLoading) return;

    const isProtectedRoute = protectedRoutes.some(route => 
      pathname.startsWith(route)
    );
    
    const isPublicRoute = publicRoutes.some(route => 
      pathname.startsWith(route)
    );

    // Redirect to login if accessing protected route without auth
    if (isProtectedRoute && !isAuthenticated) {
      const currentPath = pathname + window.location.search;
      const loginUrl = `${redirectTo}?callback=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
      return;
    }

    // Redirect authenticated users away from public routes
    if (isPublicRoute && isAuthenticated) {
      const urlParams = new URLSearchParams(window.location.search);
      const callback = urlParams.get('callback');
      const redirectPath = callback && callback.startsWith('/') ? callback : '/blog';
      router.push(redirectPath);
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, redirectTo, protectedRoutes, publicRoutes]);

  return {
    isProtectedRoute: protectedRoutes.some(route => pathname.startsWith(route)),
    isPublicRoute: publicRoutes.some(route => pathname.startsWith(route)),
    isAuthenticated,
    isLoading
  };
}
