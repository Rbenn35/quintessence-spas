// ============================================================
// Génère 1 article SEO/GEO B2B (via Claude) et le publie sur le site
// Quintessence Spas (endpoint /api/articles/publish).
// Lancé chaque lundi par GitHub Actions (.github/workflows/weekly-article.yml).
//
// Variables d'environnement requises :
//   ANTHROPIC_API_KEY  — clé API Anthropic
//   PUBLISH_SECRET     — même valeur que la variable Vercel PUBLISH_SECRET
//   SITE_URL           — ex. https://www.quintessencespas.com (optionnel)
// ============================================================

// === MIGRATION PONCTUELLE (TEMPORAIRE — à retirer après exécution) ===
// Réécrit les 6 guides et date les articles existants, puis s'arrête sans
// générer de nouvel article. Déclenché manuellement via "Run workflow".
if (process.env.RUN_MIGRATION !== "0") {
  await import("./migrate-articles.mjs");
  process.exit(0);
}
// === FIN MIGRATION PONCTUELLE ===

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const PUBLISH_SECRET = process.env.PUBLISH_SECRET;
const SITE_URL = (process.env.SITE_URL || "https://www.quintessencespas.com").replace(/\/$/, "");

if (!ANTHROPIC_API_KEY || !PUBLISH_SECRET) {
  console.error("❌ Variables manquantes : ANTHROPIC_API_KEY et/ou PUBLISH_SECRET.");
  process.exit(1);
}

// File de sujets B2B (un par semaine, dans l'ordre). Ajoute/retire librement.
const TOPICS = [
  { topic: "Distributeur de spas en France : comment choisir son fournisseur", slug: "choisir-fournisseur-distributeur-spa", kw: ["distributeur spa", "grossiste spa", "fournisseur spa France"] },
  { topic: "Spa pour paysagiste : intégrer le spa dans vos projets d'aménagement", slug: "spa-pour-paysagiste", kw: ["spa pour paysagiste", "aménagement jardin spa", "revendeur spa paysagiste"] },
  { topic: "Spa professionnel pour hôtel et camping : équiper l'hôtellerie de plein air", slug: "spa-professionnel-hotel-camping", kw: ["spa professionnel hôtel", "spa camping", "spa locatif professionnel"] },
  { topic: "Marge et rentabilité de la revente de spas rigides : le calcul complet", slug: "marge-rentabilite-revente-spa", kw: ["marge revente spa", "rentabilité revendeur spa", "prix grossiste spa"] },
  { topic: "Stock de spas en France : pourquoi la disponibilité change tout pour un revendeur", slug: "stock-spa-france-revendeur", kw: ["stock spa France", "livraison spa revendeur", "délai livraison spa"] },
  { topic: "Ouvrir un showroom de spas : conseils pour réussir son point de vente", slug: "ouvrir-showroom-spa", kw: ["showroom spa", "magasin spa", "exposition spa revendeur"] },
  { topic: "Spa rigide vs spa de nage : que proposer à vos clients ?", slug: "spa-rigide-vs-spa-de-nage-revendeur", kw: ["spa rigide vs spa de nage", "choisir spa revendeur", "gamme spa"] },
  { topic: "Formation revendeur spa : ce qu'un nouveau distributeur doit maîtriser", slug: "formation-revendeur-spa", kw: ["formation revendeur spa", "accompagnement distributeur spa", "devenir distributeur spa"] },
];

// 1) Premier sujet dont la page n'existe pas encore sur le site.
async function pickTopic() {
  for (const t of TOPICS) {
    const r = await fetch(`${SITE_URL}/guides/${t.slug}`, { method: "HEAD" });
    if (r.status === 404) return t;
  }
  return null;
}

