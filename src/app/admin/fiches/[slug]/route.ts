import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getSpaBySlug } from "@/lib/store";
import { renderFicheTechnique } from "@/lib/fiche-technique";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  const { slug } = await params;
  const spa = await getSpaBySlug(slug);
  if (!spa) {
    return new NextResponse("Spa introuvable", { status: 404 });
  }
  const origin = new URL(request.url).origin;
  const dateLabel = new Date().toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const html = renderFicheTechnique(spa, { baseUrl: origin, dateLabel });
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
