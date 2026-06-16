import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveGammes } from "@/lib/store";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as
    | { gammes?: string[] }
    | null;
  if (!body || !Array.isArray(body.gammes)) {
    return NextResponse.json(
      { ok: false, error: "Liste de gammes invalide." },
      { status: 422 },
    );
  }
  await saveGammes(body.gammes);
  return NextResponse.json({ ok: true });
}
