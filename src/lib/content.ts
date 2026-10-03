import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export type Collection = "posts" | "reports";
export const COLLECTIONS: Collection[] = ["posts", "reports"];

const CONTENT_ROOT = path.join(process.cwd(), "content");

export interface ContentMeta {
  collection: Collection;
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  updated?: string; // YYYY-MM-DD — 선택, 최종 수정일
  tags: string[];
  thumbnail?: string;
  period?: string; // reports 전용 — 보고 기간 라벨
  dashboardUrl?: string; // reports 전용 — BI 대시보드 iframe URL
  draft: boolean;
}

export interface ContentDoc extends ContentMeta {
  content: string;
}

/** posts→/blog/{slug}, reports→/reports/{slug} */
export function contentHref(collection: Collection, slug: string): string {
  return `/${collection === "posts" ? "blog" : "reports"}/${slug}`;
}

/** 컬렉션 발행 항목 — draft 제외, 날짜 역순(동률이면 slug 역순). 깨진 파일은 스킵. */
export function getAll(collection: Collection): ContentMeta[] {
  const dir = path.join(CONTENT_ROOT, collection);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => readDoc(collection, f))
    .filter((d): d is ContentDoc => d !== null && !d.draft)
    .sort((a, b) => (a.date === b.date ? (a.slug < b.slug ? 1 : -1) : a.date < b.date ? 1 : -1))
    .map(toMeta);
}

/** slug 로 문서 1건. draft 도 반환하므로 호출부에서 걸러야 한다. 없으면 null. */
export function getOne(collection: Collection, slug: string): ContentDoc | null {
  return readDoc(collection, `${slug}.md`);
}

/** 본문 선두의 H1(# ...) 제거 — 제목은 페이지 컴포넌트가 frontmatter title로 렌더하므로 이중 H1 방지. */
function stripLeadingH1(md: string): string {
  return md.replace(/^\s*#\s+[^\n]*\n+/, "");
}

/** 마크다운 → HTML. GFM 지원, raw HTML 은 안전하게 제거, 선두 H1은 제거(이중 H1 방지). */
export async function renderMarkdown(md: string): Promise<string> {
  const out = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: true })
    .process(stripLeadingH1(md));
  // Wrap only sanitized, renderer-generated tables; preserve table semantics.
  return String(out)
    // 본문 이미지는 대표 이미지(LCP) 뒤에 화면에 가까워질 때 불러온다.
    .replaceAll("<img ", '<img loading="lazy" decoding="async" ')
    .replaceAll("<table>", '<div class="table-scroll" role="region" aria-label="비교표 — 가로로 스크롤할 수 있습니다" tabindex="0"><table>')
    .replaceAll("</table>", "</table></div>");
}

export interface TocItem {
  id: string;
  text: string;
}

/** 렌더된 HTML의 h2에 앵커 id를 붙이고 목차를 만든다. 입력은 sanitize 를 거친 HTML 이다. */
export function withHeadingAnchors(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const out = html.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner: string) => {
    const id = `section-${toc.length + 1}`;
    // 목차는 <ol>로 번호를 매기므로 소제목 앞의 "1." 같은 번호는 뗀다.
    const text = decodeEntities(inner.replace(/<[^>]+>/g, "").trim()).replace(/^\d+[.)]\s*/, "");
    toc.push({ id, text });
    return `<h2 id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

function decodeEntities(text: string): string {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** 한국어 본문 기준 대략적인 읽기 시간(분). 공백 제외 약 500자/분. */
export function readingMinutes(md: string): number {
  const text = md.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\]\([^)]*\)/g, "]").replace(/\s+/g, "");
  return Math.max(1, Math.round(text.length / 500));
}

function readDoc(collection: Collection, filename: string): ContentDoc | null {
  const filePath = path.join(CONTENT_ROOT, collection, filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
    if (!data.title || !data.description || !data.date) {
      console.warn(`[content] ${collection}/${filename} 스킵 — 필수 필드(title·description·date) 누락`);
      return null;
    }
    return {
      collection,
      slug: filename.replace(/\.md$/, ""),
      title: String(data.title),
      description: String(data.description),
      date: toDateString(data.date),
      updated: data.updated ? toDateString(data.updated) : undefined,
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      thumbnail: typeof data.thumbnail === "string" ? data.thumbnail : undefined,
      period: typeof data.period === "string" ? data.period : undefined,
      dashboardUrl: typeof data.dashboardUrl === "string" ? data.dashboardUrl : undefined,
      draft: data.draft === true,
      content,
    };
  } catch (err) {
    console.warn(`[content] ${collection}/${filename} 스킵 — 파싱 실패:`, err);
    return null;
  }
}

function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function toMeta(doc: ContentDoc): ContentMeta {
  return {
    collection: doc.collection,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    date: doc.date,
    updated: doc.updated,
    tags: doc.tags,
    thumbnail: doc.thumbnail,
    period: doc.period,
    dashboardUrl: doc.dashboardUrl,
    draft: doc.draft,
  };
}
