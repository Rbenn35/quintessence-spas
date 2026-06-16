/**
 * Génère 4 propositions de fiche technique A4 (PDF) pour un spa.
 * Données réelles du Prado. Exécuter : node mockups/fiches-techniques/build.mjs
 * Les images/logo sont servies par le dev server (http://localhost:3000).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = dirname(fileURLToPath(import.meta.url));
const BASE = "http://localhost:3000";

const spa = {
  name: "Prado",
  gamme: "AquaLuxe",
  accroche: "Le spa familial 6 places, complet et équilibré.",
  places: 6,
  jets: 33,
  dims: "200 × 200 × 83 cm",
  poidsEau: "≈ 1 100 L",
  conso: "Réchauffeur 2 kW · isolation renforcée",
  prix: 13520,
  prixPromo: 10140, // -25 %
  ref: "QS-PRADO-6",
  photo: `${BASE}/products/prado-1.jpg`,
  photo2: `${BASE}/products/prado-3.jpg`,
  gallery: [2, 3, 4, 5, 6].map((n) => `${BASE}/products/prado-${n}.jpg`),
  logo: `${BASE}/brand/logo.png`,
  logoHero: `${BASE}/brand/logo-hero-white.png`,
  logoLight: `${BASE}/brand/quintessence-spas-pour-fond-sombre-transparent.png`,
  pointsForts: [
    "6 places, 6 appuie-têtes",
    "33 hydrojets multizones",
    "Électronique Gecko YJ3, réchauffeur 2 kW",
    "Lampe UV-C : 99,9 % des germes détruits",
    "Isolation renforcée, pré-équipement PAC",
    "Éclairage LED et sous-marin",
  ],
  inclus: [
    "6 appuie-têtes",
    "Filtre et lampe UV-C",
    "Fontaine XXL",
    "By-pass pompe à chaleur",
    "Porte de meuble avec serrure",
    "Logo sur tablier",
  ],
  colors: [
    { type: "Coque", name: "Blanc nacré", hex: "#f1f2ef" },
    { type: "Tablier", name: "Noir", hex: "#15181b" },
  ],
  caracteristiques: [
    {
      groupe: "Général",
      items: [
        ["Revêtement de coque", "Artitech Acrylic"],
        ["Couleur de coque", "Blanche"],
        ["Contours", "Noirs"],
        ["Structure de base", "Base ABS standard"],
        ["Appuie-têtes", "6 appuie-têtes"],
      ],
    },
    {
      groupe: "Massage et hydrothérapie",
      items: [
        ["Hydrojets", "33 hydrojets"],
        ["Pompe de massage principale", "1 500 W"],
        ["Pompe de massage secondaire", "750 W"],
        ["Pompe de circulation", "263 W"],
      ],
    },
    {
      groupe: "Électronique et chauffage",
      items: [
        ["Boîtier électronique", "Gecko YJ3"],
        ["Réchauffeur", "2 kW"],
        ["Clavier principal", "Gecko IN.K336"],
        ["Clavier auxiliaire", "Gecko IN.K120"],
      ],
    },
    {
      groupe: "Éclairage et ambiance",
      items: [
        ["Éclairage niveau d'eau", "LED level light"],
        ["Éclairage sous-marin", "Inclus"],
        ["Fontaine XXL", "Incluse"],
        ["Éclairage d'angle extérieur", "Non inclus"],
      ],
    },
    {
      groupe: "Isolation",
      items: [
        ["Isolation de cuve", "18 à 20 mm"],
        ["Isolation du tablier", "Incluse"],
        ["Isolation de la base ABS", "Incluse"],
        ["Isolation du meuble", "Incluse"],
      ],
    },
    {
      groupe: "Filtration et traitement de l'eau",
      items: [
        ["Filtration", "Filtre inclus"],
        ["Désinfection", "Lampe UV intégrée"],
        ["Ozone", "Remplacé par lampe UV"],
      ],
    },
    {
      groupe: "Équipements complémentaires",
      items: [
        ["Pré-équipement PAC", "By-pass inclus"],
        ["Logo sur tablier", "Inclus"],
        ["Porte de meuble", "Avec serrure"],
        ["Système audio Bluetooth", "Non inclus"],
      ],
    },
  ],
};

const site = {
  name: "Quintessence Spas",
  tagline: "Spas rigides premium · France",
  email: "contact@quintessencespas.com",
  url: "quintessencespas.com",
};

const euro = (n) => `${n.toLocaleString("fr-FR")} €`;
const today = "Juin 2026";

/* Polices de marque (Fraunces serif + Inter sans) via Google Fonts. */
const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;

