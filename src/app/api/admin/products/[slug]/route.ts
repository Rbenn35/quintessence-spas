import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertSpa, deleteSpa } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";
import type { Spa } from "@/lib/spas";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { slug } = await params;
  const spa = (await request.json().catch(() => null)) as Spa | null;
  if (!spa || !spa.slug || !spa.name) {
    return NextResponse.json(
      { ok: false, error: "Slug et nom obligatoires." },
      { status: 422 },
    );
  }
  // Si le slug a changé, on supprime l'ancien.
  if (spa.slug !== slug) {
    await deleteSpa(slug);
  }
  await upsertSpa(spa);
  revalidateCatalogue();
  return NextResponse.json({ ok: true, slug: spa.slug });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { slug } = await params;
  await deleteSpa(slug);
  revalidateCatalogue();
  return NextResponse.json({ ok: true });
}
