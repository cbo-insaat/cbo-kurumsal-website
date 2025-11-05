export type AboutStatsItem = { icon: "users" | "trophy" | "hardhat" | "clock"; label: string };

export type AboutReasonItem = { title: string; desc: string };

export type AboutContent = {
  heroImageUrl: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutP1: string;
  aboutP2: string;
  stats: AboutStatsItem[];
  reasons: AboutReasonItem[];
  quoteText: string;
  quoteAuthor: string;
  ctaTitle: string;
  ctaText: string;
  ctaLink: string;
};
