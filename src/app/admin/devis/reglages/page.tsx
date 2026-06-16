import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getDevisConfig } from "@/lib/store";
import { DevisTabs } from "../DevisTabs";
import { DevisConfigEditor } from "../DevisConfigEditor";

export const dynamic = "force-dynamic";

export default async function AdminDevisReglages() {
  if (!(await isAdmin())) redirect("/admin/login");
  const config = await getDevisConfig();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl">Devis · Réglages</h1>
      <p className="mt-1 text-sm text-muted">
        Objet, titre, texte d&apos;accompagnement, lignes et délai d&apos;envoi.
      </p>

      <div className="mt-5">
        <DevisTabs />
      </div>

      <DevisConfigEditor initial={config} />
    </div>
  );
}
