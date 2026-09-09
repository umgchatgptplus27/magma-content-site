import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import PostCard from "@/components/PostCard";
import ImageSlot from "@/components/ImageSlot";
import { siteConfig } from "@config";
import { getAll } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import BlogTopicNav from "@/components/BlogTopicNav";

export const metadata = pageMetadata({
  title: "3040 남성 패션·의류 관리 가이드",
  description: "3040 남성을 위한 옷 선택, 핏 점검, 소재 이해와 의류 관리 가이드를 MAGMA의 기준으로 정리합니다.",
  path: "/",
  image: "/images/magma-hero-poster.png",
});

export default function Home() {
  const posts = getAll("posts").slice(0, 3);
  return (
    <>
      <Hero />

      {/* 브랜드 소개 스트립 (About 흡수) */}
      <section className="container-page py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">패션 정보 가이드</p>
            <h2 className="font-display text-3xl font-bold leading-snug text-primary">
              {siteConfig.company.name}와 옷의 선택·관리를 차근차근
            </h2>
            <p className="mt-5 leading-relaxed text-ink-sub">
              옷을 판매하는 상품 소개가 아니라, 보유한 옷과 구매 후보를 비교하는 정보 공간입니다.
              핏과 실측, 출근 옷차림, 세탁과 보관 중 지금 필요한 주제부터 읽어 보세요.
            </p>
            <BlogTopicNav />
          </div>
          <ImageSlot ratio="4/5" label="브랜드 비주얼" />
        </div>
      </section>

      {/* 최신 블로그 */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="저널" title="최신 글" href="/blog" cta="블로그 전체" />
        {posts.length === 0 ? (
          <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-3">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
      </section>


    </>
  );
}
