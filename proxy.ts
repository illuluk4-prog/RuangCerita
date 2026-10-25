import { NextResponse, type NextRequest } from "next/server";
import {
  localSessionCookie,
  verifyLocalSessionToken,
} from "@/lib/auth/local-session";

const publicApiPaths = new Set([
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/session",
]);

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await verifyLocalSessionToken(request.cookies.get(localSessionCookie)?.value);
  const isApiRoute = pathname.startsWith("/api/");

  if (pathname === "/login") {
    if (!session) return NextResponse.next();
    return NextResponse.redirect(new URL(session.role === "guru" ? "/dashboard-guru" : "/", request.url));
  }

  if (pathname === "/register") {
    return NextResponse.redirect(
      new URL(!session ? "/login" : session.role === "guru" ? "/dashboard-guru" : "/", request.url),
    );
  }

  if (isApiRoute && publicApiPaths.has(pathname)) return NextResponse.next();

  if (!session) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/dashboard-guru") {
    if (session.role === "guru") return NextResponse.next();
    if (isApiRoute) return NextResponse.json({ error: "Akses khusus guru." }, { status: 403 });
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (session.role === "guru") {
    if (isApiRoute && pathname === "/api/practice/questions" && request.method === "POST") {
      return NextResponse.next();
    }
    if (isApiRoute) return NextResponse.json({ error: "Akses tidak diizinkan untuk role guru." }, { status: 403 });
    return NextResponse.redirect(new URL("/dashboard-guru", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};