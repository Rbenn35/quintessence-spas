import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSettings, getGammes } from "@/lib/store";
import { SettingsEditor } from "../SettingsEditor";
import { GammesEditor } from "../GammesEditor";

export const dynamic = "force-dynamic";

export default async function AdminReglages() {
  if (!(await isAdmin())) redirect("/admin/login");
  const [settings, gammes] = await Promise.all([getSettings(), getGammes()]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl">Réglages</h1>
      <SettingsEditor initial={settings} />
      <GammesEditor initial={gammes} />
    </div>
  );
}
