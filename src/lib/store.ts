import fs from "fs/promises";
import fssync from "fs";
import path from "path";
import { seedSpas, gammes as defaultGammes, type Spa } from "./spas";
import { seedArticles, type Article } from "./articles";
import { seedReviews, type Review } from "./reviews";
import { defaultSettings, type SiteSettings } from "./settings";
import type { ContactMessage } from "./messages";
import { defaultDevisConfig, type DevisConfig } from "./devis";
import type { DevisRequest } from "./devis-requests";
import { seedAccessoires, type Accessoire } from "./accessoires";

/**
 * Store de contenu (back-office). Les produits sont stockés dans data/spas.json,
 * éditable via l'admin. À la première lecture, le fichier est initialisé à
 * partir des données « seed ».
 *
 * ⚠️ En production serverless, l'écriture fichier n'est pas persistante :
 * brancher une base de données + stockage d'images au déploiement.
 */
const DATA_DIR = path.join(process.cwd(), "data");
const SPAS_FILE = path.join(DATA_DIR, "spas.json");

async function ensureFile(): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  if (!fssync.existsSync(SPAS_FILE)) {
    await fs.writeFile(SPAS_FILE, JSON.stringify(seedSpas, null, 2), "utf8");
  }
}

export async function getAllSpas(): Promise<Spa[]> {
  await ensureFile();
  try {
    const raw = await fs.readFile(SPAS_FILE, "utf8");
    return JSON.parse(raw) as Spa[];
  } catch {
    return seedSpas;
  }
}

export async function getSpaBySlug(slug: string): Promise<Spa | undefined> {
  const all = await getAllSpas();
  return all.find((s) => s.slug === slug);
}

export async function saveAllSpas(spas: Spa[]): Promise<void> {
  await ensureFile();
  await fs.writeFile(SPAS_FILE, JSON.stringify(spas, null, 2), "utf8");
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

const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");

async function ensureArticles(): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  if (!fssync.existsSync(ARTICLES_FILE)) {
    await fs.writeFile(
      ARTICLES_FILE,
      JSON.stringify(seedArticles, null, 2),
      "utf8",
    );
  }
}

export async function getAllArticles(): Promise<Article[]> {
  await ensureArticles();
  try {
    return JSON.parse(await fs.readFile(ARTICLES_FILE, "utf8")) as Article[];
  } catch {
    return seedArticles;
  }
}

export async function getArticleBySlug(
  slug: string,
): Promise<Article | undefined> {
  return (await getAllArticles()).find((a) => a.slug === slug);
}

export async function saveAllArticles(articles: Article[]): Promise<void> {
  await ensureArticles();
  await fs.writeFile(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf8");
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

const REVIEWS_FILE = path.join(DATA_DIR, "reviews.json");

async function ensureReviews(): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  if (!fssync.existsSync(REVIEWS_FILE)) {
    await fs.writeFile(REVIEWS_FILE, JSON.stringify(seedReviews, null, 2), "utf8");
  }
}

export async function getAllReviews(): Promise<Review[]> {
  await ensureReviews();
  try {
    return JSON.parse(await fs.readFile(REVIEWS_FILE, "utf8")) as Review[];
  } catch {
    return seedReviews;
  }
}

/** Avis affichés sur une fiche : globaux + ceux du modèle, publiés. */
export async function getReviewsForProduct(slug: string): Promise<Review[]> {
  const all = await getAllReviews();
  return all.filter(
    (r) => r.published && (!r.productSlug || r.productSlug === slug),
  );
}

export async function saveAllReviews(reviews: Review[]): Promise<void> {
  await ensureReviews();
  await fs.writeFile(REVIEWS_FILE, JSON.stringify(reviews, null, 2), "utf8");
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

/* ----------------------------- Réglages du site --------------------------- */

const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

export async function getSettings(): Promise<SiteSettings> {
  if (!fssync.existsSync(SETTINGS_FILE)) return defaultSettings;
  try {
    const raw = JSON.parse(
      await fs.readFile(SETTINGS_FILE, "utf8"),
    ) as Partial<SiteSettings>;
    return {
      ...defaultSettings,
      ...raw,
      stats: { ...defaultSettings.stats, ...(raw.stats ?? {}) },
    };
  } catch {
    return defaultSettings;
  }
}

export async function saveSettings(settings: SiteSettings): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(settings, null, 2), "utf8");
}

