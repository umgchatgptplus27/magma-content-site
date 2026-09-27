import { siteConfig } from "@config";
import { contentHref, getAll } from "@/lib/content";
import { absoluteUrl, SITE_NAME } from "@/lib/seo";

export const dynamic = "force-static";

function escapeXml(text: string): string {
  return text.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[c]!);
}

/** 재방문 독자를 위한 RSS 2.0 피드 — 최근 수정·발행 순 30편. */
export function GET() {
  const posts = getAll("posts")
    .sort((a, b) => ((b.updated ?? b.date) < (a.updated ?? a.date) ? -1 : 1))
    .slice(0, 30);
  const items = posts
    .map((post) => {
      const url = absoluteUrl(contentHref("posts", post.slug));
      return `<item><title>${escapeXml(post.title)}</title><link>${url}</link><guid>${url}</guid><pubDate>${new Date(`${post.updated ?? post.date}T00:00:00+09:00`).toUTCString()}</pubDate><description>${escapeXml(post.description)}</description></item>`;
    })
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${escapeXml(SITE_NAME)}</title><link>${absoluteUrl("/")}</link><description>${escapeXml(siteConfig.company.description)}</description><language>ko-KR</language>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
