/**
 * Avis client, gérés dans le back-office.
 * `productSlug` vide = avis global (affiché sur toutes les fiches) ;
 * sinon l'avis n'apparaît que sur la fiche du modèle concerné.
 */
export interface Review {
  id: string;
  author: string;
  city?: string;
  rating: number; // 1 à 5
  text: string;
  productSlug?: string;
  published: boolean;
  date?: string;
}

export const seedReviews: Review[] = [
  {
    id: "seed-1",
    author: "Jean-Marc",
    city: "Aix-en-Provence",
    rating: 5,
    text: "Installation nickel en une matinée. Le spa est superbe et l'eau est cristalline.",
    published: true,
  },
  {
    id: "seed-2",
    author: "Sophie L.",
    city: "Bordeaux",
    rating: 5,
    text: "Conseil au top avant l'achat, livraison rapide. On l'utilise tous les soirs.",
    published: true,
  },
  {
    id: "seed-3",
    author: "Thomas D.",
    city: "Lyon",
    rating: 5,
    text: "Très bon rapport qualité-prix avec la remise. Massage puissant, je recommande.",
    published: true,
  },
];

export function reviewStats(reviews: Review[]): { avg: number; count: number } {
  if (reviews.length === 0) return { avg: 0, count: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return { avg: sum / reviews.length, count: reviews.length };
}

/** Note d'un produit : avis publiés globaux + ceux du modèle. */
export function statsForProduct(
  reviews: Review[],
  slug: string,
): { avg: number; count: number } {
  return reviewStats(
    reviews.filter(
      (r) => r.published && (!r.productSlug || r.productSlug === slug),
    ),
  );
}

export type Rating = { avg: number; count: number };


export function initiales(author: string): string {
  return author
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
