import type { Metadata } from "next";
import BlogListing from "@/components/BlogListing";
import { getAll } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "3040 남성 패션·의류 관리 가이드",
  description: "핏, 소재, 스타일링과 의류 관리까지 3040 남성의 일상에 바로 적용할 수 있는 패션 선택 가이드를 모았습니다.",
  path: "/blog",
});

export default function BlogPage() {
  const posts = getAll("posts");
  return <BlogListing posts={posts} />;
}
