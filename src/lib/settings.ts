import { site } from "./site";

/** Réglages éditables du site (back-office). */
export interface SiteSettings {
  name: string;
  email: string;
  description: string;
  stats: {
    yearsExperience: string;
    spasInstalled: string;
    rating: string;
    warranty: string;
  };
}

export const defaultSettings: SiteSettings = {
  name: site.name,
  email: site.email,
  description: site.description,
  stats: { ...site.stats },
};
