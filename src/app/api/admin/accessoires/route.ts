import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertAccessoire } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";
import type { Accessoire } from "@/lib/accessoires";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const item = (await request.json().catch(() => null)) as Accessoire | null;
  if (!item || !item.name) {
    return NextResponse.json(
      { ok: false, error: "Nom obligatoire." },
      { status: 422 },
    );
  }
  if (!item.id) item.id = `acc-${Date.now()}`;
  await upsertAccessoire(item);
  revalidateCatalogue();
  return NextResponse.json({ ok: true, id: item.id });
}
