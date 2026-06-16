/** Message reçu via le formulaire de contact, stocké dans le back-office. */
export interface ContactMessage {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  sujet?: string;
  message: string;
  date: string; // ISO
  read: boolean;
}
