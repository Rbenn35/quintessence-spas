import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertSpa, getSpaBySlug } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";
import type { Spa } from "@/lib/spas";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const spa = (await request.json().catch(() => null)) as Spa | null;
  if (!spa || !spa.slug || !spa.name) {
    return NextResponse.json(
      { ok: false, error: "Slug et nom obligatoires." },
      { status: 422 },
    );
  }
  if (await getSpaBySlug(spa.slug)) {
    return NextResponse.json(
      { ok: false, error: "Ce slug existe déjà." },
      { status: 409 },
    );
  }
  await upsertSpa(spa);
  revalidateCatalogue();
  return NextResponse.json({ ok: true, slug: spa.slug });
}
