import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllSpas, getAllArticles } from "@/lib/store";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const spas = await getAllSpas();
  const articles = (await getAllArticles()).filter((a) => a.published);
  const staticRoutes = ["", "/spas", "/guides", "/marque", "/devis", "/contact"];

  const now = new Date();

  const pages: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/spas" || path === "/devis" ? 0.9 : 0.7,
  }));

  const spaPages: MetadataRoute.Sitemap = spas.map((s) => ({
    url: `${site.url}/spas/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const guidePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${site.url}/guides/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...pages, ...spaPages, ...guidePages];
}
