import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import RelatedPosts from "@/components/RelatedPosts";
import { topicOfPost } from "@/lib/blog-topics";
import { getAll, getOne, readingMinutes, renderMarkdown, withHeadingAnchors } from "@/lib/content";
import { absoluteUrl, AUTHOR_NAME, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";
import { siteConfig } from "@config";

export const dynamicParams = true;

export function generateStaticParams() {
  return getAll("posts").map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const post = getOne("posts", slug);
  if (!post || post.draft) return {};
  return pageMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.thumbnail,
    type: "article",
  });
}

export default async function PostPage(
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const post = getOne("posts", slug);
  if (!post || post.draft) notFound();

  const path = `/blog/${post.slug}`;
  const { html, toc } = withHeadingAnchors(await renderMarkdown(post.content));
  const topic = topicOfPost(post);
  const minutes = readingMinutes(post.content);
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    inLanguage: "ko-KR",
    author: siteConfig.author
      ? { "@type": "Person", name: siteConfig.author.name, url: absoluteUrl("/about#author") }
      : { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(post.thumbnail ? { image: absoluteUrl(post.thumbnail) } : {}),
  };
  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "가이드", item: absoluteUrl("/blog") },
      ...(topic
        ? [{ "@type": "ListItem", position: 3, name: topic.label, item: absoluteUrl(`/blog/topic/${topic.slug}`) }]
        : []),
      { "@type": "ListItem", position: topic ? 4 : 3, name: post.title, item: absoluteUrl(path) },
    ],
  };

  return (
    <>
      <article className="reading py-20">
        <header className="mb-12">
          {topic && (
            <nav aria-label="현재 위치" className="mb-4 text-xs text-ink-muted">
              <Link href="/blog" className="hover:text-primary">가이드</Link>
              <span className="mx-2">/</span>
              <Link href={`/blog/topic/${topic.slug}`} className="text-accent hover:text-primary">{topic.label}</Link>
            </nav>
          )}
          <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
            <time dateTime={post.date}>{post.date}</time>
            <span>읽는 시간 약 {minutes}분</span>
            {post.updated && post.updated !== post.date && (
              <span>
                최종 업데이트 <time dateTime={post.updated}>{post.updated}</time>
              </span>
            )}
            {post.tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-accent">{tag}</span>
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-snug text-primary sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-ink-sub">{post.description}</p>
          <div className="mt-6 flex items-center gap-3 border-t border-line/50 pt-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-line text-xs font-bold text-ink-sub">
              {AUTHOR_NAME.slice(0, 2)}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-primary">
                {AUTHOR_NAME}
                {siteConfig.author && <span className="ml-2 font-normal text-ink-muted">{siteConfig.author.role}</span>}
              </p>
              <p className="mt-0.5 text-ink-muted">
                <Link href={siteConfig.author ? "/about#author" : "/about"} className="hover:text-primary transition-colors">
                  작성자 소개·편집 원칙
                </Link>
              </p>
            </div>
          </div>
        </header>
        {post.thumbnail && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-card border border-line bg-card">
            <Image
              src={post.thumbnail}
              alt={`${post.title} 대표 이미지`}
              fill
              preload
              sizes="(min-width: 720px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        {toc.length >= 3 && (
          <nav aria-labelledby="toc-heading" className="mb-12 rounded-card border border-line bg-card p-6">
            <p id="toc-heading" className="eyebrow mb-3">이 글의 목차</p>
            <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink-sub">
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="hover:text-primary">{item.text}</a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
        {topic && (
          <aside className="mt-14 rounded-card border border-line bg-card p-6 text-sm">
            <p className="eyebrow mb-2">이 주제 더 보기</p>
            <p className="leading-relaxed text-ink-sub">{topic.description}</p>
            <Link href={`/blog/topic/${topic.slug}`} className="mt-3 inline-block font-semibold text-primary hover:underline">
              {topic.label} 가이드 전체 보기 →
            </Link>
          </aside>
        )}
        {siteConfig.author && (
          <aside aria-label="작성자" className="mt-6 flex gap-4 rounded-card border border-line p-6 text-sm">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-line text-xs font-bold text-ink-sub">
              {siteConfig.author.name.slice(0, 2)}
            </div>
            <div>
              <p className="font-semibold text-primary">
                {siteConfig.author.name}
                <span className="ml-2 font-normal text-ink-muted">{siteConfig.author.role}</span>
              </p>
              <p className="mt-1.5 leading-relaxed text-ink-sub">{siteConfig.author.bio}</p>
              <Link href="/about#author" className="mt-2 inline-block text-ink-muted hover:text-primary">편집 원칙과 문의 →</Link>
            </div>
          </aside>
        )}
        <RelatedPosts current={post} />
      </article>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
    </>
  );
}
