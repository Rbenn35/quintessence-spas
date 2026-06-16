/**
 * Rendu de la fiche technique A4 (design « C2 » validé) à partir des données
 * produit en direct. Source unique : utilisée pour l'aperçu back-office et la
 * génération PDF. Toute modification du produit se reflète automatiquement.
 */
import {
  prixApresRemise,
  remiseEffectivePct,
  type Spa,
} from "./spas";
import { site } from "./site";

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

/** Exclut les lignes « Non inclus ». */
const estInclus = ([, v]: [string, string]) =>
  !/^non inclus/i.test(String(v).trim());

type Groupe = { groupe: string; items: [string, string][] };

/** Caractéristiques réelles, sinon fallback synthétique depuis les champs de base. */
function specGroups(s: Spa): Groupe[] {
  if (s.caracteristiques?.length) return s.caracteristiques;
  const dims = `${s.dimensions.largeur} × ${s.dimensions.profondeur} × ${s.dimensions.hauteur} cm`;
  const base: Groupe = {
    groupe: "Caractéristiques",
    items: [
      ["Gamme", s.gamme],
      ["Nombre de places", `${s.places} places`],
      ["Hydrojets", `${s.jets} hydrojets`],
      ["Dimensions", dims],
      ["Énergie / isolation", s.consommation],
    ],
  };
  const pf: Groupe | null = s.pointsForts?.length
    ? { groupe: "Points forts", items: s.pointsForts.map((p) => ["", p]) }
    : null;
  return pf ? [base, pf] : [base];
}

function renderGroup(groupe: string, items: [string, string][]): string {
  return `<div class="grp"><h4>${groupe}</h4>${items
    .map(([k, v]) =>
      k
        ? `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`
        : `<div class="row pf"><span class="v">${v}</span></div>`,
    )
    .join("")}</div>`;
}

/**
 * Répartit les familles de caractéristiques dans 3 colonnes équilibrées
 * (chaque famille est placée dans la colonne la plus courte). Évite les
 * colonnes vides et réduit la hauteur globale → plus de place pour les photos.
 */
function specColumns(groupes: Groupe[], n = 3): string {
  const cols = Array.from({ length: n }, () => ({ html: "", weight: 0 }));
  for (const g of groupes) {
    const items = g.items.filter(estInclus);
    if (!items.length) continue;
    let idx = 0;
    for (let i = 1; i < n; i++) if (cols[i].weight < cols[idx].weight) idx = i;
    cols[idx].html += renderGroup(g.groupe, items);
    cols[idx].weight += items.length + 2; // ~2 lignes pour l'en-tête
  }
  return cols.map((c) => `<div class="col">${c.html}</div>`).join("");
}

/** Bandeau de 2 photos complémentaires (une seule rangée) sous les specs. */
function collage(extras: string[]): string {
  const ph = extras.slice(0, 2);
  if (!ph.length) return "";
  const cells = ph.map((p) => `<div><img src="${p}" alt=""></div>`).join("");
  return `<div class="collage" style="grid-template-columns:repeat(${ph.length},1fr)">${cells}</div>`;
}

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const STYLE = `*{margin:0;padding:0;box-sizing:border-box}html,body{background:#9aa6ad}
@page{size:A4;margin:0}
.page{width:210mm;height:297mm;background:#fff;position:relative;overflow:hidden;margin:0 auto;display:flex;flex-direction:column;font-family:'Inter',sans-serif;color:#13313d}
@media screen{body{padding:24px 0}.page{box-shadow:0 8px 40px rgba(0,0,0,.25)}}
@media print{html,body{background:#fff}body{padding:0}.page{box-shadow:none}}
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
.grp{margin-bottom:3.5mm}
.grp h4{font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#1c6e8e;font-weight:700;border-bottom:1px solid #dbe7ec;padding-bottom:1.2mm;margin-bottom:1.4mm}
.row{font-size:8pt;padding:.8mm 0;border-bottom:1px dotted #e4eaed}
.row .k{color:#557079;display:block;font-size:7pt}
.row .v{color:#13313d;font-weight:600}
.row.pf .v{font-weight:500}
.row.pf .v::before{content:"› ";color:#1c6e8e;font-weight:700}
.specs{flex-shrink:0;display:flex;gap:8mm}
.col{flex:1;min-width:0}
.collage{display:grid;gap:3mm;flex:1 1 auto;min-height:46mm;max-height:82mm;margin:5mm 0}
.collage>div{overflow:hidden;border-radius:2mm;background:#dbe7ec}
.collage img{width:100%;height:100%;object-fit:cover;display:block}
.ftr{display:flex;flex-shrink:0;justify-content:space-between;font-size:7.5pt;color:#557079;border-top:1px solid #dbe7ec;padding:3mm 14mm;background:#fff}
.ftr b{color:#1c6e8e}`;

