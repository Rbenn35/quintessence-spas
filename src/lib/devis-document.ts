import { prixApresRemise, type Spa } from "./spas";
import type { DevisConfig } from "./devis";
import type { DevisRequest } from "./devis-requests";
import type { SiteSettings } from "./settings";

export interface DocLine {
  label: string;
  desc?: string;
  price: string;
  old?: string;
  offered?: boolean;
}

export interface DevisDocData {
  spaName: string;
  photo?: string;
  specs: [string, string][];
  lines: DocLine[];
  total: string;
  economie: string;
  validityDays: number;
}

const euro = (n: number) => `${n.toLocaleString("fr-FR")} €`;

/** Specs essentielles du spa (places, jets, dimensions, électronique, garantie). */
function buildSpecs(spa: Spa, settings: SiteSettings): [string, string][] {
  const dims = `${spa.dimensions.largeur} × ${spa.dimensions.profondeur} × ${spa.dimensions.hauteur} cm`;
  const specs: [string, string][] = [
    ["Places", `${spa.places} personnes`],
    ["Hydrojets", `${spa.jets} jets`],
    ["Dimensions", dims],
  ];
  const items = (spa.caracteristiques ?? []).flatMap((g) => g.items);
  const find = (re: RegExp) =>
    items.find(([k]) => re.test(k.toLowerCase()))?.[1];
  const electro = find(/électro|boîtier|clavier|gecko|contrôle/);
  if (electro) specs.push(["Électronique", electro]);
  const rech = find(/réchauff/);
  if (rech) specs.push(["Réchauffeur", rech]);
  if (settings.stats?.warranty) specs.push(["Garantie", settings.stats.warranty]);
  return specs;
}

/** Construit les données du document de devis (ligne spa + lignes config). */
export function buildDevisDocData(
  req: DevisRequest,
  spa: Spa,
  config: DevisConfig,
  settings: SiteSettings,
): DevisDocData {
  const prixSite = prixApresRemise(spa) ?? 0;
  const extraPct = config.extraRemisePct ?? 0;
  const base = Math.round(prixSite * (1 - extraPct / 100));
  const cfgLines = req.lines ?? config.lines.filter((l) => l.active);

  // 1re phrase de la description comme sous-titre du spa.
  const ptIndex = spa.description.indexOf(". ");
  const spaDesc =
    ptIndex > 0 ? spa.description.slice(0, ptIndex + 1) : spa.description;

  const lines: DocLine[] = [
    {
      label: `${spa.name} ${spa.places} places`,
      desc: spaDesc,
      price: euro(base),
      ...(spa.prixIndicatif && spa.prixIndicatif > base
        ? { old: euro(spa.prixIndicatif) }
        : {}),
    },
    ...cfgLines.map((l) => ({
      label: l.label,
      ...(l.description ? { desc: l.description } : {}),
      price: l.offered ? "Offert" : euro(l.price),
      ...(l.offered ? { offered: true } : {}),
    })),
  ];

  const offeredSum = cfgLines
    .filter((l) => l.offered)
    .reduce((s, l) => s + l.price, 0);
  const savings =
    (spa.prixIndicatif ? spa.prixIndicatif - base : 0) + offeredSum;

  return {
    spaName: `${spa.name} ${spa.places} places`,
    photo: spa.photos?.[0],
    specs: buildSpecs(spa, settings),
    lines,
    total: euro(req.total),
    economie: euro(savings),
    validityDays: config.validityDays,
  };
}
