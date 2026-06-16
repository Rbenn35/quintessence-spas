/**
 * Catalogue placeholder des spas.
 * Les données (prix, dimensions, descriptions, images) sont fictives et à
 * remplacer par le contenu réel. La structure est typée pour pouvoir brancher
 * un CMS ou un fichier de contenu plus tard sans changer les composants.
 */

/** Catégorie (gamme) d'un spa. Liste gérée dans le back-office. */
export type Gamme = string;

export interface Spa {
  slug: string;
  name: string;
  gamme: Gamme;
  places: number;
  /** Dimensions en cm : largeur x profondeur x hauteur */
  dimensions: { largeur: number; profondeur: number; hauteur: number };
  /** Prix indicatif TTC en euros (à partir de). null = uniquement sur devis */
  prixIndicatif: number | null;
  jets: number;
  /** Consommation indicative, libellé court */
  consommation: string;
  /** Accroche courte (1 phrase) */
  accroche: string;
  /** Description longue (plusieurs phrases, utile SEO fiche produit) */
  description: string;
  /** Points forts affichés en liste */
  pointsForts: string[];
  /** Teinte du dégradé placeholder en attendant les photos : [clair, foncé] */
  placeholder: [string, string];
  /** Photos réelles (chemins /public). Si présent, remplace le dégradé placeholder. */
  photos?: string[];
  /** Remise en cours (en %) appliquée au prixIndicatif. (Héritage : prixPromo est prioritaire s'il est défini.) */
  remisePct?: number;
  /** Prix promotionnel explicite (€ TTC). Prioritaire sur remisePct. Absent/null = pas de promo. */
  prixPromo?: number | null;
  /** Libellé du badge personnalisé (ex. « Nouveauté », « Coup de cœur », « Déstockage »). */
  badgeLabel?: string;
  /** Affiche le badge personnalisé sur la carte et la fiche produit. */
  badgeActive?: boolean;
  /** Prix de la livraison seule (€ TTC). */
  livraison?: number;
  /** Prix livraison + installation (€ TTC). */
  livraisonInstallation?: number;
  /** Icône choisie par point fort (même ordre que `pointsForts`). */
  pointsFortsIcons?: string[];
  /** Caractéristiques techniques détaillées, regroupées par thème. */
  caracteristiques?: { groupe: string; items: [string, string][] }[];
  /** Ce qui est inclus à la livraison. */
  inclus?: string[];
  /** Couleurs de coque disponibles (nom + code hex). */
  colorsCoque?: SpaColor[];
  /** Couleurs de tablier disponibles (nom + code hex). */
  colorsTablier?: SpaColor[];
  /** Disponibilité du produit. */
  stockStatus?: StockStatus;
  /** Date de disponibilité (si en production), ex. « septembre 2026 ». */
  stockAvailableAt?: string;
  /** Formules de livraison & installation (bannière fiche produit). */
  deliveryFormulas?: DeliveryFormula[];
}

export interface DeliveryFormula {
  name: string;
  description: string;
  /** Prix TTC ; null = « Sur devis ». */
  price: number | null;
  recommended?: boolean;
}

export interface SpaColor {
  name: string;
  hex: string;
}

export type StockStatus = "in_stock" | "production" | "out_of_stock";

export const STOCK_LABELS: Record<StockStatus, string> = {
  in_stock: "En stock",
  production: "En cours de production",
  out_of_stock: "En rupture de stock",
};

export const DEFAULT_COLORS_COQUE: SpaColor[] = [
  { name: "Blanc nacré", hex: "#f1f2ef" },
  { name: "Gris perle", hex: "#c7cbce" },
  { name: "Marbre", hex: "#e7e1d7" },
  { name: "Bleu glacier", hex: "#cfe2ea" },
];

export const DEFAULT_COLORS_TABLIER: SpaColor[] = [
  { name: "Anthracite", hex: "#2c3034" },
  { name: "Noir", hex: "#15181b" },
  { name: "Brun", hex: "#5a4632" },
  { name: "Taupe", hex: "#8a7d6d" },
];

