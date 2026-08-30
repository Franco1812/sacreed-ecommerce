import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ADMIN_SESSION_COOKIE, isValidAdminSessionToken } from "@/lib/admin-auth";

export const config = { matcher: ["/admin/:path*"] };

export async function proxy(request: NextRequest) {
  if (request.nextUrl.pathname === "/admin/login") return NextResponse.next();

  const token = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (await isValidAdminSessionToken(token)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/admin/login";
  return NextResponse.redirect(url);
}
