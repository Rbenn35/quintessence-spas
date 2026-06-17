import { seedSpas, gammes as defaultGammes, type Spa } from "./spas";
import { seedArticles, type Article } from "./articles";
import { seedReviews, type Review } from "./reviews";
import { defaultSettings, type SiteSettings } from "./settings";
import type { ContactMessage } from "./messages";
import { defaultDevisConfig, type DevisConfig } from "./devis";
import type { DevisRequest } from "./devis-requests";
import { seedAccessoires, type Accessoire } from "./accessoires";
import { storeRead, storeWrite } from "./kv";

/**
 * Store de contenu (back-office). Persistance via la couche `kv` :
 * base de données en production (Vercel), fichiers /data en local.
 *
 * Le contenu commité dans /data est importé ici comme valeur initiale :
 * ainsi, sur un déploiement neuf (base vide), le site affiche le vrai
 * catalogue avant toute édition admin. Données runtime (messages, demandes de
 * devis) : valeur initiale vide, non versionnées.
 */
import spasContent from "../../data/spas.json";
import articlesContent from "../../data/articles.json";
import reviewsContent from "../../data/reviews.json";
import accessoiresContent from "../../data/accessoires.json";
import gammesContent from "../../data/gammes.json";
import settingsContent from "../../data/settings.json";
import devisContent from "../../data/devis.json";

const SPAS_SEED = (spasContent as unknown as Spa[]) ?? seedSpas;
const ARTICLES_SEED = (articlesContent as unknown as Article[]) ?? seedArticles;
const REVIEWS_SEED = (reviewsContent as unknown as Review[]) ?? seedReviews;
const ACCESSOIRES_SEED =
  (accessoiresContent as unknown as Accessoire[]) ?? seedAccessoires;
const GAMMES_SEED = (gammesContent as unknown as string[]) ?? [
  ...defaultGammes,
];
const SETTINGS_SEED = settingsContent as unknown as Partial<SiteSettings>;
const DEVIS_SEED = devisContent as unknown as Partial<DevisConfig>;

/* -------------------------------- Spas ------------------------------------ */

export async function getAllSpas(): Promise<Spa[]> {
  return storeRead<Spa[]>("spas", SPAS_SEED);
}

export async function getSpaBySlug(slug: string): Promise<Spa | undefined> {
  return (await getAllSpas()).find((s) => s.slug === slug);
}

export async function saveAllSpas(spas: Spa[]): Promise<void> {
  await storeWrite("spas", spas);
}

export async function upsertSpa(spa: Spa): Promise<void> {
  const all = await getAllSpas();
  const idx = all.findIndex((s) => s.slug === spa.slug);
  if (idx >= 0) all[idx] = spa;
  else all.unshift(spa);
  await saveAllSpas(all);
}

export async function deleteSpa(slug: string): Promise<void> {
  const all = await getAllSpas();
  await saveAllSpas(all.filter((s) => s.slug !== slug));
}

/** Champs modifiables en masse depuis la liste produits. */
export interface SpaBulkPatch {
  prixIndicatif?: number | null;
  prixPromo?: number | null;
  badgeLabel?: string;
  badgeActive?: boolean;
}

/**
 * Applique un patch partiel à plusieurs produits d'un coup.
 * Seules les clés présentes dans `patch` sont modifiées (les autres champs des
 * produits restent intacts). Renvoie le nombre de produits modifiés.
 */
export async function bulkPatchSpas(
  slugs: string[],
  patch: SpaBulkPatch,
): Promise<number> {
  const targets = new Set(slugs);
  const all = await getAllSpas();
  let count = 0;
  const next = all.map((s) => {
    if (!targets.has(s.slug)) return s;
    count++;
    const u: Spa = { ...s };
    if ("prixIndicatif" in patch) {
      u.prixIndicatif = patch.prixIndicatif ?? null;
    }
    if ("prixPromo" in patch) {
      // On unifie sur prixPromo : on retire l'ancienne remise % éventuelle.
      delete u.remisePct;
      if (patch.prixPromo == null) delete u.prixPromo;
      else u.prixPromo = patch.prixPromo;
    }
    if ("badgeLabel" in patch) {
      const label = (patch.badgeLabel ?? "").trim();
      if (label) u.badgeLabel = label;
      else delete u.badgeLabel;
    }
    if ("badgeActive" in patch) u.badgeActive = patch.badgeActive;
    return u;
  });
  await saveAllSpas(next);
  return count;
}

/* ----------------------------- Articles (blog) ---------------------------- */

export async function getAllArticles(): Promise<Article[]> {
  return storeRead<Article[]>("articles", ARTICLES_SEED);
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  return (await getAllArticles()).find((a) => a.slug === slug);
}

export async function saveAllArticles(articles: Article[]): Promise<void> {
  await storeWrite("articles", articles);
}

export async function upsertArticle(article: Article): Promise<void> {
  const all = await getAllArticles();
  const idx = all.findIndex((a) => a.slug === article.slug);
  if (idx >= 0) all[idx] = article;
  else all.unshift(article);
  await saveAllArticles(all);
}

export async function deleteArticle(slug: string): Promise<void> {
  const all = await getAllArticles();
  await saveAllArticles(all.filter((a) => a.slug !== slug));
}

/* ------------------------------- Avis clients ----------------------------- */

export async function getAllReviews(): Promise<Review[]> {
  return storeRead<Review[]>("reviews", REVIEWS_SEED);
}

/** Avis affichés sur une fiche : globaux + ceux du modèle, publiés. */
export async function getReviewsForProduct(slug: string): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter(
    (r) => r.published && (!r.productSlug || r.productSlug === slug),
  );
}

export async function saveAllReviews(reviews: Review[]): Promise<void> {
  await storeWrite("reviews", reviews);
}