/**
 * Données initiales (« seed »). Le contenu réel est géré dans data/spas.json
 * via le back-office. Ce tableau sert uniquement à initialiser le fichier la
 * première fois (voir src/lib/store.ts).
 */
export const seedSpas: Spa[] = [
  {
    slug: "vassania-4",
    name: "Vassania",
    gamme: "AquaLuxe",
    places: 4,
    // Caractéristiques à confirmer (dimensions, jets) : valeurs indicatives.
    dimensions: { largeur: 200, profondeur: 200, hauteur: 90 },
    prixIndicatif: 11580,
    remisePct: 25,
    livraison: 540,
    livraisonInstallation: 1190,
    jets: 40,
    consommation: "Classe A · isolation renforcée",
    accroche: "Notre nouveau spa 4 places, pensé pour la convivialité.",
    description:
      "Dernier-né de la collection Quintessence, le Vassania accueille quatre personnes dans un design épuré et contemporain. Assises ergonomiques, hydromassage enveloppant et finitions soignées transforment votre terrasse en véritable espace de bien-être. Habillage anthracite, ligne sobre et premium. Les caractéristiques techniques détaillées seront précisées prochainement.",
    pointsForts: [
      "4 places confortables",
      "Hydromassage multizone",
      "Design contemporain, habillage anthracite",
      "Livraison, installation et mise en service par nos équipes",
    ],
    placeholder: ["#d3e9ef", "#2e7c8f"],
    photos: [
      "/products/vassania-2.jpg",
      "/products/vassania-1.jpg",
      "/products/vassania-3.jpg",
    ],
  },
  {
    slug: "prado-6",
    name: "Prado",
    gamme: "AquaLuxe",
    places: 6,
    // Dimensions à confirmer (non précisées dans la fiche technique).
    dimensions: { largeur: 220, profondeur: 220, hauteur: 92 },
    prixIndicatif: 13520,
    remisePct: 25,
    jets: 33,
    consommation: "Isolation renforcée · réchauffeur 2 kW",
    accroche: "Le spa familial 6 places, complet et équilibré.",
    description:
      "Le Spa Prado 6 places est un spa familial conçu pour une expérience de relaxation complète : coque en Artitech Acrylic blanche, contours noirs et équipement technique fiable basé sur la technologie Gecko. Pensé pour accueillir jusqu'à six personnes, il associe confort, massage par 33 hydrojets, éclairage d'ambiance LED et isolation renforcée pour répondre aux exigences d'un usage régulier en extérieur. Son hydromassage puissant et sa filtration continue garantissent une eau toujours saine, désinfectée par lampe UV-C qui élimine 99,9 % des germes et bactéries.",
    pointsForts: [
      "6 places, 6 appuie-têtes",
      "33 hydrojets",
      "Électronique Gecko YJ3, réchauffeur 2 kW",
      "Lampe UV-C : 99,9 % des germes et bactéries détruits",
      "Isolation renforcée, pré-équipement pompe à chaleur",
      "Éclairage LED et sous-marin",
    ],
    placeholder: ["#cfe2ea", "#1c6e8e"],
    photos: [
      "/products/prado-1.jpg",
      "/products/prado-2.jpg",
      "/products/prado-3.jpg",
      "/products/prado-4.jpg",
      "/products/prado-5.jpg",
      "/products/prado-6.jpg",
    ],
    caracteristiques: [
      {
        groupe: "Général",
        items: [
          ["Modèle", "Spa Prado"],
          ["Nombre de places", "6 places"],
          ["Revêtement de coque", "Artitech Acrylic"],
          ["Couleur de coque", "Blanche"],
          ["Contours", "Noirs"],
          ["Structure de base", "Base ABS standard"],
          ["Appuie-têtes", "6 appuie-têtes"],
        ],
      },
      {
        groupe: "Massage et hydrothérapie",
        items: [
          ["Hydrojets", "33 hydrojets"],
          ["Pompe de massage principale", "1 500 W"],
          ["Pompe de massage secondaire", "750 W"],
          ["Pompe de circulation", "263 W"],
        ],
      },
      {
        groupe: "Électronique et chauffage",
        items: [
          ["Boîtier électronique", "Gecko YJ3"],
          ["Réchauffeur", "2 kW"],
          ["Clavier principal", "Gecko IN.K336"],
          ["Clavier auxiliaire", "Gecko IN.K120"],
        ],
      },
      {
        groupe: "Éclairage et ambiance",
        items: [
          ["Éclairage niveau d'eau", "LED level light"],
          ["Éclairage sous-marin", "Inclus"],
          ["Fontaine XXL", "Incluse"],
          ["Éclairage d'angle extérieur", "Non inclus"],
        ],
      },
      {
        groupe: "Isolation",
        items: [
          ["Isolation de cuve", "18 à 20 mm"],
          ["Isolation du tablier", "Incluse"],
          ["Isolation de la base ABS", "Incluse"],
          ["Isolation du meuble", "Incluse"],
        ],
      },
      {
        groupe: "Filtration et traitement de l'eau",
        items: [
          ["Filtration", "Filtre inclus"],
          ["Désinfection", "Lampe UV intégrée"],
          ["Ozone", "Non inclus (remplacé par lampe UV)"],
        ],
      },
      {
        groupe: "Équipements complémentaires",
        items: [
          ["Pré-équipement pompe à chaleur", "By-pass inclus"],
          ["Logo sur tablier", "Inclus"],
          ["Porte de meuble avec serrure", "Incluse"],
          ["Système audio Bluetooth", "Non inclus"],
        ],
      },
    ],
    inclus: [
      "Spa Prado 6 places",
      "6 appuie-têtes",
      "Filtre et lampe UV-C",
      "Fontaine XXL",
      "By-pass pompe à chaleur",
      "Porte de meuble avec serrure",
    ],
  },
  {
    slug: "javelino-6",
    name: "Javelino",
    gamme: "AquaLuxe",
    places: 6,
    // Caractéristiques à confirmer (dimensions, jets) : valeurs indicatives.
    dimensions: { largeur: 220, profondeur: 220, hauteur: 92 },
    prixIndicatif: 10580,
    remisePct: 25,
    jets: 48,
    consommation: "Classe A · isolation renforcée",
    accroche: "Le spa 6 places au design affirmé, pour de vrais moments de partage.",
    description:
      "Le Javelino accueille six personnes dans un spa rigide au caractère contemporain. Hydromassage enveloppant, assises ergonomiques et belle profondeur d'eau en font un espace de détente généreux, idéal en famille comme entre amis. Habillage anthracite et lignes nettes pour s'intégrer avec élégance à votre extérieur.",
    pointsForts: [
      "6 places spacieuses",
      "Hydromassage multizone",
      "Design contemporain, habillage anthracite",
      "Livraison, installation et mise en service par nos équipes",
    ],
    placeholder: ["#dcedf1", "#3a8aa0"],
    photos: [
      "/products/javelino-1.jpg",
      "/products/javelino-2.jpg",
      "/products/javelino-3.jpg",
      "/products/javelino-4.jpg",
      "/products/javelino-5.jpg",
      "/products/javelino-6.jpg",
    ],
  },
  {
    slug: "massidia-7",
    name: "Massidia",
    gamme: "AquaLuxe",
    places: 7,
    dimensions: { largeur: 257, profondeur: 219, hauteur: 90 },
    prixIndicatif: null,
    jets: 52,
    consommation: "Isolation renforcée · réchauffeur 3 kW",
    accroche: "Le spa grand format 7 places, massage hydrojets et air.",
    description:
      "Le Spa Massidia est un spa grand format conçu pour une expérience complète de détente : il associe massage par 52 hydrojets, massage par air (10 buses), gestion automatique de l'eau, éclairage sous-marin et électronique Gecko. Avec ses dimensions généreuses de 257 × 219 × 90 cm, sa coque en Artitech Acrylic blanche et ses contours noirs, il offre un espace confortable et une finition sobre et moderne, pensé pour un usage régulier en extérieur.",
    pointsForts: [
      "7 places, grand format 257 × 219 cm",
      "52 hydrojets + 10 buses d'air",
      "Électronique Gecko YE5, réchauffeur 3 kW",
      "Lampe UV-C : 99,9 % des germes et bactéries détruits",
      "Gestion automatique de l'eau (réservoir + remplissage)",
      "Isolation renforcée, pré-équipement pompe à chaleur",
    ],
    placeholder: ["#cfe2ea", "#1c6e8e"],
    photos: [
      "/products/massidia-1.jpg",
      "/products/massidia-2.jpg",
      "/products/massidia-3.jpg",
      "/products/massidia-4.jpg",
      "/products/massidia-5.jpg",
    ],
    caracteristiques: [
      {
        groupe: "Général",
        items: [
          ["Modèle", "Spa Massidia"],
          ["Nombre de places", "7 places"],
          ["Revêtement de coque", "Artitech Acrylic"],
          ["Couleur de coque", "Blanche"],
          ["Contours", "Noirs"],
          ["Structure de base", "Base ABS standard"],
        ],
      },
      {
        groupe: "Dimensions",
        items: [
          ["Longueur", "257 cm"],
          ["Largeur", "219 cm"],
          ["Hauteur", "90 cm"],
        ],
      },
      {
        groupe: "Massage et hydrothérapie",
        items: [
          ["Hydrojets", "52 hydrojets"],
          ["Massage par air", "10 buses d'air"],
          ["Pompe de massage", "1 500 W"],
          ["Air blower", "400 W"],
          ["Pompe de filtration", "250 W"],
        ],
      },
      {
        groupe: "Électronique et chauffage",
        items: [
          ["Boîtier électronique", "Gecko YE5"],
          ["Réchauffeur", "3 000 W"],
          ["Clavier principal", "Gecko IN.K506"],
          ["Clavier auxiliaire", "Gecko IN.K120"],
        ],
      },
      {
        groupe: "Gestion de l'eau",
        items: [
          ["Réservoir d'eau", "Inclus"],
          ["Alimentation automatique en eau", "Incluse"],
          ["Désinfection UV", "Incluse"],
          ["Filtration", "Filtre inclus"],
        ],
      },
      {
        groupe: "Éclairage et ambiance",
        items: [["Éclairage sous-marin", "Inclus"]],
      },
      {
        groupe: "Isolation",
        items: [
          ["Isolation de cuve", "18 à 20 mm"],
          ["Isolation du tablier", "Incluse"],
          ["Isolation de la base ABS", "Incluse"],
          ["Isolation du meuble", "Incluse"],
        ],
      },
      {
        groupe: "Équipements complémentaires",
        items: [
          ["Pré-équipement pompe à chaleur", "By-pass inclus"],
          ["Logo sur tablier", "Inclus"],
          ["Porte de meuble avec serrure", "Incluse"],
        ],
      },
    ],
    inclus: [
      "Spa Massidia 7 places",
      "Filtre et lampe UV-C",
      "Réservoir + alimentation automatique en eau",
      "Éclairage sous-marin",
      "By-pass pompe à chaleur",
      "Porte de meuble avec serrure",
    ],
  },
  {
    slug: "serenite-5",
    name: "Sérénité 5",
    gamme: "Signature",
    places: 5,
    dimensions: { largeur: 215, profondeur: 215, hauteur: 90 },
    prixIndicatif: 9900,
    jets: 38,
    consommation: "Classe A · isolation renforcée",
    accroche: "L'équilibre parfait entre confort et compacité.",
    description:
      "Le Sérénité 5 accueille cinq personnes dans un espace pensé pour la détente quotidienne. Assises ergonomiques, hydromassage ciblé et isolation renforcée pour une consommation maîtrisée toute l'année. Un modèle polyvalent, idéal pour une première installation premium.",
    pointsForts: [
      "5 places dont 1 allongée",
      "38 jets d'hydromassage",
      "Isolation renforcée, basse consommation",
      "Système de filtration silencieux",
    ],
    placeholder: ["#cfe2ea", "#1c6e8e"],
  },
  {
    slug: "equilibre-6",
    name: "Équilibre 6",
    gamme: "Signature",
    places: 6,
    dimensions: { largeur: 230, profondeur: 230, hauteur: 92 },
    prixIndicatif: 12500,
    jets: 46,
    consommation: "Classe A · pompe à chaleur compatible",
    accroche: "De l'espace pour toute la famille, sans compromis.",
    description:
      "Avec ses six places et son grand bassin, l'Équilibre 6 transforme votre extérieur en véritable espace bien-être. Éclairage d'ambiance, hydromassage multizone et compatibilité pompe à chaleur pour optimiser vos coûts d'usage.",
    pointsForts: [
      "6 places confortables",
      "46 jets répartis en zones",
      "Éclairage LED d'ambiance",
      "Compatible pompe à chaleur",
    ],
    placeholder: ["#dcedf1", "#3a8aa0"],
  },
  {
    slug: "plenitude-7",
    name: "Plénitude 7",
    gamme: "Prestige",
    places: 7,
    dimensions: { largeur: 240, profondeur: 240, hauteur: 95 },
    prixIndicatif: 15900,
    jets: 56,
    consommation: "Classe A+ · isolation premium",
    accroche: "Le grand spa convivial, dans sa version la plus aboutie.",
    description:
      "Pièce maîtresse de la gamme Prestige, le Plénitude 7 reçoit jusqu'à sept personnes dans un raffinement absolu. Matériaux nobles, hydromassage haute performance et finitions soignées dans le moindre détail. L'expérience spa portée à son sommet.",
    pointsForts: [
      "7 places dont 2 allongées",
      "56 jets haute performance",
      "Habillage matériaux nobles",
      "Isolation premium classe A+",
    ],
    placeholder: ["#cde6ec", "#14566e"],
  },
  {
    slug: "intimite-2",
    name: "Intimité 2",
    gamme: "Essentiel",
    places: 2,
    dimensions: { largeur: 180, profondeur: 180, hauteur: 85 },
    prixIndicatif: 6900,
    jets: 22,
    consommation: "Classe A · compact",
    accroche: "Le spa duo, parfait pour les petits espaces.",
    description:
      "Compact et chaleureux, l'Intimité 2 est conçu pour les couples et les terrasses de taille modeste. Une bulle de détente à deux, simple à installer et économe à l'usage, sans renoncer à la qualité de fabrication Quintessence.",
    pointsForts: [
      "2 places face à face",
      "22 jets d'hydromassage",
      "Format compact, petites terrasses",
      "Installation simplifiée",
    ],
    placeholder: ["#d3e9ef", "#2e7c8f"],
  },
  {
    slug: "harmonie-4",
    name: "Harmonie 4",
    gamme: "Essentiel",
    places: 4,
    dimensions: { largeur: 200, profondeur: 200, hauteur: 88 },
    prixIndicatif: 8400,
    jets: 30,
    consommation: "Classe A · isolation renforcée",
    accroche: "Le bon compromis places / encombrement.",
    description:
      "L'Harmonie 4 offre quatre places confortables dans un encombrement raisonnable. Un spa rigide accessible, robuste et bien équipé, pensé pour devenir le rendez-vous détente de toute la maison.",
    pointsForts: [
      "4 places ergonomiques",
      "30 jets d'hydromassage",
      "Couverture isotherme incluse",
      "Entretien simplifié",
    ],
    placeholder: ["#cfe2ea", "#1c6e8e"],
  },
  {
    slug: "prestige-6-pro",
    name: "Prestige 6 Pro",
    gamme: "Prestige",
    places: 6,
    dimensions: { largeur: 235, profondeur: 235, hauteur: 95 },
    prixIndicatif: null,
    jets: 60,
    consommation: "Classe A+ · pilotage connecté",
    accroche: "La technologie au service du bien-être absolu.",
    description:
      "Modèle d'exception, le Prestige 6 Pro conjugue hydromassage haute densité, pilotage connecté depuis votre smartphone et finitions sur mesure. Chaque détail est personnalisable. Disponible uniquement sur devis, pour un projet à la hauteur de vos attentes.",
    pointsForts: [
      "6 places grand confort",
      "60 jets haute densité",
      "Pilotage connecté (application)",
      "Finitions et habillage sur mesure",
    ],
    placeholder: ["#dcedf1", "#3a8aa0"],
  },
  {
    slug: "evasion-5",
    name: "Évasion 5",
    gamme: "Signature",
    places: 5,
    dimensions: { largeur: 218, profondeur: 218, hauteur: 90 },
    prixIndicatif: 10900,
    jets: 42,
    consommation: "Classe A · pompe à chaleur compatible",
    accroche: "Un cocon d'évasion au quotidien.",
    description:
      "L'Évasion 5 mise sur le confort enveloppant et une ambiance lumineuse soignée. Cinq places, hydromassage progressif et chromothérapie pour des moments de relâchement complet, été comme hiver.",
    pointsForts: [
      "5 places dont 1 allongée",
      "42 jets + chromothérapie",
      "Cascade d'eau apaisante",
      "Compatible pompe à chaleur",
    ],
    placeholder: ["#cde6ec", "#14566e"],
  },
  {
    slug: "majeste-8",
    name: "Majesté 8",
    gamme: "Prestige",
    places: 8,
    dimensions: { largeur: 250, profondeur: 250, hauteur: 98 },
    prixIndicatif: null,
    jets: 68,
    consommation: "Classe A+ · isolation premium",
    accroche: "Le spa familial d'exception, jusqu'à 8 places.",
    description:
      "Le plus généreux de la collection. Le Majesté 8 accueille jusqu'à huit personnes pour des moments de partage inoubliables. Banquettes multiples, hydromassage haute performance et habillage haut de gamme. Sur devis, pour les grands projets.",
    pointsForts: [
      "8 places, banquettes multiples",
      "68 jets haute performance",
      "Habillage haut de gamme",
      "Isolation premium classe A+",
    ],
    placeholder: ["#d3e9ef", "#2e7c8f"],
  },
];

