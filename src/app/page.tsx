import Hero from "@/components/Hero";
import SectionHeading from "@/components/SectionHeading";
import PostCard from "@/components/PostCard";
import ImageSlot from "@/components/ImageSlot";
import Link from "next/link";
import { siteConfig } from "@config";
import { contentHref, getAll } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import BlogTopicNav from "@/components/BlogTopicNav";
import { BLOG_TOPICS, getPostsForTopic } from "@/lib/blog-topics";
import { currentSeason } from "@/lib/seasonal";

// 계절 추천이 바뀌도록 하루 한 번 다시 만든다.
export const revalidate = 86400;

export const metadata = pageMetadata({
  title: "3040 남성 패션·의류 관리 가이드",
  description: "셔츠·바지·재킷 핏 기준부터 하객룩·조문 옷차림, 세탁과 수선까지. 3040 남성이 옷을 고르고 오래 입는 데 필요한 기준을 주제별로 정리합니다.",
  path: "/",
  image: "/images/magma-hero-poster.png",
});

export default function Home() {
  const allPosts = getAll("posts");
  const bySlug = new Map(allPosts.map((post) => [post.slug, post]));
  const season = currentSeason();
  const seasonalPosts = season.posts.map((slug) => bySlug.get(slug)).filter((post) => post !== undefined).slice(0, 3);
  const recentlyUpdated = [...allPosts]
    .sort((a, b) => ((b.updated ?? b.date) < (a.updated ?? a.date) ? -1 : (b.updated ?? b.date) > (a.updated ?? a.date) ? 1 : 0))
    .slice(0, 6);

  return (
    <>
      <Hero />

      {/* 사이트 소개 */}
      <section className="container-page py-24">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-3">패션 정보 가이드</p>
            <h2 className="font-display text-3xl font-bold leading-snug text-primary">
              잘 맞는 옷을 고르고, 오래 입는 기준
            </h2>
            <p className="mt-5 leading-relaxed text-ink-sub">
              {siteConfig.company.name}는 옷을 파는 곳이 아니라 옷을 고르는 기준을 정리하는 곳입니다.
              셔츠 소매가 재킷 밖으로 얼마나 보여야 하는지, 결혼식과 조문에는 무엇을 입어야 하는지,
              니트 보풀과 셔츠 얼룩은 어떻게 다뤄야 하는지처럼 자주 묻는 질문에 구체적인 기준으로 답합니다.
            </p>
            <p className="mt-4 leading-relaxed text-ink-sub">
              아래 주제에서 지금 필요한 것부터 골라 읽어 보세요. 각 주제는 처음 읽을 글부터 순서대로 정리되어 있습니다.
            </p>
            <BlogTopicNav />
          </div>
          <ImageSlot ratio="4/5" label="차분한 톤의 셔츠와 재킷을 입은 남성 룩북 이미지" showLabel={false} />
        </div>
      </section>

      {/* 계절 추천 */}
      {seasonalPosts.length > 0 && (
        <section className="container-page py-16">
          <SectionHeading eyebrow={`${season.label} 추천`} title={`${season.label}에 먼저 읽을 가이드`} href="/blog" cta="전체 가이드" />
          <p className="-mt-4 mb-8 text-sm text-ink-sub">{season.note}</p>
          <div className="grid gap-8 sm:grid-cols-3">
            {seasonalPosts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}

      {/* 주제별 시작점 */}
      <section className="border-t border-line">
        <div className="container-page py-20">
          <p className="eyebrow mb-3">주제별로 시작하기</p>
          <h2 className="font-display text-3xl font-bold text-primary">처음이라면 이 순서로 읽어 보세요</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_TOPICS.map((topic) => {
              const starters = getPostsForTopic(allPosts, topic).slice(0, 3);
              return (
                <div key={topic.slug} className="rounded-card border border-line bg-card p-6">
                  <h3 className="font-display text-xl font-bold text-primary">
                    <Link href={`/blog/topic/${topic.slug}`} className="hover:underline">{topic.label}</Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-sub">{topic.description}</p>
                  <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-ink">
                    {starters.map((post) => (
                      <li key={post.slug}>
                        <Link href={contentHref("posts", post.slug)} className="hover:text-primary">{post.title}</Link>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 사이즈 도구 */}
      <section className="container-page pb-4">
        <div className="rounded-card border border-line bg-card p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <p className="eyebrow mb-2">도구</p>
            <h2 className="font-display text-2xl font-bold text-primary">온라인으로 옷 살 때, 내 옷 실측과 비교해 보세요</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-sub">
              잘 맞는 셔츠·바지·재킷의 단면 치수와 사려는 옷의 사이즈표를 넣으면 항목별 차이와 수선 가능성을 알려 드립니다. 신발·셔츠 목둘레·바지 허리 환산표도 함께 있습니다.
            </p>
          </div>
          <Link
            href="/tools/size-compare"
            className="mt-6 inline-block shrink-0 rounded-ui border border-primary px-6 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-canvas sm:mt-0"
          >
            사이즈 비교 계산기
          </Link>
        </div>
      </section>

      {/* 최근 업데이트 */}
      <section className="container-page py-16">
        <SectionHeading eyebrow="업데이트" title="최근 새로 쓰거나 보강한 글" href="/blog" cta="전체 가이드" />
        {recentlyUpdated.length === 0 ? (
          <p className="text-sm text-ink-muted">아직 발행된 글이 없습니다.</p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-3">
            {recentlyUpdated.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        )}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-block rounded-ui border border-primary px-7 py-3 text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-canvas"
          >
            전체 가이드 탐색하기
          </Link>
        </div>
      </section>
    </>
  );
}
