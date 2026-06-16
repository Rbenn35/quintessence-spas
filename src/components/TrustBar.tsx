import { Container } from "@/components/Container";
import { getSettings } from "@/lib/store";

export async function TrustBar() {
  const { stats } = await getSettings();
  const items = [
    { num: stats.yearsExperience, label: "d'expérience" },
    { num: stats.spasInstalled, label: "spas installés" },
    { num: stats.rating, label: "avis clients" },
    { num: stats.warranty, label: "de garantie" },
  ];

  return (
    <div className="border-y border-line bg-cream">
      <Container className="flex flex-wrap justify-between gap-6 py-10 text-center">
        {items.map((item) => (
          <div key={item.label} className="flex-1 basis-[40%] sm:basis-0">
            <div className="font-serif text-4xl text-terra">{item.num}</div>
            <div className="mt-1 text-[11.5px] uppercase tracking-wider text-muted">
              {item.label}
            </div>
          </div>
        ))}
      </Container>
    </div>
  );
}
