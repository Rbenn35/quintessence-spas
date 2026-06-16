import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllReviews, getAllSpas } from "@/lib/store";
import { ReviewsImport } from "./ReviewsImport";

export const dynamic = "force-dynamic";

export default async function AdminAvis() {
  if (!(await isAdmin())) redirect("/admin/login");
  const reviews = await getAllReviews();
  const products = (await getAllSpas()).map((s) => ({
    slug: s.slug,
    name: s.name,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Avis</h1>
          <p className="mt-1 text-sm text-muted">
            {reviews.length} avis client{reviews.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/avis/new"
          className="rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark"
        >
          + Nouvel avis
        </Link>
      </div>

      <div className="mt-6">
        <ReviewsImport products={products} />
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {reviews.map((r, i) => (
          <Link
            key={r.id}
            href={`/admin/avis/${r.id}`}
            className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream ${
              i % 2 ? "bg-cream/40" : "bg-card"
            }`}
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[#e0a93b]">
                  {"★".repeat(r.rating)}
                  <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                </span>
                <span className="font-medium">{r.author}</span>
                {r.city && <span className="text-xs text-muted">· {r.city}</span>}
              </div>
              <div className="mt-0.5 truncate text-xs text-muted">
                {r.productSlug ? `Modèle : ${r.productSlug}` : "Avis global"} ·{" "}
                {r.text}
              </div>
            </div>
            <span
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                r.published ? "bg-terra/10 text-terra" : "bg-line/60 text-muted"
              }`}
            >
              {r.published ? "Publié" : "Masqué"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
