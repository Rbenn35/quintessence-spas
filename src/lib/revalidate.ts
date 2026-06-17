import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Revalidation à la demande après une écriture admin.
 * - revalidateTag : vide le cache de données (unstable_cache du store).
 * - revalidatePath : vide le rendu mis en cache des pages (ISR).
 * Les deux sont nécessaires : les changements apparaissent alors immédiatement,
 * tout en gardant les pages en cache CDN le reste du temps.
 */

/** Catalogue : produits, avis, accessoires, gammes → accueil, /spas, fiches. */
export function revalidateCatalogue(): void {
  revalidateTag("spas");
  revalidateTag("reviews");
  revalidateTag("accessoires");
  revalidateTag("gammes");
  revalidatePath("/");
  revalidatePath("/spas");
  revalidatePath("/spas/[slug]", "page");
  revalidatePath("/revendeur");
}

/** Guides : articles → index + pages d'articles + accueil. */
export function revalidateGuides(): void {
  revalidateTag("articles");
  revalidatePath("/");
  revalidatePath("/guides");
  revalidatePath("/guides/[slug]", "page");
}

/** Réglages globaux (en-tête, pied de page, métadonnées) : tout le site. */
export function revalidateSite(): void {
  revalidateTag("settings");
  revalidatePath("/", "layout");
}
