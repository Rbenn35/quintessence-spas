import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { getAllReviews, getAllSpas } from "@/lib/store";
import type { Review } from "@/lib/reviews";
import { ReviewEditor } from "../../ReviewEditor";

export const dynamic = "force-dynamic";

function blank(): Review {
  return {
    id: "",
    author: "",
    city: "",
    rating: 5,
    text: "",
    productSlug: "",
    published: true,
  };
}

export default async function AdminAvisEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  const isNew = id === "new";

  let initial: Review;
  if (isNew) {
    initial = blank();
  } else {
    const found = (await getAllReviews()).find((r) => r.id === id);
    if (!found) notFound();
    initial = found;
  }

  const products = (await getAllSpas()).map((s) => ({
    slug: s.slug,
    name: `${s.name} ${s.places} places`,
  }));

  return <ReviewEditor initial={initial} isNew={isNew} products={products} />;
}
