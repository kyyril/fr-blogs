import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Custom base64 decode function for Edge Runtime compatibility
function decodeBase64(str: string): string {
  try {
    // Use atob if available (browser environment)
    if (typeof atob !== "undefined") {
      return atob(str);
    }

    // Manual base64 decode for Edge Runtime
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let result = "";
    let i = 0;

    // Remove any characters not in the base64 character set
    str = str.replace(/[^A-Za-z0-9+/]/g, "");

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

    return result;
  } catch (error) {
    console.error("Base64 decode error:", error);
    return "";
  }
}

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  let auth_token = "";

  // Safely decode the token with proper error handling
  if (token && token.trim().length > 0) {
    try {
      auth_token = decodeBase64(token);
    } catch (error) {
      console.error("Error decoding token in middleware:", error);
      // If token is corrupted, treat as unauthenticated
      auth_token = "";
    }
  }

  const isAuthenticated = !!auth_token && auth_token.length > 0;

  // Define protected routes
  const protectedRoutes = ["/profile", "/blog/create", "/dashboard"];
  const authRoutes = ["/login"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  const isAuthRoute = authRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if trying to access protected route without authentication
  if (!isAuthenticated && isProtectedRoute) {
    const loginUrl = new URL("/login", req.url);
    // Add the original URL as a callback parameter for redirect after login
    loginUrl.searchParams.set(
      "callback",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthenticated && isAuthRoute) {
    // Check if there's a callback URL to redirect to
    const callback = req.nextUrl.searchParams.get("callback");
    const redirectUrl = callback && callback.startsWith("/") ? callback : "/";
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Add security headers
  const response = NextResponse.next();

  // Add user authentication status to headers (optional, for debugging)
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "x-auth-status",
      isAuthenticated ? "authenticated" : "unauthenticated"
    );
  }

  return response;
}

export const config = {
  matcher: [
    // Protected routes
    "/profile/:path*",
    "/blog/create/:path*",
    "/dashboard/:path*",
    // Auth routes
    "/auth/login",
  ],
};
