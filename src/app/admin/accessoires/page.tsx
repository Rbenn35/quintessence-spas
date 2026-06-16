import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllAccessoires } from "@/lib/store";
import { formatEuro } from "@/lib/spas";

export const dynamic = "force-dynamic";

export default async function AdminAccessoires() {
  if (!(await isAdmin())) redirect("/admin/login");
  const items = await getAllAccessoires();

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl">Accessoires</h1>
          <p className="mt-1 text-sm text-muted">
            {items.length} produit{items.length > 1 ? "s" : ""} complémentaire
            {items.length > 1 ? "s" : ""} · affichés sur les fiches spa
          </p>
        </div>
        <Link
          href="/admin/accessoires/new"
          className="rounded-full bg-terra px-5 py-2.5 text-sm font-semibold text-white hover:bg-terra-dark"
        >
          + Nouvel accessoire
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-line">
        {items.map((a, i) => (
          <Link
            key={a.id}
            href={`/admin/accessoires/${a.id}`}
            className={`flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-cream ${
              i % 2 ? "bg-cream/40" : "bg-card"
            }`}
          >
            <div className="flex min-w-0 items-center gap-4">
              <span
                className="h-11 w-11 shrink-0 rounded-lg border border-line bg-cover bg-center"
                style={{
                  backgroundImage: a.image
                    ? `url('${a.image}')`
                    : "linear-gradient(150deg,#cfe2ea,#1c6e8e)",
                }}
              />
              <div className="min-w-0">
                <div className="font-medium">{a.name}</div>
                <div className="truncate text-xs text-muted">
                  {a.description}
                </div>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-medium">
                {a.price === null ? "Sur devis" : formatEuro(a.price)}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  a.active
                    ? "bg-terra/10 text-terra"
                    : "bg-line/60 text-muted"
                }`}
              >
                {a.active ? "Affiché" : "Masqué"}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
