import type { DevisLine } from "./devis";

/**
 * Demande de devis reçue via le formulaire. Le document est généré et "gelé"
 * (HTML + objet) à la réception, puis mis en file pour envoi à J+délai.
 */
export interface DevisRequest {
  id: string;
  /** "devis" = proposition chiffrée ; "info" = e-mail de demande générique. */
  type: "devis" | "info";
  prenom: string;
  nom: string;
  email: string;
  modeleLabel: string;
  total: number;
  ref: string;
  /** Objet du mail rendu (variables remplacées). */
  subject: string;
  /** Document HTML du devis, figé à la réception. */
  html: string;
  createdAt: string;
  /** Heure d'envoi prévue (réception + délai). */
  sendAt: string;
  status: "pending" | "sent" | "cancelled";
  sentAt?: string;
  /** Slug du spa concerné (permet de régénérer le devis pour le modifier). */
  slug?: string;
  /** Lignes du devis (livraison, installation, accessoires) telles qu'envoyées. */
  lines?: DevisLine[];
  /** Nombre de fois où le devis a été renvoyé (après modification). */
  resendCount?: number;

  /* ----- Signature électronique (validation par le client) ----- */
  signed?: boolean;
  /** Date/heure ISO de la signature. */
  signedAt?: string;
  /** Adresse IP du signataire (preuve). */
  signerIp?: string;
  /** Nom saisi par le signataire. */
  signerName?: string;
  /** Image de la signature (PNG base64 data URL). */
  signatureDataUrl?: string;
  /** Coordonnées de facturation saisies. */
  billing?: DevisAddress;
  /** Coordonnées de livraison si différentes de la facturation. */
  delivery?: DevisAddress;
}

export interface DevisAddress {
  address: string;
  cp: string;
  city: string;
  phone?: string;
}
