/**
 * Produits complémentaires (accessoires) proposés pour compléter un spa.
 * Gérés dans le back-office, affichés sur les fiches produit.
 */
export interface Accessoire {
  id: string;
  name: string;
  description: string;
  /** Prix TTC ; null = « Sur devis ». */
  price: number | null;
  /** Image (/public) ; sinon dégradé. */
  image?: string;
  active: boolean;
}

export const seedAccessoires: Accessoire[] = [
  {
    id: "acc-couverture",
    name: "Couverture isotherme premium",
    description: "Limite les pertes de chaleur et protège l'eau.",
    price: 290,
    active: true,
  },
  {
    id: "acc-escalier",
    name: "Escalier bois",
    description: "Accès confortable et sécurisé au spa.",
    price: 190,
    active: true,
  },
  {
    id: "acc-eau",
    name: "Kit traitement de l'eau",
    description: "Tout le nécessaire pour une eau saine toute l'année.",
    price: 120,
    active: true,
  },
];
