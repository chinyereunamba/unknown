import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Check for NextAuth session cookie (JWT strategy: next-auth.session-token)
  const session = request.cookies.get("next-auth.session-token");
  if (!session && request.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
