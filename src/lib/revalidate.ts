import { revalidatePath } from "next/cache";

/**
 * Revalidation à la demande des pages publiques (ISR).
 * Appelée après une écriture admin pour que les changements apparaissent
 * immédiatement, tout en gardant les pages en cache CDN le reste du temps.
 */

/** Catalogue : accueil, liste des spas et toutes les fiches produit. */
export function revalidateCatalogue(): void {
  revalidatePath("/");
  revalidatePath("/spas");
  revalidatePath("/spas/[slug]", "page");
  revalidatePath("/revendeur");
}

/** Guides : index + toutes les pages d'articles + accueil. */
export function revalidateGuides(): void {
  revalidatePath("/");
  revalidatePath("/guides");
  revalidatePath("/guides/[slug]", "page");
}

/** Réglages globaux (en-tête, pied de page, métadonnées) : tout le site. */
export function revalidateSite(): void {
  revalidatePath("/", "layout");
}
