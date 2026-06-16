import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { saveDevisConfig } from "@/lib/store";
import type { DevisConfig } from "@/lib/devis";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const config = (await request.json().catch(() => null)) as DevisConfig | null;
  if (!config || !Array.isArray(config.lines)) {
    return NextResponse.json(
      { ok: false, error: "Configuration invalide." },
      { status: 422 },
    );
  }
  await saveDevisConfig(config);
  return NextResponse.json({ ok: true });
}
