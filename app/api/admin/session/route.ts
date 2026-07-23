import { NextRequest, NextResponse } from "next/server";
import { adminSessionCookie, adminSessionMaxAge, createAdminSession, isAdminConfigured, isValidAdminSession, passwordMatches } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  return NextResponse.json({ authenticated: isValidAdminSession(request.cookies.get(adminSessionCookie)?.value), configured: isAdminConfigured() });
}

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string };
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Set ADMIN_PASSWORD before using the admin panel." }, { status: 503 });
  }

  if (!passwordMatches(password || "")) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, createAdminSession(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: adminSessionMaxAge,
    path: "/",
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(adminSessionCookie, "", { httpOnly: true, sameSite: "lax", maxAge: 0, path: "/" });
  return response;
}
