import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import PostCard from "@/components/PostCard";
import ImageSlot from "@/components/ImageSlot";
import { siteConfig } from "@config";
import { getAll } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

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
            <p className="eyebrow mb-3">브랜드</p>
            <h2 className="font-display text-3xl font-bold leading-snug text-primary">
              {siteConfig.company.name}는 오래&nbsp;입을&nbsp;기본을 만듭니다
            </h2>
            <p className="mt-5 leading-relaxed text-ink-sub">
              유행을 좇는 대신 과장 없는 단정함을 택합니다.
              계절이 바뀌어도 다시 손이 가는 옷을, 3040 남성을 위해 만듭니다.
            </p>
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