/* --------------------------- Messages de contact -------------------------- */

const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");

export async function getAllMessages(): Promise<ContactMessage[]> {
  if (!fssync.existsSync(MESSAGES_FILE)) return [];
  try {
    return JSON.parse(
      await fs.readFile(MESSAGES_FILE, "utf8"),
    ) as ContactMessage[];
  } catch {
    return [];
  }
}

async function saveAllMessages(messages: ContactMessage[]): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf8");
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

/* ----------------------------- Config du devis ---------------------------- */

const DEVIS_FILE = path.join(DATA_DIR, "devis.json");

export async function getDevisConfig(): Promise<DevisConfig> {
  if (!fssync.existsSync(DEVIS_FILE)) return defaultDevisConfig;
  try {
    const raw = JSON.parse(
      await fs.readFile(DEVIS_FILE, "utf8"),
    ) as Partial<DevisConfig>;
    return {
      ...defaultDevisConfig,
      ...raw,
      lines: raw.lines ?? defaultDevisConfig.lines,
    };
  } catch {
    return defaultDevisConfig;
  }
}

export async function saveDevisConfig(config: DevisConfig): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DEVIS_FILE, JSON.stringify(config, null, 2), "utf8");
}

/* --------------------------- Demandes de devis ---------------------------- */

const DEVIS_REQUESTS_FILE = path.join(DATA_DIR, "devis-requests.json");

export async function getAllDevisRequests(): Promise<DevisRequest[]> {
  if (!fssync.existsSync(DEVIS_REQUESTS_FILE)) return [];
  try {
    return JSON.parse(
      await fs.readFile(DEVIS_REQUESTS_FILE, "utf8"),
    ) as DevisRequest[];
  } catch {
    return [];
  }
}

async function saveAllDevisRequests(requests: DevisRequest[]): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    DEVIS_REQUESTS_FILE,
    JSON.stringify(requests, null, 2),
    "utf8",
  );
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

const ACCESSOIRES_FILE = path.join(DATA_DIR, "accessoires.json");

async function ensureAccessoires(): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  if (!fssync.existsSync(ACCESSOIRES_FILE)) {
    await fs.writeFile(
      ACCESSOIRES_FILE,
      JSON.stringify(seedAccessoires, null, 2),
      "utf8",
    );
  }
}

export async function getAllAccessoires(): Promise<Accessoire[]> {
  await ensureAccessoires();
  try {
    return JSON.parse(
      await fs.readFile(ACCESSOIRES_FILE, "utf8"),
    ) as Accessoire[];
  } catch {
    return seedAccessoires;
  }
}

export async function getAccessoireById(
  id: string,
): Promise<Accessoire | undefined> {
  return (await getAllAccessoires()).find((a) => a.id === id);
}

async function saveAllAccessoires(items: Accessoire[]): Promise<void> {
  await ensureAccessoires();
  await fs.writeFile(ACCESSOIRES_FILE, JSON.stringify(items, null, 2), "utf8");
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

const GAMMES_FILE = path.join(DATA_DIR, "gammes.json");

export async function getGammes(): Promise<string[]> {
  if (!fssync.existsSync(GAMMES_FILE)) return [...defaultGammes];
  try {
    const list = JSON.parse(await fs.readFile(GAMMES_FILE, "utf8")) as string[];
    return Array.isArray(list) && list.length ? list : [...defaultGammes];
  } catch {
    return [...defaultGammes];
  }
}

export async function saveGammes(gammes: string[]): Promise<void> {
  if (!fssync.existsSync(DATA_DIR)) await fs.mkdir(DATA_DIR, { recursive: true });
  const clean = gammes.map((g) => g.trim()).filter(Boolean);
  await fs.writeFile(GAMMES_FILE, JSON.stringify(clean, null, 2), "utf8");
}
