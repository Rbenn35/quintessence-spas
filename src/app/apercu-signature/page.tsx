/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Données d'exemple — devis Prado pré-rempli, complet                */
/* ------------------------------------------------------------------ */
const SPA = {
  name: "Spa Prado 6 places",
  photo: "/products/prado-1.jpg",
  specs: [
    ["Places", "6 personnes"],
    ["Hydrojets", "33 jets"],
    ["Dimensions", "220 × 220 × 92 cm"],
    ["Électronique", "Gecko YJ3"],
    ["Réchauffeur", "2 kW"],
    ["Garantie", "5 ans"],
  ] as [string, string][],
};

const LINES = [
  {
    label: "Spa Prado 6 places",
    desc: "Coque Artitech Acrylic blanche, hydromassage 33 jets, lampe UV-C (99,9 % des germes), isolation renforcée, éclairage LED.",
    price: "10 140 €",
    old: "13 520 €",
  },
  {
    label: "Pack livraison",
    desc: "Livraison sur toute la France par camion semi-remorque 35T, déchargement au hayon et transpalette.",
    price: "540 €",
  },
  {
    label: "Couverture thermique",
    desc: "Protège l'eau et limite fortement les pertes de chaleur.",
    price: "Offert",
    offered: true,
  },
  {
    label: "Kit traitement de l'eau O'Pure",
    desc: "Traitement naturel et hypoallergénique, sans produit chimique dans l'eau.",
    price: "Offert",
    offered: true,
  },
];

const DEV = {
  ref: "DV-003521",
  date: "17 juin 2026",
  validite: 30,
  client: "Marie Durand",
  email: "marie.durand@email.fr",
  total: "10 680 €",
  economie: "3 990 €",
};

const COMPANY = {
  name: "Quintessence Spas",
  legal: "Marque de la société Quality Spa (SARL)",
  addr: "14 Avenue des Vignes, 17320 Saint-Just-Luzac",
  email: "contact@quintessencespas.com",
  siren: "SIREN 832 359 137",
};

const LEGAL =
  "En signant, vous acceptez ce devis. Votre adresse IP, la date et l'heure sont enregistrées à des fins de preuve légale.";

/* ------------------------------------------------------------------ */
/*  Pad de signature (souris + tactile)                                */
/* ------------------------------------------------------------------ */
function SignaturePad({ accent = "#1c6e8e", height = 150 }: { accent?: string; height?: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const [has, setHas] = useState(false);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ratio = window.devicePixelRatio || 1;
    c.width = c.offsetWidth * ratio;
    c.height = c.offsetHeight * ratio;
    const ctx = c.getContext("2d");
    if (!ctx) return;
    ctx.scale(ratio, ratio);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = accent;
  }, [accent]);
  const at = (e: React.PointerEvent) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const start = (e: React.PointerEvent) => {
    e.preventDefault();
    drawing.current = true;
    const ctx = ref.current!.getContext("2d")!;
    const { x, y } = at(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return;
    e.preventDefault();
    const ctx = ref.current!.getContext("2d")!;
    const { x, y } = at(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHas(true);
  };
  const end = () => {
    drawing.current = false;
  };
  const clear = () => {
    const c = ref.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setHas(false);
  };
  return (
    <div>
      <canvas
        ref={ref}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        style={{ height, touchAction: "none" }}
        className="w-full cursor-crosshair rounded-xl border-2 border-dashed border-line bg-white"
      />
      <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
        <span>{has ? "✓ Signature saisie" : "Signez dans le cadre"}</span>
        <button type="button" onClick={clear} className="underline hover:text-terra">
          Effacer
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Briques réutilisables                                              */
/* ------------------------------------------------------------------ */
const INPUT = "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:border-terra";

function CoordForm() {
  const [diff, setDiff] = useState(false);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input className={`${INPUT} sm:col-span-2`} placeholder="Adresse postale" defaultValue="" />
        <input className={INPUT} placeholder="Code postal" />
        <input className={INPUT} placeholder="Ville" />
        <input className={`${INPUT} sm:col-span-2`} placeholder="Téléphone" />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} />
        Adresse de livraison différente de la facturation
      </label>
      {diff && (
        <div className="grid gap-3 rounded-xl bg-cream/50 p-3 sm:grid-cols-2">
          <input className={`${INPUT} sm:col-span-2`} placeholder="Adresse de livraison" />
          <input className={INPUT} placeholder="Code postal (livraison)" />
          <input className={INPUT} placeholder="Ville (livraison)" />
        </div>
      )}
    </div>
  );
}

function SpecsGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
      {SPA.specs.map(([k, v]) => (
        <div key={k} className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-muted">{k}</span>
          <span className="font-medium">{v}</span>
        </div>
      ))}
    </div>
  );
}

