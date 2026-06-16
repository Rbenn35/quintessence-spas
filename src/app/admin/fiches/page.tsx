import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllSpas } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function FichesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const spas = await getAllSpas();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl">Fiches techniques</h1>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Une fiche A4 par spa, générée automatiquement depuis les données
        produit. Toute modification d&apos;un produit (prix, caractéristiques,
        photos…) se répercute aussitôt ici. Cliquez « Ouvrir » pour la voir en
        grand, puis <code>Cmd/Ctrl+P → Enregistrer en PDF</code>.
      </p>

      <div className="mt-8 grid gap-7 sm:grid-cols-2">
        {spas.map((s) => (
          <div
            key={s.slug}
            className="overflow-hidden rounded-2xl border border-line bg-card"
          >
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="min-w-0">
                <div className="truncate font-medium">{s.name}</div>
                <div className="truncate text-xs text-muted">
                  {s.gamme} · {s.places} places ·{" "}
                  {s.caracteristiques?.length
                    ? `${s.caracteristiques.length} familles de specs`
                    : "specs de base"}
                </div>
              </div>
              <a
                href={`/admin/fiches/${s.slug}`}
                target="_blank"
                rel="noreferrer"
                className="shrink-0 rounded-full bg-terra px-4 py-2 text-xs font-semibold text-white hover:bg-terra-dark"
              >
                Ouvrir →
              </a>
            </div>
            <div className="relative h-[420px] overflow-hidden bg-[#9aa6ad]">
              <iframe
                src={`/admin/fiches/${s.slug}`}
                title={`Fiche technique ${s.name}`}
                scrolling="no"
                className="absolute left-1/2 top-3 h-[297mm] w-[210mm] origin-top -translate-x-1/2 border-0"
                style={{ transform: "translateX(-50%) scale(0.52)" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
