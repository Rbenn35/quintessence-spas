import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getSpaBySlug, getGammes } from "@/lib/store";
import { type Spa } from "@/lib/spas";
import { ProductEditor } from "../ProductEditor";

export const dynamic = "force-dynamic";

function blankSpa(): Spa {
  return {
    slug: "",
    name: "",
    gamme: "AquaLuxe",
    places: 6,
    dimensions: { largeur: 200, profondeur: 200, hauteur: 90 },
    prixIndicatif: null,
    jets: 0,
    consommation: "",
    accroche: "",
    description: "",
    pointsForts: [],
    placeholder: ["#cfe2ea", "#1c6e8e"],
  };
}

export default async function AdminEditPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { slug } = await params;
  const isNew = slug === "new";

  let initial: Spa;
  if (isNew) {
    initial = blankSpa();
  } else {
    const found = await getSpaBySlug(slug);
    if (!found) notFound();
    initial = found;
  }

  // Inclut la gamme actuelle du produit même si elle n'est plus dans la liste.
  const gammes = await getGammes();
  const options = gammes.includes(initial.gamme)
    ? gammes
    : [...gammes, initial.gamme];

  return <ProductEditor initial={initial} isNew={isNew} gammes={options} />;
}
