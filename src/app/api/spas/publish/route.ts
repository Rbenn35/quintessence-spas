import { NextResponse } from "next/server";
import { upsertSpa } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";
import type { Spa } from "@/lib/spas";

/**
 * Import / mise à jour d'un spa dans le catalogue (endpoint sécurisé).
 * Permet d'ajouter un modèle directement dans la base (KV en prod) sans passer
 * par le back-office, par exemple lors d'un import de fiche technique.
 * Protégé par le secret `PUBLISH_SECRET`.
 *
 * Header attendu : Authorization: Bearer <PUBLISH_SECRET>
 * Corps JSON : un objet Spa complet (au minimum slug, name, places, dimensions).
 */
export async function POST(request: Request) {
  const secret = process.env.PUBLISH_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const b = (await request.json().catch(() => null)) as Partial<Spa> | null;
  if (
    !b ||
    typeof b.slug !== "string" ||
    typeof b.name !== "string" ||
    typeof b.places !== "number" ||
    !b.dimensions
  ) {
    return NextResponse.json(
      {
        ok: false,
        error: "slug, name, places et dimensions sont obligatoires.",
      },
      { status: 422 },
    );
  }

  // On fait confiance à la structure fournie (usage interne, secret requis).
  await upsertSpa(b as Spa);
  revalidateCatalogue();
  return NextResponse.json({ ok: true, slug: b.slug });
}
