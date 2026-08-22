import type { MetadataRoute } from "next";
import { contentHref, getAll } from "@/lib/content";

const SITE_URL = "https://www.eurachoachoa.com";

const staticPages: MetadataRoute.Sitemap = [
  { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
  { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.5 },
  { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.9 },
  { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/disclaimer`, changeFrequency: "yearly", priority: 0.3 },
  { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts: MetadataRoute.Sitemap = getAll("posts").map((item) => ({
    url: `${SITE_URL}${contentHref("posts", item.slug)}`,
    lastModified: new Date(`${item.date}T00:00:00.000Z`),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
  const reports: MetadataRoute.Sitemap = getAll("reports").map((item) => ({
    url: `${SITE_URL}${contentHref("reports", item.slug)}`,
    lastModified: new Date(`${item.date}T00:00:00.000Z`),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticPages, ...posts, ...reports];
}
