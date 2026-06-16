"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { clsx } from "@/lib/clsx";

/**
 * Galerie produit : visuel principal au format 1:1, défilement (flèches, swipe,
 * vignettes), et ouverture en pop-up plein écran avec zoom.
 */
export function ProductGallery({
  photos: rawPhotos,
  name,
}: {
  photos: string[];
  name: string;
}) {
  // On ignore toute entrée vide pour éviter une src d'image invalide.
  const photos = rawPhotos.filter((p) => p && p.trim() !== "");
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(false);
  const touchX = useRef<number | null>(null);

  const n = photos.length;
  const go = useCallback(
    (i: number) => setIndex(n ? (i + n) % n : 0),
    [n],
  );
  const current = photos[index] ?? photos[0];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      else if (e.key === "ArrowRight") go(index + 1);
      else if (e.key === "ArrowLeft") go(index - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, go]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    touchX.current = null;
  }

  if (n === 0 || !current) return null;

  return (
    <div>
      {/* Visuel principal 1:1 */}
      <div
        className="group relative aspect-square w-full overflow-hidden rounded-2xl border border-line bg-white"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={current}
          src={current}
          alt={`${name}, photo ${index + 1}`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="cursor-zoom-in object-cover"
          onClick={() => {
            setZoom(false);
            setOpen(true);
          }}
        />

        {n > 1 && (
          <>
            <button
              type="button"
              aria-label="Photo précédente"
              onClick={() => go(index - 1)}
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl text-ink shadow-sm backdrop-blur transition hover:bg-white"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Photo suivante"
              onClick={() => go(index + 1)}
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xl text-ink shadow-sm backdrop-blur transition hover:bg-white"
            >
              ›
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] font-medium text-white">
              {index + 1} / {n}
            </span>
          </>
        )}
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink/55 px-2.5 py-1 text-[11px] text-white opacity-0 transition group-hover:opacity-100">
          Cliquer pour agrandir
        </span>
      </div>

      {/* Vignettes */}
      {n > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {photos.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Voir la photo ${i + 1}`}
              onClick={() => go(i)}
              className={clsx(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition",
                i === index ? "border-terra" : "border-line hover:border-terra/50",
              )}
            >
              <Image
                src={src}
                alt={`${name}, miniature ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Pop-up plein écran */}
      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            aria-label="Fermer"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl text-white transition hover:bg-white/25"
          >
            ✕
          </button>

          {n > 1 && (
            <>
              <button
                type="button"
                aria-label="Photo précédente"
                onClick={(e) => {
                  e.stopPropagation();
                  go(index - 1);
                }}
                className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/25"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Photo suivante"
                onClick={(e) => {
                  e.stopPropagation();
                  go(index + 1);
                }}
                className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-3xl text-white transition hover:bg-white/25"
              >
                ›
              </button>
            </>
          )}

          <div
            className="flex max-h-[90vh] max-w-[92vw] items-center justify-center overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={current}
              alt={`${name}, photo ${index + 1}`}
              onClick={() => setZoom((z) => !z)}
              className={clsx(
                "select-none",
                zoom
                  ? "h-auto w-[170vw] max-w-none cursor-zoom-out sm:w-[88vw]"
                  : "max-h-[90vh] w-auto cursor-zoom-in",
              )}
            />
          </div>

          <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
            {index + 1} / {n} · cliquez l'image pour zoomer
          </span>
        </div>
      )}
    </div>
  );
}
