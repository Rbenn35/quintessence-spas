import fs from "fs/promises";
import fssync from "fs";
import path from "path";

/**
 * Couche de stockage unifiée.
 * - Production (Vercel) : base de données Upstash Redis / Vercel KV, activée dès
 *   que KV_REST_API_URL + KV_REST_API_TOKEN sont présents.
 * - Développement local : fichiers JSON dans /data (modifiables, persistants).
 *
 * Chaque « entité » (spas, articles, messages…) est une clé portant son nom.
 * La valeur initiale (fallback) sert quand la base/le fichier est vide :
 * en prod, le contenu commité dans /data est importé au build et passé en
 * fallback, donc le site affiche le vrai catalogue dès le premier déploiement.
 */
const DATA_DIR = path.join(process.cwd(), "data");
// Compatible avec les deux conventions de nommage (Vercel KV / Upstash Marketplace).
const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const KV_TOKEN =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const useRedis = !!KV_URL && !!KV_TOKEN;

type RedisLike = {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown): Promise<unknown>;
};

let _redis: RedisLike | null = null;
async function redis(): Promise<RedisLike> {
  if (!_redis) {
    const { Redis } = await import("@upstash/redis");
    _redis = new Redis({
      url: KV_URL as string,
      token: KV_TOKEN as string,
    }) as unknown as RedisLike;
  }
  return _redis;
}

/** Lit une entité : base (prod) ou fichier (dev), sinon la valeur initiale. */
export async function storeRead<T>(name: string, fallback: T): Promise<T> {
  if (useRedis) {
    const v = await (await redis()).get<T>(name);
    return v == null ? fallback : v;
  }
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fssync.existsSync(file)) return fallback;
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch {
    return fallback;
  }
}

/** Écrit une entité : base (prod) ou fichier (dev). */
export async function storeWrite<T>(name: string, data: T): Promise<void> {
  if (useRedis) {
    await (await redis()).set(name, data);
    return;
  }
  if (!fssync.existsSync(DATA_DIR)) {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
  await fs.writeFile(
    path.join(DATA_DIR, `${name}.json`),
    JSON.stringify(data, null, 2),
    "utf8",
  );
}
