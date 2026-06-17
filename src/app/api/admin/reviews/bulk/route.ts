import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { deleteReviews, setReviewsPublished } from "@/lib/store";

/**
 * Actions groupées sur les avis (modération).
 * Body JSON : { action: "delete" | "publish" | "hide", ids: string[] }
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as {
    action?: string;
    ids?: unknown;
  } | null;

  const ids = Array.isArray(body?.ids)
    ? body!.ids.filter((x): x is string => typeof x === "string")
    : [];
  if (!ids.length) {
    return NextResponse.json(
      { ok: false, error: "Aucun avis sélectionné." },
      { status: 422 },
    );
  }

  let count = 0;
  switch (body?.action) {
    case "delete":
      count = await deleteReviews(ids);
      break;
    case "publish":
      count = await setReviewsPublished(ids, true);
      break;
    case "hide":
      count = await setReviewsPublished(ids, false);
      break;
    default:
      return NextResponse.json(
        { ok: false, error: "Action inconnue." },
        { status: 422 },
      );
  }

  return NextResponse.json({ ok: true, count });
}
