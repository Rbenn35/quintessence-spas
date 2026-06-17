/**
 * Configuration du devis (back-office) : lignes ajoutables (packs livraison,
 * installation, accessoires) et réglages (validité, délai d'envoi, texte).
 */
export type DevisLineType = "livraison" | "installation" | "accessoire";

export interface DevisLine {
  id: string;
  type: DevisLineType;
  label: string;
  price: number;
  active: boolean;
  /** Ligne offerte : prix barré, affiché « Offert » et non compté au total. */
  offered?: boolean;
  /** Phrase descriptive affichée sous le libellé. */
  description?: string;
}

export interface DevisConfig {
  /** Template validé (design du document). */
  template: string;
  /** Objet du mail (variables {cle} autorisées). */
  subject: string;
  /** Titre affiché en haut du devis ({cle} + *mise en avant* + retours ligne). */
  title: string;
  /** Durée de validité de l'offre, en jours. */
  validityDays: number;
  /** Délai d'envoi automatique après la demande, en minutes. */
  delayMinutes: number;
  /** Texte d'accompagnement sous le titre (1re variante / repli). */
  intro: string;
  /** Variantes du texte d'accompagnement : une est tirée au hasard par devis
   *  (évite d'envoyer toujours le même texte). Max ~5 recommandé. */
  introVariants?: string[];
  /** Remise supplémentaire (%) accordée sur le devis, en plus de la promo du site. */
  extraRemisePct?: number;
  lines: DevisLine[];

  /* E-mail de demande générique (aucun modèle précisé) */
  /** Délai d'envoi de l'e-mail de demande générique, en minutes. */
  genericDelayMinutes: number;
  /** Objet de l'e-mail générique. */
  genericSubject: string;
  /** Titre de l'e-mail générique. */
  genericTitle: string;
  /** Corps de l'e-mail générique (paragraphes + listes « - »). */
  genericBody: string;
}

export const DEVIS_TYPE_LABELS: Record<DevisLineType, string> = {
  livraison: "Packs livraison",
  installation: "Packs installation",
  accessoire: "Accessoires",
};

/** Variables insérables dans le texte d'accompagnement (forme {cle}). */
export interface DevisVar {
  key: string;
  label: string;
  example: string;
  group: "Client" | "Produit" | "Devis";
}

export const DEVIS_VARS: DevisVar[] = [
  // Client
  { key: "prenom", label: "Prénom", example: "Marie", group: "Client" },
  { key: "nom", label: "Nom", example: "Durand", group: "Client" },
  { key: "email", label: "Email", example: "marie.durand@email.fr", group: "Client" },
  // Produit
  { key: "modele", label: "Modèle", example: "Spa Prado 6 places", group: "Produit" },
  { key: "modele_court", label: "Modèle (court)", example: "Prado", group: "Produit" },
  { key: "gamme", label: "Gamme", example: "AquaLuxe", group: "Produit" },
  { key: "places", label: "Places", example: "6", group: "Produit" },
  { key: "jets", label: "Jets", example: "33", group: "Produit" },
  { key: "dimensions", label: "Dimensions", example: "215 × 215 × 90 cm", group: "Produit" },
  { key: "prix_initial", label: "Prix catalogue", example: "13 520 €", group: "Produit" },
  { key: "remise_pct", label: "Remise %", example: "25 %", group: "Produit" },
  { key: "prix_remise", label: "Prix remisé", example: "10 140 €", group: "Produit" },
  // Devis
  { key: "livraison", label: "Pack livraison", example: "540 €", group: "Devis" },
  { key: "installation", label: "Pack installation", example: "1 190 €", group: "Devis" },
  { key: "prix_total", label: "Total TTC", example: "12 160 €", group: "Devis" },
  { key: "economie", label: "Économie", example: "3 380 €", group: "Devis" },
  { key: "validite", label: "Validité (jours)", example: "30", group: "Devis" },
  { key: "ref", label: "N° de devis", example: "DV-003520", group: "Devis" },
  { key: "date", label: "Date", example: "10 juin 2026", group: "Devis" },
];

export const DEVIS_VAR_GROUPS: DevisVar["group"][] = [
  "Client",
  "Produit",
  "Devis",
];

/** Remplace les variables {cle} d'un texte par leurs valeurs. */
export function applyDevisVars(
  text: string,
  vars: Record<string, string>,
): string {
  return text.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? vars[key] : match,
  );
}

