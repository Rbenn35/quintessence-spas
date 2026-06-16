import { formatEuro, type DeliveryFormula } from "@/lib/spas";

const ICONS: Record<string, string[]> = {
  truck: [
    "M1 3h15v13H1z",
    "M16 8h4l3 3v5h-7",
    "M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    "M18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  ],
  wrench: [
    "M14.7 6.3a4 4 0 0 0-5.4 5.4l-7 7 2 2 7-7a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2z",
  ],
  plus: ["M12 2v20", "M2 12h20"],
};

function iconFor(f: DeliveryFormula): string[] {
  const n = f.name.toLowerCase();
  if (n.includes("install")) return ICONS.wrench;
  if (f.price === null || n.includes("mesure") || n.includes("devis"))
    return ICONS.plus;
  return ICONS.truck;
}

export function DeliveryFormulas({
  formulas,
}: {
  formulas?: DeliveryFormula[];
}) {
  if (!formulas || formulas.length === 0) return null;
  return (
    <section className="border-t border-line py-16">
      <div className="overflow-hidden rounded-[18px] border border-line">
        <div className="bg-ink px-7 py-6 text-white">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7fbfd0]">
            Livraison &amp; installation
          </div>
          <h2 className="mt-1 text-2xl text-white sm:text-[1.7rem]">
            Nos formules de livraison &amp; installation
          </h2>
        </div>
        <div className="bg-card">
          {formulas.map((f, i) => (
            <div
              key={`${f.name}-${i}`}
              className={`flex flex-wrap items-center gap-5 px-7 py-6 ${
                i > 0 ? "border-t border-line" : ""
              } ${f.recommended ? "bg-cream" : ""}`}
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-terra/10 text-terra">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {iconFor(f).map((d) => (
                    <path key={d} d={d} />
                  ))}
                </svg>
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-serif text-xl">{f.name}</span>
                  {f.recommended && (
                    <span className="rounded-full bg-terra px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      Recommandé
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-muted">{f.description}</p>
              </div>
              <div className="ml-auto whitespace-nowrap font-serif text-2xl">
                {f.price === null ? "Sur devis" : formatEuro(f.price)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
