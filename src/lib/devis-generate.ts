import { prixApresRemise, remiseEffectivePct, type Spa } from "./spas";
import { applyDevisVars, type DevisConfig } from "./devis";
import type { SiteSettings } from "./settings";
import {
  renderDevisHtml,
  renderInfoHtml,
  type DevisLineRow,
} from "./devis-template";

export interface BuildDevisOpts {
  prenom: string;
  nom: string;
  email: string;
  product: Spa;
  config: DevisConfig;
  settings: SiteSettings;
  ref: string;
  dateLabel: string;
  /** Préfixe des images (URL absolue pour l'email, vide pour l'aperçu web). */
  baseUrl?: string;
  ctaUrl?: string;
  /** Affiche le bandeau « Objet : … » (aperçu uniquement). */
  subjectBanner?: boolean;
}

export interface BuiltDevis {
  html: string;
  subject: string;
  total: number;
  savings: number;
  modeleLabel: string;
}

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

export function buildDevis(o: BuildDevisOpts): BuiltDevis {
  const p = o.product;
  const base = o.baseUrl ?? "";
  const prixSite = prixApresRemise(p) ?? 0;
  const remisePct = remiseEffectivePct(p);
  // Remise devis supplémentaire (en plus de la promo du site).
  const extraPct = o.config.extraRemisePct ?? 0;
  const prixDevis = Math.round(prixSite * (1 - extraPct / 100));

  const active = o.config.lines.filter((l) => l.active);
  const sumType = (t: string) =>
    active
      .filter((l) => l.type === t && !l.offered)
      .reduce((s, l) => s + l.price, 0);
  // Seules les lignes non offertes sont comptées au total.
  const linesTotal = active
    .filter((l) => !l.offered)
    .reduce((s, l) => s + l.price, 0);
  const offeredSum = active
    .filter((l) => l.offered)
    .reduce((s, l) => s + l.price, 0);
  const total = prixDevis + linesTotal;
  // Économie = remise sur le spa (catalogue → prix devis) + valeur des lignes offertes.
  const savings =
    (p.prixIndicatif ? p.prixIndicatif - prixDevis : 0) + offeredSum;
  const dims = `${p.dimensions.largeur} × ${p.dimensions.profondeur} × ${p.dimensions.hauteur} cm`;
  const modeleLabel = `${p.name} ${p.places} places`;

  const vars: Record<string, string> = {
    prenom: o.prenom,
    nom: o.nom,
    email: o.email,
    modele: modeleLabel,
    modele_court: p.name,
    gamme: p.gamme,
    places: String(p.places),
    jets: String(p.jets),
    dimensions: dims,
    prix_initial: p.prixIndicatif != null ? euro(p.prixIndicatif) : "Sur devis",
    remise_pct: remisePct !== null ? `${remisePct} %` : "—",
    prix_remise: euro(prixDevis),
    livraison: sumType("livraison") ? euro(sumType("livraison")) : "—",
    installation: sumType("installation") ? euro(sumType("installation")) : "—",
    prix_total: euro(total),
    economie: euro(savings),
    validite: String(o.config.validityDays),
    ref: o.ref,
    date: o.dateLabel,
  };

  const lines: DevisLineRow[] = [
    {
      label: modeleLabel,
      sub: `${p.places} places · ${p.jets} hydrojets`,
      price: prixDevis,
      oldPrice: p.prixIndicatif && p.prixIndicatif > prixDevis ? p.prixIndicatif : undefined,
    },
    ...active.map((l) => ({
      label: l.label,
      price: l.price,
      ...(l.offered ? { offered: true } : {}),
      ...(l.description ? { sub: l.description } : {}),
    })),
  ];

  const subject = applyDevisVars(o.config.subject, vars);

  // Texte d'accompagnement : une variante tirée au hasard (jamais le même
  // texte d'un devis à l'autre), repli sur l'intro simple.
  const variants = (o.config.introVariants ?? []).filter((t) => t.trim());
  const introTemplate = variants.length
    ? variants[Math.floor(Math.random() * variants.length)]
    : o.config.intro;

  // Lien du bouton « Valider mon devis » : à défaut, un e-mail pré-rempli
  // vers le contact (le client valide en répondant, reçu dans la boîte Gmail).
  const mailSubject = encodeURIComponent(
    `Validation de mon devis ${o.ref} - ${modeleLabel}`,
  );
  const mailBody = encodeURIComponent(
    `Bonjour,\n\nJe souhaite valider mon devis ${o.ref} pour le ${modeleLabel} (${euro(total)} TTC).\nMerci de me recontacter pour la suite.\n\n${o.prenom} ${o.nom}\n${o.email}`,
  );
  const ctaUrl =
    o.ctaUrl ??
    `mailto:${o.settings.email}?subject=${mailSubject}&body=${mailBody}`;

  const html = renderDevisHtml({
    vars,
    title: o.config.title,
    subjectPreview: o.subjectBanner ? subject : undefined,
    productName: modeleLabel,
    productSpecs: `Gamme ${p.gamme} · ${p.jets} hydrojets`,
    productImage: p.photos?.[0] ? `${base}${p.photos[0]}` : "",
    productUrl: `${base || "https://www.quintessencespas.com"}/spas/${p.slug}`,
    ref: o.ref,
    dateLabel: o.dateLabel,
    validityDays: o.config.validityDays,
    intro: introTemplate,
    lines,
    total,
    savings,
    contactEmail: o.settings.email,
    logoUrl: `${base}/brand/logo.png`,
    siteUrl: base || "https://www.quintessencespas.com",
    ctaUrl,
  });

  return { html, subject, total, savings, modeleLabel };
}

export interface BuildInfoOpts {
  prenom: string;
  nom: string;
  email: string;
  config: DevisConfig;
  settings: SiteSettings;
  ref: string;
  dateLabel: string;
  baseUrl?: string;
  subjectBanner?: boolean;
}

/** E-mail de demande générique (sans modèle) : variables Client uniquement. */
export function buildInfoEmail(o: BuildInfoOpts): {
  html: string;
  subject: string;
} {
  const base = o.baseUrl ?? "";
  const vars: Record<string, string> = {
    prenom: o.prenom,
    nom: o.nom,
    email: o.email,
    validite: String(o.config.validityDays),
    ref: o.ref,
    date: o.dateLabel,
  };
  const subject = applyDevisVars(o.config.genericSubject, vars);
  const html = renderInfoHtml({
    vars,
    title: o.config.genericTitle,
    body: o.config.genericBody,
    subjectPreview: o.subjectBanner ? subject : undefined,
    contactEmail: o.settings.email,
    logoUrl: `${base}/brand/logo.png`,
    siteUrl: base || "https://www.quintessencespas.com",
    ctaUrl: `${base}/contact`,
    ctaLabel: "Préciser ma demande",
  });
  return { html, subject };
}
