/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Données d'exemple (devis pré-rempli)                               */
/* ------------------------------------------------------------------ */
const D = {
  ref: "DV-003521",
  modele: "Spa Prado 6 places",
  client: "Marie Durand",
  email: "marie.durand@email.fr",
  date: "17 juin 2026",
  validite: 30,
  lines: [
    { label: "Spa Prado 6 places", sub: "6 places · 33 hydrojets", price: "10 140 €", old: "13 520 €" },
    { label: "Pack livraison", sub: "Livraison 35T partout en France", price: "540 €" },
    { label: "Couverture thermique", sub: "", price: "Offert", offered: true },
    { label: "Kit traitement O'Pure", sub: "", price: "Offert", offered: true },
  ],
  total: "10 680 €",
  economie: "3 990 €",
};

const LEGAL =
  "En signant, vous acceptez ce devis. Votre adresse IP, la date et l'heure sont enregistrées à des fins de preuve légale.";

/* ------------------------------------------------------------------ */
/*  Pad de signature (canvas, souris + tactile)                        */
/* ------------------------------------------------------------------ */
function SignaturePad({
  accent = "#1c6e8e",
  height = 170,
}: {
  accent?: string;
  height?: number;
}) {
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
        <span>{has ? "✓ Signature saisie" : "Signez dans le cadre ci-dessus"}</span>
        <button type="button" onClick={clear} className="underline hover:text-terra">
          Effacer
        </button>
      </div>
    </div>
  );
}

function Lines() {
  return (
    <div className="divide-y divide-line">
      {D.lines.map((l) => (
        <div key={l.label} className="flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <div className="font-medium">{l.label}</div>
            {l.sub && <div className="text-xs text-muted">{l.sub}</div>}
          </div>
          <div className={`shrink-0 text-right ${l.offered ? "font-semibold text-[#00917f]" : ""}`}>
            {l.old && <div className="text-xs text-muted line-through">{l.old}</div>}
            {l.price}
          </div>
        </div>
      ))}
    </div>
  );
}

