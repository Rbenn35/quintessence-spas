// ============================================================
// MIGRATION PONCTUELLE (à supprimer après usage).
// Réécrit les 6 guides grand public à partir de data/articles.json
// (contenu enrichi + dates) et date les 2 articles Revendeur déjà publiés.
// Lancée par .github/workflows/migrate-articles.yml (workflow_dispatch),
// qui dispose du secret PUBLISH_SECRET.
// ============================================================
import fs from "fs";

const SITE_URL = (process.env.SITE_URL || "https://www.quintessencespas.com").replace(/\/$/, "");
const PUBLISH_SECRET = process.env.PUBLISH_SECRET;
if (!PUBLISH_SECRET) {
  console.error("❌ PUBLISH_SECRET manquant.");
  process.exit(1);
}

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${PUBLISH_SECRET}`,
};

// Dates de publication réelles des articles Revendeur déjà en ligne.
const REVENDEUR_DATES = {
  "choisir-fournisseur-distributeur-spa": "2026-06-17",
  "spa-pour-paysagiste": "2026-06-22",
};

async function publishArticle(a) {
  const payload = {
    slug: a.slug,
    title: a.title,
    category: a.category,
    excerpt: a.excerpt,
    content: a.content,
    faq: a.faq || [],
    tint: a.tint,
    readMin: a.readMin,
    publishedAt: a.publishedAt,
    published: a.published !== false,
    ...(a.cover ? { cover: a.cover } : {}),
    ...(a.metaTitle ? { metaTitle: a.metaTitle } : {}),
    ...(a.metaDescription ? { metaDescription: a.metaDescription } : {}),
  };
  const res = await fetch(`${SITE_URL}/api/articles/publish`, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`publish ${a.slug} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

async function patchDate(slug, publishedAt) {
  const res = await fetch(`${SITE_URL}/api/articles/publish`, {
    method: "POST",
    headers,
    body: JSON.stringify({ patchDate: true, slug, publishedAt }),
  });
  if (!res.ok) throw new Error(`patchDate ${slug} -> ${res.status}: ${await res.text()}`);
  return res.json();
}

// --- Exécution ---
const articles = JSON.parse(fs.readFileSync("data/articles.json", "utf8"));

for (const a of articles) {
  const r = await publishArticle(a);
  console.log(`✅ Réécrit : ${a.slug} (publié le ${a.publishedAt})`, JSON.stringify(r));
}

for (const [slug, date] of Object.entries(REVENDEUR_DATES)) {
  try {
    const r = await patchDate(slug, date);
    console.log(`📅 Daté : ${slug} -> ${date}`, JSON.stringify(r));
  } catch (e) {
    console.log(`⚠️  Date non appliquée pour ${slug} : ${e.message}`);
  }
}

console.log("Migration terminée.");
