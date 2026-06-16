import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SiteChrome } from "@/components/SiteChrome";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/store";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const title = `${settings.name} · Spas rigides premium en France`;
  return {
    metadataBase: new URL(site.url),
    title: { default: title, template: `%s · ${settings.name}` },
    description: settings.description,
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: settings.name,
      title,
      description: settings.description,
      url: site.url,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: settings.description,
    },
    alternates: { canonical: "/" },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();
  return (
    <html
      lang="fr"
      className={`${fraunces.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        <SiteChrome
          header={<Header email={settings.email} />}
          footer={<Footer />}
        >
          {children}
        </SiteChrome>
      </body>
    </html>
  );
}
