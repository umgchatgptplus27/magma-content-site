import Link from "next/link";
import { BLOG_TOPICS } from "@/lib/blog-topics";

type BlogTopicNavProps = {
  activeTopic?: string;
};

export default function BlogTopicNav({ activeTopic }: BlogTopicNavProps) {
  return (
    <nav aria-label="블로그 주제" className="mb-10 flex flex-wrap gap-2">
      <Link
        href="/blog"
        className={`rounded-full border px-4 py-2 text-sm transition-colors ${
          !activeTopic ? "border-primary bg-primary text-canvas" : "border-line text-ink-sub hover:border-primary hover:text-primary"
        }`}
      >
        전체 글
      </Link>
      {BLOG_TOPICS.map((topic) => (
        <Link
          key={topic.slug}
          href={`/blog/topic/${topic.slug}`}
          className={`rounded-full border px-4 py-2 text-sm transition-colors ${
            activeTopic === topic.slug
              ? "border-primary bg-primary text-canvas"
              : "border-line text-ink-sub hover:border-primary hover:text-primary"
          }`}
        >
          {topic.label}
        </Link>
      ))}
    </nav>
  );
}
