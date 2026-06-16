import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { updateDevisRequest, deleteDevisRequest } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  const status = body?.status as "pending" | "sent" | "cancelled" | undefined;
  if (!status) {
    return NextResponse.json(
      { ok: false, error: "Statut manquant." },
      { status: 422 },
    );
  }
  await updateDevisRequest(id, {
    status,
    ...(status === "sent" ? { sentAt: new Date().toISOString() } : {}),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  await deleteDevisRequest(id);
  return NextResponse.json({ ok: true });
}
