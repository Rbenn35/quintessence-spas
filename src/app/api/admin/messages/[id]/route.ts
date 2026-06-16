import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteMessage, setMessageRead } from "@/lib/store";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => ({}));
  await setMessageRead(id, body?.read !== false);
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
  await deleteMessage(id);
  return NextResponse.json({ ok: true });
}
