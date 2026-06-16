import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDevisConfig } from "@/lib/store";
import { DevisConfigEditor } from "./DevisConfigEditor";

export const dynamic = "force-dynamic";

export default async function AdminDevis() {
  if (!(await isAdmin())) redirect("/admin/login");
  const config = await getDevisConfig();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl">Devis</h1>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/devis/demandes"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:bg-cream"
          >
            Demandes (file d&apos;envoi)
          </Link>
          <Link
            href="/admin/devis/apercu"
            target="_blank"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:bg-cream"
          >
            Aperçu du devis ↗
          </Link>
          <Link
            href="/admin/devis/apercu-info"
            target="_blank"
            className="rounded-full border border-line px-5 py-2.5 text-sm font-medium hover:bg-cream"
          >
            Aperçu e-mail générique ↗
          </Link>
        </div>
      </div>
      <DevisConfigEditor initial={config} />
    </div>
  );
}
