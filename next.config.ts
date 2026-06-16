import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Autorise l'affichage des photos hébergées sur Vercel Blob.
    remotePatterns: [
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
