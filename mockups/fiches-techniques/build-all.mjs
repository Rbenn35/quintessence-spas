/**
 * Génère la fiche technique C2 pour TOUS les spas (données réelles de
 * data/spas.json) + une page index-all.html de vérification.
 * Exécuter : node mockups/fiches-techniques/build-all.mjs
 * Images servies par le dev server (http://localhost:3000).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = dirname(fileURLToPath(import.meta.url));
const ROOT = join(OUT, "..", "..");
const BASE = "http://localhost:3000";

const spas = JSON.parse(readFileSync(join(ROOT, "data", "spas.json"), "utf8"));

const site = {
  name: "Quintessence Spas",
  tagline: "Spas rigides premium · France",
  email: "contact@quintessencespas.com",
  url: "quintessencespas.com",
};
const today = "Juin 2026";
const euro = (n) => `${n.toLocaleString("fr-FR")} €`;

/* ---- Logique de prix (alignée sur src/lib/spas.ts) ---- */
function prixFinalOf(s) {
  if (s.prixIndicatif == null) return null;
  if (
    typeof s.prixPromo === "number" &&
    s.prixPromo > 0 &&
    s.prixPromo < s.prixIndicatif
  )
    return s.prixPromo;
  if (!s.remisePct) return s.prixIndicatif;
  return Math.round(s.prixIndicatif * (1 - s.remisePct / 100));
}
function remisePctOf(s) {
  if (s.prixIndicatif == null || s.prixIndicatif <= 0) return null;
  const f = prixFinalOf(s);
  if (f == null || f >= s.prixIndicatif) return null;
  return Math.round((1 - f / s.prixIndicatif) * 100);
}

/* ---- Caractéristiques : réelles, sinon fallback synthétique ---- */
const estInclus = ([, v]) => !/^non inclus/i.test(String(v).trim());
function specGroups(s) {
  if (s.caracteristiques?.length) return s.caracteristiques;
  const dims = `${s.dimensions.largeur} × ${s.dimensions.profondeur} × ${s.dimensions.hauteur} cm`;
  const base = {
    groupe: "Caractéristiques",
    items: [
      ["Gamme", s.gamme],
      ["Nombre de places", `${s.places} places`],
      ["Hydrojets", `${s.jets} hydrojets`],
      ["Dimensions", dims],
      ["Énergie / isolation", s.consommation],
    ],
  };
  const pf = s.pointsForts?.length
    ? { groupe: "Points forts", items: s.pointsForts.map((p) => ["", p]) }
    : null;
  return pf ? [base, pf] : [base];
}
function renderGroup(groupe, items) {
  return `<div class="grp"><h4>${groupe}</h4>${items
    .map(([k, v]) =>
      k
        ? `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`
        : `<div class="row pf"><span class="v">${v}</span></div>`,
    )
    .join("")}</div>`;
}

/** 3 colonnes équilibrées (chaque famille dans la colonne la plus courte). */
function specRowsFiche(groupes, n = 3) {
  const cols = Array.from({ length: n }, () => ({ html: "", weight: 0 }));
  for (const g of groupes) {
    const items = g.items.filter(estInclus);
    if (!items.length) continue;
    let idx = 0;
    for (let i = 1; i < n; i++) if (cols[i].weight < cols[idx].weight) idx = i;
    cols[idx].html += renderGroup(g.groupe, items);
    cols[idx].weight += items.length + 2;
  }
  return cols.map((c) => `<div class="col">${c.html}</div>`).join("");
}

