import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllReviews, getAllSpas } from "@/lib/store";
import { ReviewsImport } from "./ReviewsImport";
import { ReviewsManager } from "./ReviewsManager";

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

      <div className="mt-8">
        <ReviewsManager reviews={reviews} products={products} />
      </div>
    </div>
  );
}
