import { NextResponse } from "next/server";
import { getSpaBySlug } from "@/lib/store";
import { renderFicheTechnique } from "@/lib/fiche-technique";

export const dynamic = "force-dynamic";

/**
 * Fiche technique publique (A4, imprimable / « Enregistrer en PDF »).
 * Affichée après le formulaire de demande. Contenu = données produit en direct.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const spa = await getSpaBySlug(slug);
  if (!spa) {
    return new NextResponse("Fiche introuvable", { status: 404 });
  }
  const origin = new URL(request.url).origin;
  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const html = renderFicheTechnique(spa, {
    baseUrl: origin,
    dateLabel,
    download: true,
  });
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
