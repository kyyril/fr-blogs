import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Types
interface AuthTokens {
  accessToken?: string;
  refreshToken?: string;
  userSession?: string;
  sessionToken?: string;
  authToken?: string;
}

interface AuthResult {
  isAuthenticated: boolean;
  userPayload?: any;
  authMethod?: "jwt" | "session";
  tokenType?: string;
}

interface RefreshResult {
  accessToken?: string;
  newRefreshToken?: string;
  error?: string;
}

// Configuration
const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  REFRESH_ENDPOINT: "/api/auth/refresh",
  PROTECTED_ROUTES: ["/profile", "/blog/create", "/blog/edit"],
  AUTH_ROUTES: ["/login", "/auth/login"],
  DEFAULT_REDIRECT: "/blog",
  COOKIE_OPTIONS: {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    accessTokenMaxAge: 60 * 60, // 1 hour
    refreshTokenMaxAge: 7 * 24 * 60 * 60, // 7 days
  },
  DEBUG: process.env.NODE_ENV !== "production",
} as const;

// Utility Functions
function log(message: string, data?: any): void {
  if (CONFIG.DEBUG) {
    console.log(`[Middleware] ${message}`, data || "");
  }
}

function extractTokensFromRequest(req: NextRequest): AuthTokens {
  return {
    accessToken: req.cookies.get("access_token")?.value,
    refreshToken: req.cookies.get("refresh_token")?.value,
    userSession: req.cookies.get("user_session")?.value,
    sessionToken: req.cookies.get("session_token")?.value,
    authToken: req.cookies.get("auth_token")?.value,
  };
}

function debugCookies(req: NextRequest): void {
  if (!CONFIG.DEBUG) return;

  const allCookies = req.cookies.getAll();
  log(`Environment: ${process.env.NODE_ENV}`);
  log(`Request path: ${req.nextUrl.pathname}`);
  log(`All cookies count: ${allCookies.length}`);

  allCookies.forEach((cookie) => {
    log(
      `Cookie: ${cookie.name} = ${
        cookie.value ? "[PRESENT]" : "[EMPTY]"
      } (length: ${cookie.value?.length || 0})`
    );
  });

  log(`User-Agent: ${req.headers.get("user-agent")}`);
  log(`API URL: ${CONFIG.API_URL}`);
}

// JWT decode function for Edge Runtime compatibility
function decodeJWT(token: string): any {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = parts[1];
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    let decoded: string;
    if (typeof atob !== "undefined") {
      decoded = atob(paddedPayload.replace(/-/g, "+").replace(/_/g, "/"));
    } else {
      // Manual base64 decode for Edge Runtime
      const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      let result = "";
      let i = 0;

      const str = paddedPayload
        .replace(/-/g, "+")
        .replace(/_/g, "/")
        .replace(/[^A-Za-z0-9+/]/g, "");

      while (i < str.length) {
        const encoded1 = chars.indexOf(str.charAt(i++));
        const encoded2 = chars.indexOf(str.charAt(i++));
        const encoded3 = chars.indexOf(str.charAt(i++));
        const encoded4 = chars.indexOf(str.charAt(i++));

        const bitmap =
          (encoded1 << 18) | (encoded2 << 12) | (encoded3 << 6) | encoded4;

        result += String.fromCharCode((bitmap >> 16) & 255);
        if (encoded3 !== 64) result += String.fromCharCode((bitmap >> 8) & 255);
        if (encoded4 !== 64) result += String.fromCharCode(bitmap & 255);
      }
      decoded = result;
    }

    return JSON.parse(decoded);
  } catch (error) {
    log("JWT decode error:", error);
    return null;
  }
}

