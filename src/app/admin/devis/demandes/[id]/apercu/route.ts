import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getDevisRequest } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdmin())) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  const { id } = await params;
  const req = await getDevisRequest(id);
  if (!req) {
    return new NextResponse("Demande introuvable.", { status: 404 });
  }
  return new NextResponse(req.html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
