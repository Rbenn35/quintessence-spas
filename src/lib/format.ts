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
