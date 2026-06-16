"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Article, ArticleFaq } from "@/lib/articles";

export type ProductRef = {
  slug: string;
  name: string;
  cover: string;
  prixFinal: number | null;
  prixInitial: number | null;
  remisePct?: number;
};

const input =
  "w-full rounded-xl border border-line bg-card px-3.5 py-2.5 text-sm outline-none focus-visible:border-terra";
const label = "block text-sm font-medium";
const tool =
  "rounded-lg border border-line bg-card px-3 py-1.5 text-sm hover:bg-cream";

function euro(n: number) {
  return n.toLocaleString("fr-FR");
}

export function ArticleEditor({
  initial,
  isNew,
  products,
}: {
  initial: Article;
  isNew: boolean;
  products: ProductRef[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial.title);
  const [slug, setSlug] = useState(initial.slug);
  const [category, setCategory] = useState(initial.category);
  const [excerpt, setExcerpt] = useState(initial.excerpt);
  const [readMin, setReadMin] = useState(String(initial.readMin));
  const [published, setPublished] = useState(initial.published);
  const [cover, setCover] = useState(initial.cover ?? "");
  const [tint0, setTint0] = useState(initial.tint[0]);
  const [tint1, setTint1] = useState(initial.tint[1]);
  const [content, setContent] = useState(initial.content);
  const [faq, setFaq] = useState<ArticleFaq[]>(initial.faq ?? []);
  const [metaTitle, setMetaTitle] = useState(initial.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial.metaDescription ?? "",
  );
  const [preview, setPreview] = useState(false);
  const [selProduct, setSelProduct] = useState(products[0]?.slug ?? "");
  const [status, setStatus] = useState<"" | "saving">("");
  const [msg, setMsg] = useState("");

  const taRef = useRef<HTMLTextAreaElement>(null);

  function slugify(v: string) {
    return v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }

  function insert(snippet: string) {
    const ta = taRef.current;
    if (!ta) {
      setContent((c) => c + snippet);
      return;
    }
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const next = content.slice(0, s) + snippet + content.slice(e);
    setContent(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = s + snippet.length;
      ta.setSelectionRange(pos, pos);
    });
  }

  function wrap(before: string, after: string, placeholder: string) {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    const sel = content.slice(s, e) || placeholder;
    const next = content.slice(0, s) + before + sel + after + content.slice(e);
    setContent(next);
  }

  function insertProductCard() {
    const p = products.find((x) => x.slug === selProduct);
    if (!p) return;
    const price =
      p.prixFinal != null ? `<b>${euro(p.prixFinal)} €</b>` : `<b>Sur devis</b>`;
    const old =
      p.remisePct && p.prixInitial != null
        ? `<s>${euro(p.prixInitial)} €</s>`
        : "";
    insert(
      `\n<a class="product-cta" href="/spas/${p.slug}">\n  <span class="product-cta-media" style="background-image:url('${p.cover}')"></span>\n  <span class="product-cta-body">\n    <span class="product-cta-cat">Notre sélection</span>\n    <span class="product-cta-title">${p.name}</span>\n    <span class="product-cta-price">${old}${price}</span>\n    <span class="product-cta-btn">Voir le spa →</span>\n  </span>\n</a>\n`,
    );
  }

  async function uploadCover(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    if (res.ok) setCover((await res.json()).path);
    e.target.value = "";
  }

  function build(): Article {
    const cleanFaq = faq
      .filter((f) => f.q.trim() || f.a.trim())
      .map((f) => ({ q: f.q.trim(), a: f.a.trim() }));
    return {
      slug: slug.trim(),
      title: title.trim(),
      category: category.trim() || "Guide",
      excerpt: excerpt.trim(),
      tint: [tint0, tint1],
      readMin: Number(readMin) || 5,
      ...(cover ? { cover } : {}),
      content,
      ...(cleanFaq.length ? { faq: cleanFaq } : {}),
      published,
      ...(metaTitle.trim() ? { metaTitle: metaTitle.trim() } : {}),
      ...(metaDescription.trim()
        ? { metaDescription: metaDescription.trim() }
        : {}),
    };
  }

  async function save() {
    const article = build();
    if (!article.slug || !article.title) {
      setMsg("Le titre et le slug sont obligatoires.");
      return;
    }
    setStatus("saving");
    setMsg("");
    const res = await fetch(
      isNew ? "/api/admin/articles" : `/api/admin/articles/${initial.slug}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      },
    );
    setStatus("");
    if (res.ok) {
      router.push("/admin/articles");
      router.refresh();
    } else {
      const d = await res.json().catch(() => ({}));
      setMsg(d.error || "Erreur à l'enregistrement.");
    }
  }

  async function remove() {
    if (!confirm(`Supprimer l'article « ${initial.title} » ?`)) return;
    await fetch(`/api/admin/articles/${initial.slug}`, { method: "DELETE" });
    router.push("/admin/articles");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/admin/articles" className="text-sm text-terra hover:underline">
        ← Retour aux articles
      </Link>
      <h1 className="mt-3 text-3xl">
        {isNew ? "Nouvel article" : `Modifier · ${initial.title}`}
      </h1>

      <div className="mt-8 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Titre</label>
            <input
              className={`mt-1.5 ${input}`}
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (isNew) setSlug(slugify(e.target.value));
              }}
            />
          </div>
          <div>
            <label className={label}>Slug (URL)</label>
            <input
              className={`mt-1.5 ${input}`}
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
            />
          </div>
          <div>
            <label className={label}>Catégorie</label>
            <input
              className={`mt-1.5 ${input}`}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className={label}>Temps de lecture (min)</label>
            <input
              type="number"
              className={`mt-1.5 ${input}`}
              value={readMin}
              onChange={(e) => setReadMin(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className={label}>Extrait (résumé affiché dans la liste)</label>
          <textarea
            rows={2}
            className={`mt-1.5 ${input}`}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />
        </div>

        {/* Cover */}
        <div>
          <label className={label}>Image de couverture (optionnelle)</label>
          <div className="mt-2 flex items-center gap-4">
            <div
              className="h-20 w-32 shrink-0 rounded-xl border border-line bg-cover bg-center"
              style={{
                backgroundImage: cover
                  ? `url('${cover}')`
                  : `linear-gradient(150deg, ${tint0}, ${tint1})`,
              }}
            />
            <label className={`${tool} cursor-pointer`}>
              Téléverser
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={uploadCover}
              />
            </label>
            {cover && (
              <button type="button" className={tool} onClick={() => setCover("")}>
                Retirer
              </button>
            )}
            <span className="text-xs text-muted">
              Sinon, dégradé :
              <input
                type="color"
                value={tint0}
                onChange={(e) => setTint0(e.target.value)}
                className="ml-2 align-middle"
              />
              <input
                type="color"
                value={tint1}
                onChange={(e) => setTint1(e.target.value)}
                className="ml-1 align-middle"
              />
            </span>
          </div>
        </div>

        {/* Contenu */}
        <div>
          <div className="flex items-center justify-between">
            <label className={label}>Contenu de l'article</label>
            <button
              type="button"
              className={tool}
              onClick={() => setPreview((v) => !v)}
            >
              {preview ? "Éditer" : "Aperçu"}
            </button>
          </div>

          {!preview ? (
            <>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" className={tool} onClick={() => insert("\n<h2>Titre de section</h2>\n")}>Titre</button>
                <button type="button" className={tool} onClick={() => insert("\n<h3>Sous-titre</h3>\n")}>Sous-titre</button>
                <button type="button" className={tool} onClick={() => insert("\n<p>Votre paragraphe…</p>\n")}>Paragraphe</button>
                <button type="button" className={tool} onClick={() => insert("\n<ul>\n  <li>Élément</li>\n  <li>Élément</li>\n</ul>\n")}>Liste</button>
                <button type="button" className={tool} onClick={() => wrap("<strong>", "</strong>", "texte")}>Gras</button>
                <button type="button" className={tool} onClick={() => wrap('<a href="https://">', "</a>", "lien")}>Lien</button>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-cream/60 p-2">
                <span className="text-sm text-muted">Insérer une card produit :</span>
                <select
                  value={selProduct}
                  onChange={(e) => setSelProduct(e.target.value)}
                  className="rounded-lg border border-line bg-card px-2 py-1.5 text-sm"
                >
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <button type="button" className="rounded-lg bg-terra px-3 py-1.5 text-sm font-medium text-white hover:bg-terra-dark" onClick={insertProductCard}>
                  Insérer la card
                </button>
              </div>

              <textarea
                ref={taRef}
                rows={16}
                spellCheck={false}
                className={`mt-2 font-mono text-[13px] leading-relaxed ${input}`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted">
                Vous pouvez écrire normalement avec les boutons ci-dessus, ou
                coller/écrire du HTML directement.
              </p>
            </>
          ) : (
            <div
              className="article-content mt-3 rounded-2xl border border-line bg-card p-6"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* FAQ */}
        <div>
          <label className={label}>Questions fréquentes (optionnel)</label>
          <div className="mt-2 space-y-3">
            {faq.map((f, i) => (
              <div key={i} className="rounded-xl border border-line bg-card p-3">
                <div className="flex items-center gap-2">
                  <input
                    placeholder="Question"
                    value={f.q}
                    onChange={(e) =>
                      setFaq(faq.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))
                    }
                    className={`${input} font-medium`}
                  />
                  <button
                    type="button"
                    onClick={() => setFaq(faq.filter((_, j) => j !== i))}
                    className="shrink-0 rounded-lg px-2 py-2 text-muted hover:bg-cream"
                    aria-label="Supprimer"
                  >
                    ✕
                  </button>
                </div>
                <textarea
                  placeholder="Réponse"
                  rows={2}
                  value={f.a}
                  onChange={(e) =>
                    setFaq(faq.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))
                  }
                  className={`mt-2 ${input}`}
                />
              </div>
            ))}
            <button
              type="button"
              className={tool}
              onClick={() => setFaq([...faq, { q: "", a: "" }])}
            >
              + Ajouter une question
            </button>
          </div>
        </div>

        {/* SEO + publication */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Titre SEO (optionnel)</label>
            <input className={`mt-1.5 ${input}`} value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div>
            <label className={label}>Description SEO (optionnel)</label>
            <input className={`mt-1.5 ${input}`} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
        </div>

        <label className="flex items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4"
          />
          Publié (visible sur le site)
        </label>

        {msg && <p className="text-sm text-terra-dark">{msg}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={save}
              disabled={status === "saving"}
              className="rounded-full bg-terra px-7 py-3 font-semibold text-white hover:bg-terra-dark disabled:opacity-60"
            >
              {status === "saving" ? "Enregistrement…" : "Enregistrer"}
            </button>
            <Link href="/admin/articles" className="rounded-full border border-line px-6 py-3 text-sm hover:bg-cream">
              Annuler
            </Link>
          </div>
          {!isNew && (
            <button type="button" onClick={remove} className="text-sm text-terra-dark hover:underline">
              Supprimer cet article
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