function isTokenExpired(payload: any): boolean {
  if (!payload || !payload.exp) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Authentication Functions
async function refreshAccessToken(
  refreshToken: string
): Promise<RefreshResult> {
  try {
    const response = await fetch(
      `${CONFIG.API_URL}${CONFIG.REFRESH_ENDPOINT}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to refresh token");
    }

    const data = await response.json();
    return {
      accessToken: data.accessToken,
      newRefreshToken: data.refreshToken,
    };
  } catch (error: any) {
    log("Token refresh failed:", error.message);
    return { error: error.message };
  }
}

function validateJWTToken(token: string): {
  isValid: boolean;
  payload?: any;
  tokenType?: string;
} {
  try {
    const payload = decodeJWT(token);
    if (payload && !isTokenExpired(payload)) {
      return { isValid: true, payload };
    }
    return { isValid: false };
  } catch (error) {
    log("JWT validation error:", error);
    return { isValid: false };
  }
}

async function authenticateUser(tokens: AuthTokens): Promise<AuthResult> {
  // Try JWT tokens first
  const jwtTokens = [
    { token: tokens.accessToken, type: "access_token" },
    { token: tokens.sessionToken, type: "session_token" },
    { token: tokens.authToken, type: "auth_token" },
  ];

  for (const { token, type } of jwtTokens) {
    if (token) {
      const { isValid, payload } = validateJWTToken(token);
      if (isValid) {
        log(`User authenticated via JWT token: ${type}`);
        return {
          isAuthenticated: true,
          userPayload: payload,
          authMethod: "jwt",
          tokenType: type,
        };
      }
    }
  }

  // Fallback to session-based authentication
  if (tokens.userSession) {
    log("Attempting session-based authentication with user_session cookie");
    return {
      isAuthenticated: true,
      authMethod: "session",
      tokenType: "user_session",
    };
  }

  log("No valid authentication found", {
    access_token: !!tokens.accessToken,
    user_session: !!tokens.userSession,
    session_token: !!tokens.sessionToken,
    auth_token: !!tokens.authToken,
  });

  return { isAuthenticated: false };
}

function isProtectedRoute(pathname: string): boolean {
  return CONFIG.PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAuthRoute(pathname: string): boolean {
  return CONFIG.AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function setCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): void {
  response.cookies.set("access_token", accessToken, {
    ...CONFIG.COOKIE_OPTIONS,
    maxAge: CONFIG.COOKIE_OPTIONS.accessTokenMaxAge,
  });

  response.cookies.set("refresh_token", refreshToken, {
    ...CONFIG.COOKIE_OPTIONS,
    maxAge: CONFIG.COOKIE_OPTIONS.refreshTokenMaxAge,
  });
}

function clearTokens(response: NextResponse): void {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
}

function addSecurityHeaders(response: NextResponse): void {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
}

function addDebugHeaders(response: NextResponse, authResult: AuthResult): void {
  if (CONFIG.DEBUG) {
    response.headers.set(
      "x-auth-status",
      authResult.isAuthenticated ? "authenticated" : "unauthenticated"
    );
    if (authResult.userPayload) {
      response.headers.set("x-user-id", authResult.userPayload.userId || "");
      response.headers.set("x-user-email", authResult.userPayload.email || "");
    }
  }
}

export default async function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Extract tokens from request
  const tokens = extractTokensFromRequest(req);

  // Debug logging
  debugCookies(req);

  // Authenticate user
  let authResult = await authenticateUser(tokens);

  // Handle token refresh if needed
  if (
    !authResult.isAuthenticated &&
    tokens.refreshToken &&
    tokens.accessToken
  ) {
    log("Attempting token refresh...");
    const refreshResult = await refreshAccessToken(tokens.refreshToken);

    if (refreshResult.accessToken && refreshResult.newRefreshToken) {
      // Set new cookies
      setCookies(
        response,
        refreshResult.accessToken,
        refreshResult.newRefreshToken
      );

      // Re-authenticate with new tokens
      const newTokens = {
        ...tokens,
        accessToken: refreshResult.accessToken,
        refreshToken: refreshResult.newRefreshToken,
      };
      authResult = await authenticateUser(newTokens);
      log("Token refresh successful");
    } else {
      log("Token refresh failed, clearing tokens");
      clearTokens(response);
    }
  }

  // Check route types
  const pathname = req.nextUrl.pathname;
  const isProtected = isProtectedRoute(pathname);
  const isAuth = isAuthRoute(pathname);

  // Debug logging
  log(`Is authenticated: ${authResult.isAuthenticated}`);
  log(`Is protected route: ${isProtected}`);
  log(`Is auth route: ${isAuth}`);

  // Handle route protection
  if (!authResult.isAuthenticated && isProtected) {
    log(
      "Redirecting to login - unauthenticated user accessing protected route"
    );
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callback", pathname + req.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (authResult.isAuthenticated && isAuth) {
    log("Redirecting authenticated user away from auth page");
    const callback = req.nextUrl.searchParams.get("callback");
    const redirectUrl =
      callback && callback.startsWith("/") ? callback : CONFIG.DEFAULT_REDIRECT;
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Add headers
  addSecurityHeaders(response);
  addDebugHeaders(response, authResult);

  return response;
}

export const config = {
  matcher: [
    // Match all routes except static files and API routes
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
