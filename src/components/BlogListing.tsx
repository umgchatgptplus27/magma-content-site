import BlogTopicNav from "@/components/BlogTopicNav";
import PostCard from "@/components/PostCard";
import PaginationNav from "@/components/PaginationNav";
import type { ContentMeta } from "@/lib/content";
import { BLOG_PAGE_SIZE, blogPageCount, blogPageHref } from "@/lib/blog-pagination.mjs";

export default function BlogListing({ posts, page = 1 }: { posts: ContentMeta[]; page?: number }) {
  const pageCount = blogPageCount(posts.length);
  const visiblePosts = posts.slice((page - 1) * BLOG_PAGE_SIZE, page * BLOG_PAGE_SIZE);
  return (
    <div className="container-page py-20">
      <p className="eyebrow mb-2">저널</p>
      <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">
        블로그{page > 1 ? ` · ${page}페이지` : ""}
      </h1>
      <p className="mt-4 max-w-2xl leading-relaxed text-ink-sub">
        관리, 핏, 출근, 상황별 옷차림처럼 지금 필요한 기준부터 골라 읽어 보세요.
      </p>
      <BlogTopicNav />
      <p className="mb-6 text-sm text-ink-muted">전체 {posts.length}개 글 · {page} / {pageCount}페이지</p>
      {visiblePosts.length === 0 ? (
        <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {visiblePosts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      )}
      <PaginationNav
        page={page}
        pageCount={pageCount}
        getPageHref={blogPageHref}
        ariaLabel="블로그 페이지"
      />
    </div>
  );
}

