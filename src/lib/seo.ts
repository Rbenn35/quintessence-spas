/**
 * Schémas de données structurées (Schema.org / JSON-LD) réutilisables.
 *
 * Objectif SEO + GEO : déclarer clairement l'entité « Quintessence Spas »
 * aux moteurs de recherche et aux IA génératives (citations, Knowledge Panel),
 * et enrichir les pages (fil d'Ariane, listes de produits).
 *
 * Tous les schémas utilisent un `@id` stable pour pouvoir se référencer
 * entre eux (l'Organisation est l'éditeur du site et des articles).
 */

import { site } from "@/lib/site";

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

/** L'entité « Quintessence Spas » : fournisseur français de spas rigides premium. */
export function organizationSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/brand/logo.png`,
    },
    image: `${site.url}/products/lucerne-installe.jpg`,
    description:
      "Quintessence Spas est un fournisseur français de spas rigides premium pour les professionnels (revendeurs, piscinistes, paysagistes, hôtellerie de plein air) et les particuliers. Spas livrés, installés et garantis partout en France.",
    email: site.email,
    areaServed: {
      "@type": "Country",
      name: "France",
    },
    knowsAbout: [
      "Spa rigide",
      "Spa premium",
      "Distribution de spas",
      "Spa pour professionnels",
      "Spa de nage",
      "Installation de spa",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "service client",
      email: site.email,
      areaServed: "FR",
      availableLanguage: ["French"],
    },
  };
}

/** Le site web lui-même, rattaché à l'Organisation éditrice. */
export function websiteSchema(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: site.url,
    inLanguage: "fr-FR",
    publisher: { "@id": ORG_ID },
  };
}

/** Fil d'Ariane structuré. `items` = chemin du plus général au plus précis. */
export function breadcrumbSchema(
  items: { name: string; url: string }[],
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${site.url}${it.url}`,
    })),
  };
}

/** Référence courte vers l'Organisation (à imbriquer comme publisher/author). */
export const orgRef = { "@id": ORG_ID };