function LinesWithDesc() {
  return (
    <div className="divide-y divide-line">
      {LINES.map((l) => (
        <div key={l.label} className="flex items-start justify-between gap-4 py-3">
          <div className="min-w-0">
            <div className="font-medium">{l.label}</div>
            <div className="mt-0.5 text-xs leading-relaxed text-muted">{l.desc}</div>
          </div>
          <div className={`shrink-0 text-right text-sm ${l.offered ? "font-semibold text-[#00917f]" : "font-medium"}`}>
            {l.old && <div className="text-xs text-muted line-through">{l.old}</div>}
            {l.price}
          </div>
        </div>
      ))}
    </div>
  );
}

function CompanyBlock({ light = false }: { light?: boolean }) {
  return (
    <div className={`text-xs leading-relaxed ${light ? "text-white/70" : "text-muted"}`}>
      <span className="font-semibold">{COMPANY.name}</span> — {COMPANY.legal}
      <br />
      {COMPANY.addr}
      <br />
      {COMPANY.email} · {COMPANY.siren}
    </div>
  );
}

function SpaPhoto({ className = "" }: { className?: string }) {
  return (
    <img
      src={SPA.photo}
      alt={SPA.name}
      className={`w-full rounded-2xl object-cover ${className}`}
    />
  );
}

function SectionTitle({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="mx-auto mb-7 max-w-5xl">
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-terra px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
          {tag}
        </span>
        <h2 className="text-2xl">{title}</h2>
      </div>
      <p className="mt-1 text-sm text-muted">{desc}</p>
    </div>
  );
}

function Totals({ accentClass = "text-terra" }: { accentClass?: string }) {
  return (
    <>
      <div className={`flex items-center justify-between border-t-2 border-ink pt-3 text-lg font-semibold ${accentClass}`}>
        <span>Total TTC</span>
        <span>{DEV.total}</span>
      </div>
      <p className="mt-1 text-right text-sm text-[#00917f]">Économie de {DEV.economie}</p>
    </>
  );
}

