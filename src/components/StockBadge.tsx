import type { StockStatus } from "@/lib/spas";

export function StockBadge({
  status = "in_stock",
  availableAt,
}: {
  status?: StockStatus;
  availableAt?: string;
}) {
  const config: Record<StockStatus, { color: string; text: string }> = {
    in_stock: { color: "#00b67a", text: "En stock · expédition rapide" },
    production: {
      color: "#e0a93b",
      text: availableAt
        ? `En cours de production · disponible ${availableAt}`
        : "En cours de production",
    },
    out_of_stock: {
      color: "#c0563f",
      text: "En rupture de stock · contactez-nous",
    },
  };
  const c = config[status];
  return (
    <div className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ background: c.color }}
        aria-hidden="true"
      />
      <span>{c.text}</span>
    </div>
  );
}
