import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertReview, deleteReview } from "@/lib/store";
import type { Review } from "@/lib/reviews";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { id } = await params;
  const review = (await request.json().catch(() => null)) as Review | null;
  if (!review || !review.author || !review.text) {
    return NextResponse.json(
      { ok: false, error: "Auteur et avis obligatoires." },
      { status: 422 },
    );
  }
  review.id = id;
  await upsertReview(review);
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
  await deleteReview(id);
  return NextResponse.json({ ok: true });
}
