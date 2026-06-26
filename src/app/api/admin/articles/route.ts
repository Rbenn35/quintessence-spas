import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertArticle, getArticleBySlug } from "@/lib/store";
import { revalidateGuides } from "@/lib/revalidate";
import type { Article } from "@/lib/articles";

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const article = (await request.json().catch(() => null)) as Article | null;
  if (!article || !article.slug || !article.title) {
    return NextResponse.json(
      { ok: false, error: "Slug et titre obligatoires." },
      { status: 422 },
    );
  }
  if (await getArticleBySlug(article.slug)) {
    return NextResponse.json(
      { ok: false, error: "Ce slug existe déjà." },
      { status: 409 },
    );
  }
  // Nouvel article : on le date du jour s'il n'a pas de date explicite.
  if (!article.publishedAt) {
    article.publishedAt = new Date().toISOString().slice(0, 10);
  }
  await upsertArticle(article);
  revalidateGuides();
  return NextResponse.json({ ok: true, slug: article.slug });
}
