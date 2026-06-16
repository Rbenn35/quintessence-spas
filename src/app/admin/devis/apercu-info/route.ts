import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getDevisConfig, getSettings } from "@/lib/store";
import { buildInfoEmail } from "@/lib/devis-generate";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const [config, settings] = await Promise.all([
    getDevisConfig(),
    getSettings(),
  ]);

  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const { html } = buildInfoEmail({
    prenom: "Marie",
    nom: "Durand",
    email: "marie.durand@email.fr",
    config,
    settings,
    ref: "",
    dateLabel,
    subjectBanner: true,
  });

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