function SectionTitle({ tag, title, desc }: { tag: string; title: string; desc: string }) {
  return (
    <div className="mx-auto mb-6 max-w-5xl">
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

export default function ApercuSignaturePage() {
  return (
    <div className="bg-bg">
      <div className="mx-auto max-w-5xl px-6 pt-12">
        <h1 className="text-3xl sm:text-4xl">Validation du devis — 4 templates</h1>
        <p className="mt-2 max-w-2xl text-muted">
          Page sur laquelle le client atterrit en cliquant « Valider mon devis ».
          Teste la signature (souris/doigt). Dis-moi le template préféré (A, B, C ou D).
        </p>
      </div>

      {/* ============ TEMPLATE A — Document A4 formel ============ */}
      <section className="mt-12 border-t border-line py-14">
        <SectionTitle
          tag="Template A"
          title="Document type contrat (A4)"
          desc="Ressemble à un vrai devis papier à signer. Formel, rassurant, juridique."
        />
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-[0_10px_40px_rgba(19,49,61,0.08)] sm:p-12">
          <div className="flex items-center justify-between border-b border-line pb-5">
            <img src="/brand/logo.png" alt="Quintessence Spas" className="h-10" />
            <div className="text-right text-sm">
              <div className="font-semibold">Devis {D.ref}</div>
              <div className="text-muted">{D.date}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-xs uppercase tracking-wide text-muted">Client</div>
              <div className="font-medium">{D.client}</div>
              <div className="text-muted">{D.email}</div>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-muted">Validité</div>
              <div className="font-medium">{D.validite} jours</div>
            </div>
          </div>
          <h3 className="mt-6 text-lg">{D.modele}</h3>
          <div className="mt-2">
            <Lines />
          </div>
          <div className="mt-4 flex items-center justify-between border-t-2 border-ink pt-4 text-lg font-semibold">
            <span>Total TTC</span>
            <span>{D.total}</span>
          </div>
          <div className="mt-8 rounded-xl border border-line bg-cream/40 p-5">
            <div className="mb-2 text-sm font-semibold">Bon pour accord</div>
            <SignaturePad height={150} />
            <p className="mt-3 text-[11px] leading-relaxed text-muted">{LEGAL}</p>
          </div>
          <button className="mt-5 w-full rounded-full bg-ink py-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-terra">
            Valider et signer mon devis
          </button>
        </div>
      </section>

      {/* ============ TEMPLATE B — Deux colonnes e-signature ============ */}
      <section className="border-t border-line bg-cream/30 py-14">
        <SectionTitle
          tag="Template B"
          title="Deux colonnes (style e-signature)"
          desc="Devis à gauche, panneau de signature à droite. Moderne, façon Yousign/DocuSign."
        />
        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-line bg-white p-7">
            <img src="/brand/logo.png" alt="Quintessence Spas" className="h-9" />
            <div className="mt-5 text-xs uppercase tracking-wide text-muted">
              Devis {D.ref} · {D.modele}
            </div>
            <div className="mt-3">
              <Lines />
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-lg font-semibold text-terra">
              <span>Total TTC</span>
              <span>{D.total}</span>
            </div>
            <p className="mt-2 text-sm text-[#00917f]">Économie de {D.economie}</p>
          </div>
          <div className="h-fit rounded-2xl border border-terra/30 bg-white p-7 shadow-[0_12px_40px_rgba(19,49,61,0.10)] lg:sticky lg:top-6">
            <h3 className="text-xl">Signez votre devis</h3>
            <label className="mt-4 block text-xs font-medium text-muted">Nom du signataire</label>
            <input
              defaultValue={D.client}
              className="mt-1 w-full rounded-lg border border-line px-3 py-2 text-sm"
            />
            <div className="mt-4">
              <SignaturePad height={160} />
            </div>
            <label className="mt-4 flex items-start gap-2 text-xs text-muted">
              <input type="checkbox" className="mt-0.5" />
              <span>{LEGAL}</span>
            </label>
            <button className="mt-4 w-full rounded-full bg-terra py-3.5 text-sm font-semibold text-white hover:bg-ink">
              Valider et signer
            </button>
          </div>
        </div>
      </section>

      {/* ============ TEMPLATE C — Wizard 2 étapes ============ */}
      <section className="border-t border-line py-14">
        <SectionTitle
          tag="Template C"
          title="Parcours guidé (2 étapes)"
          desc="Étape 1 : vérifier le devis. Étape 2 : signer. Idéal mobile."
        />
        <div className="mx-auto max-w-2xl">
          <div className="flex items-center justify-center gap-3 text-sm">
            <span className="flex items-center gap-2 font-semibold text-terra">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terra text-white">1</span>
              Vérifier
            </span>
            <span className="h-px w-10 bg-line" />
            <span className="flex items-center gap-2 font-semibold text-terra">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-terra text-white">2</span>
              Signer
            </span>
          </div>
          <div className="mt-8 rounded-2xl border border-line bg-white p-7">
            <div className="text-center">
              <div className="text-xs uppercase tracking-wide text-muted">Devis {D.ref}</div>
              <div className="mt-1 text-2xl">{D.modele}</div>
              <div className="mt-3 text-4xl font-semibold text-terra">{D.total}</div>
              <div className="text-sm text-[#00917f]">Économie de {D.economie}</div>
            </div>
            <div className="mt-6 rounded-xl bg-cream/40 p-4">
              <Lines />
            </div>
            <div className="mt-7 border-t border-line pt-6">
              <div className="mb-2 text-sm font-semibold">Votre signature</div>
              <SignaturePad height={160} />
              <p className="mt-3 text-[11px] leading-relaxed text-muted">{LEGAL}</p>
              <button className="mt-4 w-full rounded-full bg-terra py-3.5 text-sm font-semibold text-white hover:bg-ink">
                Je valide et signe mon devis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============ TEMPLATE D — Premium épuré centré ============ */}
      <section className="border-t border-line bg-footer py-14 text-white">
        <SectionTitle
          tag="Template D"
          title="Premium épuré (sombre)"
          desc="Centré, élégant, accents dorés. Aligné à l'image haut de gamme de la marque."
        />
        <div className="mx-auto max-w-xl px-6 text-center">
          <img src="/brand/logo-hero-white.png" alt="Quintessence Spas" className="mx-auto h-9" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Devis {D.ref}
          </p>
          <h3 className="mt-2 font-serif text-3xl">{D.modele}</h3>
          <div className="mt-6 flex items-center justify-center gap-8">
            <div>
              <div className="text-3xl font-semibold">{D.total}</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Total TTC</div>
            </div>
            <div className="h-10 w-px bg-white/20" />
            <div>
              <div className="text-3xl font-semibold text-gold">{D.economie}</div>
              <div className="text-xs uppercase tracking-wide text-white/60">Économie</div>
            </div>
          </div>
          <div className="mt-8 rounded-2xl bg-white p-6 text-left text-ink">
            <div className="mb-2 text-sm font-semibold">Signez pour valider</div>
            <SignaturePad accent="#b8893f" height={160} />
            <p className="mt-3 text-[11px] leading-relaxed text-muted">{LEGAL}</p>
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
