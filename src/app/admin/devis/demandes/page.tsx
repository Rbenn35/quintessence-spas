import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllDevisRequests } from "@/lib/store";
import { DevisRequestsList } from "./DevisRequestsList";

export const dynamic = "force-dynamic";

export default async function AdminDevisRequests() {
  if (!(await isAdmin())) redirect("/admin/login");
  const requests = await getAllDevisRequests();
  const pending = requests
    .filter((r) => r.status === "pending")
    .sort((a, b) => a.sendAt.localeCompare(b.sendAt));
  const done = requests
    .filter((r) => r.status !== "pending")
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl">Demandes de devis</h1>
          <p className="mt-1 text-sm text-muted">
            {pending.length} à envoyer · {done.length} traité
            {done.length > 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/devis"
          className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:bg-cream"
        >
          ← Réglages du devis
        </Link>
      </div>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-cream p-10 text-center text-muted">
          Aucune demande pour le moment. Les devis générés via le formulaire
          apparaîtront ici, en file d&apos;envoi.
        </div>
      ) : (
        <div className="mt-8 space-y-10">
          <section>
            <h2 className="text-xl">À envoyer</h2>
            <div className="mt-3">
              {pending.length === 0 ? (
                <p className="text-sm text-muted">Aucun devis en attente.</p>
              ) : (
                <DevisRequestsList requests={pending} />
              )}
            </div>
          </section>
          {done.length > 0 && (
            <section>
              <h2 className="text-xl">Traités</h2>
              <div className="mt-3">
                <DevisRequestsList requests={done} />
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
