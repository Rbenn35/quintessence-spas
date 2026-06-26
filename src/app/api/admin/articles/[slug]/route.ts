import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { upsertArticle, deleteArticle, getArticleBySlug } from "@/lib/store";
import { revalidateGuides } from "@/lib/revalidate";
import type { Article } from "@/lib/articles";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { slug } = await params;
  const article = (await request.json().catch(() => null)) as Article | null;
  if (!article || !article.slug || !article.title) {
    return NextResponse.json(
      { ok: false, error: "Slug et titre obligatoires." },
      { status: 422 },
    );
  }
  // Conserve la date de 1re publication et marque la révision du jour.
  const existing = await getArticleBySlug(slug);
  const todayIso = new Date().toISOString().slice(0, 10);
  article.publishedAt = article.publishedAt || existing?.publishedAt || todayIso;
  if (existing) article.updatedAt = todayIso;

  if (article.slug !== slug) {
    await deleteArticle(slug);
  }
  await upsertArticle(article);
  revalidateGuides();
  return NextResponse.json({ ok: true, slug: article.slug });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const { slug } = await params;
  await deleteArticle(slug);
  revalidateGuides();
  return NextResponse.json({ ok: true });
}
