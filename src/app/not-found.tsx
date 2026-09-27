import Link from "next/link";
import { BLOG_TOPICS, getPostsForTopic } from "@/lib/blog-topics";
import { contentHref, getAll } from "@/lib/content";

/** 없는 주소로 들어온 독자를 주제 허브와 대표 가이드로 안내한다. */
export default function NotFound() {
  const posts = getAll("posts");
  return (
    <section className="container-page py-24">
      <p className="font-display text-5xl font-bold text-primary">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-primary">찾으시는 페이지가 없습니다</h1>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-sub">
        주소가 바뀌었거나 여러 글을 하나로 합치면서 정리된 페이지일 수 있습니다. 아래 주제에서 필요한 가이드를 찾아 보세요.
      </p>
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_TOPICS.map((topic) => (
          <div key={topic.slug} className="rounded-card border border-line bg-card p-5">
            <Link href={`/blog/topic/${topic.slug}`} className="font-display text-lg font-bold text-primary hover:underline">
              {topic.label}
            </Link>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-sub">
              {getPostsForTopic(posts, topic)
                .slice(0, 2)
                .map((post) => (
                  <li key={post.slug}>
                    <Link href={contentHref("posts", post.slug)} className="hover:text-primary">{post.title}</Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap gap-4 text-sm">
        <Link href="/blog" className="rounded-ui border border-primary px-5 py-2.5 font-bold text-primary hover:bg-primary hover:text-canvas">
          전체 가이드
        </Link>
        <Link href="/tools/size-compare" className="rounded-ui border border-line px-5 py-2.5 text-ink-sub hover:border-primary hover:text-primary">
          사이즈 비교 계산기
        </Link>
        <Link href="/" className="rounded-ui border border-line px-5 py-2.5 text-ink-sub hover:border-primary hover:text-primary">
          홈으로
        </Link>
      </div>
    </section>
  );
}
