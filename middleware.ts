import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  const auth_token = token
    ? Buffer.from(token, "base64").toString("ascii")
    : "";

  const isAuthenticated = !!auth_token;

  if (
    !isAuthenticated &&
    (req.nextUrl.pathname.startsWith("/profile") ||
      req.nextUrl.pathname.startsWith("/create"))
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/create/:path*"],
};
