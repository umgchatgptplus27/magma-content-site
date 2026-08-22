import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogTopicNav from "@/components/BlogTopicNav";
import PostCard from "@/components/PostCard";
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

  return (
    <div className="container-page py-20">
      <p className="eyebrow mb-2">저널 · 주제별 가이드</p>
      <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">{topic.label}</h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-sub">{topic.description}</p>
      <BlogTopicNav activeTopic={topic.slug} />
      <p className="mb-6 text-sm text-ink-muted">{posts.length}개의 관련 글</p>
      <div className="grid gap-8 sm:grid-cols-2">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
