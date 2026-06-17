/**
 * 4 propositions de landing page « Devenir revendeur » (B2B).
 * node mockups/revendeur/build.mjs  →  écrit 4 HTML + index.html
 * Images servies par le dev server (http://localhost:3000).
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = dirname(fileURLToPath(import.meta.url));
const B = "http://localhost:3000";

const img = {
  logo: `${B}/brand/logo.png`,
  logoWhite: `${B}/brand/logo-hero-white.png`,
  hero: `${B}/products/lucerne-installe.jpg`,
  equipe: `${B}/brand/equipe-installation.jpg`,
  showroom: `${B}/brand/conseil-showroom.jpg`,
  gallery: [
    `${B}/products/prado-1.jpg`,
    `${B}/products/vassania-1.jpg`,
    `${B}/products/massidia-1.jpg`,
    `${B}/products/passana-1.jpg`,
    `${B}/products/javelino-1.jpg`,
    `${B}/products/vinalo-1.jpg`,
  ],
};

const avantages = [
  ["Marges attractives", "Conditions pro claires et remises par volume, pensées pour votre rentabilité."],
  ["Gamme premium différenciante", "Des spas rigides haut de gamme, fiables, qui valorisent votre showroom."],
  ["Stock & livraison France", "Disponibilité maîtrisée, livraison 35T partout en France (hayon + transpalette)."],
  ["Accompagnement & formation", "Formation produit, support technique et conseil commercial pour démarrer vite."],
  ["Supports marketing", "Catalogues, visuels et fiches techniques prêts pour votre site et votre point de vente."],
  ["SAV & garantie", "Garantie constructeur et SAV réactif : vous vendez en confiance."],
];

const cibles = ["Piscinistes", "Paysagistes", "Revendeurs de spas", "Magasins bien-être", "Constructeurs"];
const stats = [["+15 ans", "d'expérience"], ["2 400", "spas installés"], ["4,9/5", "satisfaction"], ["5 ans", "de garantie"]];

const FONTS = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">`;
const RESET = `*{margin:0;padding:0;box-sizing:border-box}img{display:block;max-width:100%}a{text-decoration:none;color:inherit}
:root{--terra:#1c6e8e;--terra-d:#14566e;--ink:#13313d;--cream:#f7fbfc;--muted:#557079;--line:#dbe7ec;--footer:#0f2932;--gold:#b8893f}
body{font-family:'Inter',sans-serif;color:var(--ink);line-height:1.6}
h1,h2,h3{font-family:'Fraunces',serif;font-weight:500;line-height:1.1}
.wrap{max-width:1100px;margin:0 auto;padding:0 28px}
.btn{display:inline-block;border-radius:40px;padding:15px 30px;font-weight:600;font-size:15px;cursor:pointer}
.btn-terra{background:var(--terra);color:#fff}
.btn-light{background:#fff;color:var(--terra)}
.btn-ghost{border:1.5px solid currentColor}
.eyebrow{font-size:12px;letter-spacing:.2em;text-transform:uppercase;font-weight:600;color:var(--terra)}
label{display:block;font-size:13px;font-weight:600;margin-bottom:6px}
input,textarea{width:100%;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font:inherit;font-size:15px;outline:none}
input:focus,textarea:focus{border-color:var(--terra)}
.grid2{display:grid;gap:16px;grid-template-columns:1fr 1fr}
.formgrid{display:grid;gap:16px;grid-template-columns:1fr 1fr}
.formgrid .full{grid-column:1/-1}`;

/* Champs de candidature (société, site web, coordonnées). */
function formFields() {
  return `
  <div class="formgrid">
    <div><label>Société / enseigne *</label><input placeholder="Ex. Piscines & Jardins Martin"></div>
    <div><label>Site internet</label><input placeholder="https://votre-site.fr"></div>
    <div><label>Prénom *</label><input></div>
    <div><label>Nom *</label><input></div>
    <div><label>E-mail professionnel *</label><input type="email"></div>
    <div><label>Téléphone</label><input type="tel"></div>
    <div class="full"><label>Votre activité</label>
      <select style="width:100%;border:1px solid var(--line);border-radius:12px;padding:12px 14px;font:inherit;font-size:15px">
        <option>Pisciniste</option><option>Paysagiste</option><option>Revendeur de spas</option><option>Magasin bien-être</option><option>Autre</option>
      </select></div>
    <div class="full"><label>Votre projet (optionnel)</label><textarea rows="3" placeholder="Zone, volume envisagé, showroom…"></textarea></div>
  </div>`;
}

