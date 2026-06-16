/**
 * Configuration centrale du site.
 * Les valeurs marquées « PLACEHOLDER » sont à remplacer par les infos réelles
 * (téléphone, email, domaine OVH).
 */

export const site = {
  name: "Quintessence Spas",
  shortName: "Quintessence",
  tagline: "Spas rigides premium · France",
  description:
    "Spas rigides haut de gamme, vendus en ligne et livrés partout en France. Demandez votre devis gratuit en quelques clics.",
  url: "https://quintessencespas.com",
  locale: "fr_FR",
  // PLACEHOLDER · email réel (contact uniquement par email)
  email: "contact@quintessencespas.com",
  // Chiffres de réassurance (à ajuster avec les vrais chiffres)
  stats: {
    yearsExperience: "+15 ans",
    spasInstalled: "2 400",
    rating: "4,9/5",
    warranty: "5 ans",
  },
  nav: [
    { label: "Les spas", href: "/spas" },
    { label: "Guides", href: "/guides" },
    { label: "La marque", href: "/marque" },
    { label: "Contact", href: "/contact" },
  ],
} as const;

export type Site = typeof site;
