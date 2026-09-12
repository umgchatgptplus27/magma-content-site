import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogTopicListing from "@/components/BlogTopicListing";
import { BLOG_TOPICS, getBlogTopic, getPostsForTopic } from "@/lib/blog-topics";
import { getAll } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return BLOG_TOPICS.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ topic: string }> },
): Promise<Metadata> {
  const { topic: topicSlug } = await params;
  const topic = getBlogTopic(topicSlug);
  if (!topic) return {};
  return pageMetadata({
    title: `${topic.label} | 3040 남성 패션 가이드`,
    description: topic.description,
    path: `/blog/topic/${topic.slug}`,
  });
}

export default async function BlogTopicPage(
  { params }: { params: Promise<{ topic: string }> },
) {
  const { topic: topicSlug } = await params;
  const topic = getBlogTopic(topicSlug);
  if (!topic) notFound();
  const posts = getPostsForTopic(getAll("posts"), topic);

  return <BlogTopicListing topic={topic} posts={posts} page={1} />;
}

