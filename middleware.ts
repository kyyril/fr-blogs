import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define the API endpoint for token refresh based on auth.services.ts
const REFRESH_TOKEN_API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`;

// Function to refresh the access token
async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken?: string;
  newRefreshToken?: string;
  error?: string;
}> {
  try {
    const response = await fetch(REFRESH_TOKEN_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Manually send refresh token in body as authService.refreshToken implies a POST with refresh token
        // In a real scenario, this might be sent as a cookie or Authorization header,
        // but for middleware, explicit body might be needed if not automatically forwarded.
      },
      body: JSON.stringify({ refreshToken }), // Assuming the backend expects it in the body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to refresh token");
    }

    const data = await response.json();
    // Assuming the response contains new accessToken and refreshToken
    return {
      accessToken: data.accessToken,
      newRefreshToken: data.refreshToken,
    };
  } catch (error: any) {
    console.error("Token refresh failed:", error.message);
    return { error: error.message };
  }
}

// JWT decode function for Edge Runtime compatibility
function decodeJWT(token: string): any {
  try {
    // Split the JWT into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Use atob if available (browser environment)
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
    console.error("JWT decode error:", error);
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

export default async function middleware(req: NextRequest) {
  // Check for access_token (matching your cookie data)
  let accessToken = req.cookies.get("access_token")?.value;
  let refreshToken = req.cookies.get("refresh_token")?.value;

  let isAuthenticated = false;
  let userPayload = null;

  const response = NextResponse.next(); // Initialize response here

  // Validate access token
  if (accessToken && accessToken.trim().length > 0) {
    try {
      userPayload = decodeJWT(accessToken);

      if (userPayload && !isTokenExpired(userPayload)) {
        isAuthenticated = true;
      } else if (refreshToken) {
        // Token expired but refresh token exists, attempt to refresh
        console.log("Access token expired, attempting to refresh token...");
        const {
          accessToken: newAccessToken,
          newRefreshToken,
          error,
        } = await refreshAccessToken(refreshToken);

        if (newAccessToken && newRefreshToken) {
          accessToken = newAccessToken;
          refreshToken = newRefreshToken;
          userPayload = decodeJWT(accessToken); // Decode new access token
          if (userPayload && !isTokenExpired(userPayload)) {
            isAuthenticated = true;

            // Set new cookies
            response.cookies.set("access_token", accessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 60 * 60, // 1 hour
              path: "/",
            });
            response.cookies.set("refresh_token", refreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: 7 * 24 * 60 * 60, // 7 days
              path: "/",
            });
            console.log("Tokens refreshed successfully.");
          } else {
            console.log("Refreshed access token is invalid or expired.");
          }
        } else {
          console.error("Failed to refresh token:", error);
          // Clear tokens if refresh failed to prevent infinite loops
          response.cookies.delete("access_token");
          response.cookies.delete("refresh_token");
        }
      }
    } catch (error) {
      console.error("Error processing access token in middleware:", error);
      // Clear tokens on any processing error
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
    }
  }

  // Define protected routes
  const protectedRoutes = ["/profile", "/blog/create", "/blog/edit"];
  const authRoutes = ["/login", "/auth/login"]; // Added both variants

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
    const redirectUrl =
      callback && callback.startsWith("/") ? callback : "/blog"; // Redirect to /blog instead of /dashboard
    return NextResponse.redirect(new URL(redirectUrl, req.url));
  }

  // Add security headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  // Add user authentication status to headers for debugging
  if (process.env.NODE_ENV === "development") {
    response.headers.set(
      "x-auth-status",
      isAuthenticated ? "authenticated" : "unauthenticated"
    );

    if (userPayload) {
      response.headers.set("x-user-id", userPayload.userId || "");
      response.headers.set("x-user-email", userPayload.email || "");
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Protected routes
    "/profile/:path*",
    "/blog/create/:path*",
    "/blog/edit/:path*",
    // Auth routes
    "/login",
    "/auth/login",
    // Exclude static files and API routes that don't need auth checking
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
