import { NextResponse, type NextRequest } from "next/server";
import {
  localSessionCookie,
  verifyLocalSessionToken,
} from "@/lib/auth/local-session";
import { createServerClient } from "@supabase/ssr";

const publicApiPaths = new Set([
  "/api/auth/login",
  "/api/auth/logout",
]);

export async function proxy(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return proxySupabaseSession(request);
  }

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

async function proxySupabaseSession(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabasePublishableKey) {
    if (pathname === "/login" || publicApiPaths.has(pathname)) {
      return NextResponse.next();
    }
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Autentikasi belum dikonfigurasi di server." },
        { status: 503 },
      );
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(supabaseUrl, supabasePublishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const isApiRoute = pathname.startsWith("/api/");
  if (isApiRoute && publicApiPaths.has(pathname)) return response;

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError && authError.name !== "AuthSessionMissingError") {
    console.error("Supabase session verification failed:", authError.message);
    return NextResponse.json({ error: "Sesi login tidak dapat diverifikasi." }, { status: 503 });
  }

  let role: "siswa" | "guru" | null = null;
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profileError) {
      console.error("Supabase role lookup failed:", profileError.message);
      return NextResponse.json({ error: "Profil akun tidak dapat diverifikasi." }, { status: 503 });
    }
    if (profile.role === "siswa" || profile.role === "guru") role = profile.role;
  }

  if (pathname === "/login") {
    if (!role) return response;
    return redirectWithCookies(
      new URL(role === "guru" ? "/dashboard-guru" : "/", request.url),
      response,
    );
  }

  if (pathname === "/register") {
    return redirectWithCookies(
      new URL(!role ? "/login" : role === "guru" ? "/dashboard-guru" : "/", request.url),
      response,
    );
  }

  if (!role) {
    if (isApiRoute) {
      return NextResponse.json({ error: "Silakan login untuk melanjutkan." }, { status: 401 });
    }
    return redirectWithCookies(new URL("/login", request.url), response);
  }

  if (pathname === "/dashboard-guru") {
    if (role === "guru") return response;
    if (isApiRoute) return NextResponse.json({ error: "Akses khusus guru." }, { status: 403 });
    return redirectWithCookies(new URL("/", request.url), response);
  }

  if (role === "guru") {
    if (isApiRoute && pathname === "/api/practice/questions" && request.method === "POST") {
      return response;
    }
    if (isApiRoute) {
      return NextResponse.json({ error: "Akses tidak diizinkan untuk role guru." }, { status: 403 });
    }
    return redirectWithCookies(new URL("/dashboard-guru", request.url), response);
  }

  return response;
}

function redirectWithCookies(url: URL, response: NextResponse) {
  const redirectResponse = NextResponse.redirect(url);
  response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set({ ...cookie }));
  return redirectResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};