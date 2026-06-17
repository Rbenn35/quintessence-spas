"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus-visible:border-terra";

function SignaturePad({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
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

export function DevisSignForm({
  requestId,
  defaultName,
}: {
  requestId: string;
  defaultName: string;
}) {
  const router = useRouter();
  const [name, setName] = useState(defaultName);
  const [address, setAddress] = useState("");
  const [cp, setCp] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [diff, setDiff] = useState(false);
  const [dAddress, setDAddress] = useState("");
  const [dCp, setDCp] = useState("");
  const [dCity, setDCity] = useState("");
  const [sig, setSig] = useState<string | null>(null);
  const [accept, setAccept] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    if (!name.trim()) return setErr("Indiquez le nom du signataire.");
    if (!address.trim() || !cp.trim() || !city.trim())
      return setErr("Complétez votre adresse de facturation.");
    if (!phone.trim()) return setErr("Indiquez un numéro de téléphone.");
    if (!sig) return setErr("Votre signature est requise.");
    if (!accept) return setErr("Veuillez accepter le devis pour valider.");

    setBusy(true);
    const res = await fetch(`/api/devis/${requestId}/sign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        signerName: name.trim(),
        signatureDataUrl: sig,
        billing: { address: address.trim(), cp: cp.trim(), city: city.trim(), phone: phone.trim() },
        ...(diff
          ? { delivery: { address: dAddress.trim(), cp: dCp.trim(), city: dCity.trim() } }
          : {}),
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
      {/* Coordonnées */}
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted">
        Vos coordonnées
      </h4>
      <div className="mt-3 space-y-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className={`${INPUT} sm:col-span-2`} placeholder="Adresse postale" value={address} onChange={(e) => setAddress(e.target.value)} />
          <input className={INPUT} placeholder="Code postal" value={cp} onChange={(e) => setCp(e.target.value)} />
          <input className={INPUT} placeholder="Ville" value={city} onChange={(e) => setCity(e.target.value)} />
          <input className={`${INPUT} sm:col-span-2`} placeholder="Téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={diff} onChange={(e) => setDiff(e.target.checked)} />
          Adresse de livraison différente de la facturation
        </label>
        {diff && (
          <div className="grid gap-3 rounded-xl bg-cream/50 p-3 sm:grid-cols-2">
            <input className={`${INPUT} sm:col-span-2`} placeholder="Adresse de livraison" value={dAddress} onChange={(e) => setDAddress(e.target.value)} />
            <input className={INPUT} placeholder="Code postal (livraison)" value={dCp} onChange={(e) => setDCp(e.target.value)} />
            <input className={INPUT} placeholder="Ville (livraison)" value={dCity} onChange={(e) => setDCity(e.target.value)} />
          </div>
        )}
      </div>

      {/* Signature */}
      <div className="mt-7 rounded-xl border border-line bg-cream/40 p-5">
        <div className="mb-2 text-sm font-semibold">Bon pour accord — Nom du signataire</div>
        <input className={`${INPUT} mb-3`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom et prénom" />
        <SignaturePad onChange={setSig} />
        <label className="mt-3 flex items-start gap-2 text-[11px] leading-relaxed text-muted">
          <input type="checkbox" className="mt-0.5" checked={accept} onChange={(e) => setAccept(e.target.checked)} />
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
