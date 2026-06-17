import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertAccessoire, deleteAccessoire } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";
import type { Accessoire } from "@/lib/accessoires";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const item = (await request.json().catch(() => null)) as Accessoire | null;
  if (!item || !item.name) {
    return NextResponse.json(
      { ok: false, error: "Nom obligatoire." },
      { status: 422 },
    );
  }
  item.id = id;
  await upsertAccessoire(item);
  revalidateCatalogue();
  return NextResponse.json({ ok: true, id });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  await deleteAccessoire(id);
  revalidateCatalogue();
  return NextResponse.json({ ok: true });
}
