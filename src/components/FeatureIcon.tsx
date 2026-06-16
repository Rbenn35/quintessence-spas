/**
 * Petites icônes SVG (ligne) pour illustrer les points forts.
 * Couleur héritée via `currentColor`.
 */
export type IconName =
  | "places"
  | "jets"
  | "control"
  | "germ"
  | "fountain"
  | "shield"
  | "light"
  | "truck"
  | "lock"
  | "clock"
  | "check"
  | "droplet"
  | "thermometer"
  | "leaf"
  | "bluetooth"
  | "music"
  | "sparkles"
  | "heart"
  | "ruler"
  | "euro"
  | "wrench"
  | "snowflake"
  | "sun"
  | "filter"
  | "waves"
  | "seat"
  | "energy"
  | "star";

/** Toutes les icônes disponibles (palette du back-office), avec leur libellé. */
export const ICON_LIST: { name: IconName; label: string }[] = [
  { name: "check", label: "Coche" },
  { name: "places", label: "Places" },
  { name: "jets", label: "Jets / hydro" },
  { name: "waves", label: "Vagues" },
  { name: "droplet", label: "Goutte d'eau" },
  { name: "fountain", label: "Fontaine" },
  { name: "filter", label: "Filtration" },
  { name: "germ", label: "Anti-bactérie" },
  { name: "control", label: "Électronique" },
  { name: "energy", label: "Énergie" },
  { name: "thermometer", label: "Température" },
  { name: "snowflake", label: "Hiver / froid" },
  { name: "sun", label: "Été / extérieur" },
  { name: "light", label: "Éclairage" },
  { name: "music", label: "Audio" },
  { name: "bluetooth", label: "Bluetooth" },
  { name: "shield", label: "Garantie" },
  { name: "lock", label: "Sécurité" },
  { name: "truck", label: "Livraison" },
  { name: "wrench", label: "Installation" },
  { name: "clock", label: "Délai" },
  { name: "seat", label: "Assises" },
  { name: "ruler", label: "Dimensions" },
  { name: "euro", label: "Prix" },
  { name: "leaf", label: "Écologie" },
  { name: "heart", label: "Bien-être" },
  { name: "sparkles", label: "Premium" },
  { name: "star", label: "Étoile" },
];

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function FeatureIcon({
  name,
  className = "h-6 w-6",
}: {
  name: IconName;
  className?: string;
}) {
  switch (name) {
    case "places":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="8.5" cy="8" r="3" {...stroke} />
          <path d="M3 20a5.5 5.5 0 0 1 11 0" {...stroke} />
          <circle cx="17" cy="9.2" r="2.3" {...stroke} />
          <path d="M15.5 20a4.6 4.6 0 0 1 5.5-4.4" {...stroke} />
        </svg>
      );
    case "jets":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="6.5" {...stroke} />
          <circle cx="12" cy="12" r="2.6" {...stroke} />
          <circle cx="12" cy="12" r="1" fill="currentColor" />
          <circle cx="12" cy="2.6" r="1" fill="currentColor" />
          <circle cx="12" cy="21.4" r="1" fill="currentColor" />
          <circle cx="2.6" cy="12" r="1" fill="currentColor" />
          <circle cx="21.4" cy="12" r="1" fill="currentColor" />
        </svg>
      );
    case "control":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect x="4" y="4" width="16" height="16" rx="2.5" {...stroke} />
          <path d="M12 8v3" {...stroke} />
          <circle cx="12" cy="13.5" r="2.5" {...stroke} />
        </svg>
      );
    case "germ":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="5.5" {...stroke} />
          <path
            d="M12 6.5V3.2M12 17.5V20.8M6.5 12H3.2M17.5 12H20.8M8.1 8.1L5.8 5.8M15.9 15.9l2.3 2.3M15.9 8.1l2.3-2.3M8.1 15.9l-2.3 2.3"
            {...stroke}
          />
          <circle cx="10.6" cy="11" r="1.05" fill="currentColor" />
          <circle cx="13.4" cy="13.2" r="1.05" fill="currentColor" />
          <circle cx="13.2" cy="9.8" r="0.7" fill="currentColor" />
        </svg>
      );
    case "fountain":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 21v-9" {...stroke} />
          <path d="M12 12c0-3.5 3-3 3-6.5" {...stroke} />
          <path d="M12 12c0-3.5-3-3-3-6.5" {...stroke} />
          <path d="M5 16h14l-1.5 5h-11Z" {...stroke} />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 3l7 3v5c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" {...stroke} />
          <path d="M9 12l2 2 4-4" {...stroke} />
        </svg>
      );
    case "light":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M9.5 18h5M10.5 21h3" {...stroke} />
          <path
            d="M12 3a6 6 0 0 0-3.8 10.6c.8.7 1.3 1.4 1.3 2.4h5c0-1 .5-1.7 1.3-2.4A6 6 0 0 0 12 3Z"
            {...stroke}
          />
        </svg>
      );
    case "truck":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M3 6h11v9H3zM14 9h4l3 3v3h-7z" {...stroke} />
          <circle cx="7" cy="18" r="1.8" {...stroke} />
          <circle cx="17.5" cy="18" r="1.8" {...stroke} />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <rect x="5" y="10" width="14" height="10" rx="2" {...stroke} />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" {...stroke} />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M12 7v5l3 2" {...stroke} />
        </svg>
      );
    case "droplet":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 3s6 5.5 6 10a6 6 0 0 1-12 0c0-4.5 6-10 6-10z" {...stroke} />
        </svg>
      );
    case "thermometer":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M14 14.8V5a2 2 0 1 0-4 0v9.8a4 4 0 1 0 4 0z" {...stroke} />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M4 20c0-9 6-15 16-15 0 10-6 15-14 15" {...stroke} />
          <path d="M9 18c1-4 3.5-7 7.5-9" {...stroke} />
        </svg>
      );
    case "bluetooth":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M7 8l10 8-5 4V4l5 4-10 8" {...stroke} />
        </svg>
      );
    case "music":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M9 18V5l11-2v13" {...stroke} />
          <circle cx="6.5" cy="18" r="2.5" {...stroke} />
          <circle cx="17.5" cy="16" r="2.5" {...stroke} />
        </svg>
      );
    case "sparkles":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 3l1.7 4.6L18 9l-4.3 1.4L12 15l-1.7-4.6L6 9l4.3-1.4z" {...stroke} />
          <path d="M19 14l.7 1.8L21.5 16.5l-1.8.7L19 19l-.7-1.8L16.5 16.5l1.8-.7z" {...stroke} />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 20S3.5 14.5 3.5 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 1.8C20.5 14.5 12 20 12 20z" {...stroke} />
        </svg>
      );
    case "ruler":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M15.5 2.5l6 6L8 22l-6-6z" {...stroke} />
          <path d="M7 9l2 2M10 6l2 2M13 12l2 2" {...stroke} />
        </svg>
      );
    case "euro":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M16 8.6a4.5 4.5 0 1 0 0 6.8M7.5 11h6M7.5 13.5h5" {...stroke} />
        </svg>
      );
    case "wrench":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4l-7 7 2 2 7-7a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z" {...stroke} />
        </svg>
      );
    case "snowflake":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 2v20M3.3 7l17.4 10M20.7 7L3.3 17" {...stroke} />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="4.3" {...stroke} />
          <path
            d="M12 2.5v2.4M12 19.1v2.4M2.5 12H5M19 12h2.5M5.2 5.2l1.7 1.7M17.1 17.1l1.7 1.7M18.8 5.2L17.1 6.9M6.9 17.1l-1.7 1.7"
            {...stroke}
          />
        </svg>
      );
    case "filter":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M3.5 5h17l-6.5 8v6l-4-2.2V13z" {...stroke} />
        </svg>
      );
    case "waves":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M2 8.5c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0" {...stroke} />
          <path d="M2 14.5c2-2.2 4-2.2 6 0s4 2.2 6 0 4-2.2 6 0" {...stroke} />
        </svg>
      );
    case "seat":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M5 11V6.5A2.5 2.5 0 0 1 7.5 4h9A2.5 2.5 0 0 1 19 6.5V11" {...stroke} />
          <path d="M3.5 11h17v3a3 3 0 0 1-3 3h-11a3 3 0 0 1-3-3z" {...stroke} />
          <path d="M7 17v3M17 17v3" {...stroke} />
        </svg>
      );
    case "energy":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M13 2L4.5 13.5H11l-1 8.5L19.5 10H13z" {...stroke} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <path d="M12 3l2.6 5.6L20.5 9.4l-4.3 4.1 1.1 6L12 16.9 6.7 19.5l1.1-6-4.3-4.1 5.9-.8z" {...stroke} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
          <circle cx="12" cy="12" r="9" {...stroke} />
          <path d="M8 12.5l2.5 2.5L16 9.5" {...stroke} />
        </svg>
      );
  }
}

/** Choisit une icône adaptée au texte d'un point fort. */
export function iconForFeature(text: string): IconName {
  const s = text.toLowerCase();
  if (/(place|appuie|personne)/.test(s)) return "places";
  if (/(isolation|pompe à chaleur|énerg|thermo)/.test(s)) return "shield";
  if (/(led|éclairage|lumi|sous-marin)/.test(s)) return "light";
  if (/(uv|désinfect|germe|bact|ozone)/.test(s)) return "germ";
  if (/(fontaine)/.test(s)) return "fountain";
  if (/(gecko|électro|réchauff|clavier|chauff|contrôle|\bkw\b)/.test(s))
    return "control";
  if (/(jet|hydro|massage|pompe|\bw\b|watt)/.test(s)) return "jets";
  if (/(livraison|installation|mise en service)/.test(s)) return "truck";
  if (/(garantie|sav)/.test(s)) return "shield";
  return "check";
}
