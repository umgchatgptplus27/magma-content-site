import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogTopicListing from "@/components/BlogTopicListing";
import { BLOG_TOPICS, getBlogTopic, getPostsForTopic } from "@/lib/blog-topics";
import { getAll } from "@/lib/content";
import { blogPageCount, parseBlogPage, topicPageHref } from "@/lib/blog-pagination.mjs";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  const allPosts = getAll("posts");
  return BLOG_TOPICS.flatMap((topic) => {
    const posts = getPostsForTopic(allPosts, topic);
    const count = blogPageCount(posts.length);
    return Array.from({ length: Math.max(0, count - 1) }, (_, index) => ({
      topic: topic.slug,
      page: String(index + 2),
    }));
  });
}

export async function generateMetadata(
  { params }: { params: Promise<{ topic: string; page: string }> },
): Promise<Metadata> {
  const { topic: topicSlug, page: pageStr } = await params;
  const topic = getBlogTopic(topicSlug);
  if (!topic) return {};
  const posts = getPostsForTopic(getAll("posts"), topic);
  const page = parseBlogPage(pageStr, posts.length);
  if (page === null) return { robots: { index: false, follow: true } };

  return pageMetadata({
    title: `${topic.label} · ${page}페이지 | 3040 남성 패션 가이드`,
    description: `${topic.label} 가이드 ${page}페이지. ${topic.description}`,
    path: topicPageHref(topic.slug, page),
  });
}

export default async function BlogTopicArchivePage(
  { params }: { params: Promise<{ topic: string; page: string }> },
) {
  const { topic: topicSlug, page: pageStr } = await params;
  const topic = getBlogTopic(topicSlug);
  if (!topic) notFound();

  const posts = getPostsForTopic(getAll("posts"), topic);
  const page = parseBlogPage(pageStr, posts.length);
  if (page === null) notFound();
  if (page === 1) permanentRedirect(`/blog/topic/${topic.slug}`);

  return <BlogTopicListing topic={topic} posts={posts} page={page} />;
}
