import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAccessoireById } from "@/lib/store";
import type { Accessoire } from "@/lib/accessoires";
import { AccessoireEditor } from "../../AccessoireEditor";

export const dynamic = "force-dynamic";

function blank(): Accessoire {
  return { id: "", name: "", description: "", price: null, active: true };
}

export default async function AdminAccessoireEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "new";

  let initial: Accessoire;
  if (isNew) {
    initial = blank();
  } else {
    const found = await getAccessoireById(id);
    if (!found) notFound();
    initial = found;
  }

  return <AccessoireEditor initial={initial} isNew={isNew} />;
}