const RESET = `*{margin:0;padding:0;box-sizing:border-box}html,body{background:#9aa6ad}
@page{size:A4;margin:0}
.page{width:210mm;height:297mm;background:#fff;position:relative;overflow:hidden;margin:0 auto}
@media screen{body{padding:24px 0}.page{box-shadow:0 8px 40px rgba(0,0,0,.25)}}
@media print{html,body{background:#fff}body{padding:0}.page{box-shadow:none}}`;

function specRows(groupes) {
  return groupes
    .map(
      (g) => `<div class="grp"><h4>${g.groupe}</h4>${g.items
        .map(
          ([k, v]) =>
            `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`,
        )
        .join("")}</div>`,
    )
    .join("");
}

function wrap(title, css, body) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>${title}</title>${FONTS}<style>${RESET}${css}</style></head><body><div class="page">${body}</div></body></html>`;
}

/* ============================================================ TEMPLATE A
   « Éditorial classique » — sobre, premium, serif, accent bleu eau. */
function templateA() {
  const css = `
  .page{font-family:'Inter',sans-serif;color:#13313d;padding:14mm 14mm 0}
  .hdr{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:1.5px solid #13313d;padding-bottom:6mm}
  .hdr img{height:13mm}
  .hdr .meta{text-align:right;font-size:8pt;color:#557079;line-height:1.5}
  .hdr .meta b{color:#13313d}
  .title{display:flex;justify-content:space-between;align-items:flex-end;margin-top:7mm}
  .title .eyebrow{font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;color:#1c6e8e;font-weight:600}
  .title h1{font-family:'Fraunces',serif;font-size:34pt;font-weight:500;line-height:1;margin-top:2mm}
  .title p{font-size:9.5pt;color:#557079;margin-top:2mm}
  .title .price{text-align:right}
  .title .price .from{font-size:8pt;color:#557079}
  .title .price .old{font-size:10pt;color:#8aa0a8;text-decoration:line-through}
  .title .price .now{font-family:'Fraunces',serif;font-size:22pt;color:#1c6e8e;font-weight:600}
  .hero{margin-top:6mm;height:52mm;border-radius:4mm;overflow:hidden;background:#dbe7ec}
  .hero img{width:100%;height:100%;object-fit:cover}
  .band{display:grid;grid-template-columns:repeat(4,1fr);gap:0;margin-top:6mm;border:1px solid #dbe7ec;border-radius:3mm;overflow:hidden}
  .band div{padding:3.5mm 4mm;border-right:1px solid #dbe7ec}
  .band div:last-child{border-right:0}
  .band .lbl{font-size:7pt;letter-spacing:.12em;text-transform:uppercase;color:#557079}
  .band .val{font-family:'Fraunces',serif;font-size:14pt;color:#13313d;margin-top:1mm}
  .specs{columns:2;column-gap:9mm;margin-top:6mm}
  .grp{break-inside:avoid;margin-bottom:4mm}
  .grp h4{font-size:8pt;letter-spacing:.1em;text-transform:uppercase;color:#1c6e8e;font-weight:700;border-bottom:1px solid #dbe7ec;padding-bottom:1.5mm;margin-bottom:1.5mm}
  .row{display:flex;justify-content:space-between;gap:4mm;font-size:8.4pt;padding:.9mm 0}
  .row .k{color:#557079}
  .row .v{color:#13313d;font-weight:500;text-align:right}
  .ftr{position:absolute;left:14mm;right:14mm;bottom:9mm;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid #13313d;padding-top:3mm;font-size:7.5pt;color:#557079}
  .ftr b{color:#1c6e8e}`;
  const body = `
  <div class="hdr"><img src="${spa.logo}" alt="Quintessence Spas">
    <div class="meta"><b>FICHE TECHNIQUE</b><br>Réf. ${spa.ref}<br>${today}</div></div>
  <div class="title">
    <div><div class="eyebrow">Gamme ${spa.gamme}</div><h1>${spa.name}</h1><p>${spa.accroche}</p></div>
    <div class="price"><div class="from">À partir de</div><div class="old">${euro(spa.prix)}</div><div class="now">${euro(spa.prixPromo)}</div></div>
  </div>
  <div class="hero"><img src="${spa.photo}" alt="${spa.name}"></div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${spa.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${spa.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val" style="font-size:10pt">${spa.dims}</div></div>
    <div><div class="lbl">Volume d'eau</div><div class="val" style="font-size:11pt">${spa.poidsEau}</div></div>
  </div>
  <div class="specs">${specRows(spa.caracteristiques)}</div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url} · ${site.email}</span></div>`;
  return wrap("Fiche technique — Éditorial classique", css, body);
}

/* ============================================================ TEMPLATE B
   « Datasheet technique » — colonne photo + faits à gauche, tables denses à droite. */
function templateB() {
  const css = `
  .page{font-family:'Inter',sans-serif;color:#1a2429;display:flex;flex-direction:column}
  .top{background:#0f2932;color:#fff;padding:10mm 12mm;display:flex;justify-content:space-between;align-items:center}
  .top img{height:11mm}
  .top .doc{text-align:right;font-size:8pt;color:#9fc0cc;line-height:1.6}
  .top .doc b{color:#fff;font-size:9pt;letter-spacing:.1em}
  .main{flex:1;display:grid;grid-template-columns:62mm 1fr;gap:0}
  .side{background:#f1f6f8;padding:8mm 7mm;border-right:1px solid #dbe7ec}
  .side h1{font-family:'Fraunces',serif;font-size:26pt;font-weight:500;line-height:.98;color:#13313d}
  .side .gm{font-size:7.5pt;letter-spacing:.2em;text-transform:uppercase;color:#1c6e8e;font-weight:600;margin-bottom:2mm}
  .side .ph{margin-top:5mm;height:42mm;border-radius:3mm;overflow:hidden;background:#dbe7ec}
  .side .ph img{width:100%;height:100%;object-fit:cover}
  .facts{margin-top:5mm}
  .facts .f{display:flex;justify-content:space-between;border-bottom:1px solid #dbe7ec;padding:2mm 0;font-size:8.5pt}
  .facts .f .k{color:#557079}.facts .f .v{font-weight:600;color:#13313d}
  .price{margin-top:5mm;background:#1c6e8e;color:#fff;border-radius:3mm;padding:4mm}
  .price .old{font-size:9pt;opacity:.7;text-decoration:line-through}
  .price .now{font-family:'Fraunces',serif;font-size:20pt;font-weight:600}
  .price .lbl{font-size:7pt;text-transform:uppercase;letter-spacing:.14em;opacity:.85}
  .sw{display:flex;gap:4mm;margin-top:4mm}
  .sw .s{display:flex;align-items:center;gap:1.5mm;font-size:7.5pt;color:#557079}
  .sw .dot{width:5mm;height:5mm;border-radius:50%;border:1px solid #cdd9de}
  .content{padding:8mm 9mm}
  .content>.lead{font-size:9pt;color:#557079;margin-bottom:4mm;font-style:italic}
  .specs{columns:2;column-gap:8mm}
  .grp{break-inside:avoid;margin-bottom:3.5mm}
  .grp h4{font-size:7.5pt;letter-spacing:.08em;text-transform:uppercase;color:#fff;background:#5f8fa0;padding:1.4mm 2.2mm;border-radius:1.5mm;font-weight:600}
  .row{display:flex;justify-content:space-between;gap:3mm;font-size:8.2pt;padding:1mm 2.2mm}
  .row:nth-child(even){background:#f1f6f8}
  .row .k{color:#557079}.row .v{font-weight:500;text-align:right}
  .ftr{background:#0f2932;color:#9fc0cc;font-size:7.5pt;padding:4mm 12mm;display:flex;justify-content:space-between}
  .ftr b{color:#fff}`;
  const body = `
  <div class="top"><img src="${spa.logoLight}" alt="Quintessence Spas">
    <div class="doc"><b>FICHE TECHNIQUE</b><br>Réf. ${spa.ref} · ${today}</div></div>
  <div class="main">
    <div class="side">
      <div class="gm">Gamme ${spa.gamme}</div><h1>${spa.name}</h1>
      <div class="ph"><img src="${spa.photo}" alt="${spa.name}"></div>
      <div class="facts">
        <div class="f"><span class="k">Places</span><span class="v">${spa.places}</span></div>
        <div class="f"><span class="k">Hydrojets</span><span class="v">${spa.jets}</span></div>
        <div class="f"><span class="k">Dimensions</span><span class="v">${spa.dims}</span></div>
        <div class="f"><span class="k">Volume d'eau</span><span class="v">${spa.poidsEau}</span></div>
        <div class="f"><span class="k">Énergie</span><span class="v" style="font-size:7.5pt">2 kW</span></div>
      </div>
      <div class="price"><div class="lbl">Prix promo</div><div class="old">${euro(spa.prix)}</div><div class="now">${euro(spa.prixPromo)}</div></div>
      <div class="sw">${spa.colors.map((c) => `<div class="s"><span class="dot" style="background:${c.hex}"></span>${c.type}</div>`).join("")}</div>
    </div>
    <div class="content">
      <div class="lead">${spa.accroche}</div>
      <div class="specs">${specRows(spa.caracteristiques)}</div>
    </div>
  </div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url} · ${site.email}</span></div>`;
  return wrap("Fiche technique — Datasheet technique", css, body);
}

/* ============================================================ TEMPLATE C
   « Magazine premium » — bandeau sombre, hero plein cadre, accents cuivre, specs 3 colonnes. */
function templateC() {
  const css = `
  .page{font-family:'Inter',sans-serif;color:#13313d}
  .hero{position:relative;height:96mm;overflow:hidden;background:#0f2932}
  .hero img{width:100%;height:100%;object-fit:cover;opacity:.85}
  .hero .grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,41,50,.55) 0%,rgba(15,41,50,0) 35%,rgba(15,41,50,.85) 100%)}
  .hero .logo{position:absolute;top:11mm;left:14mm;height:11mm}
  .hero .tag{position:absolute;top:13mm;right:14mm;color:#fff;font-size:7.5pt;letter-spacing:.16em;text-transform:uppercase;opacity:.9}
  .hero .ttl{position:absolute;left:14mm;bottom:10mm;color:#fff}
  .hero .ttl .gm{font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;color:#d8b27a;font-weight:600}
  .hero .ttl h1{font-family:'Fraunces',serif;font-size:40pt;font-weight:500;line-height:1;margin-top:2mm}
  .hero .ttl p{font-size:10pt;opacity:.92;margin-top:2mm}
  .hero .badge{position:absolute;right:14mm;bottom:10mm;text-align:right;color:#fff}
  .hero .badge .old{font-size:10pt;opacity:.7;text-decoration:line-through}
  .hero .badge .now{font-family:'Fraunces',serif;font-size:26pt;font-weight:600;color:#fff}
  .hero .badge .lbl{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#d8b27a}
  .band{display:flex;justify-content:space-around;padding:5mm 14mm;background:#0c2027;color:#fff}
  .band div{text-align:center}
  .band .lbl{font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:#9fc0cc}
  .band .val{font-family:'Fraunces',serif;font-size:15pt;margin-top:.5mm}
  .body{padding:7mm 14mm 0}
  .specs{columns:3;column-gap:8mm}
  .grp{break-inside:avoid;margin-bottom:4mm}
  .grp h4{font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#b8893f;font-weight:700;border-bottom:1px solid #e7ddcb;padding-bottom:1.2mm;margin-bottom:1.4mm}
  .row{font-size:8pt;padding:.8mm 0;border-bottom:1px dotted #e4eaed}
  .row .k{color:#557079;display:block;font-size:7pt}
  .row .v{color:#13313d;font-weight:600}
  .ftr{position:absolute;left:14mm;right:14mm;bottom:8mm;display:flex;justify-content:space-between;font-size:7.5pt;color:#557079;border-top:1px solid #e7ddcb;padding-top:3mm}
  .ftr b{color:#b8893f}`;
  const body = `
  <div class="hero"><img src="${spa.photo}" alt="${spa.name}"><div class="grad"></div>
    <img class="logo" src="${spa.logoLight}" alt="Quintessence Spas">
    <div class="tag">Fiche technique · ${spa.ref}</div>
    <div class="ttl"><div class="gm">Gamme ${spa.gamme}</div><h1>${spa.name}</h1><p>${spa.accroche}</p></div>
    <div class="badge"><div class="lbl">Prix promo</div><div class="old">${euro(spa.prix)}</div><div class="now">${euro(spa.prixPromo)}</div></div>
  </div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${spa.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${spa.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val" style="font-size:11pt">${spa.dims}</div></div>
    <div><div class="lbl">Volume</div><div class="val" style="font-size:12pt">${spa.poidsEau}</div></div>
    <div><div class="lbl">Énergie</div><div class="val" style="font-size:10pt">2 kW</div></div>
  </div>
  <div class="body"><div class="specs">${specRows(spa.caracteristiques)}</div></div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url} · ${site.email}</span></div>`;
  return wrap("Fiche technique — Magazine premium", css, body);
}

/* ============================================================ TEMPLATE D
   « Minimaliste épuré » — beaucoup d'air, filets fins, typographie, accents discrets. */
function templateD() {
  const css = `
  .page{font-family:'Inter',sans-serif;color:#1a2429;padding:16mm 16mm 0}
  .hdr{display:flex;justify-content:space-between;align-items:center}
  .hdr img{height:10mm}
  .hdr .meta{font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#8aa0a8}
  .title{margin-top:14mm;text-align:center}
  .title .gm{font-size:8pt;letter-spacing:.3em;text-transform:uppercase;color:#1c6e8e}
  .title h1{font-family:'Fraunces',serif;font-size:42pt;font-weight:400;margin-top:3mm;letter-spacing:-.01em}
  .title p{font-size:9.5pt;color:#557079;margin-top:3mm;font-weight:300}
  .rule{height:1px;background:#d3dfe3;margin:8mm 0}
  .band{display:flex;justify-content:center;gap:14mm;text-align:center}
  .band .lbl{font-size:7pt;letter-spacing:.18em;text-transform:uppercase;color:#8aa0a8}
  .band .val{font-family:'Fraunces',serif;font-size:17pt;margin-top:1.5mm;color:#13313d}
  .photo{margin:8mm 0;height:46mm;border-radius:2mm;overflow:hidden;background:#eef4f6}
  .photo img{width:100%;height:100%;object-fit:cover}
  .specs{columns:2;column-gap:14mm}
  .grp{break-inside:avoid;margin-bottom:4mm}
  .grp h4{font-family:'Fraunces',serif;font-size:11pt;font-weight:500;color:#13313d;margin-bottom:2mm}
  .row{display:flex;justify-content:space-between;align-items:baseline;font-size:8.3pt;padding:1.1mm 0}
  .row .k{color:#8aa0a8;font-weight:300}
  .row .v{color:#1a2429;font-weight:500}
  .dots{flex:1;border-bottom:1px dotted #cdd9de;margin:0 2mm;transform:translateY(-1mm)}
  .ftr{position:absolute;left:16mm;right:16mm;bottom:11mm;text-align:center;font-size:7.5pt;letter-spacing:.06em;color:#8aa0a8}
  .ftr b{color:#1c6e8e;font-weight:600}`;
  const rowsMin = (g) =>
    g.items
      .map(
        ([k, v]) =>
          `<div class="row"><span class="k">${k}</span><span class="dots"></span><span class="v">${v}</span></div>`,
      )
      .join("");
  const specs = spa.caracteristiques
    .map((g) => `<div class="grp"><h4>${g.groupe}</h4>${rowsMin(g)}</div>`)
    .join("");
  const body = `
  <div class="hdr"><img src="${spa.logo}" alt="Quintessence Spas"><div class="meta">Fiche technique · ${spa.ref} · ${today}</div></div>
  <div class="title"><div class="gm">Gamme ${spa.gamme}</div><h1>${spa.name}</h1><p>${spa.accroche}</p></div>
  <div class="rule"></div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${spa.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${spa.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val" style="font-size:12pt">${spa.dims}</div></div>
    <div><div class="lbl">Volume</div><div class="val" style="font-size:13pt">${spa.poidsEau}</div></div>
    <div><div class="lbl">Prix</div><div class="val" style="color:#1c6e8e">${euro(spa.prixPromo)}</div></div>
  </div>
  <div class="photo"><img src="${spa.photo}" alt="${spa.name}"></div>
  <div class="specs">${specs}</div>
  <div class="ftr"><b>${site.name}</b> — ${site.tagline} · ${site.url} · ${site.email}</div>`;
  return wrap("Fiche technique — Minimaliste épuré", css, body);
}

/* ---- Helpers v2 : masquer les « Non inclus », titres bleus, collage photos ---- */
const estInclus = ([, v]) => !/^non inclus/i.test(String(v).trim());

function specRowsInclus(groupes) {
  return groupes
    .map((g) => {
      const items = g.items.filter(estInclus);
      if (!items.length) return "";
      return `<div class="grp"><h4>${g.groupe}</h4>${items
        .map(
          ([k, v]) =>
            `<div class="row"><span class="k">${k}</span><span class="v">${v}</span></div>`,
        )
        .join("")}</div>`;
    })
    .join("");
}

function collage() {
  const [a, b, c, d, e] = spa.gallery;
  return `<div class="collage">
    <div class="c1"><img src="${a}" alt="${spa.name}"></div>
    <div class="c2"><img src="${b}" alt="${spa.name}"></div>
    <div class="c3"><img src="${c}" alt="${spa.name}"></div>
    <div class="c4"><img src="${d}" alt="${spa.name}"></div>
    <div class="c5"><img src="${e}" alt="${spa.name}"></div>
  </div>`;
}

/* ============================================================ TEMPLATE C1
   Variante de C : bandeau blanc avec logo original (noir), titres bleus,
   sans « non inclus », collage photo en bas. */
function templateC1() {
  const css = `
  .page{font-family:'Inter',sans-serif;color:#13313d;display:flex;flex-direction:column}
  .top{display:flex;justify-content:space-between;align-items:center;padding:7mm 14mm 5mm;background:#fff}
  .top img{height:12mm}
  .top .doc{text-align:right;font-size:8pt;letter-spacing:.1em;text-transform:uppercase;color:#557079;line-height:1.6}
  .top .doc b{color:#13313d}
  .hero{position:relative;height:62mm;overflow:hidden;background:#0f2932}
  .hero img{width:100%;height:100%;object-fit:cover;opacity:.9}
  .hero .grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,41,50,.15) 0%,rgba(15,41,50,0) 30%,rgba(15,41,50,.82) 100%)}
  .hero .ttl{position:absolute;left:14mm;bottom:8mm;color:#fff}
  .hero .ttl .gm{font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;color:#d8b27a;font-weight:600}
  .hero .ttl h1{font-family:'Fraunces',serif;font-size:34pt;font-weight:500;line-height:1;margin-top:1.5mm}
  .hero .ttl p{font-size:9.5pt;opacity:.92;margin-top:1.5mm}
  .hero .badge{position:absolute;right:14mm;bottom:8mm;text-align:right;color:#fff}
  .hero .badge .lbl{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#d8b27a}
  .hero .badge .old{font-size:10pt;opacity:.7;text-decoration:line-through}
  .hero .badge .now{font-family:'Fraunces',serif;font-size:24pt;font-weight:600}
  .band{display:flex;justify-content:space-around;padding:4.5mm 14mm;background:#0c2027;color:#fff}
  .band div{text-align:center}
  .band .lbl{font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:#9fc0cc}
  .band .val{font-family:'Fraunces',serif;font-size:14pt;margin-top:.5mm}
  .content{flex:1;display:flex;flex-direction:column;padding:6mm 14mm 0}
  .specs{columns:3;column-gap:8mm}
  .grp{break-inside:avoid;margin-bottom:3.5mm}
  .grp h4{font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#1c6e8e;font-weight:700;border-bottom:1px solid #dbe7ec;padding-bottom:1.2mm;margin-bottom:1.4mm}
  .row{font-size:8pt;padding:.8mm 0;border-bottom:1px dotted #e4eaed}
  .row .k{color:#557079;display:block;font-size:7pt}
  .row .v{color:#13313d;font-weight:600}
  .collage{display:grid;grid-template-columns:2fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:2mm;flex:1;min-height:42mm;margin-top:5mm;margin-bottom:5mm}
  .collage>div{overflow:hidden;border-radius:2mm;background:#dbe7ec}
  .collage img{width:100%;height:100%;object-fit:cover;display:block}
  .c1{grid-row:1 / span 2}
  .ftr{display:flex;justify-content:space-between;font-size:7.5pt;color:#557079;border-top:1px solid #dbe7ec;padding:3mm 14mm;background:#fff}
  .ftr b{color:#1c6e8e}`;
  const body = `
  <div class="top"><img src="${spa.logo}" alt="Quintessence Spas"><div class="doc"><b>Fiche technique</b><br>${spa.ref} · ${today}</div></div>
  <div class="hero"><img src="${spa.photo}" alt="${spa.name}"><div class="grad"></div>
    <div class="ttl"><div class="gm">Gamme ${spa.gamme}</div><h1>${spa.name}</h1><p>${spa.accroche}</p></div>
    <div class="badge"><div class="lbl">Prix promo</div><div class="old">${euro(spa.prix)}</div><div class="now">${euro(spa.prixPromo)}</div></div>
  </div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${spa.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${spa.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val" style="font-size:11pt">${spa.dims}</div></div>
    <div><div class="lbl">Volume</div><div class="val" style="font-size:12pt">${spa.poidsEau}</div></div>
    <div><div class="lbl">Énergie</div><div class="val" style="font-size:10pt">2 kW</div></div>
  </div>
  <div class="content"><div class="specs">${specRowsInclus(spa.caracteristiques)}</div>${collage()}</div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url} · ${site.email}</span></div>`;
  return wrap("Fiche technique — C1 (bandeau blanc)", css, body);
}

/* ============================================================ TEMPLATE C2
   Variante de C : hero plein cadre + médaillon blanc pour le logo original,
   titres bleus, sans « non inclus », collage photo en bas. */
function templateC2() {
  const css = `
  .page{font-family:'Inter',sans-serif;color:#13313d;display:flex;flex-direction:column}
  .hero{position:relative;height:86mm;overflow:hidden;background:#0f2932;display:flex;flex-direction:column;padding:10mm 14mm 9mm}
  .hero .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.88}
  .hero .grad{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,41,50,.55) 0%,rgba(15,41,50,0) 34%,rgba(15,41,50,.85) 100%)}
  .hero .htop,.hero .hbot{position:relative;z-index:2;display:flex;justify-content:space-between}
  .hero .htop{align-items:flex-start}
  .hero .hbot{align-items:flex-end;margin-top:auto;gap:10mm}
  .brand img{height:13mm;display:block;filter:drop-shadow(0 1mm 3mm rgba(0,0,0,.4))}
  .hero .tag{color:#fff;font-size:7.5pt;letter-spacing:.16em;text-transform:uppercase;opacity:.92;text-align:right;padding-top:2mm}
  .hero .ttl{color:#fff}
  .hero .ttl h1{font-family:'Fraunces',serif;font-size:38pt;font-weight:500;line-height:1}
  .hero .ttl .gm{font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;color:#d8b27a;font-weight:600;margin-top:2.5mm}
  .hero .ttl p{font-size:10pt;opacity:.92;margin-top:1.5mm}
  .hero .badge{text-align:right;color:#fff;white-space:nowrap}
  .hero .badge .lbl{font-size:7pt;letter-spacing:.16em;text-transform:uppercase;color:#d8b27a}
  .hero .badge .old{font-size:10pt;opacity:.7;text-decoration:line-through}
  .hero .badge .now{font-family:'Fraunces',serif;font-size:26pt;font-weight:600}
  .band{display:flex;justify-content:space-around;padding:4.5mm 14mm;background:#0c2027;color:#fff}
  .band div{text-align:center}
  .band .lbl{font-size:6.8pt;letter-spacing:.14em;text-transform:uppercase;color:#9fc0cc}
  .band .val{font-family:'Fraunces',serif;font-size:14pt;margin-top:.5mm}
  .content{flex:1;display:flex;flex-direction:column;padding:6mm 14mm 0}
  .specs{columns:3;column-gap:8mm}
  .grp{break-inside:avoid;margin-bottom:3.5mm}
  .grp h4{font-size:7.5pt;letter-spacing:.1em;text-transform:uppercase;color:#1c6e8e;font-weight:700;border-bottom:1px solid #dbe7ec;padding-bottom:1.2mm;margin-bottom:1.4mm}
  .row{font-size:8pt;padding:.8mm 0;border-bottom:1px dotted #e4eaed}
  .row .k{color:#557079;display:block;font-size:7pt}
  .row .v{color:#13313d;font-weight:600}
  .collage{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;grid-template-rows:1fr 1fr;gap:2mm;flex:1;min-height:40mm;margin-top:5mm;margin-bottom:5mm}
  .collage>div{overflow:hidden;border-radius:2mm;background:#dbe7ec}
  .collage img{width:100%;height:100%;object-fit:cover;display:block}
  .c1{grid-column:1 / span 2;grid-row:1 / span 2}
  .ftr{display:flex;justify-content:space-between;font-size:7.5pt;color:#557079;border-top:1px solid #dbe7ec;padding:3mm 14mm;background:#fff}
  .ftr b{color:#1c6e8e}`;
  const body = `
  <div class="hero"><img class="bg" src="${spa.photo}" alt="${spa.name}"><div class="grad"></div>
    <div class="htop">
      <div class="brand"><img src="${spa.logoHero}" alt="Quintessence Spas"></div>
      <div class="tag">Fiche technique · ${spa.ref} · ${today}</div>
    </div>
    <div class="hbot">
      <div class="ttl"><h1>${spa.name}</h1><div class="gm">Gamme ${spa.gamme}</div><p>${spa.accroche}</p></div>
      <div class="badge"><div class="lbl">Prix promo</div><div class="old">${euro(spa.prix)}</div><div class="now">${euro(spa.prixPromo)}</div></div>
    </div>
  </div>
  <div class="band">
    <div><div class="lbl">Places</div><div class="val">${spa.places}</div></div>
    <div><div class="lbl">Hydrojets</div><div class="val">${spa.jets}</div></div>
    <div><div class="lbl">Dimensions</div><div class="val" style="font-size:11pt">${spa.dims}</div></div>
    <div><div class="lbl">Volume</div><div class="val" style="font-size:12pt">${spa.poidsEau}</div></div>
    <div><div class="lbl">Énergie</div><div class="val" style="font-size:10pt">2 kW</div></div>
  </div>
  <div class="content"><div class="specs">${specRowsInclus(spa.caracteristiques)}</div>${collage()}</div>
  <div class="ftr"><span><b>${site.name}</b> — ${site.tagline}</span><span>${site.url} · ${site.email}</span></div>`;
  return wrap("Fiche technique — C2 (médaillon logo)", css, body);
}

const templatesV2 = [
  { file: "v2-c1-bandeau.html", label: "C1 — Bandeau blanc", desc: "Logo original en tête, hero, collage bas", fn: templateC1 },
  { file: "v2-c2-medaillon.html", label: "C2 — Médaillon logo", desc: "Hero plein cadre + logo sur médaillon blanc", fn: templateC2 },
];

const templates = [
  { file: "template-a-editorial.html", label: "A — Éditorial classique", desc: "Sobre, serif, accent bleu eau", fn: templateA },
  { file: "template-b-datasheet.html", label: "B — Datasheet technique", desc: "Colonne photo/faits + tables denses", fn: templateB },
  { file: "template-c-magazine.html", label: "C — Magazine premium", desc: "Hero plein cadre, accents cuivre", fn: templateC },
  { file: "template-d-minimaliste.html", label: "D — Minimaliste épuré", desc: "Beaucoup d'air, filets fins", fn: templateD },
];

for (const t of [...templates, ...templatesV2])
  writeFileSync(join(OUT, t.file), t.fn(), "utf8");

/* Page index v2 : les 2 nouvelles variantes corrigées, en grand. */
const indexV2 = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Fiche technique — variantes corrigées (C1 / C2)</title>${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0f2932;color:#e8f0f3;padding:32px}
h1{font-family:'Fraunces',serif;font-size:30px;font-weight:500;text-align:center}
.sub{text-align:center;color:#9fc0cc;margin-top:8px;font-size:14px;max-width:760px;margin-inline:auto}
.sub b{color:#d8b27a}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:1360px;margin:34px auto 0}
.cell{background:#13333f;border:1px solid #25525f;border-radius:14px;overflow:hidden}
.bar{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #25525f;gap:10px}
.bar b{font-size:15px}.bar span{font-size:12px;color:#9fc0cc}
.bar a{font-size:12px;color:#d8b27a;text-decoration:none;font-weight:600;white-space:nowrap}
.frame{position:relative;height:680px;overflow:hidden;background:#9aa6ad;display:flex;justify-content:center;padding-top:14px}
.frame iframe{width:210mm;height:297mm;border:0;transform:scale(.64);transform-origin:top center}
.back{display:block;text-align:center;color:#9fc0cc;font-size:12px;margin-top:24px}
@media(max-width:1100px){.grid{grid-template-columns:1fr}}
</style></head><body>
<h1>Fiche technique — variantes corrigées</h1>
<p class="sub">Base : <b>version C validée</b>. Corrections : logo original (QUINTESSENCE noir) lisible, titres de familles en <b>bleu</b>, lignes « non inclus » masquées, et <b>collage de photos</b> en bas. Clique « Plein écran » puis <code>Cmd+P → Enregistrer en PDF</code> pour juger le rendu A4 réel.</p>
<div class="grid">
${templatesV2
  .map(
    (t) =>
      `<div class="cell"><div class="bar"><div><b>${t.label}</b> <span>— ${t.desc}</span></div><a href="${t.file}" target="_blank">Plein écran →</a></div><div class="frame"><iframe src="${t.file}" scrolling="no"></iframe></div></div>`,
  )
  .join("\n")}
</div>
<a class="back" href="index.html">← Revoir les 4 propositions d'origine (A·B·C·D)</a>
</body></html>`;
writeFileSync(join(OUT, "index-v2.html"), indexV2, "utf8");

/* Page index : les 4 fiches côte à côte (aperçu A4 à l'échelle). */
const index = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Propositions — Fiche technique A4</title>${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Inter',sans-serif;background:#0f2932;color:#e8f0f3;padding:32px}
h1{font-family:'Fraunces',serif;font-size:30px;font-weight:500;text-align:center}
.sub{text-align:center;color:#9fc0cc;margin-top:8px;font-size:14px;max-width:680px;margin-left:auto;margin-right:auto}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px;max-width:1320px;margin:34px auto 0}
.cell{background:#13333f;border:1px solid #25525f;border-radius:14px;overflow:hidden}
.bar{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #25525f;gap:10px}
.bar b{font-size:15px}.bar span{font-size:12px;color:#9fc0cc}
.bar a{font-size:12px;color:#d8b27a;text-decoration:none;font-weight:600;white-space:nowrap}
.frame{position:relative;height:520px;overflow:hidden;background:#9aa6ad;display:flex;justify-content:center;padding-top:14px}
.frame iframe{width:210mm;height:297mm;border:0;transform:scale(.62);transform-origin:top center}
@media(max-width:1100px){.grid{grid-template-columns:1fr}}
</style></head><body>
<h1>Fiche technique — 4 propositions A4</h1>
<p class="sub">Mêmes données (Prado), 4 mises en page différentes au format A4 (PDF). Clique « Plein écran » pour voir une fiche en grand, puis dis-moi laquelle tu valides (ou les ajustements voulus).</p>
<div class="grid">
${templates
  .map(
    (t) =>
      `<div class="cell"><div class="bar"><div><b>${t.label}</b> <span>— ${t.desc}</span></div><a href="${t.file}" target="_blank">Plein écran →</a></div><div class="frame"><iframe src="${t.file}" scrolling="no"></iframe></div></div>`,
  )
  .join("\n")}
</div></body></html>`;
writeFileSync(join(OUT, "index.html"), index, "utf8");

console.log("OK — 4 templates + index générés dans", OUT);