/* ---- Collage adaptatif selon le nombre de photos complémentaires ---- */
function collage(extras) {
  const ph = extras.slice(0, 2);
  if (!ph.length) return "";
  const cells = ph.map((p) => `<div><img src="${p}" alt=""></div>`).join("");
  return `<div class="collage" style="grid-template-columns:repeat(${ph.length},1fr)">${cells}</div>`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;
const RESET = `*{margin:0;padding:0;box-sizing:border-box}html,body{background:#9aa6ad}
@page{size:A4;margin:0}
.page{width:210mm;height:297mm;background:#fff;position:relative;overflow:hidden;margin:0 auto;display:flex;flex-direction:column}
@media screen{body{padding:24px 0}.page{box-shadow:0 8px 40px rgba(0,0,0,.25)}}
@media print{html,body{background:#fff}body{padding:0}.page{box-shadow:none}}`;

const CSS = `
  .page{font-family:'Inter',sans-serif;color:#13313d}
  .hero{position:relative;height:86mm;flex-shrink:0;overflow:hidden;background:#0f2932;display:flex;flex-direction:column;padding:10mm 14mm 9mm}
  .hero .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.88}
  .hero .ph-empty{position:absolute;inset:0;background:linear-gradient(135deg,#1c6e8e,#0f2932)}
  .hero .grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,41,50,.55) 0%,rgba(15,41,50,0) 34%,rgba(15,41,50,.85) 100%)}
  .hero .htop,.hero .hbot{position:relative;z-index:2;display:flex;justify-content:space-between}
  .hero .htop{align-items:flex-start}
  .hero .hbot{align-items:flex-end;margin-top:auto;gap:10mm}
  .brand img{height:13mm;display:block;filter:drop-shadow(0 1mm 3mm rgba(0,0,0,.4))}
  .hero .tag{color:#fff;font-size:7.5pt;letter-spacing:.16em;text-transform:uppercase;opacity:.92;text-align:right;padding-top:2mm}
  .hero .ttl{color:#fff}
  .hero .ttl h1{font-family:'Fraunces',serif;font-size:38pt;font-weight:500;line-height:1}
  .hero .ttl .gm{font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;color:#d8b27a;font-weight:600;margin-top:2.5mm}
  .hero .ttl p{font-size:10pt;opacity:.92;margin-top:1.5mm;max-width:115mm}
  .hero .badge{text-align:right;color:#fff;white-space:nowrap}
  .hero .badge .lbl{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#d8b27a}
  .hero .badge .old{font-size:10pt;opacity:.7;text-decoration:line-through}
  .hero .badge .now{font-family:'Fraunces',serif;font-size:26pt;font-weight:600}
  .hero .badge .sur{font-family:'Fraunces',serif;font-size:20pt;font-weight:600}
  .band{display:flex;flex-shrink:0;justify-content:space-around;padding:4.5mm 14mm;background:#0c2027;color:#fff;gap:6mm}
  .band div{text-align:center}
  .band .lbl{font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:#9fc0cc}
  .band .val{font-family:'Fraunces',serif;font-size:14pt;margin-top:.5mm}
  .band .val.sm{font-size:9.5pt;font-family:'Inter',sans-serif;font-weight:500;line-height:1.25}
  .content{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;padding:6mm 14mm 0}
  .specs{flex-shrink:0;display:flex;gap:8mm}
  .col{flex:1;min-width:0}
  .grp{margin-bottom:3.5mm}
  .grp h4{font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#1c6e8e;font-weight:700;border-bottom:1px solid #dbe7ec;padding-bottom:1.2mm;margin-bottom:1.4mm}
  .row{font-size:8pt;padding:.8mm 0;border-bottom:1px dotted #e4eaed}
  .row .k{color:#557079;display:block;font-size:7pt}
  .row .v{color:#13313d;font-weight:600}
  .row.pf .v{font-weight:500}
  .row.pf .v::before{content:"› ";color:#1c6e8e;font-weight:700}
  .collage{display:grid;gap:3mm;flex:1 1 auto;min-height:46mm;max-height:82mm;margin:5mm 0}
  .collage>div{overflow:hidden;border-radius:2mm;background:#dbe7ec}
  .collage img{width:100%;height:100%;object-fit:cover;display:block}
  .ftr{display:flex;flex-shrink:0;justify-content:space-between;font-size:7.5pt;color:#557079;border-top:1px solid #dbe7ec;padding:3mm 14mm;background:#fff}
  .ftr b{color:#1c6e8e}`;

function ficheC2(s) {
  const dims = `${s.dimensions.largeur} × ${s.dimensions.profondeur} × ${s.dimensions.hauteur} cm`;
  const ref = `QS-${s.slug.toUpperCase()}`;
  const photos = (s.photos ?? []).map((p) => `${BASE}${p}`);
  const hero = photos[0];
  const extras = photos.slice(1);
  const prixFinal = prixFinalOf(s);
  const remise = remisePctOf(s);

  const heroBg = hero
    ? `<img class="bg" src="${hero}" alt="${s.name}">`
    : `<div class="ph-empty"></div>`;

  const badge =
    prixFinal == null
      ? `<div class="lbl">Tarif</div><div class="sur">Sur devis</div>`
      : remise != null
        ? `<div class="lbl">Prix promo</div><div class="old">${euro(s.prixIndicatif)}</div><div class="now">${euro(prixFinal)}</div>`
        : `<div class="lbl">À partir de</div><div class="now">${euro(prixFinal)}</div>`;

  const body = `
  <div class="hero">${heroBg}<div class="grad"></div>
    <div class="htop">
      <div class="brand"><img src="${BASE}/brand/logo-hero-white.png" alt="Quintessence Spas"></div>
      <div class="tag">Fiche technique · ${ref} · ${today}</div>
    </div>
    <div class="hbot">
      <div class="ttl"><h1>${s.name}</h1><div class="gm">Gamme ${s.gamme}</div><p>${s.accroche}</p></div>
      <div class="badge">${badge}</div>
    </div>
  </div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${s.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${s.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val sm">${dims}</div></div>
    <div><div class="lbl">Énergie / isolation</div><div class="val sm">${s.consommation}</div></div>
  </div>
  <div class="content"><div class="specs">${specRowsFiche(specGroups(s))}</div>${collage(extras)}</div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url} · ${site.email}</span></div>`;

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Fiche technique — ${s.name}</title>${FONTS}<style>${RESET}${CSS}</style></head><body><div class="page">${body}</div></body></html>`;
}

const generated = [];
for (const s of spas) {
  const file = `fiche-${s.slug}.html`;
  writeFileSync(join(OUT, file), ficheC2(s), "utf8");
  generated.push({ file, name: s.name, slug: s.slug, places: s.places });
}

const index = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Fiches techniques — tous les spas</title>${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0f2932;color:#e8f0f3;padding:32px}
h1{font-family:'Fraunces',serif;font-size:30px;font-weight:500;text-align:center}
.sub{text-align:center;color:#9fc0cc;margin-top:8px;font-size:14px;max-width:760px;margin-inline:auto}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:1360px;margin:34px auto 0}
.cell{background:#13333f;border:1px solid #25525f;border-radius:14px;overflow:hidden}
.bar{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #25525f;gap:10px}
.bar b{font-size:15px}.bar span{font-size:12px;color:#9fc0cc}
.bar a{font-size:12px;color:#d8b27a;text-decoration:none;font-weight:600;white-space:nowrap}
.frame{position:relative;height:640px;overflow:hidden;background:#9aa6ad;display:flex;justify-content:center;padding-top:14px}
.frame iframe{width:210mm;height:297mm;border:0;transform:scale(.62);transform-origin:top center}
@media(max-width:1100px){.grid{grid-template-columns:1fr}}
</style></head><body>
<h1>Fiches techniques — tous les spas</h1>
<p class="sub">Template C2 appliqué à chaque spa avec ses données réelles (${generated.length} modèles). Vérifie chaque fiche, puis je déploie le bouton « Télécharger la fiche technique » sur les pages produit.</p>
<div class="grid">
${generated
  .map(
    (g) =>
      `<div class="cell"><div class="bar"><div><b>${g.name}</b> <span>— ${g.places} places · /${g.slug}</span></div><a href="${g.file}" target="_blank">Plein écran →</a></div><div class="frame"><iframe src="${g.file}" scrolling="no"></iframe></div></div>`,
  )
  .join("\n")}
</div></body></html>`;
writeFileSync(join(OUT, "index-all.html"), index, "utf8");

console.log(`OK — ${generated.length} fiches + index-all.html générées`);
