import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveSettings } from "@/lib/store";
import type { SiteSettings } from "@/lib/settings";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const s = (await request.json().catch(() => null)) as SiteSettings | null;
  if (!s || !s.email || !s.name) {
    return NextResponse.json(
      { ok: false, error: "Nom et email obligatoires." },
      { status: 422 },
    );
  }
  await saveSettings(s);
  return NextResponse.json({ ok: true });
}
