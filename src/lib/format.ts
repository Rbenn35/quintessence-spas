/**
 * Helpers de formatage / validation des coordonnées client (devis).
 */

/** Prénom : 1re lettre de chaque mot en majuscule, reste en minuscule.
 *  « marie » → « Marie » ; « marie anne » → « Marie Anne » ; « jean-pierre » → « Jean-Pierre ». */
export function formatPrenom(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/(^|[\s'-])([a-zà-ÿ])/g, (_m, sep: string, ch: string) => sep + ch.toUpperCase());
}

/** Nom : toujours en majuscules. « dompierre » → « DOMPIERRE ». */
export function formatNom(s: string): string {
  return s.trim().toUpperCase();
}

/** Garde uniquement les chiffres d'un numéro de téléphone. */
export function phoneDigits(s: string): string {
  return s.replace(/\D/g, "");
}

/** Téléphone valide = exactement 10 chiffres. */
export function isValidPhone(s: string): boolean {
  return phoneDigits(s).length === 10;
}

/** Affichage téléphone par paires : 06 69 47 79 79. */
export function formatPhone(s: string): string {
  const d = phoneDigits(s).slice(0, 10);
  return d.replace(/(\d{2})(?=\d)/g, "$1 ").trim();
}

/** Validation simple d'adresse e-mail. */
export function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.trim());
}

/** Date ISO (`2026-06-22`) → « 22 juin 2026 ». Renvoie "" si invalide/absente. */
export function formatDateFr(iso?: string): string {
  if (!iso) return "";
  // On force midi UTC pour éviter tout décalage de jour selon le fuseau.
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}
