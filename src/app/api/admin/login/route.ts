import { NextResponse } from "next/server";
import { ADMIN_PASSWORD, ADMIN_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  if (body?.password !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { ok: false, error: "Mot de passe incorrect." },
      { status: 401 },
    );
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, ADMIN_PASSWORD, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