export async function upsertReview(review: Review): Promise<void> {
  const all = await getAllReviews();
  const idx = all.findIndex((r) => r.id === review.id);
  if (idx >= 0) all[idx] = review;
  else all.unshift(review);
  await saveAllReviews(all);
}

export async function deleteReview(id: string): Promise<void> {
  const all = await getAllReviews();
  await saveAllReviews(all.filter((r) => r.id !== id));
}

/** Supprime plusieurs avis d'un coup. Renvoie le nombre supprimé. */
export async function deleteReviews(ids: string[]): Promise<number> {
  const target = new Set(ids);
  const all = await getAllReviews();
  const next = all.filter((r) => !target.has(r.id));
  await saveAllReviews(next);
  return all.length - next.length;
}

/** Publie ou masque plusieurs avis d'un coup. Renvoie le nombre modifié. */
export async function setReviewsPublished(
  ids: string[],
  published: boolean,
): Promise<number> {
  const target = new Set(ids);
  const all = await getAllReviews();
  let count = 0;
  const next = all.map((r) => {
    if (!target.has(r.id)) return r;
    count++;
    return { ...r, published };
  });
  await saveAllReviews(next);
  return count;
}

/* ----------------------------- Réglages du site --------------------------- */

export async function getSettings(): Promise<SiteSettings> {
  const raw = await storeRead<Partial<SiteSettings>>("settings", SETTINGS_SEED);
  return {
    ...defaultSettings,
    ...raw,
    stats: { ...defaultSettings.stats, ...(raw.stats ?? {}) },
  };
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  await storeWrite("settings", settings);
}

/* --------------------------- Messages de contact -------------------------- */

export async function getAllMessages(): Promise<ContactMessage[]> {
  return storeRead<ContactMessage[]>("messages", []);
}

async function saveAllMessages(messages: ContactMessage[]): Promise<void> {
  await storeWrite("messages", messages);
}

export async function addMessage(message: ContactMessage): Promise<void> {
  const all = await getAllMessages();
  all.unshift(message);
  await saveAllMessages(all);
}

export async function deleteMessage(id: string): Promise<void> {
  const all = await getAllMessages();
  await saveAllMessages(all.filter((m) => m.id !== id));
}

export async function setMessageRead(id: string, read: boolean): Promise<void> {
  const all = await getAllMessages();
  const idx = all.findIndex((m) => m.id === id);
  if (idx >= 0) {
    all[idx].read = read;
    await saveAllMessages(all);
  }
}

/** Nombre de messages non lus (pour le badge de notification admin). */
export async function getUnreadMessageCount(): Promise<number> {
  return (await getAllMessages()).filter((m) => !m.read).length;
}

/* ----------------------------- Config du devis ---------------------------- */

export async function getDevisConfig(): Promise<DevisConfig> {
  const raw = await storeRead<Partial<DevisConfig>>("devis", DEVIS_SEED);
  return {
    ...defaultDevisConfig,
    ...raw,
    lines: raw.lines ?? defaultDevisConfig.lines,
  };
}

export async function saveDevisConfig(config: DevisConfig): Promise<void> {
  await storeWrite("devis", config);
}

/* --------------------------- Demandes de devis ---------------------------- */

export async function getAllDevisRequests(): Promise<DevisRequest[]> {
  return storeRead<DevisRequest[]>("devis-requests", []);
}

async function saveAllDevisRequests(requests: DevisRequest[]): Promise<void> {
  await storeWrite("devis-requests", requests);
}

export async function getDevisRequest(
  id: string,
): Promise<DevisRequest | undefined> {
  return (await getAllDevisRequests()).find((r) => r.id === id);
}

export async function addDevisRequest(request: DevisRequest): Promise<void> {
  const all = await getAllDevisRequests();
  all.unshift(request);
  await saveAllDevisRequests(all);
}

export async function updateDevisRequest(
  id: string,
  patch: Partial<DevisRequest>,
): Promise<void> {
  const all = await getAllDevisRequests();
  const idx = all.findIndex((r) => r.id === id);
  if (idx >= 0) {
    all[idx] = { ...all[idx], ...patch };
    await saveAllDevisRequests(all);
  }
}

export async function deleteDevisRequest(id: string): Promise<void> {
  const all = await getAllDevisRequests();
  await saveAllDevisRequests(all.filter((r) => r.id !== id));
}

/* ----------------------- Accessoires (complémentaires) -------------------- */

export async function getAllAccessoires(): Promise<Accessoire[]> {
  return storeRead<Accessoire[]>("accessoires", ACCESSOIRES_SEED);
}

export async function getAccessoireById(
  id: string,
): Promise<Accessoire | undefined> {
  return (await getAllAccessoires()).find((a) => a.id === id);
}

async function saveAllAccessoires(items: Accessoire[]): Promise<void> {
  await storeWrite("accessoires", items);
}

export async function upsertAccessoire(item: Accessoire): Promise<void> {
  const all = await getAllAccessoires();
  const idx = all.findIndex((a) => a.id === item.id);
  if (idx >= 0) all[idx] = item;
  else all.push(item);
  await saveAllAccessoires(all);
}

export async function deleteAccessoire(id: string): Promise<void> {
  const all = await getAllAccessoires();
  await saveAllAccessoires(all.filter((a) => a.id !== id));
}

/* ------------------------------ Gammes / catégories ----------------------- */

export async function getGammes(): Promise<string[]> {
  const list = await storeRead<string[]>("gammes", GAMMES_SEED);
  return Array.isArray(list) && list.length ? list : [...defaultGammes];
}

export async function saveGammes(gammes: string[]): Promise<void> {
  const clean = gammes.map((g) => g.trim()).filter(Boolean);
  await storeWrite("gammes", clean);
}
