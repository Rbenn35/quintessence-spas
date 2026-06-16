import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllSpas } from "@/lib/store";
import { ProductList } from "./ProductList";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  if (!(await isAdmin())) redirect("/admin/login");
  const spas = await getAllSpas();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Produits</h1>
          <p className="mt-1 text-sm text-muted">
            {spas.length} produit{spas.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/new"
          className="rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark"
        >
          + Nouveau produit
        </Link>
      </div>

      <ProductList spas={spas} />
    </div>
  );
}
