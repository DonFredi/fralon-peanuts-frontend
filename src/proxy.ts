import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/shared/lib/supabase/proxy";

export async function proxy(request: NextRequest) {
  const { supabaseResponse, claims: data } = await updateSession(request);

  const user = data?.claims;
  const path = request.nextUrl.pathname;

  // redirect unauthenticated users away from protected routes
  if (!user && path.startsWith("/account")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // redirect unauthenticated users away from admin
  if (!user && path.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // redirect authenticated users away from auth pages
  if (user && (path === "auth/login" || path === "auth/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
