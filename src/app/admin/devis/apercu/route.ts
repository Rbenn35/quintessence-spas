import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getDevisConfig, getAllSpas, getSettings } from "@/lib/store";
import { buildDevis } from "@/lib/devis-generate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const [config, settings, spas] = await Promise.all([
    getDevisConfig(),
    getSettings(),
    getAllSpas(),
  ]);

  const product =
    spas.find((s) => s.slug === "prado-6") ??
    spas.find((s) => s.photos?.length) ??
    spas[0];

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { html } = buildDevis({
    prenom: "Marie",
    nom: "Durand",
    email: "marie.durand@email.fr",
    product,
    config,
    settings,
    ref: "DV-003520",
    dateLabel,
    subjectBanner: true,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
