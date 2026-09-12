import BlogTopicNav from "@/components/BlogTopicNav";
import PostCard from "@/components/PostCard";
import PaginationNav from "@/components/PaginationNav";
import type { BlogTopic } from "@/lib/blog-topics";
import type { ContentMeta } from "@/lib/content";
import { BLOG_PAGE_SIZE, blogPageCount, topicPageHref } from "@/lib/blog-pagination.mjs";

interface BlogTopicListingProps {
  topic: BlogTopic;
  posts: ContentMeta[];
  page?: number;
}

export default function BlogTopicListing({
  topic,
  posts,
  page = 1,
}: BlogTopicListingProps) {
  const pageCount = blogPageCount(posts.length);
  const visiblePosts = posts.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);

  return (
    <div className="container-page py-20">
      <p className="eyebrow mb-2">저널 · 주제별 가이드</p>
      <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        {topic.label}{page > 1 ? ` · ${page}페이지` : ""}
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-sub">{topic.description}</p>
      <BlogTopicNav activeTopic={topic.slug} />
      <p className="mb-6 text-sm text-ink-muted">
        {posts.length}개의 관련 글{pageCount > 1 ? ` · ${page} / ${pageCount}페이지` : ""}
      </p>
      {visiblePosts.length === 0 ? (
        <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {visiblePosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
      <PaginationNav
        page={page}
        pageCount={pageCount}
        getPageHref={(p) => topicPageHref(topic.slug, p)}
        ariaLabel={`${topic.label} 페이지`}
      />
    </div>
  );
}
