import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { bulkPatchSpas, type SpaBulkPatch } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";

interface BulkBody {
  slugs?: unknown;
  patch?: unknown;
}

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === "" || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

export async function PATCH(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await request.json().catch(() => null)) as BulkBody | null;
  const slugs = Array.isArray(body?.slugs)
    ? (body!.slugs as unknown[]).filter((s): s is string => typeof s === "string")
    : [];
  const raw = (body?.patch ?? {}) as Record<string, unknown>;

  if (slugs.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Aucun produit sélectionné." },
      { status: 422 },
    );
  }

  // On ne retient que les clés réellement transmises (modification ciblée).
  const patch: SpaBulkPatch = {};
  if ("prixIndicatif" in raw) patch.prixIndicatif = toNumberOrNull(raw.prixIndicatif);
  if ("prixPromo" in raw) patch.prixPromo = toNumberOrNull(raw.prixPromo);
  if ("badgeLabel" in raw) patch.badgeLabel = String(raw.badgeLabel ?? "");
  if ("badgeActive" in raw) patch.badgeActive = Boolean(raw.badgeActive);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { ok: false, error: "Aucun champ à modifier." },
      { status: 422 },
    );
  }

  const count = await bulkPatchSpas(slugs, patch);
  revalidateCatalogue();
  return NextResponse.json({ ok: true, count });
}
