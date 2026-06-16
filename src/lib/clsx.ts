/** Concatène des classes conditionnelles (utilitaire minimal). */
export function clsx(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}