export const gammes: Gamme[] = [
  "AquaLuxe",
  "Essentiel",
  "Signature",
  "Prestige",
];

export function formatPrix(prix: number | null): string {
  if (prix === null) return "Sur devis";
  return `À partir de ${prix.toLocaleString("fr-FR")} €`;
}

/** Formate un montant en euros (ex. 8685 -> "8 685 €"). */
export function formatEuro(montant: number): string {
  return `${montant.toLocaleString("fr-FR")} €`;
}

/**
 * Prix après remise éventuelle. null si le modèle est uniquement sur devis.
 * Un prix promo explicite (`prixPromo`) est prioritaire sur la remise en %.
 */
export function prixApresRemise(spa: Spa): number | null {
  if (spa.prixIndicatif === null) return null;
  if (
    typeof spa.prixPromo === "number" &&
    spa.prixPromo > 0 &&
    spa.prixPromo < spa.prixIndicatif
  ) {
    return spa.prixPromo;
  }
  if (!spa.remisePct) return spa.prixIndicatif;
  return Math.round(spa.prixIndicatif * (1 - spa.remisePct / 100));
}

/**
 * Pourcentage de remise effectif (calculé depuis prixPromo ou remisePct),
 * arrondi à l'entier. null s'il n'y a pas de promo en cours.
 */
export function remiseEffectivePct(spa: Spa): number | null {
  if (spa.prixIndicatif === null || spa.prixIndicatif <= 0) return null;
  const final = prixApresRemise(spa);
  if (final === null || final >= spa.prixIndicatif) return null;
  return Math.round((1 - final / spa.prixIndicatif) * 100);
}

/** Libellé du badge personnalisé à afficher, ou null si désactivé/vide. */
export function badgePersonnalise(spa: Spa): string | null {
  const label = spa.badgeLabel?.trim();
  return spa.badgeActive && label ? label : null;
}
