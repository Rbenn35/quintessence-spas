import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getAllReviews, saveAllReviews, getAllSpas } from "@/lib/store";
import { revalidateCatalogue } from "@/lib/revalidate";
import type { Review } from "@/lib/reviews";

/** Parseur CSV minimal : gère les champs entre guillemets, virgules et CRLF. */
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (c !== "\r") field += c;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

const truthy = (v: string) =>
  ["oui", "yes", "true", "1", "vrai", "o"].includes(v.trim().toLowerCase());

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Fichier CSV manquant." },
      { status: 422 },
    );
  }

  const text = await file.text();
  const rows = parseCSV(text).filter((r) => r.some((c) => c.trim() !== ""));
  if (rows.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Le fichier ne contient aucune ligne d'avis." },
      { status: 422 },
    );
  }

  // En-têtes (insensible à la casse / aux accents).
  const norm = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  const header = rows[0].map(norm);
  const col = (name: string) => header.indexOf(name);
  const iAuteur = col("auteur");
  const iVille = col("ville");
  const iNote = col("note");
  const iAvis = col("avis");
  const iProduit = col("produit");
  const iPublie = col("publie");

  if (iAuteur < 0 || iNote < 0 || iAvis < 0) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "En-têtes manquants. Colonnes attendues : auteur, ville, note, avis, produit, publie.",
      },
      { status: 422 },
    );
  }

  const slugs = new Set((await getAllSpas()).map((s) => s.slug));
  const newReviews: Review[] = [];
  const warnings: string[] = [];
  let skipped = 0;

  rows.slice(1).forEach((r, idx) => {
    const author = (r[iAuteur] ?? "").trim();
    const text = (r[iAvis] ?? "").trim();
    if (!author || !text) {
      skipped++;
      return;
    }
    let rating = parseInt((r[iNote] ?? "").trim(), 10);
    if (isNaN(rating)) rating = 5;
    rating = Math.max(1, Math.min(5, rating));
    const city = iVille >= 0 ? (r[iVille] ?? "").trim() : "";
    const productSlug = iProduit >= 0 ? (r[iProduit] ?? "").trim() : "";
    if (productSlug && !slugs.has(productSlug)) {
      warnings.push(
        `Ligne ${idx + 2} : produit « ${productSlug} » inconnu (avis importé mais non rattaché).`,
      );
    }
    const published = iPublie >= 0 ? truthy(r[iPublie] ?? "oui") : true;
    newReviews.push({
      id: `r-imp-${Date.now()}-${idx}`,
      author,
      ...(city ? { city } : {}),
      rating,
      text,
      ...(productSlug && slugs.has(productSlug) ? { productSlug } : {}),
      published,
    });
  });

  if (newReviews.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Aucun avis valide trouvé dans le fichier." },
      { status: 422 },
    );
  }

  const all = await getAllReviews();
  await saveAllReviews([...newReviews, ...all]);
  revalidateCatalogue();

  return NextResponse.json({
    ok: true,
    imported: newReviews.length,
    skipped,
    warnings,
  });
}
