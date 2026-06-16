import { cookies } from "next/headers";

/**
 * Authentification basique du back-office par mot de passe.
 * Mot de passe via la variable d'environnement ADMIN_PASSWORD
 * (défaut « quintessence » en local). À durcir avant la mise en ligne.
 */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "quintessence";
export const ADMIN_COOKIE = "qs_admin";

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === ADMIN_PASSWORD;
}
