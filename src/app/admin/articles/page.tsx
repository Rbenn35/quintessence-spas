import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllArticles } from "@/lib/store";
import { formatDateFr } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function AdminArticles() {
  if (!(await isAdmin())) redirect("/admin/login");
  const articles = await getAllArticles();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Articles</h1>
          <p className="mt-1 text-sm text-muted">
            {articles.length} article{articles.length > 1 ? "s" : ""} ·{" "}
            <Link href="/guides" className="text-terra hover:underline" target="_blank">
              voir le blog ↗
            </Link>
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark"
        >
          + Nouvel article
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {articles.map((a, i) => (
          <Link
            key={a.slug}
            href={`/admin/articles/${a.slug}`}
            className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream ${
              i % 2 ? "bg-cream/40" : "bg-card"
            }`}
          >
            <div className="min-w-0">
              <div className="font-medium">{a.title}</div>
              <div className="truncate text-xs text-muted">
                {a.category} · /guides/{a.slug}
                {a.publishedAt && ` · ${formatDateFr(a.publishedAt)}`}
              </div>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                a.published
                  ? "bg-terra/10 text-terra"
                  : "bg-line/60 text-muted"
              }`}
            >
              {a.published ? "Publié" : "Brouillon"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