// 2) Génération via l'API Anthropic (sortie JSON, contenu en HTML).
async function generateArticle(t) {
  const system = `Tu es rédacteur SEO senior pour Quintessence Spas, marque française de spas rigides premium vendus en B2B (revendeurs, piscinistes, paysagistes, hôtels/campings).
Écris en français, ton professionnel et expert, jamais commercial à outrance.
RÈGLES DE TYPOGRAPHIE FRANÇAISE (impératives) :
- N'utilise JAMAIS de tiret cadratin (—) ni de tiret demi-cadratin (–), nulle part : ni dans le titre, ni dans les phrases, ni dans le HTML. Absolument aucun. Pour une incise, utilise la virgule, les parenthèses, ou le deux-points.
- N'utilise AUCUN émoji, nulle part.
- Écriture à la française : espace insécable avant : ; ! ? et %, guillemets français « » si besoin, pas d'anglicismes inutiles.
Optimisation SEO ET GEO (réponses citables par les LLM) :
- "excerpt" doit répondre directement à la question principale en 2-3 phrases avec des chiffres (c'est le chapô "En bref").
- Structure le corps en H2/H3 logiques, paragraphes courts.
- Données chiffrées réalistes (marges 25-40 %, prix 8 000-15 000 € TTC, réponse candidature sous 48 h).
- Maillage interne : au moins un lien vers ${SITE_URL}/revendeur et un vers ${SITE_URL}/spas.
- 800 à 1100 mots. Pas d'invention de certifications ou récompenses.
- Le champ "title" est le titre éditorial SEUL : n'y ajoute PAS le nom de la marque ("Quintessence Spas") ni de séparateur ("|", "·", "—") — le site ajoute déjà la marque automatiquement.
Réponds UNIQUEMENT avec un objet JSON valide (sans balises Markdown), au format :
{"title":"...","meta_desc":"... (max 155 car.)","excerpt":"...","content_html":"<h2>...</h2><p>...</p>... (corps en HTML, SANS la FAQ, SANS le titre H1, balises autorisées: h2,h3,p,ul,ol,li,strong,em,a)","faq":[{"q":"...","a":"..."}]}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system,
      // Sorties structurées : l'API garantit un JSON conforme au schéma.
      output_config: {
        format: {
          type: "json_schema",
          schema: {
            type: "object",
            properties: {
              title: { type: "string" },
              meta_desc: { type: "string" },
              excerpt: { type: "string" },
              content_html: { type: "string" },
              faq: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    q: { type: "string" },
                    a: { type: "string" },
                  },
                  required: ["q", "a"],
                  additionalProperties: false,
                },
              },
            },
            required: ["title", "meta_desc", "excerpt", "content_html", "faq"],
            additionalProperties: false,
          },
        },
      },
      messages: [
        {
          role: "user",
          content: `Rédige l'article sur le sujet : "${t.topic}". Mots-clés cibles : ${t.kw.join(", ")}.`,
        },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Anthropic API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  let txt = data.content.map((b) => b.text || "").join("").trim();
  txt = txt.replace(/^```json\s*/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(txt);
  } catch {
    // Filet de sécurité : extraire le 1er objet JSON du texte.
    const m = txt.match(/\{[\s\S]*\}/);
    if (m) return JSON.parse(m[0]);
    throw new Error(`Réponse Claude non JSON : ${txt.slice(0, 300)}`);
  }
}

// 3) Publication sur le site via l'endpoint sécurisé.
async function publish(t, art) {
  const words = String(art.content_html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
  // Filet de sécurité : retire un éventuel "… | Quintessence Spas" en fin de titre
  // (le site ajoute déjà la marque automatiquement).
  const title = String(art.title)
    .replace(/\s*[|·–—-]\s*Quintessence\s*Spas\s*$/i, "")
    .trim();
  const payload = {
    slug: t.slug,
    title,
    category: "Revendeur",
    publishedAt: new Date().toISOString().slice(0, 10),
    excerpt: art.excerpt,
    content: art.content_html,
    faq: Array.isArray(art.faq) ? art.faq : [],
    metaTitle: title,
    metaDescription: art.meta_desc,
    readMin: Math.max(3, Math.round(words / 200)),
    cover: "/products/lucerne-installe.jpg",
    published: true,
  };
  const res = await fetch(`${SITE_URL}/api/articles/publish`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${PUBLISH_SECRET}` },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Publish ${res.status}: ${await res.text()}`);
  return res.json();
}

// --- Exécution ---
const topic = await pickTopic();
if (!topic) {
  console.log("ℹ️ Tous les sujets sont déjà publiés. Ajoute des sujets dans TOPICS.");
  process.exit(0);
}
console.log(`📝 Sujet retenu : ${topic.topic}`);
const article = await generateArticle(topic);
console.log(`✍️  Article généré : "${article.title}" (${(article.faq || []).length} FAQ) — publication…`);
await publish(topic, article);
console.log(`✅ Publié sur ${SITE_URL}/guides/${topic.slug} — "${article.title}"`);
