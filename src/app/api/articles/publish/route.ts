import { NextResponse } from "next/server";
import { upsertArticle, getArticleBySlug } from "@/lib/store";
import { revalidateGuides } from "@/lib/revalidate";
import type { Article } from "@/lib/articles";

/** Date du jour au format ISO court (YYYY-MM-DD). */
function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Publication d'un article (endpoint sécurisé).
 * Utilisé pour importer du contenu et par la génération hebdomadaire
 * (GitHub Actions). Protégé par un secret `PUBLISH_SECRET`.
 *
 * Header attendu : Authorization: Bearer <PUBLISH_SECRET>
 * Corps JSON : { slug, title, content(HTML), excerpt?, category?, faq?[{q,a}],
 *               metaTitle?, metaDescription?, cover?, tint?, readMin?, published? }
 */
export async function POST(request: Request) {
  const secret = process.env.PUBLISH_SECRET;
  const auth = request.headers.get("authorization");
  if (!secret || auth !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const b = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;

  // Mode « date seule » : met à jour uniquement la date de publication d'un
  // article existant, sans toucher au contenu. Utile pour dater a posteriori.
  if (b && b.patchDate === true) {
    if (typeof b.slug !== "string" || typeof b.publishedAt !== "string") {
      return NextResponse.json(
        { ok: false, error: "slug et publishedAt requis pour patchDate." },
        { status: 422 },
      );
    }
    const found = await getArticleBySlug(b.slug.trim());
    if (!found) {
      return NextResponse.json({ ok: false, error: "Article introuvable." }, { status: 404 });
    }
    await upsertArticle({ ...found, publishedAt: b.publishedAt.slice(0, 10) });
    revalidateGuides();
    return NextResponse.json({ ok: true, slug: found.slug, patched: "date" });
  }

  if (!b || typeof b.slug !== "string" || typeof b.title !== "string" || typeof b.content !== "string") {
    return NextResponse.json(
      { ok: false, error: "slug, title et content (HTML) sont obligatoires." },
      { status: 422 },
    );
  }

  const tint =
    Array.isArray(b.tint) && b.tint.length === 2
      ? ([String(b.tint[0]), String(b.tint[1])] as [string, string])
      : (["#cfe2ea", "#1c6e8e"] as [string, string]);

  const faq = Array.isArray(b.faq)
    ? b.faq
        .filter(
          (f): f is { q: string; a: string } =>
            !!f && typeof f === "object" && "q" in f && "a" in f,
        )
        .map((f) => ({ q: String(f.q), a: String(f.a) }))
    : undefined;

  // Dates : on conserve la date de 1re publication si l'article existe déjà
  // (republication = mise à jour), sinon on prend celle fournie ou la date du jour.
  const existing = await getArticleBySlug(b.slug.trim());
  const slug = b.slug.trim();
  const publishedAt =
    typeof b.publishedAt === "string" && b.publishedAt
      ? b.publishedAt.slice(0, 10)
      : (existing?.publishedAt ?? today());
  // updatedAt : renseigné uniquement quand on révise un article déjà publié.
  const updatedAt = existing ? today() : undefined;

  const article: Article = {
    slug,
    title: b.title.trim(),
    category: typeof b.category === "string" ? b.category : "Revendeur",
    excerpt: typeof b.excerpt === "string" ? b.excerpt : "",
    tint,
    readMin: Number(b.readMin) || 5,
    content: b.content,
    published: b.published !== false,
    publishedAt,
    ...(updatedAt ? { updatedAt } : {}),
    ...(typeof b.cover === "string" ? { cover: b.cover } : {}),
    ...(faq && faq.length ? { faq } : {}),
    ...(typeof b.metaTitle === "string" ? { metaTitle: b.metaTitle } : {}),
    ...(typeof b.metaDescription === "string"
      ? { metaDescription: b.metaDescription }
      : {}),
  };

  await upsertArticle(article);
  revalidateGuides();
  return NextResponse.json({ ok: true, slug: article.slug });
}
