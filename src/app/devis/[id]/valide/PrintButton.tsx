"use client";

export function PrintButton() {
  return (
    <div className="mx-auto mb-5 flex max-w-3xl justify-end px-4 print:hidden">
      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-full bg-terra px-6 py-3 text-sm font-semibold text-white hover:bg-ink"
      >
        ⬇ Télécharger / imprimer en PDF
      </button>
    </div>
  );
}
