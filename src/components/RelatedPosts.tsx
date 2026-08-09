import PostCard from "@/components/PostCard";
import type { ContentMeta } from "@/lib/content";
import { getAll } from "@/lib/content";

function sharedTagCount(a: ContentMeta, b: ContentMeta): number {
  return a.tags.filter((tag) => b.tags.includes(tag)).length;
}

export default function RelatedPosts({ current }: { current: ContentMeta }) {
  const posts = getAll("posts")
    .filter((post) => post.slug !== current.slug)
    .sort((a, b) => {
      const sharedTags = sharedTagCount(b, current) - sharedTagCount(a, current);
      if (sharedTags !== 0) return sharedTags;
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      return a.slug < b.slug ? 1 : -1;
    })
    .slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="mt-16 border-t border-line pt-12" aria-labelledby="related-posts-heading">
      <p className="eyebrow mb-2">MORE TO READ</p>
      <h2 id="related-posts-heading" className="font-display text-2xl font-bold text-primary">
        함께 읽을 글
      </h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}
