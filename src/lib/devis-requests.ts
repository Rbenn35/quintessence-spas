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
}
