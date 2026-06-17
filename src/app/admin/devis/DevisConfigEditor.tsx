"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  DEVIS_TYPE_LABELS,
  DEVIS_VARS,
  DEVIS_VAR_GROUPS,
  type DevisConfig,
  type DevisLine,
  type DevisLineType,
} from "@/lib/devis";

const input =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";
const label = "block text-sm font-medium";

const TYPES: DevisLineType[] = ["livraison", "installation", "accessoire"];

export function DevisConfigEditor({ initial }: { initial: DevisConfig }) {
  const router = useRouter();
  const [subject, setSubject] = useState(initial.subject);
  const [title, setTitle] = useState(initial.title);
  const [validityDays, setValidityDays] = useState(String(initial.validityDays));
  const [delayMinutes, setDelayMinutes] = useState(String(initial.delayMinutes));
  const [extraRemise, setExtraRemise] = useState(
    String(initial.extraRemisePct ?? 0),
  );
  const [intro, setIntro] = useState(
    initial.introVariants?.length
      ? initial.introVariants.join("\n---\n")
      : initial.intro,
  );
  const [lines, setLines] = useState<DevisLine[]>(initial.lines);
  const [genericDelay, setGenericDelay] = useState(
    String(initial.genericDelayMinutes),
  );
  const [gSubject, setGSubject] = useState(initial.genericSubject);
  const [gTitle, setGTitle] = useState(initial.genericTitle);
  const [gBody, setGBody] = useState(initial.genericBody);
  const [status, setStatus] = useState<"" | "saving" | "saved">("");
  const [msg, setMsg] = useState("");

  const subjectRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const introRef = useRef<HTMLTextAreaElement>(null);
  const gSubjectRef = useRef<HTMLInputElement>(null);
  const gTitleRef = useRef<HTMLTextAreaElement>(null);
  const gBodyRef = useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = useState<
    "subject" | "title" | "intro" | "gsubject" | "gtitle" | "gbody"
  >("intro");

  const fields = {
    subject: { ref: subjectRef, value: subject, set: setSubject },
    title: { ref: titleRef, value: title, set: setTitle },
    intro: { ref: introRef, value: intro, set: setIntro },
    gsubject: { ref: gSubjectRef, value: gSubject, set: setGSubject },
    gtitle: { ref: gTitleRef, value: gTitle, set: setGTitle },
    gbody: { ref: gBodyRef, value: gBody, set: setGBody },
  };

  function insertVar(key: string) {
    const token = `{${key}}`;
    const f = fields[focused];
    const el = f.ref.current;
    if (!el) {
      f.set((v: string) => v + token);
      return;
    }
    const s = el.selectionStart ?? f.value.length;
    const e = el.selectionEnd ?? f.value.length;
    f.set(f.value.slice(0, s) + token + f.value.slice(e));
    requestAnimationFrame(() => {
      el.focus();
      const pos = s + token.length;
      el.setSelectionRange(pos, pos);
    });
  }

  const patch = (id: string, p: Partial<DevisLine>) =>
    setLines((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));
  const remove = (id: string) =>
    setLines((ls) => ls.filter((l) => l.id !== id));
  const add = (type: DevisLineType) =>
    setLines((ls) => [
      ...ls,
      {
        id: `l-${Date.now()}`,
        type,
        label: "",
        price: 0,
        active: true,
      },
    ]);

  async function save() {
    // Le champ « texte d'accompagnement » contient une ou plusieurs variantes
    // séparées par une ligne « --- ». Une est tirée au hasard à chaque devis.
    const introList = intro
      .split(/\n*---\n*/)
      .map((t) => t.trim())
      .filter(Boolean);
    const config: DevisConfig = {
      template: initial.template,
      subject: subject.trim(),
      title: title.trim(),
      validityDays: Number(validityDays) || 30,
      delayMinutes: Number(delayMinutes) || 40,
      extraRemisePct: Number(extraRemise) || 0,
      intro: introList[0] ?? intro.trim(),
      introVariants: introList,
      lines: lines
        .filter((l) => l.label.trim())
        .map((l) => ({
          ...l,
          label: l.label.trim(),
          price: Number(l.price) || 0,
          ...(l.description?.trim()
            ? { description: l.description.trim() }
            : { description: undefined }),
        })),
      genericDelayMinutes: Number(genericDelay) || 12,
      genericSubject: gSubject.trim(),
      genericTitle: gTitle.trim(),
      genericBody: gBody.trim(),
    };
    setStatus("saving");
    setMsg("");
    const res = await fetch("/api/admin/devis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(config),
    });
    if (res.ok) {
      setStatus("saved");
      router.refresh();
      setTimeout(() => setStatus(""), 2000);
    } else {
      setStatus("");
      setMsg("Erreur à l'enregistrement.");
    }
  }

  return (
    <div className="mt-8 space-y-9">
      {/* Réglages */}
      <section>
        <h2 className="text-xl">Réglages du devis</h2>
        <p className="mt-1 text-sm text-muted">
          Template validé : <strong>Proposition 3</strong>.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Validité de l&apos;offre (jours)</label>
            <input
              type="number"
              className={`mt-1.5 ${input}`}
              value={validityDays}
              onChange={(e) => setValidityDays(e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Envoi automatique après (minutes)</label>
            <input
              type="number"
              className={`mt-1.5 ${input}`}
              value={delayMinutes}
              onChange={(e) => setDelayMinutes(e.target.value)}
            />
          </div>
          <div>
            <label className={label}>
              Remise devis supplémentaire (%)
            </label>
            <input
              type="number"
              className={`mt-1.5 ${input}`}
              value={extraRemise}
              onChange={(e) => setExtraRemise(e.target.value)}
            />
            <p className="mt-1 text-xs text-muted">
              Appliquée sur le prix du site (en plus de la promo affichée en
              ligne) uniquement dans le devis.
            </p>
          </div>
        </div>
        {/* Variables partagées */}
        <div className="mt-5">
          <label className={label}>Variables disponibles</label>
          <p className="mt-1 text-xs text-muted">
            Cliquez une variable pour l&apos;insérer dans le champ sélectionné
            (objet, titre ou texte). Elle sera remplacée par la donnée du client
            à l&apos;envoi.
          </p>
          <div className="mt-2 space-y-2">
            {DEVIS_VAR_GROUPS.map((group) => (
              <div key={group} className="flex flex-wrap items-center gap-2">
                <span className="w-16 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-olive">
                  {group}
                </span>
                {DEVIS_VARS.filter((v) => v.group === group).map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => insertVar(v.key)}
                    title={`${v.label} (ex. ${v.example})`}
                    className="rounded-lg border border-line bg-card px-2.5 py-1 text-xs hover:bg-cream"
                  >
                    {v.label}{" "}
                    <span className="text-muted">{`{${v.key}}`}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Objet du mail */}
        <div className="mt-5">
          <label className={label}>Objet du mail</label>
          <input
            ref={subjectRef}
            onFocus={() => setFocused("subject")}
            className={`mt-1.5 ${input}`}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>

        {/* Titre du devis */}
        <div className="mt-4">
          <label className={label}>Titre du devis</label>
          <p className="mt-1 text-xs text-muted">
            {"Encadrez un mot avec * pour le mettre en avant (ex. votre *{modele_court}* vous attend). Retour à la ligne autorisé."}
          </p>
          <textarea
            ref={titleRef}
            onFocus={() => setFocused("title")}
            rows={2}
            className={`mt-1.5 ${input}`}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Texte d'accompagnement (variantes) */}
        <div className="mt-4">
          <label className={label}>
            Textes d&apos;accompagnement (variantes)
          </label>
          <p className="mt-1 text-xs text-muted">
            Séparez chaque variante par une ligne contenant uniquement{" "}
            <code className="rounded bg-cream px-1">---</code>. À chaque devis,
            une variante est choisie au hasard (évite d&apos;envoyer toujours le
            même texte). Les sauts de ligne et la signature sont conservés.
          </p>
          <textarea
            ref={introRef}
            onFocus={() => setFocused("intro")}
            rows={14}
            className={`mt-1.5 ${input}`}
            value={intro}
            onChange={(e) => setIntro(e.target.value)}
          />
        </div>
      </section>

      {/* Lignes par type */}
      {TYPES.map((type) => {
        const group = lines.filter((l) => l.type === type);
        return (
          <section key={type}>
            <h2 className="text-xl">{DEVIS_TYPE_LABELS[type]}</h2>
            <div className="mt-3 space-y-2">
              {group.length === 0 && (
                <p className="text-sm text-muted">Aucune ligne.</p>
              )}
              {group.map((l) => (
                <div
                  key={l.id}
                  className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-card p-2.5"
                >
                  <label className="flex shrink-0 items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={l.active}
                      onChange={(e) => patch(l.id, { active: e.target.checked })}
                      className="h-4 w-4 accent-[color:var(--color-terra)]"
                    />
                    <span className="hidden sm:inline">Active</span>
                  </label>
                  <input
                    placeholder="Libellé"
                    value={l.label}
                    onChange={(e) => patch(l.id, { label: e.target.value })}
                    className={`${input} min-w-[160px] flex-1`}
                  />
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Prix"
                      value={l.price}
                      onChange={(e) =>
                        patch(l.id, { price: Number(e.target.value) })
                      }
                      className={`${input} w-24 text-right`}
                    />
                    <span className="text-sm text-muted">€</span>
                  </div>
                  <label className="flex shrink-0 items-center gap-1.5 text-sm">
                    <input
                      type="checkbox"
                      checked={!!l.offered}
                      onChange={(e) =>
                        patch(l.id, { offered: e.target.checked })
                      }
                      className="h-4 w-4 accent-[color:var(--color-terra)]"
                    />
                    Offert
                  </label>
                  <button
                    type="button"
                    onClick={() => remove(l.id)}
                    aria-label="Supprimer"
                    className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-cream hover:text-terra-dark"
                  >
                    ✕
                  </button>
                  <input
                    placeholder="Description (phrase sous le libellé — optionnel)"
                    value={l.description ?? ""}
                    onChange={(e) =>
                      patch(l.id, { description: e.target.value })
                    }
                    className={`${input} w-full`}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={() => add(type)}
                className="text-sm font-medium text-terra hover:underline"
              >
                + Ajouter une ligne
              </button>
            </div>
          </section>
        );
      })}

      {/* E-mail de demande générique */}
      <section className="rounded-2xl border border-line bg-cream/40 p-5">
        <h2 className="text-xl">E-mail de demande générique</h2>
        <p className="mt-1 text-sm text-muted">
          Envoyé automatiquement quand le client n&apos;a pas choisi de modèle,
          pour cadrer son projet avant de lui adresser un devis. Variables{" "}
          <strong>Client</strong> uniquement (prénom, nom, email).
        </p>
        <div className="mt-4">
          <label className={label}>Délai d&apos;envoi (minutes)</label>
          <input
            type="number"
            className={`mt-1.5 w-40 ${input}`}
            value={genericDelay}
            onChange={(e) => setGenericDelay(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className={label}>Objet du mail</label>
          <input
            ref={gSubjectRef}
            onFocus={() => setFocused("gsubject")}
            className={`mt-1.5 ${input}`}
            value={gSubject}
            onChange={(e) => setGSubject(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className={label}>Titre</label>
          <p className="mt-1 text-xs text-muted">
            {"* pour mettre en avant, retour à la ligne autorisé."}
          </p>
          <textarea
            ref={gTitleRef}
            onFocus={() => setFocused("gtitle")}
            rows={2}
            className={`mt-1.5 ${input}`}
            value={gTitle}
            onChange={(e) => setGTitle(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <label className={label}>Corps du message</label>
          <p className="mt-1 text-xs text-muted">
            Une ligne commençant par «&nbsp;-&nbsp;» devient une puce. Les
            retours à la ligne sont respectés.
          </p>
          <textarea
            ref={gBodyRef}
            onFocus={() => setFocused("gbody")}
            rows={8}
            className={`mt-1.5 ${input}`}
            value={gBody}
            onChange={(e) => setGBody(e.target.value)}
          />
        </div>
      </section>

      {msg && <p className="text-sm text-terra-dark">{msg}</p>}

      <div className="flex items-center gap-4 border-t border-line pt-6">
        <button
          type="button"
          onClick={save}
          disabled={status === "saving"}
          className="rounded-full bg-terra px-7 py-3 font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
        >
          {status === "saving" ? "Enregistrement…" : "Enregistrer"}
        </button>
        {status === "saved" && (
          <span className="text-sm text-[#00b67a]">Enregistré ✓</span>
        )}
      </div>
    </div>
  );
}