export interface FicheOptions {
  /** Préfixe des URLs d'images/logo (origine du site). */
  baseUrl: string;
  dateLabel?: string;
  /** Ajoute un bouton « Enregistrer en PDF » + impression auto (page publique). */
  download?: boolean;
}

/** Génère le HTML complet (A4) de la fiche technique d'un spa. */
export function renderFicheTechnique(spa: Spa, opts: FicheOptions): string {
  const base = opts.baseUrl.replace(/\/$/, "");
  const dateLabel = opts.dateLabel ?? "";
  const dims = `${spa.dimensions.largeur} × ${spa.dimensions.profondeur} × ${spa.dimensions.hauteur} cm`;
  const ref = `QS-${spa.slug.toUpperCase()}`;
  const photos = (spa.photos ?? []).map((p) => `${base}${p}`);
  const hero = photos[0];
  const extras = photos.slice(1);
  const prixFinal = prixApresRemise(spa);
  const remise = remiseEffectivePct(spa);

  const heroBg = hero
    ? `<img class="bg" src="${hero}" alt="${spa.name}">`
    : `<div class="ph-empty"></div>`;

  const badge =
    prixFinal == null
      ? `<div class="lbl">Tarif</div><div class="sur">Sur devis</div>`
      : remise != null && spa.prixIndicatif != null
        ? `<div class="lbl">Prix promo</div><div class="old">${euro(spa.prixIndicatif)}</div><div class="now">${euro(prixFinal)}</div>`
        : `<div class="lbl">À partir de</div><div class="now">${euro(prixFinal)}</div>`;

  const tag = dateLabel
    ? `Fiche technique · ${ref} · ${dateLabel}`
    : `Fiche technique · ${ref}`;

  const body = `
  <div class="hero">${heroBg}<div class="grad"></div>
    <div class="htop">
      <div class="brand"><img src="${base}/brand/logo-hero-white.png" alt="${site.name}"></div>
      <div class="tag">${tag}</div>
    </div>
    <div class="hbot">
      <div class="ttl"><h1>${spa.name}</h1><div class="gm">Gamme ${spa.gamme}</div><p>${spa.accroche}</p></div>
      <div class="badge">${badge}</div>
    </div>
  </div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${spa.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${spa.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val sm">${dims}</div></div>
    <div><div class="lbl">Énergie / isolation</div><div class="val sm">${spa.consommation}</div></div>
  </div>
  <div class="content"><div class="specs">${specColumns(specGroups(spa))}</div>${collage(extras)}</div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url.replace(/^https?:\/\//, "")} · ${site.email}</span></div>`;

  const dlStyle = opts.download
    ? `.dl-bar{position:fixed;top:16px;right:16px;z-index:50;font-family:'Inter',sans-serif}.dl-bar button{background:#1c6e8e;color:#fff;border:0;border-radius:40px;padding:12px 22px;font-size:14px;font-weight:600;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25)}.dl-bar button:hover{background:#14566e}@media print{.dl-bar{display:none}}`
    : "";
  const dlBar = opts.download
    ? `<div class="dl-bar"><button onclick="window.print()">⬇ Enregistrer en PDF</button></div><script>window.addEventListener("load",function(){setTimeout(function(){window.print()},500)})</script>`
    : "";

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Fiche technique — ${spa.name}</title>${FONTS}<style>${STYLE}${dlStyle}</style></head><body><div class="page">${body}</div>${dlBar}</body></html>`;
}
