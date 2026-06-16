import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { put } from "@vercel/blob";
import { isAdmin } from "@/lib/auth";

/**
 * Upload d'image du back-office.
 * - Production (Vercel) : stockage objet Vercel Blob (persistant), activé dès
 *   que BLOB_READ_WRITE_TOKEN est présent.
 * - Développement local : écriture dans public/products.
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

  const safe = file.name
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
  const name = `${Date.now()}-${safe}`;

  // Production : Vercel Blob (stockage persistant). Jeton statique
  // (BLOB_READ_WRITE_TOKEN) ou store connecté via OIDC (BLOB_STORE_ID).
  if (process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID) {
    const blob = await put(`products/${name}`, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type || undefined,
    });
    return NextResponse.json({ ok: true, path: blob.url });
  }

  // Local : système de fichiers.
  const bytes = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), "public", "products");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, name), bytes);
  return NextResponse.json({ ok: true, path: `/products/${name}` });
}
