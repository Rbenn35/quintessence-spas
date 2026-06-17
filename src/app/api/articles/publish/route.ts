import { NextResponse } from "next/server";
import { upsertArticle } from "@/lib/store";
import type { Article } from "@/lib/articles";

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

  const article: Article = {
    slug: b.slug.trim(),
    title: b.title.trim(),
    category: typeof b.category === "string" ? b.category : "Revendeur",
    excerpt: typeof b.excerpt === "string" ? b.excerpt : "",
    tint,
    readMin: Number(b.readMin) || 5,
    content: b.content,
    published: b.published !== false,
    ...(typeof b.cover === "string" ? { cover: b.cover } : {}),
    ...(faq && faq.length ? { faq } : {}),
    ...(typeof b.metaTitle === "string" ? { metaTitle: b.metaTitle } : {}),
    ...(typeof b.metaDescription === "string"
      ? { metaDescription: b.metaDescription }
      : {}),
  };

  await upsertArticle(article);
  return NextResponse.json({ ok: true, slug: article.slug });
}