/* ================================================================== */
export default function ApercuSignaturePage() {
  return (
    <div className="bg-bg">
      <div className="mx-auto max-w-5xl px-6 pt-12">
        <h1 className="text-3xl sm:text-4xl">Devis à valider — 4 nouveaux templates</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Devis complet (photo, specs, descriptions, mentions légales) + formulaire
          coordonnées avant signature. Teste la signature. Choisis A, B, C ou D.
        </p>
      </div>

      {/* ====== TEMPLATE A — Devis professionnel A4 complet ====== */}
      <section className="mt-12 border-t border-line py-14">
        <SectionTitle tag="Template A" title="Devis professionnel (A4 complet)" desc="Document type facture : en-tête légal, photo + specs, lignes détaillées, coordonnées, signature." />
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-[0_10px_40px_rgba(19,49,61,0.08)] sm:p-12">
          <div className="flex items-start justify-between gap-4 border-b border-line pb-5">
            <div>
              <img src="/brand/logo.png" alt="Quintessence Spas" className="h-10" />
              <div className="mt-3">
                <CompanyBlock />
              </div>
            </div>
            <div className="shrink-0 text-right text-sm">
              <div className="font-semibold">Devis {DEV.ref}</div>
              <div className="text-muted">{DEV.date}</div>
              <div className="mt-1 text-muted">Validité {DEV.validite} j</div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.2fr]">
            <SpaPhoto className="h-44 sm:h-full" />
            <div>
              <h3 className="text-lg">{SPA.name}</h3>
              <div className="mt-3">
                <SpecsGrid />
              </div>
            </div>
          </div>

          <h4 className="mt-7 text-xs font-semibold uppercase tracking-wide text-muted">Détail de l'offre</h4>
          <div className="mt-1">
            <LinesWithDesc />
          </div>
          <div className="mt-3">
            <Totals />
          </div>

          <h4 className="mt-8 text-xs font-semibold uppercase tracking-wide text-muted">Vos coordonnées</h4>
          <div className="mt-3">
            <CoordForm />
          </div>

          <div className="mt-7 rounded-xl border border-line bg-cream/40 p-5">
            <div className="mb-2 text-sm font-semibold">Bon pour accord</div>
            <SignaturePad height={140} />
            <p className="mt-3 text-[11px] leading-relaxed text-muted">{LEGAL}</p>
          </div>
          <button className="mt-5 w-full rounded-full bg-ink py-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-terra">
            Valider et signer mon devis
          </button>
        </div>
      </section>

      {/* ====== TEMPLATE B — Deux colonnes ====== */}
      <section className="border-t border-line bg-cream/30 py-14">
        <SectionTitle tag="Template B" title="Deux colonnes (document | coordonnées + signature)" desc="Le devis complet à gauche, le formulaire et la signature à droite, collés." />
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-line bg-white p-7">
            <div className="flex items-center justify-between">
              <img src="/brand/logo.png" alt="Quintessence Spas" className="h-9" />
              <div className="text-right text-xs text-muted">Devis {DEV.ref}<br />{DEV.date}</div>
            </div>
            <SpaPhoto className="mt-5 h-48" />
            <h3 className="mt-4 text-lg">{SPA.name}</h3>
            <div className="mt-3">
              <SpecsGrid />
            </div>
            <div className="mt-5 border-t border-line pt-2">
              <LinesWithDesc />
            </div>
            <div className="mt-3">
              <Totals />
            </div>
            <div className="mt-5 border-t border-line pt-4">
              <CompanyBlock />
            </div>
          </div>
          <div className="h-fit rounded-2xl border border-terra/30 bg-white p-7 shadow-[0_12px_40px_rgba(19,49,61,0.10)] lg:sticky lg:top-6">
            <h3 className="text-xl">Vos coordonnées</h3>
            <div className="mt-4">
              <CoordForm />
            </div>
            <div className="mt-5 border-t border-line pt-5">
              <div className="mb-2 text-sm font-semibold">Votre signature</div>
              <SignaturePad height={150} />
              <label className="mt-3 flex items-start gap-2 text-xs text-muted">
                <input type="checkbox" className="mt-0.5" />
                <span>{LEGAL}</span>
              </label>
              <button className="mt-4 w-full rounded-full bg-terra py-3.5 text-sm font-semibold text-white hover:bg-ink">
                Valider et signer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ====== TEMPLATE C — Wizard 3 étapes ====== */}
      <section className="border-t border-line py-14">
        <SectionTitle tag="Template C" title="Parcours guidé (3 étapes)" desc="1. Coordonnées · 2. Votre devis · 3. Signature. Idéal mobile." />
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center gap-2 text-xs sm:text-sm">
            {["Coordonnées", "Votre devis", "Signature"].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                <span className="flex items-center gap-2 font-semibold text-terra">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terra text-white">{i + 1}</span>
                  {s}
                </span>
                {i < 2 && <span className="h-px w-6 bg-line sm:w-10" />}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-line bg-white p-7">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted">1 · Vos coordonnées</h3>
            <div className="mt-3">
              <CoordForm />
            </div>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">2 · Votre devis</h3>
            <SpaPhoto className="mt-3 h-44" />
            <h4 className="mt-3 text-lg">{SPA.name}</h4>
            <div className="mt-3">
              <SpecsGrid />
            </div>
            <div className="mt-4 rounded-xl bg-cream/40 p-4">
              <LinesWithDesc />
              <div className="mt-2">
                <Totals />
              </div>
            </div>

            <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-muted">3 · Signature</h3>
            <div className="mt-3">
              <SignaturePad height={150} />
            </div>
            <p className="mt-3 text-[11px] leading-relaxed text-muted">{LEGAL}</p>
            <div className="mt-3">
              <CompanyBlock />
            </div>
            <button className="mt-5 w-full rounded-full bg-terra py-3.5 text-sm font-semibold text-white hover:bg-ink">
              Je valide et signe mon devis
            </button>
          </div>
        </div>
      </section>

      {/* ====== TEMPLATE D — Premium sombre ====== */}
      <section className="border-t border-line bg-footer py-14 text-white">
        <SectionTitle tag="Template D" title="Premium (sombre, photo en avant)" desc="Photo du spa en grand, chiffres clés dorés, document blanc pour les détails et la signature." />
        <div className="mx-auto max-w-2xl px-6">
          <div className="text-center">
            <img src="/brand/logo-hero-white.png" alt="Quintessence Spas" className="mx-auto h-9" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">Devis {DEV.ref} · {DEV.date}</p>
          </div>
          <img src={SPA.photo} alt={SPA.name} className="mt-6 h-56 w-full rounded-2xl object-cover" />
          <h3 className="mt-5 text-center font-serif text-3xl">{SPA.name}</h3>
          <div className="mt-5 flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="text-3xl font-semibold">{DEV.total}</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Total TTC</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div className="text-center">
              <div className="text-3xl font-semibold text-gold">{DEV.economie}</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Économie</div>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-white p-7 text-ink">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              {SPA.specs.map(([k, v]) => (
                <div key={k}>
                  <div className="text-xs uppercase tracking-wide text-muted">{k}</div>
                  <div className="font-medium">{v}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 border-t border-line pt-2">
              <LinesWithDesc />
            </div>
            <h4 className="mt-6 text-xs font-semibold uppercase tracking-wide text-muted">Vos coordonnées</h4>
            <div className="mt-3">
              <CoordForm />
            </div>
            <div className="mt-6 border-t border-line pt-5">
              <div className="mb-2 text-sm font-semibold">Signez pour valider</div>
              <SignaturePad accent="#b8893f" height={150} />
              <p className="mt-3 text-[11px] leading-relaxed text-muted">{LEGAL}</p>
            </div>
          </div>
          <div className="mt-5 text-center">
            <CompanyBlock light />
          </div>
          <button className="mt-5 w-full rounded-full bg-gold py-4 text-sm font-semibold uppercase tracking-wider text-ink hover:brightness-95">
            Signer et valider mon devis
          </button>
        </div>
      </section>

      <div className="py-16" />
    </div>
  );
}
