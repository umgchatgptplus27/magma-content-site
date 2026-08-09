import type { Metadata } from "next";
import PostCard from "@/components/PostCard";
import { getAll } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "3040 남성 패션·의류 관리 가이드",
  description: "핏, 소재, 스타일링과 의류 관리까지 3040 남성의 일상에 바로 적용할 수 있는 패션 선택 가이드를 모았습니다.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAll("posts");
  return (
    <div className="container-page py-20">
      <p className="eyebrow mb-2">저널</p>
      <h1 className="mb-12 font-display text-3xl font-bold text-primary sm:text-4xl">블로그</h1>
      {posts.length === 0 ? (
        <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2">
          {posts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
