import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import RelatedPosts from "@/components/RelatedPosts";
import { getAll, getOne, renderMarkdown } from "@/lib/content";
import { absoluteUrl, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

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
  const html = await renderMarkdown(post.content);
  const articleSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    inLanguage: "ko-KR",
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    ...(post.thumbnail ? { image: absoluteUrl(post.thumbnail) } : {}),
  };
  const breadcrumbSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "블로그", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(path) },
    ],
  };

  return (
    <>
      <article className="reading py-20">
        <header className="mb-12">
          <div className="flex items-center gap-3 text-xs text-ink-muted">
            <time dateTime={post.date}>{post.date}</time>
            {post.tags.map((tag, index) => (
              <span key={`${tag}-${index}`} className="text-accent">{tag}</span>
            ))}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-snug text-primary sm:text-4xl">{post.title}</h1>
          <p className="mt-4 text-lg text-ink-sub">{post.description}</p>
        </header>
        {post.thumbnail && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-card border border-line bg-card">
            <Image
              src={post.thumbnail}
              alt={`${post.title} 대표 이미지`}
              fill
              sizes="(min-width: 720px) 720px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="post-body" dangerouslySetInnerHTML={{ __html: html }} />
        <RelatedPosts current={post} />
      </article>
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
    </>
  );
}