export const defaultDevisConfig: DevisConfig = {
  template: "prop-3",
  subject: "Votre devis personnalisé — {modele_court}",
  title: "Bonjour {prenom},\nvotre *{modele_court}* vous attend",
  validityDays: 30,
  delayMinutes: 40,
  extraRemisePct: 5,
  intro:
    "Merci {prenom} pour votre demande. Voici votre proposition pour le {modele}, soit {prix_total} TTC, avec {economie} d'économie.\n\nJ'ai ajouté une petite remise complémentaire et le Kit d'entretien 6 mois offert. Si vous souhaitez la livraison et l'installation du spa, n'hésitez pas à revenir vers moi, je mettrai à jour votre devis.\nOffre valable {validite} jours.\n\nCordialement,\nEric Huault",
  introVariants: [
    "Merci {prenom} pour votre demande. Voici votre proposition pour le {modele}, soit {prix_total} TTC, avec {economie} d'économie.\n\nJ'ai ajouté une petite remise complémentaire et le Kit d'entretien 6 mois offert. Si vous souhaitez la livraison et l'installation du spa, n'hésitez pas à revenir vers moi, je mettrai à jour votre devis.\nOffre valable {validite} jours.\n\nCordialement,\nEric Huault",
    "Bonjour {prenom}, merci pour votre intérêt. Voici votre offre pour le {modele} : {prix_total} TTC, soit {economie} d'économie.\n\nJ'y ai glissé une remise supplémentaire ainsi que le Kit d'entretien 6 mois, offert. Besoin de la livraison et de l'installation ? Dites-le moi et j'actualise votre devis.\nProposition valable {validite} jours.\n\nBien à vous,\nEric Huault",
    "{prenom}, merci de votre confiance. Voici ma proposition pour le {modele}, à {prix_total} TTC ({economie} d'économie).\n\nJ'ai inclus une remise complémentaire et le Kit d'entretien 6 mois en cadeau. Pour ajouter la livraison et l'installation, un simple message suffit et je mets votre devis à jour.\nCette offre reste valable {validite} jours.\n\nÀ très bientôt,\nEric Huault",
    "Merci {prenom} pour votre demande de devis. Voici ce que je peux vous proposer sur le {modele} : {prix_total} TTC, avec déjà {economie} d'économie.\n\nEn bonus, une remise additionnelle et le Kit d'entretien 6 mois offert. Si la livraison et l'installation vous intéressent, revenez vers moi : je réajuste le devis en conséquence.\nOffre valable {validite} jours.\n\nCordialement,\nEric Huault",
    "Bonjour {prenom}, ravi de vous accompagner dans votre projet. Voici votre proposition pour le {modele} : {prix_total} TTC, soit {economie} d'économie.\n\nJ'ai ajouté une remise complémentaire et je vous offre le Kit d'entretien 6 mois. La livraison et l'installation peuvent être ajoutées sur simple demande, je mettrai alors votre devis à jour.\nValable {validite} jours.\n\nBien cordialement,\nEric Huault",
  ],
  genericDelayMinutes: 12,
  genericSubject: "{prenom}, parlons de votre projet de spa",
  genericTitle: "Bonjour {prenom},\nparlons de votre *projet*",
  genericBody:
    "Merci pour votre demande ! Pour vous proposer le spa le plus adapté et un devis au plus juste, pourriez-vous nous en dire un peu plus ?\n- Combien de personnes profiteront du spa ?\n- Plutôt détente, massage ou nage ?\n- Avez-vous un emplacement prévu (terrasse, jardin, intérieur) ?\n- Une idée du budget envisagé ?\nRépondez simplement à cet e-mail : nous reviendrons vers vous avec une proposition personnalisée.",
  lines: [
    {
      id: "liv-std",
      type: "livraison",
      label: "Pack livraison",
      price: 540,
      active: true,
      description:
        "Livraison sur toute la France par camion semi-remorque 35T, déchargement au hayon et transpalette.",
    },
    {
      id: "inst-std",
      type: "installation",
      label: "Pack installation & mise en service",
      price: 1190,
      active: false,
    },
    {
      id: "acc-couverture",
      type: "accessoire",
      label: "Couverture thermique",
      price: 490,
      active: true,
      offered: true,
    },
    {
      id: "acc-escalier",
      type: "accessoire",
      label: "Escalier bois",
      price: 190,
      active: false,
    },
    {
      id: "acc-eau",
      type: "accessoire",
      label: "Kit traitement de l'eau O'Pure",
      price: 120,
      active: true,
      offered: true,
      description:
        "Traitement naturel et hypoallergénique, sans produit chimique dans l'eau.",
    },
  ],
};
