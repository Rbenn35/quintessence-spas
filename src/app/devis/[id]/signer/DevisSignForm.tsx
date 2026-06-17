"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPhone, phoneDigits, isValidPhone } from "@/lib/format";

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:border-terra";

type Addr = { address: string; cp: string; city: string };

/* ------------------------------------------------------------------ */
/*  Autocomplétion d'adresse — Base Adresse Nationale (data.gouv.fr)   */
/* ------------------------------------------------------------------ */
type BanFeature = {
  properties: {
    id: string;
    label: string;
    name: string;
    postcode: string;
    city: string;
  };
};

function AddressAutocomplete({
  selected,
  onSelect,
}: {
  selected: Addr;
  onSelect: (a: Addr) => void;
}) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<BanFeature[]>([]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function search(v: string) {
    setQ(v);
    onSelect({ address: "", cp: "", city: "" }); // invalide tant que non choisi dans la liste
    if (timer.current) clearTimeout(timer.current);
    if (v.trim().length < 3) {
      setResults([]);
      setOpen(false);
      return;
    }
    timer.current = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(v)}&limit=5`,
        );
        const d = await r.json();
        setResults(d.features || []);
        setOpen(true);
      } catch {
        setResults([]);
      }
    }, 250);
  }

  function pick(f: BanFeature) {
    const p = f.properties;
    setQ(p.label);
    setOpen(false);
    setResults([]);
    onSelect({ address: p.name, cp: p.postcode, city: p.city });
  }

  return (
    <div className="relative">
      <input
        className={INPUT}
        placeholder="Saisissez votre adresse puis choisissez dans la liste"
        value={q}
        onChange={(e) => search(e.target.value)}
        autoComplete="off"
      />
      {open && results.length > 0 && (
        <ul className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-line bg-white shadow-lg">
          {results.map((f) => (
            <li key={f.properties.id}>
              <button
                type="button"
                onClick={() => pick(f)}
                className="block w-full px-3 py-2 text-left text-sm hover:bg-cream"
              >
                {f.properties.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected.address && (
        <p className="mt-1 text-xs text-[#00917f]">
          ✓ {selected.address}, {selected.cp} {selected.city}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pad de signature                                                   */
/* ------------------------------------------------------------------ */
function SignaturePad({ onChange }: { onChange: (d: string | null) => void }) {
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
    ctx.strokeStyle = "#13313d";
  }, []);

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
    if (!has) setHas(true);
  };
  const end = () => {
    if (drawing.current) {
      drawing.current = false;
      onChange(ref.current!.toDataURL("image/png"));
    }
  };
  const clear = () => {
    const c = ref.current!;
    c.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setHas(false);
    onChange(null);
  };

  return (
    <div>
      <canvas
        ref={ref}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        style={{ height: 150, touchAction: "none" }}
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
export function DevisSignForm({
  requestId,
  defaultName,
}: {
  requestId: string;
  defaultName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [billing, setBilling] = useState<Addr>({ address: "", cp: "", city: "" });
  const [phone, setPhone] = useState("");
  const [diff, setDiff] = useState(false);
  const [delivery, setDelivery] = useState<Addr>({ address: "", cp: "", city: "" });
  const [sig, setSig] = useState<string | null>(null);
  const [accept, setAccept] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    if (!name.trim()) return setErr("Indiquez le nom du signataire.");
    if (!billing.address || !billing.cp || !billing.city)
      return setErr("Sélectionnez votre adresse de facturation dans la liste.");
    if (!isValidPhone(phone))
      return setErr("Le téléphone doit comporter 10 chiffres.");
    if (diff && (!delivery.address || !delivery.cp || !delivery.city))
      return setErr("Sélectionnez l'adresse de livraison dans la liste.");
    if (!sig) return setErr("Votre signature est requise.");
    if (!accept) return setErr("Veuillez accepter le devis pour valider.");

    setBusy(true);
    const res = await fetch(`/api/devis/${requestId}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signerName: name.trim(),
        signatureDataUrl: sig,
        billing: { ...billing, phone: phoneDigits(phone) },
        ...(diff ? { delivery } : {}),
      }),
    });
    const data = await res.json().catch(() => ({}));
    setBusy(false);
    if (res.ok && data.ok) {
      router.push(data.redirect || `/devis/${requestId}/valide`);
      router.refresh();
    } else {
      setErr(data.error || "Une erreur est survenue. Réessayez.");
    }
  }

  return (
    <div className="mt-8 border-t border-line pt-7">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Vos coordonnées
      </h4>
      <div className="mt-3 space-y-3">
        <div>
          <label className="mb-1 block text-xs text-muted">
            Adresse de facturation
          </label>
          <AddressAutocomplete selected={billing} onSelect={setBilling} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted">Téléphone</label>
          <input
            className={INPUT}
            inputMode="numeric"
            placeholder="06 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={diff}
            onChange={(e) => setDiff(e.target.checked)}
          />
          Adresse de livraison différente de la facturation
        </label>
        {diff && (
          <div className="rounded-xl bg-cream/50 p-3">
            <label className="mb-1 block text-xs text-muted">
              Adresse de livraison
            </label>
            <AddressAutocomplete selected={delivery} onSelect={setDelivery} />
          </div>
        )}
      </div>

      <div className="mt-7 rounded-xl border border-line bg-cream/40 p-5">
        <div className="mb-2 text-sm font-semibold">
          Bon pour accord — Nom du signataire
        </div>
        <input
          className={`${INPUT} mb-3`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nom et prénom"
        />
        <SignaturePad onChange={setSig} />
        <label className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
          />
          <span>
            J&apos;accepte ce devis. Mon adresse IP, la date et l&apos;heure sont
            enregistrées à des fins de preuve légale.
          </span>
        </label>
      </div>

      {err && <p className="mt-3 text-sm text-terra-dark">{err}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-5 w-full rounded-full bg-ink py-4 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-terra disabled:opacity-60"
      >
        {busy ? "Validation…" : "Valider et signer mon devis"}
      </button>
    </div>
  );
}
