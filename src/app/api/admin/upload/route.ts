import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { isAdmin } from "@/lib/auth";

/**
 * Upload d'image vers public/products (back-office, local).
 * ⚠️ En production serverless, remplacer par un stockage objet (R2/S3/Blob).
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Aucun fichier." },
      { status: 422 },
    );
  }
  const bytes = Buffer.from(await file.arrayBuffer());
  const safe = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
  const name = `${Date.now()}-${safe}`;
  const dir = path.join(process.cwd(), "public", "products");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ ok: true, path: `/products/${name}` });
}
