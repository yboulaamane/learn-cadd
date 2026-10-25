import type { MetadataRoute } from "next";
import { curriculum } from "@/lib/curriculum";

const siteUrl = "https://learn-cadd.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const moduleEntries: MetadataRoute.Sitemap = curriculum.map((module) => ({
    url: `${siteUrl}/${module.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: module.track === "extension" ? 0.7 : 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...moduleEntries,
  ];
}
