import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllDevisRequests } from "@/lib/store";
import { DevisTabs } from "./DevisTabs";
import { DevisBrowser } from "./DevisBrowser";

export const dynamic = "force-dynamic";

export default async function AdminDevis() {
  if (!(await isAdmin())) redirect("/admin/login");
  const requests = await getAllDevisRequests();

  // Tri : « à envoyer » d'abord (par échéance), puis les autres (plus récents).
  const sorted = [...requests].sort((a, b) => {
    const ap = a.status === "pending";
    const bp = b.status === "pending";
    if (ap && !bp) return -1;
    if (bp && !ap) return 1;
    if (ap && bp) return a.sendAt.localeCompare(b.sendAt);
    return b.createdAt.localeCompare(a.createdAt);
  });
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl">Devis</h1>
      <p className="mt-1 text-sm text-muted">
        {requests.length} devis au total · {pending} à envoyer
      </p>

      <div className="mt-5">
        <DevisTabs />
      </div>

      <div className="mt-6">
        <DevisBrowser requests={sorted} />
      </div>
    </div>
  );
}
