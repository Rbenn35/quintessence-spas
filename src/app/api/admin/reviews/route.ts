import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertReview } from "@/lib/store";
import type { Review } from "@/lib/reviews";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const review = (await request.json().catch(() => null)) as Review | null;
  if (!review || !review.author || !review.text) {
    return NextResponse.json(
      { ok: false, error: "Auteur et avis obligatoires." },
      { status: 422 },
    );
  }
  if (!review.id) review.id = `r-${Date.now()}`;
  await upsertReview(review);
  return NextResponse.json({ ok: true, id: review.id });
}
