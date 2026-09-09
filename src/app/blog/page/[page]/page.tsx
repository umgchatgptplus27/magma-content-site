import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogListing from "@/components/BlogListing";
import { getAll } from "@/lib/content";
import { blogPageCount, blogPageHref, parseBlogPage } from "@/lib/blog-pagination.mjs";
import { pageMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return Array.from({ length: blogPageCount(getAll("posts").length) - 1 }, (_, index) => ({ page: String(index + 2) }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page: value } = await params;
  const page = parseBlogPage(value, getAll("posts").length);
  if (page === null) return { robots: { index: false, follow: true } };
  return pageMetadata({
    title: `남성 패션·의류 관리 가이드 · ${page}페이지`,
    description: `MAGMA 블로그 ${page}페이지. 핏, 출근 옷차림, 소재와 의류 관리 가이드를 찾아보세요.`,
    path: blogPageHref(page),
  });
}

export default async function BlogArchivePage({ params }: { params: Promise<{ page: string }> }) {
  const { page: value } = await params;
  const posts = getAll("posts");
  const page = parseBlogPage(value, posts.length);
  if (page === null) notFound();
  if (page === 1) permanentRedirect("/blog");
  return <BlogListing posts={posts} page={page} />;
}
