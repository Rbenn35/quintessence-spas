import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getArticleBySlug, getAllSpas } from "@/lib/store";
import { prixApresRemise, remiseEffectivePct } from "@/lib/spas";
import type { Article } from "@/lib/articles";
import { ArticleEditor, type ProductRef } from "../../ArticleEditor";

export const dynamic = "force-dynamic";

function blank(): Article {
  return {
    slug: "",
    title: "",
    category: "Guide",
    excerpt: "",
    tint: ["#cfe2ea", "#1c6e8e"],
    readMin: 5,
    content: "<p>Rédigez votre article ici…</p>",
    faq: [],
    published: false,
  };
}

export default async function AdminArticleEdit({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const isNew = slug === "new";

  let initial: Article;
  if (isNew) {
    initial = blank();
  } else {
    const found = await getArticleBySlug(slug);
    if (!found) notFound();
    initial = found;
  }

  const products: ProductRef[] = (await getAllSpas()).map((s) => ({
    slug: s.slug,
    name: `${s.name} ${s.places} places`,
    cover: s.photos?.[0] ?? "",
    prixFinal: prixApresRemise(s),
    prixInitial: s.prixIndicatif,
    remisePct: remiseEffectivePct(s) ?? undefined,
  }));

  return <ArticleEditor initial={initial} isNew={isNew} products={products} />;
}
