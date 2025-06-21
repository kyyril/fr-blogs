/**
 * Utility functions for cookie management across different environments
 */

export interface CookieOptions {
  expires?: Date | number;
  maxAge?: number;
  path?: string;
  domain?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

/**
 * Get optimal cookie configuration for the current environment
 */
export function getCookieConfig(isProduction: boolean = process.env.NODE_ENV === 'production'): CookieOptions {
  return {
    path: '/',
    secure: isProduction,
    sameSite: 'lax',
    httpOnly: false, // Allow client-side access for token management
  };
}

/**
 * Get cookie configuration for access tokens
 */
export function getAccessTokenCookieConfig(): CookieOptions {
  const baseConfig = getCookieConfig();
  return {
    ...baseConfig,
    maxAge: 60 * 60, // 1 hour
  };
}

/**
 * Get cookie configuration for refresh tokens
 */
export function getRefreshTokenCookieConfig(): CookieOptions {
  const baseConfig = getCookieConfig();
  return {
    ...baseConfig,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  };
}

/**
 * Debug cookie information
 */
export function debugCookies(cookies: any, context: string = 'Unknown') {
  console.log(`[${context}] Cookie Debug:`, {
    environment: process.env.NODE_ENV,
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    cookieCount: Array.isArray(cookies) ? cookies.length : Object.keys(cookies || {}).length,
    cookies: Array.isArray(cookies) 
      ? cookies.map(c => ({ name: c.name, hasValue: !!c.value, valueLength: c.value?.length || 0 }))
      : Object.entries(cookies || {}).map(([name, value]) => ({ 
          name, 
          hasValue: !!value, 
          valueLength: typeof value === 'string' ? value.length : 0 
        }))
  });
}
