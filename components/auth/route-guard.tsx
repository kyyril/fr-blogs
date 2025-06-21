'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function RouteGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login',
  fallback 
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for auth to initialize
    if (isLoading) return;

    setIsChecking(false);

    if (requireAuth && !isAuthenticated) {
      // Save current path for redirect after login
      const currentPath = window.location.pathname + window.location.search;
      const loginUrl = `${redirectTo}?callback=${encodeURIComponent(currentPath)}`;
      router.push(loginUrl);
      return;
    }

    // If user is authenticated and trying to access auth pages, redirect to dashboard
    if (isAuthenticated && !requireAuth) {
      const urlParams = new URLSearchParams(window.location.search);
      const callback = urlParams.get('callback');
      const redirectPath = callback && callback.startsWith('/') ? callback : '/blog';
      router.push(redirectPath);
      return;
    }
  }, [isLoading, isAuthenticated, requireAuth, redirectTo, router]);

  // Show loading while checking authentication
  if (isLoading || isChecking) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if auth requirements aren't met
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  if (!requireAuth && isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

// HOC for protected pages
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RouteGuardProps, 'children'> = {}
) {
  return function AuthenticatedComponent(props: P) {
    return (
      <RouteGuard {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}

// HOC for public pages (redirect if authenticated)
export function withGuest<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<RouteGuardProps, 'children' | 'requireAuth'> = {}
) {
  return function GuestComponent(props: P) {
    return (
      <RouteGuard requireAuth={false} {...options}>
        <Component {...props} />
      </RouteGuard>
    );
  };
}