function page(title, css, body) {
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>${FONTS}<style>${RESET}${css}</style></head><body>${body}</body></html>`;
}

/* ============ A — Corporate clair (sobre, bleu eau, brand-aligned) ============ */
function templateA() {
  const css = `
  header{position:sticky;top:0;background:#fff;border-bottom:1px solid var(--line);z-index:10}
  header .wrap{display:flex;align-items:center;justify-content:space-between;height:74px}
  header img{height:34px}
  .hero{padding:70px 0}
  .hero .wrap{display:grid;grid-template-columns:1.05fr 1fr;gap:48px;align-items:center}
  .hero h1{font-size:52px;margin:14px 0 18px}
  .hero p{font-size:18px;color:var(--muted);max-width:480px}
  .hero .cta{margin-top:28px;display:flex;gap:14px;flex-wrap:wrap}
  .hero .ph{border-radius:20px;overflow:hidden;aspect-ratio:4/3;background:var(--line)}
  .hero .ph img{width:100%;height:100%;object-fit:cover}
  .stats{background:var(--cream);border-block:1px solid var(--line)}
  .stats .wrap{display:flex;justify-content:space-around;gap:24px;padding:34px 28px;text-align:center;flex-wrap:wrap}
  .stats .n{font-family:'Fraunces',serif;font-size:34px;color:var(--terra)}
  .stats .l{font-size:13px;color:var(--muted)}
  .sec{padding:72px 0}
  .sec h2{font-size:38px;text-align:center}
  .sec .sub{text-align:center;color:var(--muted);margin:12px auto 0;max-width:560px}
  .adv{margin-top:46px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
  .card{border:1px solid var(--line);border-radius:18px;padding:26px}
  .card h3{font-size:21px}.card p{margin-top:8px;font-size:14px;color:var(--muted)}
  .gal{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:46px}
  .gal img{border-radius:14px;aspect-ratio:1;object-fit:cover;width:100%}
  .pro{background:var(--cream);border-block:1px solid var(--line)}
  .pro .wrap{display:grid;grid-template-columns:1fr 1fr;gap:48px;align-items:center;padding:72px 28px}
  .pro img{border-radius:20px;aspect-ratio:4/3;object-fit:cover;width:100%}
  .formsec{padding:72px 0}
  .formcard{max-width:720px;margin:36px auto 0;border:1px solid var(--line);border-radius:24px;padding:40px;background:#fff;box-shadow:0 20px 50px rgba(19,49,61,.07)}
  footer{background:var(--footer);color:#cfe0e6;text-align:center;padding:34px;font-size:13px}
  footer img{height:30px;margin:0 auto 12px}`;
  const adv = avantages.map(([t, d]) => `<div class="card"><h3>${t}</h3><p>${d}</p></div>`).join("");
  const gal = img.gallery.map((u) => `<img src="${u}" alt="Spa Quintessence">`).join("");
  const st = stats.map(([n, l]) => `<div><div class="n">${n}</div><div class="l">${l}</div></div>`).join("");
  const body = `
  <header><div class="wrap"><img src="${img.logo}" alt="Quintessence Spas"><a href="#form" class="btn btn-terra" style="padding:11px 22px">Devenir revendeur</a></div></header>
  <section class="hero"><div class="wrap">
    <div><span class="eyebrow">Programme revendeurs · B2B</span>
      <h1>Devenez revendeur de <span style="color:var(--terra)"><em>spas premium</em></span></h1>
      <p>Quintessence Spas est votre fournisseur de spas rigides haut de gamme. Piscinistes, paysagistes, revendeurs : enrichissez votre offre avec une gamme différenciante et un partenaire fiable.</p>
      <div class="cta"><a href="#form" class="btn btn-terra">Poser ma candidature</a><a href="#avantages" class="btn btn-ghost" style="color:var(--ink)">Voir les avantages</a></div>
    </div>
    <div class="ph"><img src="${img.hero}" alt="Spa rigide installé"></div>
  </div></section>
  <div class="stats"><div class="wrap">${st}</div></div>
  <section class="sec" id="avantages"><div class="wrap">
    <h2>Un partenariat <em style="color:var(--terra)">gagnant</em></h2>
    <p class="sub">Tout ce qu'il faut pour vendre des spas premium sereinement et avec marge.</p>
    <div class="adv">${adv}</div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap">
    <h2 style="font-size:32px">Une gamme qui valorise votre showroom</h2>
    <div class="gal">${gal}</div></div></section>
  <div class="pro"><div class="wrap">
    <img src="${img.equipe}" alt="Équipe Quintessence">
    <div><span class="eyebrow">Notre professionnalisme</span>
      <h2 style="font-size:34px;margin-top:12px">Un partenaire, pas un simple fournisseur</h2>
      <p style="color:var(--muted);margin-top:14px">Plus de 15 ans d'expérience, des équipes formées, une logistique maîtrisée et un SAV réactif partout en France. On vous accompagne de la première commande au service après-vente.</p>
    </div></div></div>
  <section class="formsec" id="form"><div class="wrap">
    <h2 style="text-align:center;font-size:36px">Posez votre candidature</h2>
    <p class="sub" style="text-align:center;color:var(--muted);margin-top:10px">Réponse sous 48 h ouvrées avec nos conditions et tarifs professionnels.</p>
    <div class="formcard">${formFields()}<button class="btn btn-terra" style="width:100%;margin-top:22px;border:0">Envoyer ma candidature</button></div>
  </div></section>
  <footer><img src="${img.logoWhite}" alt="Quintessence Spas">Quintessence Spas — Spas rigides premium · France · contact@quintessencespas.com</footer>`;
  return page("Revendeur — A · Corporate clair", css, body);
}

/* ============ B — Hero plein écran (image immersive + overlay) ============ */
function templateB() {
  const css = `
  .hero{position:relative;min-height:600px;display:flex;align-items:center;color:#fff;text-align:center}
  .hero .bg{position:absolute;inset:0}.hero .bg img{width:100%;height:100%;object-fit:cover}
  .hero .ov{position:absolute;inset:0;background:linear-gradient(180deg,rgba(15,41,50,.55),rgba(15,41,50,.78))}
  .hero .c{position:relative;z-index:2;width:100%}
  .hero img.logo{height:40px;margin:0 auto 30px}
  .hero h1{font-size:60px;max-width:880px;margin:14px auto 0}
  .hero p{font-size:19px;color:#e8f0f3;max-width:620px;margin:20px auto 0}
  .hero .cta{margin-top:32px;display:flex;gap:14px;justify-content:center;flex-wrap:wrap}
  .chips{margin-top:34px;display:flex;gap:10px;justify-content:center;flex-wrap:wrap}
  .chips span{border:1px solid rgba(255,255,255,.4);border-radius:30px;padding:8px 16px;font-size:13px}
  .sec{padding:80px 0}.sec h2{font-size:40px;text-align:center}
  .sub{text-align:center;color:var(--muted);margin:12px auto 0;max-width:580px}
  .adv{margin-top:50px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
  .card{text-align:center;padding:20px}.card .num{font-family:'Fraunces',serif;color:var(--terra);font-size:30px}
  .card h3{font-size:20px;margin-top:8px}.card p{margin-top:8px;font-size:14px;color:var(--muted)}
  .galband{background:var(--cream);padding:60px 0}
  .gal{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
  .gal img{aspect-ratio:3/4;object-fit:cover;border-radius:10px;width:100%}
  .formsec{padding:80px 0;background:var(--footer);color:#fff}
  .formsec .card{background:#fff;color:var(--ink);max-width:760px;margin:30px auto 0;border-radius:24px;padding:40px}
  footer{background:#0a1c23;color:#9fc0cc;text-align:center;padding:30px;font-size:13px}`;
  const adv = avantages.map(([t, d], i) => `<div class="card"><div class="num">0${i + 1}</div><h3>${t}</h3><p>${d}</p></div>`).join("");
  const gal = img.gallery.map((u) => `<img src="${u}" alt="Spa">`).join("");
  const chips = cibles.map((c) => `<span>${c}</span>`).join("");
  const body = `
  <section class="hero"><div class="bg"><img src="${img.hero}" alt=""></div><div class="ov"></div>
    <div class="c wrap"><img class="logo" src="${img.logoWhite}" alt="Quintessence Spas">
      <span class="eyebrow" style="color:var(--gold)">Programme revendeurs</span>
      <h1>Distribuez des spas premium qui font la différence</h1>
      <p>Devenez revendeur Quintessence Spas : une gamme rigide haut de gamme, des marges attractives et un partenaire fiable de la commande au SAV.</p>
      <div class="cta"><a href="#form" class="btn btn-light">Devenir revendeur</a><a href="#form" class="btn btn-ghost" style="color:#fff">Demander nos tarifs pro</a></div>
      <div class="chips">${chips}</div>
    </div></section>
  <section class="sec"><div class="wrap"><h2>Pourquoi nous rejoindre</h2><p class="sub">Un partenariat pensé pour votre rentabilité et votre image.</p><div class="adv">${adv}</div></div></section>
  <div class="galband"><div class="wrap"><h2 style="text-align:center;font-size:32px">Une gamme complète, de 2 à 8 places</h2><div class="gal" style="margin-top:36px">${gal}</div></div></div>
  <section class="formsec" id="form"><div class="wrap"><h2 style="text-align:center;font-size:38px">Rejoignez le réseau</h2><p style="text-align:center;color:#cfe0e6;margin-top:10px">Réponse sous 48 h avec nos conditions professionnelles.</p>
    <div class="card">${formFields()}<button class="btn btn-terra" style="width:100%;margin-top:22px;border:0">Envoyer ma candidature</button></div></div></section>
  <footer>Quintessence Spas — Spas rigides premium · France · contact@quintessencespas.com</footer>`;
  return page("Revendeur — B · Hero plein écran", css, body);
}

/* ============ C — Split conversion (formulaire dès le hero) ============ */
function templateC() {
  const css = `
  header{background:#fff;border-bottom:1px solid var(--line)}
  header .wrap{display:flex;align-items:center;justify-content:space-between;height:70px}
  header img{height:32px}header nav a{margin-left:22px;font-size:14px;color:var(--muted)}
  .hero{background:var(--cream);border-bottom:1px solid var(--line)}
  .hero .wrap{display:grid;grid-template-columns:1fr 480px;gap:50px;padding:60px 28px;align-items:start}
  .hero h1{font-size:46px}
  .hero p{color:var(--muted);font-size:17px;margin-top:16px;max-width:480px}
  .ul{margin-top:24px;display:grid;gap:12px}
  .ul div{display:flex;gap:12px;align-items:flex-start;font-size:15px}.ul .b{color:var(--terra);font-weight:700}
  .formcard{background:#fff;border:1px solid var(--line);border-radius:22px;padding:32px;box-shadow:0 20px 50px rgba(19,49,61,.08)}
  .formcard h3{font-size:24px}.formcard .formgrid{margin-top:18px}
  .sec{padding:70px 0}.sec h2{font-size:34px;text-align:center}
  .gal{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-top:40px}
  .gal img{aspect-ratio:4/3;object-fit:cover;border-radius:14px;width:100%}
  .pro{background:var(--ink);color:#fff}
  .pro .wrap{display:grid;grid-template-columns:1fr 1fr;gap:46px;align-items:center;padding:64px 28px}
  .pro img{border-radius:18px;aspect-ratio:4/3;object-fit:cover;width:100%}
  .pro h2{font-size:32px}.pro p{color:#cfe0e6;margin-top:14px}
  footer{background:var(--footer);color:#9fc0cc;text-align:center;padding:30px;font-size:13px}`;
  const gal = img.gallery.slice(0, 3).map((u) => `<img src="${u}" alt="Spa">`).join("");
  const ul = ["Marges pro & remises par volume", "Stock et livraison partout en France", "Formation et supports marketing fournis", "SAV réactif et garantie constructeur"]
    .map((t) => `<div><span class="b">✓</span><span>${t}</span></div>`).join("");
  const body = `
  <header><div class="wrap"><img src="${img.logo}" alt="Quintessence Spas"><nav><a>Avantages</a><a>La gamme</a><a>Contact</a></nav></div></header>
  <section class="hero"><div class="wrap">
    <div><span class="eyebrow">Devenir revendeur · B2B</span>
      <h1>Votre nouveau rayon spas premium commence ici</h1>
      <p>Fournisseur de spas rigides haut de gamme pour piscinistes, paysagistes et revendeurs. Une gamme qui valorise votre showroom, un partenaire qui assure derrière.</p>
      <div class="ul">${ul}</div></div>
    <div class="formcard" id="form"><h3>Candidature revendeur</h3>${formFields()}<button class="btn btn-terra" style="width:100%;margin-top:20px;border:0">Recevoir nos tarifs pro</button>
      <p style="font-size:12px;color:var(--muted);margin-top:12px;text-align:center">Réservé aux professionnels · réponse sous 48 h</p></div>
  </div></section>
  <section class="sec"><div class="wrap"><h2>Une gamme prête à vendre</h2><div class="gal">${gal}</div></div></section>
  <div class="pro"><div class="wrap"><div><span class="eyebrow" style="color:var(--gold)">Notre savoir-faire</span><h2 style="margin-top:12px">15 ans d'expertise du spa rigide</h2><p>Sélection rigoureuse, logistique 35T maîtrisée, équipes formées et SAV France. Vous vendez, on sécurise toute la chaîne.</p></div><img src="${img.showroom}" alt="Conseil en showroom"></div></div>
  <footer>Quintessence Spas — Spas rigides premium · France · contact@quintessencespas.com</footer>`;
  return page("Revendeur — C · Split conversion", css, body);
}

/* ============ D — Magazine premium sombre (éditorial + cuivre) ============ */
function templateD() {
  const css = `
  body{background:#0c1f26;color:#e8f0f3}
  header .wrap{display:flex;align-items:center;justify-content:space-between;padding:24px 28px}
  header img{height:34px}
  .hero{padding:40px 0 80px}
  .hero .wrap{text-align:center}
  .hero .eyebrow{color:var(--gold)}
  .hero h1{font-size:62px;color:#fff;margin-top:16px}
  .hero h1 em{color:var(--gold)}
  .hero p{color:#aebfc6;max-width:600px;margin:20px auto 0;font-size:18px}
  .hero .cta{margin-top:30px}
  .big{margin-top:50px;border-radius:22px;overflow:hidden;aspect-ratio:21/9}
  .big img{width:100%;height:100%;object-fit:cover}
  .sec{padding:70px 0}
  .adv{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.1);border-radius:18px;overflow:hidden}
  .adv .card{background:#0c1f26;padding:30px}
  .adv h3{color:#fff;font-size:22px}.adv h3 .g{color:var(--gold);font-family:'Inter';font-size:13px;font-weight:700;letter-spacing:.1em}
  .adv p{color:#aebfc6;margin-top:8px;font-size:14px}
  .collage{display:grid;grid-template-columns:2fr 1fr 1fr;grid-auto-rows:160px;gap:12px}
  .collage img{width:100%;height:100%;object-fit:cover;border-radius:12px}
  .collage .tall{grid-row:span 2}
  .formsec .wrap{max-width:760px}
  .formcard{background:#102a33;border:1px solid rgba(255,255,255,.12);border-radius:24px;padding:40px;margin-top:34px}
  .formcard label{color:#cfe0e6}
  .formcard input,.formcard textarea,.formcard select{background:#0c1f26;border-color:rgba(255,255,255,.18);color:#fff}
  h2{color:#fff}.eyebrow{color:var(--gold)}
  .ctr{text-align:center}
  footer{border-top:1px solid rgba(255,255,255,.1);text-align:center;padding:30px;font-size:13px;color:#aebfc6}`;
  const adv = avantages.map(([t, d], i) => `<div class="card"><h3><span class="g">0${i + 1}</span><br>${t}</h3><p>${d}</p></div>`).join("");
  const g = img.gallery;
  const collage = `<div class="collage"><img class="tall" src="${g[0]}"><img src="${g[1]}"><img src="${g[2]}"><img src="${g[3]}"><img src="${g[4]}"></div>`;
  const body = `
  <header><div class="wrap"><img src="${img.logoWhite}" alt="Quintessence Spas"><a href="#form" class="btn btn-light" style="padding:11px 22px">Devenir revendeur</a></div></header>
  <section class="hero"><div class="wrap"><span class="eyebrow">Programme revendeurs · B2B</span>
    <h1>Distribuez l'excellence du <em>spa rigide</em></h1>
    <p>Devenez le partenaire Quintessence sur votre territoire. Une gamme premium, des marges pensées pour les pros, un accompagnement de bout en bout.</p>
    <div class="cta"><a href="#form" class="btn btn-light">Poser ma candidature</a></div>
    <div class="big"><img src="${img.hero}" alt="Spa rigide premium"></div></div></section>
  <section class="sec"><div class="wrap ctr"><span class="eyebrow">Pourquoi nous rejoindre</span><h2 style="font-size:40px;margin-top:10px">Un partenariat d'exception</h2></div>
    <div class="wrap" style="margin-top:40px"><div class="adv">${adv}</div></div></section>
  <section class="sec" style="padding-top:0"><div class="wrap"><h2 style="font-size:32px;margin-bottom:28px">La gamme</h2>${collage}</div></section>
  <section class="sec formsec" id="form"><div class="wrap ctr"><span class="eyebrow">Candidature</span><h2 style="font-size:40px;margin-top:10px">Rejoignez le réseau</h2><p style="color:#aebfc6;margin-top:10px">Réponse sous 48 h avec nos conditions professionnelles.</p>
    <div class="formcard" style="text-align:left">${formFields()}<button class="btn btn-light" style="width:100%;margin-top:22px;border:0">Envoyer ma candidature</button></div></div></section>
  <footer>Quintessence Spas — Spas rigides premium · France · contact@quintessencespas.com</footer>`;
  return page("Revendeur — D · Magazine premium", css, body);
}

const templates = [
  { file: "a-corporate.html", label: "A — Corporate clair", desc: "Sobre, bleu eau, aligné à la marque", fn: templateA },
  { file: "b-hero-plein.html", label: "B — Hero plein écran", desc: "Image immersive, impact visuel fort", fn: templateB },
  { file: "c-split.html", label: "C — Split conversion", desc: "Formulaire dès le hero, orienté leads", fn: templateC },
  { file: "d-magazine.html", label: "D — Magazine premium", desc: "Sombre, accents cuivre, éditorial", fn: templateD },
];

for (const t of templates) writeFileSync(join(OUT, t.file), t.fn(), "utf8");

const index = `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Landing revendeur — 4 propositions</title>${FONTS}<style>
*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Inter',sans-serif;background:#0f2932;color:#e8f0f3;padding:32px}
h1{font-family:'Fraunces',serif;font-weight:500;font-size:30px;text-align:center}
.sub{text-align:center;color:#9fc0cc;margin-top:8px;font-size:14px;max-width:720px;margin-inline:auto}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:26px;max-width:1500px;margin:32px auto 0}
.cell{background:#13333f;border:1px solid #25525f;border-radius:14px;overflow:hidden}
.bar{display:flex;justify-content:space-between;align-items:center;padding:14px 18px;border-bottom:1px solid #25525f}
.bar b{font-size:15px}.bar span{font-size:12px;color:#9fc0cc}.bar a{font-size:12px;color:#d8b27a;font-weight:600}
.frame{height:560px;overflow:hidden;background:#fff}
.frame iframe{width:1280px;height:1900px;border:0;transform:scale(.566);transform-origin:top left}
@media(max-width:1200px){.grid{grid-template-columns:1fr}}
</style></head><body>
<h1>Landing « Devenir revendeur » — 4 propositions</h1>
<p class="sub">Chaque design met en avant les spas, le professionnalisme, les avantages, des photos et un formulaire de candidature (société, coordonnées, site internet). Clique « Plein écran » pour parcourir, puis dis-moi laquelle tu valides.</p>
<div class="grid">
${templates.map((t) => `<div class="cell"><div class="bar"><div><b>${t.label}</b> <span>— ${t.desc}</span></div><a href="${t.file}" target="_blank">Plein écran →</a></div><div class="frame"><iframe src="${t.file}" scrolling="no"></iframe></div></div>`).join("\n")}
</div></body></html>`;
writeFileSync(join(OUT, "index.html"), index, "utf8");
console.log("OK — 4 landing pages + index générés");
