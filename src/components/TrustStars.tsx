/**
 * Étoiles façon plateforme d'avis : tuiles carrées vertes avec une étoile
 * blanche (rempli) ou grises (vide).
 */
const STAR =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z";

const GREEN = "#00b67a";
const GREY = "#dcdce6";

export function TrustStars({
  rating,
  size = "md",
}: {
  rating: number;
  size?: "sm" | "md" | "lg";
}) {
  const px = size === "lg" ? 30 : size === "sm" ? 16 : 22;
  const full = Math.round(rating);
  return (
    <div className="flex gap-[2px]" aria-label={`Note ${full} sur 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className="flex items-center justify-center rounded-[3px]"
          style={{
            width: px,
            height: px,
            background: i <= full ? GREEN : GREY,
          }}
        >
          <svg
            viewBox="0 0 24 24"
            width={Math.round(px * 0.72)}
            height={Math.round(px * 0.72)}
            fill="#fff"
            aria-hidden="true"
          >
            <path d={STAR} />
          </svg>
        </span>
      ))}
    </div>
  );
}
