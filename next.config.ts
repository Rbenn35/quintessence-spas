import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF d'abord (plus léger que WebP) → images plus petites, LCP plus rapide.
    formats: ["image/avif", "image/webp"],
    // Cache long des images optimisées (réduit les recalculs et le poids réseau).
    minimumCacheTTL: 2678400, // 31 jours
    // Autorise l'affichage des photos hébergées sur Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
